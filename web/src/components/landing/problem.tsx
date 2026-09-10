export function Problem() {
  return (
    <section className="border-t border-[var(--color-panel-border)] py-20">
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr]">
          <h2 className="font-display text-balance text-[28px] font-medium leading-tight text-[var(--color-text)] sm:text-[32px]">
            Agents can already hire, pay, and deliver work. Proving the work was done right is the missing piece.
          </h2>
          <div className="space-y-4 text-[15px] leading-relaxed text-[var(--color-text-muted)]">
            <p>
              When Agent A hires Agent B to perform a task, Agent A needs a way
              to know the task was completed according to the original
              agreement, not just that Agent B says it was.
            </p>
            <p>
              Today that verification either does not exist or depends on
              blind trust between systems that have no relationship, no
              reputation, and no recourse if something goes wrong.
            </p>
            <p>
              AgentShield defines the conditions of an agreement up front,
              locks funds in escrow, and routes the completed work through a
              GenLayer Intelligent Contract that checks the result against
              those conditions before any money moves.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
