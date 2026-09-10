"use client";

import { useState } from "react";
import { Menu, X, ShieldHalf } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { label: "Dashboard", href: "#" },
  { label: "Agreements", href: "#" },
  { label: "Create Agreement", href: "#" },
  { label: "Activity", href: "#" },
  { label: "Docs", href: "#" },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-panel-border)] bg-[var(--color-base)]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <a href="#" className="flex items-center gap-2">
          <ShieldHalf className="h-5 w-5 text-[var(--color-blue)]" strokeWidth={2} />
          <span className="font-display text-[15px] font-semibold tracking-tight">
            AgentShield
          </span>
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-[13.5px] text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center md:flex">
          <button className="rounded-full border border-[var(--color-panel-border-strong)] bg-[var(--color-panel)] px-4 py-2 text-[13.5px] font-medium text-[var(--color-text)] transition-colors hover:border-[var(--color-blue)]/50">
            Connect Wallet
          </button>
        </div>

        <button
          className="text-[var(--color-text)] md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-[var(--color-panel-border)] transition-[max-height] duration-300 ease-out md:hidden",
          open ? "max-h-96" : "max-h-0 border-t-0"
        )}
      >
        <nav className="flex flex-col gap-1 px-5 py-4">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="rounded-lg px-2 py-2.5 text-[14px] text-[var(--color-text-muted)] hover:bg-[var(--color-panel)] hover:text-[var(--color-text)]"
            >
              {l.label}
            </a>
          ))}
          <button className="mt-2 rounded-full border border-[var(--color-panel-border-strong)] bg-[var(--color-panel)] px-4 py-2.5 text-[14px] font-medium text-[var(--color-text)]">
            Connect Wallet
          </button>
        </nav>
      </div>
    </header>
  );
}
