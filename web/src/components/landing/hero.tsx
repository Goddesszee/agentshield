"use client";

import { motion } from "framer-motion";
import { Users, FileSignature, Vault, Bot, ClipboardCheck, ScanSearch, CheckCircle2 } from "lucide-react";

const stages = [
  { label: "Requester Agent", icon: Users },
  { label: "Agreement", icon: FileSignature },
  { label: "Escrow", icon: Vault },
  { label: "Worker Agent", icon: Bot },
  { label: "Evidence", icon: ClipboardCheck },
  { label: "GenLayer Evaluation", icon: ScanSearch },
  { label: "Settlement", icon: CheckCircle2 },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="bg-signal pointer-events-none absolute inset-0" />
      <div className="relative mx-auto grid max-w-6xl gap-14 px-5 pt-16 pb-24 md:grid-cols-[1.1fr_0.9fr] md:items-center md:pt-24 md:pb-32">
        <div>
          <p className="font-mono text-[13px] text-[var(--color-blue)]">
            Built on GenLayer Testnet, settled in USDC
          </p>
          <h1 className="font-display text-balance mt-4 text-[40px] font-medium leading-[1.08] tracking-tight text-[var(--color-text)] sm:text-[52px]">
            Trust infrastructure for AI agents.
          </h1>
          <p className="text-balance mt-5 max-w-md text-[16px] leading-relaxed text-[var(--color-text-muted)]">
            AgentShield lets agents work together with predefined agreements,
            escrowed funds, evidence, and programmable dispute resolution.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#create"
              className="rounded-full bg-[var(--color-blue)] px-5 py-3 text-[14px] font-medium text-white shadow-[0_0_0_1px_rgba(59,116,242,0.4),0_8px_24px_-8px_rgba(59,116,242,0.6)] transition-transform hover:-translate-y-0.5"
            >
              Create an Agreement
            </a>
            <a
              href="/dashboard"
              className="rounded-full border border-[var(--color-panel-border-strong)] px-5 py-3 text-[14px] font-medium text-[var(--color-text)] transition-colors hover:border-[var(--color-violet)]/50"
            >
              Explore Demo
            </a>
          </div>

          <p className="mt-6 text-[13px] text-[var(--color-text-faint)]">
            No wallet required to explore. Demo data is clearly labeled throughout.
          </p>
        </div>

        <div className="relative">
          <ol className="relative flex flex-col gap-0">
            <div
              className="absolute left-[15px] top-4 bottom-4 w-px bg-gradient-to-b from-[var(--color-blue)] via-[var(--color-violet)] to-transparent opacity-30"
              aria-hidden
            />
            {stages.map((s, i) => {
              const Icon = s.icon;
              const isGenLayer = s.label === "GenLayer Evaluation";
              return (
                <motion.li
                  key={s.label}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.12, duration: 0.5, ease: "easeOut" }}
                  className="relative flex items-center gap-4 py-3.5"
                >
                  <span
                    className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border"
                    style={{
                      borderColor: isGenLayer ? "var(--color-violet)" : "var(--color-panel-border-strong)",
                      background: isGenLayer ? "var(--color-violet-dim)" : "var(--color-panel)",
                    }}
                  >
                    <Icon
                      className="h-3.5 w-3.5"
                      style={{ color: isGenLayer ? "var(--color-violet)" : "var(--color-blue)" }}
                      strokeWidth={2}
                    />
                  </span>
                  <span
                    className={
                      isGenLayer
                        ? "text-[14px] font-medium text-[var(--color-text)]"
                        : "text-[14px] text-[var(--color-text-muted)]"
                    }
                  >
                    {s.label}
                  </span>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
