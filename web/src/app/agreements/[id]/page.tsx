import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { AppNav } from "@/components/app/app-nav";
import { StatusBadge, DemoBadge } from "@/components/shared/status-badge";
import { AgreementTimeline } from "@/components/agreement/timeline";
import { Section } from "@/components/agreement/section";
import { demoAgreements, demoActivity, getAgreementById } from "@/lib/demo-data";
import { getTimelineSteps } from "@/lib/timeline";
import { formatDate, formatDateTime, formatUsdc } from "@/lib/format";

export function generateStaticParams() {
  return demoAgreements.map((a) => ({ id: a.id }));
}

export default async function AgreementDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const agreement = getAgreementById(id);
  if (!agreement) notFound();

  const steps = getTimelineSteps(agreement);
  const activity = demoActivity.filter((e) => e.agreementId === agreement.id);

  return (
    <main>
      <AppNav />
      <div className="mx-auto max-w-4xl px-5 py-10">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[12px] text-[var(--color-text-faint)]">
              AgentShield Agreement
            </p>
            <h1 className="font-display mt-1 text-[24px] font-medium text-[var(--color-text)]">
              {agreement.id}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <DemoBadge />
            <StatusBadge status={agreement.status} />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-5 rounded-2xl border border-[var(--color-panel-border)] bg-[var(--color-panel)] p-5 sm:grid-cols-3">
          <Field label="Requester" value={agreement.requester.name} sub={agreement.requester.address} />
          <Field label="Worker" value={agreement.worker.name} sub={agreement.worker.address} />
          <Field label="Escrow" value={formatUsdc(agreement.escrowAmount)} mono />
          <Field label="Deadline" value={formatDate(agreement.deadline)} />
          <Field label="Created" value={formatDate(agreement.createdAt)} />
          <Field label="Network" value={agreement.network} />
        </div>

        <div className="mt-10 rounded-2xl border border-[var(--color-panel-border)] p-6">
          <AgreementTimeline steps={steps} />
        </div>

        <div className="mt-10">
          <Section title="Agreement Terms">
            <p className="text-[14px] leading-relaxed text-[var(--color-text-muted)]">
              {agreement.taskDescription}
            </p>
          </Section>

          <Section title="Success Conditions">
            <ul className="space-y-2">
              {agreement.conditions.map((c, i) => (
                <li key={c.id} className="flex gap-3 text-[14px] text-[var(--color-text-muted)]">
                  <span className="font-mono shrink-0 text-[var(--color-blue)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {c.text}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Escrow Details">
            <p className="text-[14px] text-[var(--color-text-muted)]">
              <span className="font-mono text-[var(--color-text)]">
                {formatUsdc(agreement.escrowAmount)}
              </span>{" "}
              locked on {agreement.network}. Released only on an APPROVED evaluation or a resolved
              dispute — never on submission alone.
            </p>
          </Section>

          <Section title="Evidence">
            {agreement.evidence ? (
              <div className="space-y-2 text-[14px] text-[var(--color-text-muted)]">
                <p className="text-[var(--color-text)]">{agreement.evidence.resultSummary}</p>
                <p className="leading-relaxed">{agreement.evidence.detailedResult}</p>
                {agreement.evidence.evidenceUrl && (
                  <a
                    href={agreement.evidence.evidenceUrl}
                    className="inline-flex items-center gap-1 text-[13px] text-[var(--color-blue)] hover:underline"
                  >
                    View evidence <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                <p className="text-[12.5px] text-[var(--color-text-faint)]">
                  Submitted {formatDateTime(agreement.evidence.submittedAt)}
                </p>
              </div>
            ) : (
              <p className="text-[13.5px] text-[var(--color-text-faint)]">
                No evidence submitted yet.
              </p>
            )}
          </Section>

          <Section title="Evaluation">
            {agreement.evaluation ? (
              <div className="space-y-2">
                <p className="font-mono text-[12px] text-[var(--color-violet)]">
                  {agreement.evaluation.outcome}
                  {agreement.evaluation.isDemo && (
                    <span className="ml-2 text-[var(--color-text-faint)]">DEMO EVALUATION</span>
                  )}
                </p>
                <p className="text-[14px] leading-relaxed text-[var(--color-text-muted)]">
                  {agreement.evaluation.reasoning}
                </p>
              </div>
            ) : (
              <p className="text-[13.5px] text-[var(--color-text-faint)]">
                Not yet evaluated.
              </p>
            )}
          </Section>

          <Section title="Settlement">
            <p className="text-[13.5px] text-[var(--color-text-muted)]">
              {agreement.status === "RELEASED" || agreement.status === "APPROVED"
                ? "Escrow released to the worker."
                : agreement.status === "REFUNDED"
                ? "Escrow refunded to the requester."
                : agreement.status === "DISPUTED"
                ? "Awaiting dispute resolution."
                : "Not yet settled."}
            </p>
          </Section>

          <Section title="Activity">
            {activity.length === 0 ? (
              <p className="text-[13.5px] text-[var(--color-text-faint)]">No activity yet.</p>
            ) : (
              <ul className="space-y-2">
                {activity.map((e) => (
                  <li key={e.id} className="text-[13.5px] text-[var(--color-text-muted)]">
                    {e.message} — {formatDateTime(e.timestamp)}
                  </li>
                ))}
              </ul>
            )}
          </Section>

          <Section title="Transaction Links">
            {agreement.txHash ? (
              <p className="font-mono text-[13px] text-[var(--color-blue)]">{agreement.txHash}</p>
            ) : (
              <p className="text-[13.5px] text-[var(--color-text-faint)]">
                No onchain transaction yet — this agreement is running in mock mode.
              </p>
            )}
          </Section>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  sub,
  mono,
}: {
  label: string;
  value: string;
  sub?: string;
  mono?: boolean;
}) {
  return (
    <div>
      <p className="text-[12px] text-[var(--color-text-faint)]">{label}</p>
      <p className={mono ? "font-mono mt-1 text-[14px] text-[var(--color-text)]" : "mt-1 text-[14px] text-[var(--color-text)]"}>
        {value}
      </p>
      {sub && <p className="font-mono mt-0.5 text-[11.5px] text-[var(--color-text-faint)]">{sub}</p>}
    </div>
  );
}
