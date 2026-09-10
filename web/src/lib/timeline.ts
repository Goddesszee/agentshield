import type { Agreement, TimelineStepKey } from "@/types";

export type StepState = "done" | "active" | "pending" | "disputed";

export interface TimelineStep {
  key: TimelineStepKey;
  label: string;
  state: StepState;
}

const order: TimelineStepKey[] = [
  "CREATED",
  "ESCROW_FUNDED",
  "IN_PROGRESS",
  "EVIDENCE_SUBMITTED",
  "EVALUATION",
  "SETTLEMENT",
];

const labels: Record<TimelineStepKey, string> = {
  CREATED: "Agreement Created",
  ESCROW_FUNDED: "Escrow Funded",
  IN_PROGRESS: "Task In Progress",
  EVIDENCE_SUBMITTED: "Evidence Submitted",
  EVALUATION: "Evaluation",
  SETTLEMENT: "Settlement",
};

export function getTimelineSteps(agreement: Agreement): TimelineStep[] {
  // How far the agreement has progressed, as an index into `order`.
  let reachedIndex = 0;

  switch (agreement.status) {
    case "AWAITING_EVIDENCE":
      reachedIndex = 2; // created, funded, in progress active
      break;
    case "ESCROWED":
      reachedIndex = 1; // created, funded done — in progress active
      break;
    case "PENDING_EVALUATION":
      reachedIndex = 4; // through evidence submitted, evaluation active
      break;
    case "APPROVED":
    case "RELEASED":
    case "DISPUTED":
    case "REFUNDED":
      reachedIndex = 5; // through evaluation, settlement reflects outcome
      break;
  }

  return order.map((key, i) => {
    let state: StepState = "pending";
    if (i < reachedIndex) state = "done";
    else if (i === reachedIndex) state = "active";

    if (key === "SETTLEMENT") {
      if (agreement.status === "APPROVED" || agreement.status === "RELEASED") state = "done";
      else if (agreement.status === "DISPUTED") state = "disputed";
      else if (agreement.status === "REFUNDED") state = "done";
      else state = "pending";
    }

    return { key, label: labels[key], state };
  });
}
