// GenLayer adapter interface.
// The UI should only ever call evaluateAgreement() — never a specific
// implementation — so the real GenLayer integration can be dropped in
// without touching any component code.
// Scaffolded in Milestone 1 — implemented in Milestone 6.

export type EvaluationResult = {
  status: "APPROVED" | "REJECTED" | "DISPUTED" | "PENDING";
  reasoning?: string;
  isDemo: boolean;
};

export interface GenLayerEvaluator {
  evaluateAgreement(agreementId: string): Promise<EvaluationResult>;
}
