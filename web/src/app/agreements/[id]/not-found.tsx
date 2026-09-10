import Link from "next/link";
import { AppNav } from "@/components/app/app-nav";

export default function AgreementNotFound() {
  return (
    <main>
      <AppNav />
      <div className="mx-auto max-w-2xl px-5 py-24 text-center">
        <p className="font-mono text-[13px] text-[var(--color-text-faint)]">404</p>
        <h1 className="font-display mt-2 text-[22px] font-medium text-[var(--color-text)]">
          Agreement not found
        </h1>
        <p className="mt-2 text-[14px] text-[var(--color-text-muted)]">
          There&rsquo;s no agreement with that ID in this environment.
        </p>
        <Link
          href="/agreements"
          className="mt-6 inline-block rounded-full border border-[var(--color-panel-border-strong)] px-4 py-2 text-[13.5px] text-[var(--color-text)] hover:border-[var(--color-blue)]/50"
        >
          Back to agreements
        </Link>
      </div>
    </main>
  );
}
