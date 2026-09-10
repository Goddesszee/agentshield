import Link from "next/link";
import type { Agreement } from "@/types";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDate, formatUsdc } from "@/lib/format";

export function AgreementCard({ agreement }: { agreement: Agreement }) {
  return (
    <Link
      href={`/agreements/${agreement.id}`}
      className="group block rounded-2xl border border-[var(--color-panel-border)] bg-[var(--color-panel)] p-5 transition-colors hover:border-[var(--color-panel-border-strong)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[12px] text-[var(--color-text-faint)]">{agreement.id}</p>
          <h3 className="font-display mt-1 text-[16px] font-medium text-[var(--color-text)] group-hover:text-[var(--color-blue)]">
            {agreement.taskTitle}
          </h3>
        </div>
        <StatusBadge status={agreement.status} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-[13px] sm:grid-cols-4">
        <div>
          <p className="text-[var(--color-text-faint)]">Requester</p>
          <p className="mt-0.5 text-[var(--color-text-muted)]">{agreement.requester.name}</p>
        </div>
        <div>
          <p className="text-[var(--color-text-faint)]">Worker</p>
          <p className="mt-0.5 text-[var(--color-text-muted)]">{agreement.worker.name}</p>
        </div>
        <div>
          <p className="text-[var(--color-text-faint)]">Escrow</p>
          <p className="font-mono mt-0.5 text-[var(--color-text)]">
            {formatUsdc(agreement.escrowAmount)}
          </p>
        </div>
        <div>
          <p className="text-[var(--color-text-faint)]">Deadline</p>
          <p className="mt-0.5 text-[var(--color-text-muted)]">{formatDate(agreement.deadline)}</p>
        </div>
      </div>

      <p className="mt-4 text-[12px] text-[var(--color-text-faint)]">
        Created {formatDate(agreement.createdAt)}
      </p>
    </Link>
  );
}
