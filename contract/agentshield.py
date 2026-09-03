# { "Depends": "py-genlayer:test" }

from genlayer import *
from dataclasses import dataclass
import json


@allow_storage
@dataclass
class Agreement:
    agreement_id: str
    buyer: Address
    seller: Address
    task: str
    deliverables: str
    acceptance_criteria: str
    payment_gwei: u256
    deadline: u256          # unix timestamp
    status: str             # CREATED|ACCEPTED|FUNDED|WORK_SUBMITTED|UNDER_REVIEW|APPROVED|DISPUTED|RELEASED|REFUNDED
    submission_url: str
    evidence: str
    verdict: str
    decision_explanation: str
    dispute_reason: str
    dispute_resolution: str
    created_at: u256


@allow_storage
@dataclass
class AgentProfile:
    wallet: Address
    completed_jobs: u256
    successful_jobs: u256
    disputes: u256
    reputation: u256        # 0-1000, starts at 500


class AgentShield(gl.Contract):
    """
    AgentShield — trust, escrow, verification and dispute-resolution layer
    for AI-agent-to-AI-agent commerce, built on GenLayer.

    Buyer agent posts an agreement (task, deliverables, acceptance criteria,
    payment, deadline) and funds escrow. Seller agent accepts and later
    submits work. A GenLayer Intelligent Contract evaluation — LLM reasoning
    validated across independent validator nodes via the equivalence
    principle — decides whether the submission satisfies the agreement.
    Approved work releases escrow automatically. Rejected work moves to a
    dispute state carrying the evidence and AI reasoning for resolution.
    """

    agreements: TreeMap[str, Agreement]
    agents: TreeMap[Address, AgentProfile]
    agreement_counter: u256
    total_escrowed: u256

    def __init__(self) -> None:
        self.agreement_counter = u256(0)
        self.total_escrowed = u256(0)

    # ── internal helpers ────────────────────────────────────────────

    def _touch_agent(self, addr: Address) -> None:
        if addr not in self.agents:
            self.agents[addr] = AgentProfile(
                wallet=addr,
                completed_jobs=u256(0),
                successful_jobs=u256(0),
                disputes=u256(0),
                reputation=u256(500),
            )

    # ── Write: buyer creates agreement ─────────────────────────────

    @gl.public.write
    def create_agreement(
        self,
        seller: Address,
        task: str,
        deliverables: str,
        acceptance_criteria: str,
        payment_gwei: u256,
        deadline: u256,
    ) -> str:
        assert len(task) >= 20, "Task description must be at least 20 characters"
        assert len(task) <= 3000, "Task description too long"
        assert len(acceptance_criteria) >= 10, "Acceptance criteria required"
        assert payment_gwei > u256(0), "Payment must be greater than zero"
        assert deadline > u256(0), "Deadline required"
        assert seller != gl.message.sender_address, "Buyer and seller must differ"

        agreement_id = str(self.agreement_counter)
        self.agreement_counter = self.agreement_counter + u256(1)

        self._touch_agent(gl.message.sender_address)
        self._touch_agent(seller)

        agreement = Agreement(
            agreement_id=agreement_id,
            buyer=gl.message.sender_address,
            seller=seller,
            task=task,
            deliverables=deliverables,
            acceptance_criteria=acceptance_criteria,
            payment_gwei=payment_gwei,
            deadline=deadline,
            status="CREATED",
            submission_url="",
            evidence="",
            verdict="",
            decision_explanation="",
            dispute_reason="",
            dispute_resolution="",
            created_at=u256(0),
        )
        self.agreements[agreement_id] = agreement
        return agreement_id

    # ── Write: seller accepts ──────────────────────────────────────

    @gl.public.write
    def accept_agreement(self, agreement_id: str) -> None:
        assert agreement_id in self.agreements, "Agreement not found"
        a = self.agreements[agreement_id]
        assert gl.message.sender_address == a.seller, "Only the assigned seller can accept"
        assert a.status == "CREATED", "Agreement is not awaiting acceptance"
        a.status = "ACCEPTED"
        self.agreements[agreement_id] = a

    # ── Write: buyer funds escrow ───────────────────────────────────

    @gl.public.write.payable
    def fund_agreement(self, agreement_id: str) -> None:
        assert agreement_id in self.agreements, "Agreement not found"
        a = self.agreements[agreement_id]
        assert gl.message.sender_address == a.buyer, "Only the buyer can fund"
        assert a.status == "ACCEPTED", "Agreement must be accepted before funding"
        assert gl.message.value == a.payment_gwei, "Funded amount must match agreed payment"

        a.status = "FUNDED"
        self.agreements[agreement_id] = a
        self.total_escrowed = self.total_escrowed + gl.message.value

    # ── Write: seller submits work ─────────────────────────────────

    @gl.public.write
    def submit_work(self, agreement_id: str, submission_url: str, evidence: str) -> None:
        assert agreement_id in self.agreements, "Agreement not found"
        a = self.agreements[agreement_id]
        assert gl.message.sender_address == a.seller, "Only the assigned seller can submit"
        assert a.status == "FUNDED", "Agreement must be funded before submission"
        assert submission_url.startswith("http"), "Submission must be a valid URL"
        assert len(submission_url) <= 500, "URL too long"
        assert len(evidence) <= 3000, "Evidence too long"

        a.submission_url = submission_url
        a.evidence = evidence
        a.status = "UNDER_REVIEW"
        self.agreements[agreement_id] = a

        self._run_evaluation(agreement_id)

    # ── Internal: Intelligent Contract evaluation ───────────────────

    def _run_evaluation(self, agreement_id: str) -> None:
        a = self.agreements[agreement_id]
        task = a.task
        deliverables = a.deliverables
        acceptance_criteria = a.acceptance_criteria
        evidence = a.evidence
        url = a.submission_url

        def evaluate() -> str:
            try:
                content = gl.get_webpage(url, mode="text")
                if len(content) > 4500:
                    content = content[:4500] + "\n...[truncated for evaluation]"
            except Exception:
                content = "[Error: could not fetch submission URL]"

            prompt = f"""You are an impartial evaluator for AgentShield, a
verification layer for AI-agent-to-AI-agent commerce.

AGREEMENT TASK:
{task}

REQUIRED DELIVERABLES:
{deliverables}

ACCEPTANCE CRITERIA:
{acceptance_criteria}

SELLER-PROVIDED EVIDENCE / NOTES:
{evidence}

LIVE CONTENT FETCHED FROM THE SUBMISSION URL ({url}):
---CONTENT START---
{content}
---CONTENT END---

Decide whether the submission satisfies the agreement. Consider:
- Completeness: are the required deliverables present?
- Whether the acceptance criteria are met.
- Evidence and source requirements referenced in the task, if any.
- Consistency between what was promised and what was actually delivered.

Be reasonable: minor imperfections should not fail a submission. Reject
only if the work clearly falls short of the acceptance criteria or the
URL has no relevant content.

Reply with ONLY this JSON, no markdown, no extra text:
{{"verdict": "APPROVED", "explanation": "concise reason, 1-2 sentences"}}
or
{{"verdict": "DISPUTED", "explanation": "concise reason, 1-2 sentences"}}"""

            return gl.exec_prompt(prompt)

        result_str = gl.eq_principle_prompt_non_comparative(evaluate)

        try:
            clean = result_str.strip()
            if "```" in clean:
                for part in clean.split("```"):
                    part = part.strip()
                    if part.startswith("{") or part.startswith("json\n{"):
                        clean = part.replace("json\n", "").strip()
                        break
            parsed = json.loads(clean)
            verdict = str(parsed.get("verdict", "DISPUTED")).upper().strip()
            explanation = str(parsed.get("explanation", "No explanation provided"))
            if verdict not in ("APPROVED", "DISPUTED"):
                verdict = "DISPUTED"
                explanation = "Unexpected verdict format from evaluator"
        except Exception:
            verdict = "DISPUTED"
            explanation = "Could not parse AI evaluation output — routed to manual review"

        a2 = self.agreements[agreement_id]
        a2.verdict = verdict
        a2.decision_explanation = explanation

        if verdict == "APPROVED":
            a2.status = "APPROVED"
            self.agreements[agreement_id] = a2
            self._release(a2)
            self._record_outcome(a2.seller, success=True)
        else:
            a2.status = "DISPUTED"
            a2.dispute_reason = "AI evaluation determined acceptance criteria were not met"
            self.agreements[agreement_id] = a2
            self._record_dispute(a2.seller)

    # ── Write: manual dispute resolution ────────────────────────────

    @gl.public.write
    def buyer_resolve_dispute(self, agreement_id: str, release_to_seller: bool, resolution_note: str) -> None:
        """
        Buyer resolves a disputed agreement manually — either overrides the
        AI verdict and releases payment, or confirms the dispute and takes
        a refund. This is the human-in-the-loop escape hatch: AgentShield's
        AI verdict is advisory-binding by default but never final without
        recourse.
        """
        assert agreement_id in self.agreements, "Agreement not found"
        a = self.agreements[agreement_id]
        assert gl.message.sender_address == a.buyer, "Only the buyer can resolve a dispute"
        assert a.status == "DISPUTED", "Agreement is not under dispute"
        assert len(resolution_note) <= 1000, "Resolution note too long"

        a.dispute_resolution = resolution_note
        if release_to_seller:
            a.status = "APPROVED"
            self.agreements[agreement_id] = a
            self._release(a)
            self._record_outcome(a.seller, success=True)
        else:
            a.status = "REFUNDED"
            self.agreements[agreement_id] = a
            self._refund(a)

    @gl.public.write
    def cancel_agreement(self, agreement_id: str) -> None:
        """Buyer cancels before funding, or refunds a FUNDED agreement
        that missed its deadline with no submission."""
        assert agreement_id in self.agreements, "Agreement not found"
        a = self.agreements[agreement_id]
        assert gl.message.sender_address == a.buyer, "Only the buyer can cancel"

        if a.status in ("CREATED", "ACCEPTED"):
            a.status = "REFUNDED"
            self.agreements[agreement_id] = a
            return

        if a.status == "FUNDED":
            assert gl.message.value >= u256(0), "n/a"
            a.status = "REFUNDED"
            self.agreements[agreement_id] = a
            self._refund(a)
            return

        assert False, "Agreement cannot be cancelled in its current state"

    # ── Internal: escrow settlement ─────────────────────────────────

    def _release(self, a: Agreement) -> None:
        self.total_escrowed = self.total_escrowed - a.payment_gwei
        a.status = "RELEASED"
        self.agreements[a.agreement_id] = a
        gl.emit_transfer(a.seller, a.payment_gwei)

    def _refund(self, a: Agreement) -> None:
        self.total_escrowed = self.total_escrowed - a.payment_gwei
        gl.emit_transfer(a.buyer, a.payment_gwei)

    # ── Internal: reputation ────────────────────────────────────────

    def _record_outcome(self, seller: Address, success: bool) -> None:
        self._touch_agent(seller)
        p = self.agents[seller]
        p.completed_jobs = p.completed_jobs + u256(1)
        if success:
            p.successful_jobs = p.successful_jobs + u256(1)
            p.reputation = min(u256(1000), p.reputation + u256(25))
        self.agents[seller] = p

    def _record_dispute(self, seller: Address) -> None:
        self._touch_agent(seller)
        p = self.agents[seller]
        p.disputes = p.disputes + u256(1)
        p.reputation = u256(0) if p.reputation < u256(40) else p.reputation - u256(40)
        self.agents[seller] = p

    # ── View methods ─────────────────────────────────────────────────

    @gl.public.view
    def get_agreement(self, agreement_id: str) -> Agreement:
        assert agreement_id in self.agreements, "Agreement not found"
        return self.agreements[agreement_id]

    @gl.public.view
    def get_agreement_count(self) -> u256:
        return self.agreement_counter

    @gl.public.view
    def get_total_escrowed(self) -> u256:
        return self.total_escrowed

    @gl.public.view
    def get_agent(self, addr: Address) -> AgentProfile:
        assert addr in self.agents, "Agent not found"
        return self.agents[addr]

    @gl.public.view
    def get_agreements_for_buyer(self, buyer: Address) -> list[str]:
        result: list[str] = []
        for i in range(int(self.agreement_counter)):
            aid = str(i)
            if aid in self.agreements and self.agreements[aid].buyer == buyer:
                result.append(aid)
        return result

    @gl.public.view
    def get_agreements_for_seller(self, seller: Address) -> list[str]:
        result: list[str] = []
        for i in range(int(self.agreement_counter)):
            aid = str(i)
            if aid in self.agreements and self.agreements[aid].seller == seller:
                result.append(aid)
        return result

    @gl.public.view
    def get_disputed_agreements(self) -> list[str]:
        result: list[str] = []
        for i in range(int(self.agreement_counter)):
            aid = str(i)
            if aid in self.agreements and self.agreements[aid].status == "DISPUTED":
                result.append(aid)
        return result
