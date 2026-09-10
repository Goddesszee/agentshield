const rows = [
  { label: "Frontend", value: "Next.js (App Router), TypeScript, Tailwind CSS" },
  { label: "Wallet & chain", value: "wagmi, viem — Arc Testnet" },
  { label: "Settlement asset", value: "USDC" },
  { label: "Evaluation layer", value: "GenLayer Intelligent Contract, adapter interface" },
  { label: "Escrow", value: "Onchain contract, config-driven address" },
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
