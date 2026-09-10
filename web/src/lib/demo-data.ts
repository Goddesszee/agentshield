import type { Agreement, ActivityEvent } from "@/types";

// All data in this file is DEMO DATA. It exists so the dashboard and
// agreement pages are understandable before any wallet is connected or any
// real onchain activity exists. Every record carries isDemo: true and the
// UI must always surface that — never render this as live activity.

export const demoAgreements: Agreement[] = [
  {
    id: "AG-0001",
    requester: { name: "Buyer Agent", address: "0x8f2a...9c31" },
    worker: { name: "Research Agent", address: "0x4b71...e208" },
    taskTitle: "Find 50 qualified Web3 leads",
    taskDescription:
      "Find 50 qualified leads matching the agreement criteria and provide the required information for each.",
    conditions: [
      { id: "c1", text: "At least 50 qualified leads submitted" },
      { id: "c2", text: "Each lead includes company, website, and contact information" },
      { id: "c3", text: "Result submitted before the deadline" },
    ],
    escrowAmount: 100,
    escrowAsset: "USDC",
    network: "Arc Testnet",
    status: "PENDING_EVALUATION",
    createdAt: "2026-09-02T14:20:00Z",
    deadline: "2026-09-12T00:00:00Z",
    evidence: {
      resultSummary: "52 leads delivered across 4 verticals.",
      detailedResult:
        "Submitted a spreadsheet of 52 leads with company name, website, and a verified contact for each, sourced from public company directories.",
      evidenceUrl: "https://example.com/evidence/ag-0001",
      submittedAt: "2026-09-08T09:12:00Z",
    },
    isDemo: true,
  },
  {
    id: "AG-0002",
    requester: { name: "Commerce Agent", address: "0x1d09...44ab" },
    worker: { name: "Verification Agent", address: "0x9a63...11f0" },
    taskTitle: "Verify supplier documentation",
    taskDescription:
      "Verify that the supplier's compliance documents match the agreed checklist before the purchase order is released.",
    conditions: [
      { id: "c1", text: "All 6 compliance documents present" },
      { id: "c2", text: "Each document dated within the last 12 months" },
    ],
    escrowAmount: 40,
    escrowAsset: "USDC",
    network: "Arc Testnet",
    status: "APPROVED",
    createdAt: "2026-08-27T10:05:00Z",
    deadline: "2026-09-03T00:00:00Z",
    evidence: {
      resultSummary: "All 6 documents verified against the checklist.",
      detailedResult:
        "Cross-checked each compliance document against the agreed checklist. All 6 were present and within the required date range.",
      submittedAt: "2026-09-01T16:40:00Z",
    },
    evaluation: {
      outcome: "APPROVED",
      reasoning:
        "Submitted evidence lists all 6 required documents with dates within the last 12 months, satisfying both conditions.",
      isDemo: true,
      evaluatedAt: "2026-09-01T17:02:00Z",
    },
    txHash: "0x6e2f...b8a1",
    isDemo: true,
  },
  {
    id: "AG-0003",
    requester: { name: "Buyer Agent", address: "0x8f2a...9c31" },
    worker: { name: "Data Agent", address: "0x22c4...7de9" },
    taskTitle: "Clean and dedupe customer dataset",
    taskDescription:
      "Remove duplicate records and normalize contact fields across the provided customer dataset.",
    conditions: [
      { id: "c1", text: "Zero duplicate records by email" },
      { id: "c2", text: "All phone numbers in E.164 format" },
      { id: "c3", text: "Row count discrepancy under 1%" },
    ],
    escrowAmount: 65,
    escrowAsset: "USDC",
    network: "Arc Testnet",
    status: "DISPUTED",
    createdAt: "2026-08-21T08:00:00Z",
    deadline: "2026-08-29T00:00:00Z",
    evidence: {
      resultSummary: "Deduped dataset returned, 3% row count reduction.",
      detailedResult:
        "Removed duplicate records by email and normalized phone numbers. Final row count is 3% lower than the source file.",
      submittedAt: "2026-08-28T12:00:00Z",
    },
    evaluation: {
      outcome: "DISPUTED",
      reasoning:
        "Row count discrepancy of 3% exceeds the 1% threshold defined in the agreement's conditions.",
      isDemo: true,
      evaluatedAt: "2026-08-28T13:15:00Z",
    },
    isDemo: true,
  },
  {
    id: "AG-0004",
    requester: { name: "Commerce Agent", address: "0x1d09...44ab" },
    worker: { name: "Research Agent", address: "0x4b71...e208" },
    taskTitle: "Competitor pricing report",
    taskDescription:
      "Produce a pricing comparison across 10 named competitors, refreshed weekly for one month.",
    conditions: [
      { id: "c1", text: "All 10 competitors included in each report" },
      { id: "c2", text: "4 weekly reports delivered" },
    ],
    escrowAmount: 220,
    escrowAsset: "USDC",
    network: "Arc Testnet",
    status: "AWAITING_EVIDENCE",
    createdAt: "2026-09-05T11:30:00Z",
    deadline: "2026-10-03T00:00:00Z",
    isDemo: true,
  },
  {
    id: "AG-0005",
    requester: { name: "Buyer Agent", address: "0x8f2a...9c31" },
    worker: { name: "Verification Agent", address: "0x9a63...11f0" },
    taskTitle: "KYC document cross-check",
    taskDescription:
      "Cross-check submitted KYC documents against the identity provided at signup.",
    conditions: [
      { id: "c1", text: "Name on document matches signup name exactly" },
      { id: "c2", text: "Document not expired" },
    ],
    escrowAmount: 25,
    escrowAsset: "USDC",
    network: "Arc Testnet",
    status: "REFUNDED",
    createdAt: "2026-08-10T09:00:00Z",
    deadline: "2026-08-14T00:00:00Z",
    evidence: {
      resultSummary: "Document expired at time of check.",
      detailedResult: "Submitted document had expired 11 days prior to review.",
      submittedAt: "2026-08-13T10:00:00Z",
    },
    evaluation: {
      outcome: "REJECTED",
      reasoning: "Document expiration date is before the check date, failing condition 2.",
      isDemo: true,
      evaluatedAt: "2026-08-13T10:20:00Z",
    },
    txHash: "0xaa41...5c02",
    isDemo: true,
  },
  {
    id: "AG-0006",
    requester: { name: "Commerce Agent", address: "0x1d09...44ab" },
    worker: { name: "Data Agent", address: "0x22c4...7de9" },
    taskTitle: "Inventory sync validation",
    taskDescription:
      "Confirm warehouse inventory counts match the platform listing counts after the nightly sync.",
    conditions: [
      { id: "c1", text: "SKU count discrepancy is zero" },
      { id: "c2", text: "Sync completed within the maintenance window" },
    ],
    escrowAmount: 55,
    escrowAsset: "USDC",
    network: "Arc Testnet",
    status: "ESCROWED",
    createdAt: "2026-09-07T18:45:00Z",
    deadline: "2026-09-14T00:00:00Z",
    isDemo: true,
  },
];

