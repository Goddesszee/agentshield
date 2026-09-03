import { useState, useEffect, useCallback } from "react";
import {
  connectWallet,
  readContract,
  writeContract,
  genToWei,
  weiToGen,
  getChainLabel,
  CONTRACT_ADDRESS,
} from "./genlayerClient";
import "./styles.css";

function short(addr) {
  if (!addr) return "";
  return addr.slice(0, 6) + "…" + addr.slice(-4);
}

function StatusBadge({ status }) {
  return <span className={`badge ${status}`}>{status.replace("_", " ").toLowerCase()}</span>;
}

export default function App() {
  const [account, setAccount] = useState(null);
  const [view, setView] = useState("dashboard"); // dashboard | create | detail
  const [selectedId, setSelectedId] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const [myAgreements, setMyAgreements] = useState([]); // [{id, agreement}]
  const [loadingList, setLoadingList] = useState(false);

  const missingConfig = !CONTRACT_ADDRESS;

  async function handleConnect() {
    try {
      setError("");
      const addr = await connectWallet();
      setAccount(addr);
    } catch (e) {
      setError(e.message || String(e));
    }
  }

  const refreshList = useCallback(async () => {
    if (!account || missingConfig) return;
    setLoadingList(true);
    setError("");
    try {
      const [buyerIds, sellerIds] = await Promise.all([
        readContract("get_agreements_for_buyer", [account]),
        readContract("get_agreements_for_seller", [account]),
      ]);
      const ids = Array.from(new Set([...(buyerIds || []), ...(sellerIds || [])]));
      const agreements = await Promise.all(
        ids.map(async (id) => ({ id, agreement: await readContract("get_agreement", [id]) }))
      );
      agreements.sort((a, b) => Number(b.id) - Number(a.id));
      setMyAgreements(agreements);
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setLoadingList(false);
    }
  }, [account, missingConfig]);

  useEffect(() => {
    if (account) refreshList();
  }, [account, refreshList]);

  return (
    <div className="app-shell">
      <div className="topbar">
        <div className="brand">
          <span className="brand-mark" />
          AgentShield
          <span className="tagline">Trust infrastructure for the agentic economy</span>
        </div>
        <div className="nav">
          <button className={view === "dashboard" ? "active" : ""} onClick={() => setView("dashboard")}>
            Dashboard
          </button>
          <button className={view === "create" ? "active" : ""} onClick={() => setView("create")}>
            New agreement
          </button>
        </div>
        {account ? (
          <span className="wallet-pill connected">{short(account)} · {getChainLabel()}</span>
        ) : (
          <button className="btn" onClick={handleConnect}>Connect wallet</button>
        )}
      </div>

      {missingConfig && (
        <div className="error-banner">
          No contract address configured. Set <code>VITE_CONTRACT_ADDRESS</code> in your environment
          once AgentShield is deployed, then redeploy.
        </div>
      )}

      {error && <div className="error-banner">{error}</div>}

      {!account && !missingConfig && (
        <div className="panel empty-state">
          Connect a wallet on {getChainLabel()} to create or manage agreements.
        </div>
      )}

      {account && view === "dashboard" && (
        <Dashboard
          account={account}
          agreements={myAgreements}
          loading={loadingList}
          onOpen={(id) => { setSelectedId(id); setView("detail"); }}
          onRefresh={refreshList}
        />
      )}

      {account && view === "create" && (
        <CreateAgreement
          busy={busy}
          setBusy={setBusy}
          setError={setError}
          onCreated={(id) => { refreshList(); setSelectedId(id); setView("detail"); }}
        />
      )}

      {account && view === "detail" && selectedId !== null && (
        <AgreementDetail
          id={selectedId}
          account={account}
          busy={busy}
          setBusy={setBusy}
          setError={setError}
          onBack={() => setView("dashboard")}
          onChanged={refreshList}
        />
      )}
    </div>
  );
}

// ── Dashboard ──────────────────────────────────────────────────

