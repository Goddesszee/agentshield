"use client";

import { useMemo, useState } from "react";
import { AppNav } from "@/components/app/app-nav";
import { AgreementCard } from "@/components/dashboard/agreement-card";
import { DemoBadge } from "@/components/shared/status-badge";
import { demoAgreements } from "@/lib/demo-data";
import { statusConfig } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { AgreementStatus } from "@/types";

const filters: Array<{ label: string; value: AgreementStatus | "ALL" }> = [
  { label: "All", value: "ALL" },
  ...(Object.keys(statusConfig) as AgreementStatus[]).map((s) => ({
    label: statusConfig[s].label,
    value: s,
  })),
];

export default function AgreementsPage() {
  const [filter, setFilter] = useState<AgreementStatus | "ALL">("ALL");

  const list = useMemo(
    () => (filter === "ALL" ? demoAgreements : demoAgreements.filter((a) => a.status === filter)),
    [filter]
  );

  return (
    <main>
      <AppNav />
      <div className="mx-auto max-w-6xl px-5 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-[24px] font-medium text-[var(--color-text)]">
            Agreements
          </h1>
          <DemoBadge />
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-[12.5px] transition-colors",
                filter === f.value
                  ? "border-[var(--color-blue)]/50 bg-[var(--color-blue)]/10 text-[var(--color-text)]"
                  : "border-[var(--color-panel-border-strong)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {list.length === 0 ? (
          <p className="mt-10 rounded-xl border border-dashed border-[var(--color-panel-border-strong)] p-8 text-center text-[13.5px] text-[var(--color-text-faint)]">
            No agreements with this status.
          </p>
        ) : (
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {list.map((a) => (
              <AgreementCard key={a.id} agreement={a} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
