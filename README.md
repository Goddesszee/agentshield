# AgentShield

Trust infrastructure for AI agents.

AgentShield is a trust and dispute layer for autonomous AI agents. When one
agent hires another, AgentShield lets them record an agreement with explicit
success conditions, escrow USDC on GenLayer Testnet, submit evidence of completed
work, and have a GenLayer Intelligent Contract evaluate whether the
conditions were actually met — before any money moves.

> **Status:** Milestone 1 of a staged rebuild. This is the design system and
> landing page only. Wallet connection, escrow, evidence submission, and the
> GenLayer evaluation adapter are scaffolded but not yet implemented — see
> "Current state" below.

## Repository structure

```
contract/           GenLayer Intelligent Contract (Python)
web/                 Next.js application (frontend + server routes)
  src/app/           App Router pages and layout
  src/components/    UI components (landing/ built; app UI comes later)
  src/lib/genlayer/  GenLayer adapter interface + demo evaluator
  src/lib/contracts/ Escrow/agreement contract ABIs (Milestone 5)
  src/lib/web3/      wagmi/viem wallet + chain config (Milestone 5)
  src/hooks/         App-specific React hooks (added as needed)
  src/types/         Shared TypeScript types
  config/            GenLayer Testnet + contract address configuration
```

## Tech stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4
- Framer Motion, Lucide icons
- wagmi + viem for wallet/chain interaction (not yet wired up)
- GenLayer Intelligent Contracts for evaluation (adapter scaffolded, not yet wired up)
- Deployment target: Vercel

## Local setup

```bash
cd web
npm install
npm run dev
```

App runs at `http://localhost:3000`.

```bash
npm run lint    # ESLint
npm run build   # Production build + TypeScript check
npm run start   # Serve the production build
```

## Environment variables

None are required yet — the landing page has no live integrations. As later
milestones add wallet and GenLayer support, required variables will be
documented here and added to `web/.env.example`. No secret or private key is
ever read on the client; anything sensitive stays in server routes only.

## GenLayer Testnet / USDC configuration

The agreement/escrow/evaluation logic lives entirely in the GenLayer
Intelligent Contract at `contract/agentshield.py` — there is no separate
EVM escrow chain. GenLayer Testnet chain ID (4221), the wallet-compatible
RPC endpoint, and the deployed contract address live in
`web/config/chains.ts`. The contract address is currently `undefined` and
the app is in **mock mode** (`IS_MOCK_MODE = true`). Real values get filled
in once `contract/agentshield.py` is deployed to testnet — the app must
never fabricate a transaction hash or balance in the meantime.

Note on wallet connection: MetaMask's network-add flow calls `net_version`,
which GenLayer's main RPC endpoint doesn't implement. Wallet connections
must use the Chain RPC endpoint (`rpc.testnet-chain.genlayer.com`); the
other endpoint (`rpc-bradbury.genlayer.com`) is for SDK/CLI use. Wallet
interaction should go through `genlayer-js`, not a generic EVM library,
since Intelligent Contracts have GenLayer-specific call semantics.

## Demo mode vs. live mode

The GenLayer evaluation adapter lives behind `GenLayerEvaluator` in
`web/src/lib/genlayer/index.ts`. `mockEvaluator.ts` is a demo implementation
that always returns a result explicitly marked `isDemo: true`. Swapping to a
live GenLayer network connection means implementing the same interface and
pointing the app at it — no UI code should need to change. The UI must never
present a demo evaluation as if it were live.

## Deploying to Vercel

1. Set the project root to `web/` in Vercel's project settings.
2. `npm install` / `npm run build` are Vercel's defaults and work unmodified.
3. No environment variables are required for Milestone 1.

## Troubleshooting

- **Fonts fail to load during build:** `next/font/google` needs outbound
  access to `fonts.googleapis.com` at build time. This works on Vercel; if
  building somewhere with restricted network egress, allow that domain.

## Contract

`contract/agentshield.py` is the GenLayer Intelligent Contract implementing
the agreement state machine (CREATED → ACCEPTED → FUNDED → UNDER_REVIEW →
APPROVED/DISPUTED → RELEASED/REFUNDED) with LLM-based evaluation and
reputation tracking. This predates the Next.js rebuild and is the basis for
the live GenLayer integration in a later milestone.
