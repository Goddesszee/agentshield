import { Check, X } from "lucide-react";
import type { TimelineStep } from "@/lib/timeline";
import { cn } from "@/lib/utils";

const dotStyles: Record<TimelineStep["state"], string> = {
  done: "bg-[var(--color-blue)] border-[var(--color-blue)]",
  active: "bg-[var(--color-violet-dim)] border-[var(--color-violet)]",
  pending: "bg-[var(--color-panel)] border-[var(--color-panel-border-strong)]",
  disputed: "bg-[var(--color-dispute)]/20 border-[var(--color-dispute)]",
};

const lineStyles: Record<TimelineStep["state"], string> = {
  done: "bg-[var(--color-blue)]",
  active: "bg-[var(--color-panel-border-strong)]",
  pending: "bg-[var(--color-panel-border-strong)]",
  disputed: "bg-[var(--color-dispute)]",
};

export function AgreementTimeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <ol className="flex flex-col sm:flex-row sm:items-start">
      {steps.map((s, i) => (
        <li key={s.key} className="flex flex-1 items-start sm:flex-col">
          <div className="flex items-center sm:w-full">
            <span
              className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2",
                dotStyles[s.state]
              )}
            >
              {s.state === "done" && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
              {s.state === "disputed" && (
                <X className="h-3 w-3 text-[var(--color-dispute)]" strokeWidth={3} />
              )}
            </span>
            {i < steps.length - 1 && (
              <span
                className={cn(
                  "mx-2 hidden h-px flex-1 sm:mx-0 sm:mt-[11px] sm:ml-0 sm:block sm:h-0.5 sm:w-full",
                  lineStyles[s.state]
                )}
              />
            )}
          </div>
          <p
            className={cn(
              "ml-3 mt-0.5 text-[12.5px] sm:ml-0 sm:mt-2",
              s.state === "pending" ? "text-[var(--color-text-faint)]" : "text-[var(--color-text)]"
            )}
          >
            {s.label}
          </p>
        </li>
      ))}
    </ol>
  );
}
