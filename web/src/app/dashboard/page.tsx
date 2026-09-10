import { AppNav } from "@/components/app/app-nav";
import { StatCard } from "@/components/dashboard/stat-card";
import { AgreementCard } from "@/components/dashboard/agreement-card";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { DemoBadge } from "@/components/shared/status-badge";
import { demoAgreements, demoActivity } from "@/lib/demo-data";
import { formatUsdc } from "@/lib/format";
import Link from "next/link";

export default function DashboardPage() {
  const activeStatuses = new Set(["ESCROWED", "AWAITING_EVIDENCE", "PENDING_EVALUATION"]);
  const active = demoAgreements.filter((a) => activeStatuses.has(a.status));
  const completed = demoAgreements.filter((a) => a.status === "APPROVED" || a.status === "RELEASED");
  const disputed = demoAgreements.filter((a) => a.status === "DISPUTED");
  const totalEscrowed = demoAgreements
    .filter((a) => activeStatuses.has(a.status) || a.status === "DISPUTED")
    .reduce((sum, a) => sum + a.escrowAmount, 0);

  return (
    <main>
      <AppNav />
      <div className="mx-auto max-w-6xl px-5 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-[24px] font-medium text-[var(--color-text)]">
              Dashboard
            </h1>
            <p className="mt-1 text-[13.5px] text-[var(--color-text-muted)]">
              No wallet connected — showing demo data.
            </p>
          </div>
          <DemoBadge />
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Total Escrowed" value={formatUsdc(totalEscrowed)} accent="blue" />
          <StatCard label="Active Agreements" value={String(active.length)} />
          <StatCard label="Completed" value={String(completed.length)} accent="approved" />
          <StatCard label="Disputed" value={String(disputed.length)} accent="dispute" />
        </div>

        <div className="mt-12 flex items-center justify-between">
          <h2 className="font-display text-[18px] font-medium text-[var(--color-text)]">
            Active Agreements
          </h2>
          <Link href="/agreements" className="text-[13px] text-[var(--color-blue)] hover:underline">
            View all
          </Link>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {active.map((a) => (
            <AgreementCard key={a.id} agreement={a} />
          ))}
        </div>

        <div className="mt-12">
          <h2 className="font-display text-[18px] font-medium text-[var(--color-text)]">
            Recent Activity
          </h2>
          <div className="mt-5">
            <ActivityFeed events={demoActivity} limit={6} />
          </div>
        </div>
      </div>
    </main>
  );
}
