import type { AgreementStatus, ActivityType } from "@/types";

export function formatUsdc(amount: number): string {
  return `${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDC`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function shortAddress(address: string): string {
  return address;
}

export const statusConfig: Record<
  AgreementStatus,
  { label: string; color: string; bg: string }
> = {
  AWAITING_EVIDENCE: {
    label: "Awaiting Evidence",
    color: "var(--color-text-muted)",
    bg: "rgba(139,147,168,0.12)",
  },
  PENDING_EVALUATION: {
    label: "Pending Evaluation",
    color: "var(--color-violet)",
    bg: "rgba(124,92,255,0.14)",
  },
  APPROVED: {
    label: "Approved",
    color: "var(--color-approved)",
    bg: "rgba(53,201,140,0.14)",
  },
  DISPUTED: {
    label: "Disputed",
    color: "var(--color-dispute)",
    bg: "rgba(224,165,60,0.14)",
  },
  ESCROWED: {
    label: "Escrowed",
    color: "var(--color-blue)",
    bg: "rgba(59,116,242,0.14)",
  },
  RELEASED: {
    label: "Released",
    color: "var(--color-approved)",
    bg: "rgba(53,201,140,0.14)",
  },
  REFUNDED: {
    label: "Refunded",
    color: "var(--color-refund)",
    bg: "rgba(107,114,128,0.14)",
  },
};

export const activityLabel: Record<ActivityType, string> = {
  AGREEMENT_CREATED: "Agreement created",
  USDC_DEPOSITED: "USDC deposited",
  EVIDENCE_SUBMITTED: "Evidence submitted",
  EVALUATION_STARTED: "Evaluation started",
  AGREEMENT_APPROVED: "Agreement approved",
  ESCROW_RELEASED: "Escrow released",
  DISPUTE_OPENED: "Dispute opened",
  ESCROW_REFUNDED: "Escrow refunded",
};
