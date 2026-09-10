export function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "blue" | "violet" | "approved" | "dispute";
}) {
  const color = accent ? `var(--color-${accent})` : "var(--color-text)";
  return (
    <div className="rounded-2xl border border-[var(--color-panel-border)] bg-[var(--color-panel)] p-5">
      <p className="text-[13px] text-[var(--color-text-muted)]">{label}</p>
      <p className="font-display mt-2 text-[26px] font-medium" style={{ color }}>
        {value}
      </p>
    </div>
  );
}
