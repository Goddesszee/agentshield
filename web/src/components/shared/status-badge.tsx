import type { AgreementStatus } from "@/types";
import { statusConfig } from "@/lib/format";

export function StatusBadge({ status }: { status: AgreementStatus }) {
  const cfg = statusConfig[status];
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 font-mono text-[11.5px] font-medium tracking-tight"
      style={{ color: cfg.color, background: cfg.bg }}
    >
      {cfg.label}
    </span>
  );
}

export function DemoBadge() {
  return (
    <span className="inline-flex items-center rounded-full border border-[var(--color-panel-border-strong)] px-2.5 py-1 font-mono text-[11px] text-[var(--color-text-faint)]">
      Demo data
    </span>
  );
}