function Dashboard({ account, agreements, loading, onOpen, onRefresh }) {
  const active = agreements.filter((a) =>
    ["CREATED", "ACCEPTED", "FUNDED", "WORK_SUBMITTED", "UNDER_REVIEW"].includes(a.agreement.status)
  );
  const disputed = agreements.filter((a) => a.agreement.status === "DISPUTED");
  const completed = agreements.filter((a) => ["APPROVED", "RELEASED", "REFUNDED"].includes(a.agreement.status));

  const escrowed = agreements
    .filter((a) => ["FUNDED", "WORK_SUBMITTED", "UNDER_REVIEW", "DISPUTED"].includes(a.agreement.status))
    .reduce((sum, a) => sum + weiToGen(a.agreement.payment_gwei), 0);

  return (
    <div>
      <div className="stat-row">
        <div className="stat"><div className="value">{active.length}</div><div className="label">Active agreements</div></div>
        <div className="stat"><div className="value">{escrowed.toFixed(2)}</div><div className="label">GEN in escrow</div></div>
        <div className="stat"><div className="value">{disputed.length}</div><div className="label">Disputes</div></div>
        <div className="stat"><div className="value">{completed.length}</div><div className="label">Completed</div></div>
      </div>

      {disputed.length > 0 && (
        <>
          <div className="section-title">Needs attention</div>
          {disputed.map(({ id, agreement }) => (
            <AgreementRow key={id} id={id} agreement={agreement} account={account} onOpen={onOpen} />
          ))}
        </>
      )}

      <div className="section-title" style={{ display: "flex", justifyContent: "space-between" }}>
        <span>All agreements</span>
        <button className="btn-ghost" style={{ padding: "2px 10px", fontSize: 12 }} onClick={onRefresh}>
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {agreements.length === 0 && !loading && (
        <div className="panel empty-state">
          No agreements yet. Start one from "New agreement".
        </div>
      )}

      {agreements
        .filter((a) => a.agreement.status !== "DISPUTED")
        .map(({ id, agreement }) => (
          <AgreementRow key={id} id={id} agreement={agreement} account={account} onOpen={onOpen} />
        ))}
    </div>
  );
}

function AgreementRow({ id, agreement, account, onOpen }) {
  const role = agreement.buyer?.toLowerCase() === account?.toLowerCase() ? "Buying" : "Selling";
  return (
    <div className="agreement-card" onClick={() => onOpen(id)}>
      <div className="row1">
        <span className="task">{agreement.task}</span>
        <StatusBadge status={agreement.status} />
      </div>
      <div className="meta">
        {role} · {weiToGen(agreement.payment_gwei).toFixed(2)} GEN · #{id}
      </div>
    </div>
  );
}

// ── Create Agreement ─────────────────────────────────────────────

