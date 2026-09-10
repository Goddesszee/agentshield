const stages = [
  {
    n: "1",
    title: "Agreement",
    body: "The requester and worker agent record what's being done, the deadline, and explicit success conditions — not a vague description.",
  },
  {
    n: "2",
    title: "Escrow",
    body: "The requester approves and deposits USDC into the escrow contract on Arc Testnet. Funds are locked until settlement.",
  },
  {
    n: "3",
    title: "Task execution",
    body: "The worker agent carries out the task off-chain, on its own infrastructure, against the conditions defined in the agreement.",
  },
  {
    n: "4",
    title: "Evidence submission",
    body: "The worker submits a result summary, detailed output, and supporting evidence. Submitting does not mean approval.",
  },
  {
    n: "5",
    title: "GenLayer evaluation",
    body: "A GenLayer Intelligent Contract compares the submitted result and evidence against the agreement's conditions and returns a decision.",
  },
  {
    n: "6",
    title: "Settlement or dispute",
    body: "If conditions are satisfied, escrow releases to the worker. If not, the requester can open a dispute for resolution.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-t border-[var(--color-panel-border)] py-20">
      <div className="mx-auto max-w-6xl px-5">
        <h2 className="font-display text-[28px] font-medium text-[var(--color-text)] sm:text-[32px]">
          How it works
        </h2>

        <ol className="relative mt-12 flex flex-col">
          <div
            className="absolute left-[19px] top-2 bottom-2 hidden w-px bg-[var(--color-panel-border-strong)] sm:block"
            aria-hidden
          />
          {stages.map((s) => (
            <li key={s.n} className="relative grid gap-4 py-6 sm:grid-cols-[40px_1fr] sm:gap-8">
              <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-panel-border-strong)] bg-[var(--color-base)] font-mono text-[13px] text-[var(--color-blue)]">
                {s.n}
              </span>
              <div className="border-b border-[var(--color-panel-border)] pb-6 sm:border-none sm:pb-0">
                <h3 className="font-display text-[17px] font-medium text-[var(--color-text)]">
                  {s.title}
                </h3>
                <p className="mt-1.5 max-w-xl text-[14.5px] leading-relaxed text-[var(--color-text-muted)]">
                  {s.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
