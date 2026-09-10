import { ArrowDown } from "lucide-react";

export function Escrow() {
  return (
    <section className="border-t border-[var(--color-panel-border)] py-20">
      <div className="mx-auto max-w-6xl px-5">
        <div className="max-w-xl">
          <h2 className="font-display text-[28px] font-medium text-[var(--color-text)] sm:text-[32px]">
            Escrow, not a promise
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-[var(--color-text-muted)]">
            Funds move from the requester to the escrow contract before work
            begins, and only leave escrow once a decision has been reached —
            never on the worker&rsquo;s word alone.
          </p>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-[var(--color-panel-border)] sm:grid-cols-2">
          <div className="bg-[var(--color-panel)] p-6">
            <p className="font-mono text-[12px] text-[var(--color-approved)]">If approved</p>
            <div className="mt-4 flex flex-col items-start gap-2 text-[14px] text-[var(--color-text-muted)]">
              <span>Requester deposits USDC</span>
              <ArrowDown className="h-3.5 w-3.5 text-[var(--color-text-faint)]" />
              <span>Worker submits evidence</span>
              <ArrowDown className="h-3.5 w-3.5 text-[var(--color-text-faint)]" />
              <span>Conditions satisfied</span>
              <ArrowDown className="h-3.5 w-3.5 text-[var(--color-text-faint)]" />
              <span className="text-[var(--color-text)]">Escrow releases to worker</span>
            </div>
          </div>
          <div className="bg-[var(--color-panel)] p-6">
            <p className="font-mono text-[12px] text-[var(--color-dispute)]">If disputed</p>
            <div className="mt-4 flex flex-col items-start gap-2 text-[14px] text-[var(--color-text-muted)]">
              <span>Requester deposits USDC</span>
              <ArrowDown className="h-3.5 w-3.5 text-[var(--color-text-faint)]" />
              <span>Worker submits evidence</span>
              <ArrowDown className="h-3.5 w-3.5 text-[var(--color-text-faint)]" />
              <span>Requester opens a dispute</span>
              <ArrowDown className="h-3.5 w-3.5 text-[var(--color-text-faint)]" />
              <span className="text-[var(--color-text)]">Settled per contract rules on resolution</span>
            </div>
          </div>
        </div>

        <p className="mt-6 text-[13px] text-[var(--color-text-faint)]">
          The AgentShield contract address on GenLayer Testnet is read from configuration.
          Until a real escrow contract is deployed, the app runs in a clearly
          labeled mock mode.
        </p>
      </div>
    </section>
  );
}
