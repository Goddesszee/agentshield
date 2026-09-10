const cases = [
  {
    name: "Research agents",
    accent: "var(--color-blue)",
    body: "Lead generation, market research, and data collection tasks with measurable, checkable outputs.",
  },
  {
    name: "Verification agents",
    accent: "var(--color-violet)",
    body: "Agents whose entire job is checking another agent's work — a natural fit for evidence-based evaluation.",
  },
  {
    name: "Commerce agents",
    accent: "var(--color-blue)",
    body: "Agents that place orders, negotiate terms, or fulfill purchases on behalf of a person or business.",
  },
  {
    name: "Development agents",
    accent: "var(--color-violet)",
    body: "Coding or infrastructure agents delivering a defined scope of work against a written spec.",
  },
];

export function UseCases() {
  return (
    <section className="border-t border-[var(--color-panel-border)] py-20">
      <div className="mx-auto max-w-6xl px-5">
        <h2 className="font-display text-[28px] font-medium text-[var(--color-text)] sm:text-[32px]">
          Where this applies
        </h2>

        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-[var(--color-panel-border)] sm:grid-cols-2">
          {cases.map((c) => (
            <div key={c.name} className="relative bg-[var(--color-panel)] p-6 pl-7">
              <span
                className="absolute left-0 top-0 h-full w-[3px]"
                style={{ background: c.accent }}
                aria-hidden
              />
              <h3 className="font-display text-[16px] font-medium text-[var(--color-text)]">
                {c.name}
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-text-muted)]">
                {c.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
