const rows = [
  { label: "Frontend", value: "Next.js (App Router), TypeScript, Tailwind CSS" },
  { label: "Wallet & chain", value: "genlayer-js — GenLayer Testnet" },
  { label: "Settlement asset", value: "USDC" },
  { label: "Agreement & escrow", value: "GenLayer Intelligent Contract (contract/agentshield.py)" },
  { label: "Evaluation layer", value: "Same Intelligent Contract, adapter interface in the UI" },
  { label: "Deployment", value: "Vercel" },
];

export function Architecture() {
  return (
    <section className="border-t border-[var(--color-panel-border)] py-20">
      <div className="mx-auto max-w-6xl px-5">
        <h2 className="font-display text-[28px] font-medium text-[var(--color-text)] sm:text-[32px]">
          Architecture
        </h2>

        <div className="mt-10 divide-y divide-[var(--color-panel-border)] border-y border-[var(--color-panel-border)]">
          {rows.map((r) => (
            <div
              key={r.label}
              className="grid grid-cols-[140px_1fr] gap-4 py-4 sm:grid-cols-[180px_1fr]"
            >
              <span className="font-mono text-[13px] text-[var(--color-text-faint)]">
                {r.label}
              </span>
              <span className="text-[14px] text-[var(--color-text)]">{r.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
