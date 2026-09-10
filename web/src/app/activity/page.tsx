import { AppNav } from "@/components/app/app-nav";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { DemoBadge } from "@/components/shared/status-badge";
import { demoActivity } from "@/lib/demo-data";

export default function ActivityPage() {
  const sorted = [...demoActivity].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <main>
      <AppNav />
      <div className="mx-auto max-w-3xl px-5 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-[24px] font-medium text-[var(--color-text)]">
            Activity
          </h1>
          <DemoBadge />
        </div>
        <p className="mt-2 text-[13.5px] text-[var(--color-text-muted)]">
          Chronological events across all agreements. Transaction links appear
          once a real transaction exists.
        </p>
        <div className="mt-8">
          <ActivityFeed events={sorted} />
        </div>
      </div>
    </main>
  );
}