export const demoActivity: ActivityEvent[] = [
  {
    id: "act-01",
    agreementId: "AG-0006",
    type: "USDC_DEPOSITED",
    message: "Commerce Agent deposited 55 USDC into escrow for AG-0006",
    timestamp: "2026-09-07T18:47:00Z",
    isDemo: true,
  },
  {
    id: "act-02",
    agreementId: "AG-0001",
    type: "EVIDENCE_SUBMITTED",
    message: "Research Agent submitted evidence for AG-0001",
    timestamp: "2026-09-08T09:12:00Z",
    isDemo: true,
  },
  {
    id: "act-03",
    agreementId: "AG-0001",
    type: "EVALUATION_STARTED",
    message: "GenLayer evaluation started for AG-0001",
    timestamp: "2026-09-08T09:14:00Z",
    isDemo: true,
  },
  {
    id: "act-04",
    agreementId: "AG-0003",
    type: "DISPUTE_OPENED",
    message: "Buyer Agent opened a dispute on AG-0003",
    timestamp: "2026-08-28T13:20:00Z",
    isDemo: true,
  },
  {
    id: "act-05",
    agreementId: "AG-0002",
    type: "ESCROW_RELEASED",
    message: "Escrow released to Verification Agent for AG-0002",
    timestamp: "2026-09-01T17:05:00Z",
    txHash: "0x6e2f...b8a1",
    isDemo: true,
  },
  {
    id: "act-06",
    agreementId: "AG-0005",
    type: "ESCROW_REFUNDED",
    message: "Escrow refunded to Buyer Agent for AG-0005",
    timestamp: "2026-08-13T10:25:00Z",
    txHash: "0xaa41...5c02",
    isDemo: true,
  },
  {
    id: "act-07",
    agreementId: "AG-0004",
    type: "AGREEMENT_CREATED",
    message: "Commerce Agent created AG-0004 with Research Agent",
    timestamp: "2026-09-05T11:30:00Z",
    isDemo: true,
  },
];

export function getAgreementById(id: string): Agreement | undefined {
  return demoAgreements.find((a) => a.id === id);
}
