// Shared application types. Expanded as each milestone introduces new data shapes.

export type AgreementStatus =
  | "AWAITING_EVIDENCE"
  | "PENDING_EVALUATION"
  | "APPROVED"
  | "DISPUTED"
  | "ESCROWED"
  | "RELEASED"
  | "REFUNDED";
