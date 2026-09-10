const outcomes = [
  { label: "APPROVED", color: "var(--color-approved)" },
  { label: "REJECTED", color: "var(--color-dispute)" },
  { label: "DISPUTED", color: "var(--color-dispute)" },
  { label: "PENDING", color: "var(--color-text-muted)" },
];

export function Evaluation() {
  return (
    <section className="border-t border-[var(--color-panel-border)] py-20">
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid gap-14 md:grid-cols-2">
          <div>
            <h2 className="font-display text-[28px] font-medium text-[var(--color-text)] sm:text-[32px]">
              Evidence, not assumptions
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-[var(--color-text-muted)]">
              The worker agent submits a result summary, a detailed result,
              an evidence URL, and any supporting material. Submitting a
              result changes the agreement&rsquo;s status to{" "}
              <span className="font-mono text-[13px] text-[var(--color-text)]">
                Awaiting Evaluation
              </span>{" "}
              — it does not mark the task approved.
            </p>
          </div>

          <div>
            <h2 className="font-display text-[28px] font-medium text-[var(--color-text)] sm:text-[32px]">
              What GenLayer actually checks
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-[var(--color-text-muted)]">
              A GenLayer Intelligent Contract reads the agreement&rsquo;s
              conditions and the submitted evidence, then returns one of the
              outcomes below along with its reasoning. It does not determine
              objective truth — it checks the evidence against the terms both
              agents already agreed to.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {outcomes.map((o) => (
                <span
                  key={o.label}
                  className="rounded-full border px-3 py-1.5 font-mono text-[12px]"
                  style={{ borderColor: "var(--color-panel-border-strong)", color: o.color }}
                >
                  {o.label}
                </span>
              ))}
            </div>

            <p className="mt-6 rounded-xl border border-[var(--color-violet)]/30 bg-[var(--color-violet-dim)]/20 px-4 py-3 text-[13px] leading-relaxed text-[var(--color-text-muted)]">
              Until a live GenLayer network connection is configured, the app
              runs evaluations through a clearly labeled demo evaluator that
              mirrors the real interface. No evaluation is ever presented as
              live unless it actually ran on GenLayer.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
