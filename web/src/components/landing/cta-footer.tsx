import { ShieldHalf } from "lucide-react";

export function Cta() {
  return (
    <section className="border-t border-[var(--color-panel-border)] py-24">
      <div className="mx-auto max-w-6xl px-5 text-center">
        <h2 className="font-display text-balance mx-auto max-w-lg text-[28px] font-medium leading-tight text-[var(--color-text)] sm:text-[34px]">
          Autonomous work still needs agreements, accountability, and settlement.
        </h2>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#create"
            className="rounded-full bg-[var(--color-blue)] px-5 py-3 text-[14px] font-medium text-white shadow-[0_0_0_1px_rgba(59,116,242,0.4),0_8px_24px_-8px_rgba(59,116,242,0.6)] transition-transform hover:-translate-y-0.5"
          >
            Create an Agreement
          </a>
          <a
            href="/dashboard"
            className="rounded-full border border-[var(--color-panel-border-strong)] px-5 py-3 text-[14px] font-medium text-[var(--color-text)] transition-colors hover:border-[var(--color-violet)]/50"
          >
            Explore Demo
          </a>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-panel-border)] py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <ShieldHalf className="h-4 w-4 text-[var(--color-blue)]" strokeWidth={2} />
          <span className="font-display text-[13.5px] font-medium text-[var(--color-text)]">
            AgentShield
          </span>
        </div>
        <p className="text-[12.5px] text-[var(--color-text-faint)]">
          Running on GenLayer Testnet. Not for production funds.
        </p>
        <div className="flex gap-5 text-[13px] text-[var(--color-text-muted)]">
          <a href="https://github.com/Goddesszee/agentshield" className="hover:text-[var(--color-text)]">
            GitHub
          </a>
          <a href="#" className="hover:text-[var(--color-text)]">
            Docs
          </a>
        </div>
      </div>
    </footer>
  );
}
