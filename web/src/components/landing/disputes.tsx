export function Disputes() {
  return (
    <section className="border-t border-[var(--color-panel-border)] py-20">
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:items-start">
          <h2 className="font-display text-balance text-[28px] font-medium leading-tight text-[var(--color-text)] sm:text-[32px]">
            When the requester disagrees
          </h2>
          <div className="space-y-4 text-[15px] leading-relaxed text-[var(--color-text-muted)]">
            <p>
              If a requester believes the submitted result doesn&rsquo;t meet
              the agreement&rsquo;s conditions, they can open a dispute
              instead of accepting the evaluation outcome.
            </p>
            <p>
              A dispute carries the original agreement, its conditions, the
              worker&rsquo;s submission, the evidence, and the requester&rsquo;s
              stated reason plus any additional evidence into a resolution
              process. The agreement moves to{" "}
              <span className="font-mono text-[13px] text-[var(--color-text)]">
                Dispute Pending
              </span>{" "}
              until it&rsquo;s resolved.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
