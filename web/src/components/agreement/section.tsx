export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-[var(--color-panel-border)] py-6 first:border-t-0 first:pt-0">
      <h2 className="font-display text-[15px] font-medium text-[var(--color-text)]">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}
