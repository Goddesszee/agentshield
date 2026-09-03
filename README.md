# AgentShield

**Trust infrastructure for the agentic economy.**

Escrow, verification, and dispute resolution for AI-agent-to-AI-agent commerce, built on [GenLayer](https://genlayer.com) Intelligent Contracts.

---

## What's real here and what isn't yet

This is not a mockup. The contract and frontend are written to actually run against GenLayer's live Bradbury testnet. Two things are true at the same time:

1. **The Intelligent Contract (`contract/agentshield.py`) is complete and syntax-checked**, written against the current `docs.genlayer.com` API — not invented, not copied from stale examples.
2. **It has not been deployed yet.** Deploying requires signing a transaction from a wallet with testnet GEN, either through GenLayer Studio's browser GUI or the `genlayer` CLI running on your machine. Neither is reachable from the sandboxed environment this was built in, so that step is on you — see [Deploying](#deploying) below. Nothing in this repo pretends a deployment happened; `frontend/.env.example` ships with a blank contract address and the app shows an explicit "not configured" banner until you set one.

One naming decision worth flagging: the LLM-evaluation call (`gl.exec_prompt` / `gl.eq_principle_prompt_non_comparative`) was carried forward unchanged from your working `agent-escrow-contract` repo rather than independently re-verified against a live SDK install, since I couldn't install the `py-genlayer` package in this sandbox either. Every other API surface — `gl.message.sender_address`, `gl.message.value`, `Address` as a `TreeMap` key, `@gl.public.write.payable` — was checked directly against current docs pages fetched during this session.

---

## How it works

```
Buyer creates agreement (task, deliverables, acceptance criteria, payment, deadline)
        ↓
Seller accepts
        ↓
Buyer funds escrow (GEN locked in the contract)
        ↓
Seller submits work (URL + evidence)
        ↓
GenLayer validators fetch the URL live and evaluate it against the
acceptance criteria — LLM reasoning validated across independent
nodes via the equivalence principle
        ↓
APPROVED → escrow releases to seller automatically, reputation updates
DISPUTED → buyer can manually override (release or refund) with a resolution note
```

State machine: `CREATED → ACCEPTED → FUNDED → WORK_SUBMITTED → UNDER_REVIEW → APPROVED/DISPUTED → RELEASED/REFUNDED`

## Why this needs GenLayer specifically

A normal smart contract can hold funds and check a signature. It cannot read a URL and judge whether the content inside satisfies a natural-language brief — that requires an LLM, and a plain oracle call would mean trusting one server's opinion. GenLayer's Intelligent Contracts run that judgment across independent validator nodes and only accept the result if they reach consensus (the equivalence principle), so no single party — buyer, seller, or a centralized arbiter — controls the verdict.

## Contract methods

| Method | Caller | What it does |
|---|---|---|
| `create_agreement(seller, task, deliverables, acceptance_criteria, payment_gwei, deadline)` | Buyer | Creates the agreement |
| `accept_agreement(id)` | Seller | Accepts the job |
| `fund_agreement(id)` | Buyer (payable) | Locks GEN in escrow |
| `submit_work(id, url, evidence)` | Seller | Submits deliverable, triggers AI evaluation |
| `buyer_resolve_dispute(id, release_to_seller, note)` | Buyer | Manual override on a disputed agreement |
| `cancel_agreement(id)` | Buyer | Cancel/refund before or after funding, before submission |
| `get_agreement(id)`, `get_agent(addr)`, `get_agreements_for_buyer/seller(addr)`, `get_disputed_agreements()` | Anyone | Views |

## Reputation

Each `AgentProfile` tracks `completed_jobs`, `successful_jobs`, `disputes`, and a `reputation` score (0–1000, starts at 500). Approval nudges reputation up; a dispute pulls it down. Simple by design for the MVP — the storage shape leaves room for weighting by job size or buyer reputation later without a migration.

---

## Deploying

### Fastest: GenLayer Studio (browser, no local setup)

1. Get testnet GEN from the [Bradbury faucet](https://testnet-faucet.genlayer.foundation).
2. Open [studio.genlayer.com](https://studio.genlayer.com), switch network to Bradbury.
3. Paste the contents of `contract/agentshield.py`, deploy (no constructor args).
4. Copy the deployed contract address.

### CLI

```bash
npm install -g genlayer
genlayer network set testnet-bradbury   # exact subcommand may vary by CLI version —
                                         # confirm at docs.genlayer.com/api-references/genlayer-cli
genlayer deploy --contract contract/agentshield.py
```

### After deploying

Set the address in the frontend:

```bash
cd frontend
cp .env.example .env
# edit .env: VITE_CONTRACT_ADDRESS=0x...
```

## Running the frontend locally

```bash
cd frontend
npm install
npm run dev
```

## Deploying the frontend to Vercel

This repo includes `vercel.json` at the root. Import the repo in Vercel, and it will run `cd frontend && npm install && npm run build` and serve `frontend/dist` automatically — no manual config needed beyond setting `VITE_CONTRACT_ADDRESS` (and optionally `VITE_GL_NETWORK`) as environment variables in the Vercel project settings.

## Network

| | |
|---|---|
| GenLayer RPC | `https://rpc-bradbury.genlayer.com` |
| Chain ID | 4221 |
| Explorer | `https://explorer-bradbury.genlayer.com` |
| Faucet | `https://testnet-faucet.genlayer.foundation` |

## Security notes

- No private keys anywhere in this repo. The frontend connects via the browser wallet (`window.ethereum`); nothing is signed server-side.
- All monetary state transitions (`fund_agreement`, `_release`, `_refund`) live only in the contract — the frontend never simulates a payment.
- Buyer-side dispute override exists deliberately: an AI verdict is advisory-binding by default, never unappealable.
