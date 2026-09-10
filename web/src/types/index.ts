// Shared application types. Expanded as each milestone introduces new data shapes.

export type AgreementStatus =
  | "AWAITING_EVIDENCE"
  | "PENDING_EVALUATION"
  | "APPROVED"
  | "DISPUTED"
  | "ESCROWED"
  | "RELEASED"
  | "REFUNDED";

export type TimelineStepKey =
  | "CREATED"
  | "ESCROW_FUNDED"
  | "IN_PROGRESS"
  | "EVIDENCE_SUBMITTED"
  | "EVALUATION"
  | "SETTLEMENT";

export type EvaluationOutcome = "APPROVED" | "REJECTED" | "DISPUTED" | "PENDING";

export interface Condition {
  id: string;
  text: string;
}

export interface Evidence {
  resultSummary: string;
  detailedResult: string;
  evidenceUrl?: string;
  submittedAt: string;
}

export interface Evaluation {
  outcome: EvaluationOutcome;
  reasoning: string;
  isDemo: boolean;
  evaluatedAt?: string;
}

export interface Agreement {
  id: string; // e.g. AG-0001
  requester: { name: string; address: string };
  worker: { name: string; address: string };
  taskTitle: string;
  taskDescription: string;
  conditions: Condition[];
  escrowAmount: number;
  escrowAsset: "USDC";
  network: "GenLayer Testnet";
  status: AgreementStatus;
  createdAt: string;
  deadline: string;
  evidence?: Evidence;
  evaluation?: Evaluation;
  txHash?: string;
  isDemo: boolean;
}

export type ActivityType =
  | "AGREEMENT_CREATED"
  | "USDC_DEPOSITED"
  | "EVIDENCE_SUBMITTED"
  | "EVALUATION_STARTED"
  | "AGREEMENT_APPROVED"
  | "ESCROW_RELEASED"
  | "DISPUTE_OPENED"
  | "ESCROW_REFUNDED";

export interface ActivityEvent {
  id: string;
  agreementId: string;
  type: ActivityType;
  message: string;
  timestamp: string;
  txHash?: string;
  isDemo: boolean;
}
