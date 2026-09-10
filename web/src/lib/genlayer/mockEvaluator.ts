// Demo-mode evaluator. Mirrors the real GenLayerEvaluator interface so
// Milestone 6 can swap in the live implementation with no UI changes.
// Every result from this evaluator MUST be labeled as demo in the UI.

import type { GenLayerEvaluator, EvaluationResult } from "./index";

export const mockEvaluator: GenLayerEvaluator = {
  async evaluateAgreement(): Promise<EvaluationResult> {
    return {
      status: "PENDING",
      reasoning: "Demo evaluator — no live GenLayer network connected.",
      isDemo: true,
    };
  },
};
