import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ActivityEvent } from "@/types";
import { activityLabel, formatDateTime } from "@/lib/format";

export function ActivityFeed({
  events,
  limit,
}: {
  events: ActivityEvent[];
  limit?: number;
}) {
  const list = limit ? events.slice(0, limit) : events;

  if (list.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-[var(--color-panel-border-strong)] p-6 text-center text-[13.5px] text-[var(--color-text-faint)]">
        No activity yet. Activity will appear here once an agreement is created.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-[var(--color-panel-border)] rounded-2xl border border-[var(--color-panel-border)]">
      {list.map((e) => (
        <li key={e.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
          <div className="min-w-0">
            <p className="text-[13.5px] text-[var(--color-text)]">{e.message}</p>
            <p className="mt-0.5 text-[12px] text-[var(--color-text-faint)]">
              {activityLabel[e.type]} &middot; {formatDateTime(e.timestamp)}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            {e.txHash && (
              <span className="font-mono hidden text-[12px] text-[var(--color-text-faint)] sm:inline">
                {e.txHash}
              </span>
            )}
            <Link
              href={`/agreements/${e.agreementId}`}
              className="flex items-center gap-1 text-[12.5px] text-[var(--color-blue)] hover:underline"
            >
              {e.agreementId}
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}