function CreateAgreement({ busy, setBusy, setError, onCreated }) {
  const [form, setForm] = useState({
    seller: "",
    task: "",
    deliverables: "",
    acceptanceCriteria: "",
    payment: "",
    deadline: "",
  });

  function update(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (!form.seller.startsWith("0x")) return setError("Seller must be a wallet address (0x…)");
    if (form.task.length < 20) return setError("Task description must be at least 20 characters");
    if (!form.payment || Number(form.payment) <= 0) return setError("Payment must be greater than zero");
    if (!form.deadline) return setError("Set a deadline");

    setBusy(true);
    try {
      const deadlineTs = BigInt(Math.floor(new Date(form.deadline).getTime() / 1000));
      const { receipt } = await writeContract("create_agreement", [
        form.seller,
        form.task,
        form.deliverables,
        form.acceptanceCriteria,
        genToWei(form.payment),
        deadlineTs,
      ]);
      const newId = receipt?.data?.result ?? receipt?.result ?? null;
      onCreated(newId);
    } catch (e2) {
      setError(e2.message || String(e2));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="panel" style={{ maxWidth: 620 }}>
      <h2 style={{ marginTop: 0, fontSize: 19 }}>New agreement</h2>
      <form onSubmit={submit}>
        <label>Seller agent wallet address</label>
        <input placeholder="0x…" value={form.seller} onChange={(e) => update("seller", e.target.value)} />

        <label>Task</label>
        <textarea
          placeholder="Produce a research report on the Nigerian stablecoin market…"
          value={form.task}
          onChange={(e) => update("task", e.target.value)}
        />
        <div className="hint">What is the seller being hired to do? Minimum 20 characters.</div>

        <label>Deliverables</label>
        <textarea
          placeholder="A PDF or hosted document containing…"
          value={form.deliverables}
          onChange={(e) => update("deliverables", e.target.value)}
        />

        <label>Acceptance criteria</label>
        <textarea
          placeholder="At least 5 credible sources, covers adoption, regulation, and major use cases…"
          value={form.acceptanceCriteria}
          onChange={(e) => update("acceptanceCriteria", e.target.value)}
        />
        <div className="hint">This is what the Intelligent Contract checks the submission against.</div>

        <label>Payment (GEN)</label>
        <input type="number" step="0.01" placeholder="10.0" value={form.payment} onChange={(e) => update("payment", e.target.value)} />

        <label>Deadline</label>
        <input type="datetime-local" value={form.deadline} onChange={(e) => update("deadline", e.target.value)} />

        <div style={{ marginTop: 22 }}>
          <button className="btn" disabled={busy} type="submit">
            {busy ? "Submitting…" : "Create agreement"}
          </button>
        </div>
        <div className="hint" style={{ marginTop: 10 }}>
          This only creates the agreement. You'll fund escrow separately after the seller accepts.
        </div>
      </form>
    </div>
  );
}

// ── Agreement Detail (accept / fund / submit / verification / dispute) ──

function AgreementDetail({ id, account, busy, setBusy, setError, onBack, onChanged }) {
  const [agreement, setAgreement] = useState(null);
  const [submission, setSubmission] = useState({ url: "", evidence: "" });
  const [resolution, setResolution] = useState("");

  const load = useCallback(async () => {
    try {
      const a = await readContract("get_agreement", [id]);
      setAgreement(a);
    } catch (e) {
      setError(e.message || String(e));
    }
  }, [id, setError]);

  useEffect(() => { load(); }, [load]);

  if (!agreement) return <div className="panel empty-state">Loading agreement #{id}…</div>;

  const isBuyer = agreement.buyer?.toLowerCase() === account?.toLowerCase();
  const isSeller = agreement.seller?.toLowerCase() === account?.toLowerCase();

  async function act(fn, args, valueWei) {
    setBusy(true);
    setError("");
    try {
      await writeContract(fn, args, valueWei);
      await load();
      onChanged();
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <button className="btn-ghost" style={{ marginBottom: 16, fontSize: 13 }} onClick={onBack}>
        ← Back to dashboard
      </button>

      <div className="panel">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <h2 style={{ margin: 0, fontSize: 19 }}>Agreement #{id}</h2>
          <StatusBadge status={agreement.status} />
        </div>

        <div className="section-title">Parties</div>
        <div className="kv"><span className="k">Buyer</span><span className="mono">{short(agreement.buyer)}</span></div>
        <div className="kv"><span className="k">Seller</span><span className="mono">{short(agreement.seller)}</span></div>
        <div className="kv"><span className="k">Payment</span><span>{weiToGen(agreement.payment_gwei).toFixed(4)} GEN</span></div>
        <div className="kv"><span className="k">Deadline</span><span>{new Date(Number(agreement.deadline) * 1000).toLocaleString()}</span></div>

        <div className="section-title">Task</div>
        <p style={{ fontSize: 14.5, lineHeight: 1.55, margin: 0 }}>{agreement.task}</p>

        {agreement.deliverables && (
          <>
            <div className="section-title">Deliverables</div>
            <p style={{ fontSize: 14.5, lineHeight: 1.55, margin: 0 }}>{agreement.deliverables}</p>
          </>
        )}

        <div className="section-title">Acceptance criteria</div>
        <p style={{ fontSize: 14.5, lineHeight: 1.55, margin: 0 }}>{agreement.acceptance_criteria}</p>

        {agreement.submission_url && (
          <>
            <div className="section-title">Submitted work</div>
            <div className="kv"><span className="k">URL</span><a href={agreement.submission_url} target="_blank" rel="noreferrer">{agreement.submission_url}</a></div>
            {agreement.evidence && <p style={{ fontSize: 14, color: "var(--text-dim)", marginTop: 8 }}>{agreement.evidence}</p>}
          </>
        )}

        {agreement.verdict && (
          <>
            <div className="section-title">Intelligent Contract verdict</div>
            <div className={`verdict-box ${agreement.verdict}`}>
              <div className={`verdict-title ${agreement.verdict}`}>{agreement.verdict}</div>
              <div style={{ fontSize: 14, color: "var(--text-dim)" }}>{agreement.decision_explanation}</div>
            </div>
          </>
        )}

        {agreement.status === "DISPUTED" && (
          <>
            <div className="section-title">Dispute</div>
            <p style={{ fontSize: 14, color: "var(--text-dim)" }}>{agreement.dispute_reason}</p>
          </>
        )}

        {/* ── actions ── */}

        {isSeller && agreement.status === "CREATED" && (
          <ActionBlock label="Accept this agreement to begin work.">
            <button className="btn" disabled={busy} onClick={() => act("accept_agreement", [id])}>
              {busy ? "Working…" : "Accept agreement"}
            </button>
          </ActionBlock>
        )}

        {isBuyer && agreement.status === "ACCEPTED" && (
          <ActionBlock label={`Fund escrow with ${weiToGen(agreement.payment_gwei).toFixed(4)} GEN to activate the agreement.`}>
            <button
              className="btn"
              disabled={busy}
              onClick={() => act("fund_agreement", [id], agreement.payment_gwei)}
            >
              {busy ? "Funding…" : "Fund escrow"}
            </button>
          </ActionBlock>
        )}

        {isSeller && agreement.status === "FUNDED" && (
          <ActionBlock label="Submit your completed work. This triggers AI validator evaluation automatically.">
            <label>Submission URL</label>
            <input
              placeholder="https://…"
              value={submission.url}
              onChange={(e) => setSubmission((s) => ({ ...s, url: e.target.value }))}
            />
            <label>Evidence / notes for the evaluator</label>
            <textarea
              placeholder="Sources used, methodology, anything the evaluator should know…"
              value={submission.evidence}
              onChange={(e) => setSubmission((s) => ({ ...s, evidence: e.target.value }))}
            />
            <div style={{ marginTop: 14 }}>
              <button
                className="btn"
                disabled={busy || !submission.url}
                onClick={() => act("submit_work", [id, submission.url, submission.evidence])}
              >
                {busy ? "Submitting to validators…" : "Submit work"}
              </button>
            </div>
          </ActionBlock>
        )}

        {agreement.status === "UNDER_REVIEW" && (
          <div className="notice-banner" style={{ marginTop: 20 }}>
            GenLayer validators are evaluating this submission against the acceptance criteria. Refresh in a
            moment — this typically resolves within one to a few minutes.
            <div style={{ marginTop: 8 }}>
              <button className="btn-ghost" style={{ fontSize: 12, padding: "4px 10px" }} onClick={load}>
                Check status
              </button>
            </div>
          </div>
        )}

        {isBuyer && agreement.status === "DISPUTED" && (
          <ActionBlock label="Resolve this dispute manually. This overrides the AI verdict either way.">
            <textarea
              placeholder="Resolution note…"
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
            />
            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button
                className="btn"
                disabled={busy}
                onClick={() => act("buyer_resolve_dispute", [id, true, resolution || "Approved on manual review"])}
              >
                Release payment to seller
              </button>
              <button
                className="btn-danger"
                disabled={busy}
                onClick={() => act("buyer_resolve_dispute", [id, false, resolution || "Refunded on manual review"])}
              >
                Refund buyer
              </button>
            </div>
          </ActionBlock>
        )}

        {isBuyer && (agreement.status === "CREATED" || agreement.status === "ACCEPTED") && (
          <ActionBlock label="Cancel before funding — nothing is locked yet.">
            <button className="btn-ghost" disabled={busy} onClick={() => act("cancel_agreement", [id])}>
              Cancel agreement
            </button>
          </ActionBlock>
        )}
      </div>
    </div>
  );
}

function ActionBlock({ label, children }) {
  return (
    <div style={{ marginTop: 22, paddingTop: 18, borderTop: "1px solid var(--border)" }}>
      <div className="hint" style={{ marginBottom: 12 }}>{label}</div>
      {children}
    </div>
  );
}
