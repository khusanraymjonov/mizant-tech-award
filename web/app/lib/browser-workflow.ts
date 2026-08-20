import type { SmeApplication } from '@mizant/domain';
import { requiredEvidence, type SyntheticApplicationDraft } from './application-draft';

export const submittedApplicationsStorageKey = 'mizant-sme-submissions-v1';

export type BrowserApplicationStatus =
  | 'awaiting_review'
  | 'manual_review'
  | 'in_review'
  | 'evidence_requested'
  | 'review_complete';

export interface BrowserApplicationEvent {
  at: string;
  actor: string;
  action: string;
}

export interface BrowserApplicationRecord {
  reference: string;
  legalName: string;
  registrationReference: string;
  location: string;
  sector: string;
  operatingHistoryYears: number;
  assetNeed: string;
  supplier: string;
  assetPrice: number;
  requestedTermMonths: number;
  businessRationale: string;
  submittedAt: string;
  status: BrowserApplicationStatus;
  evidenceCount: number;
  evidenceTotal: number;
  currentLane: 'compliance_risk';
  assignedReviewer?: string;
  history: BrowserApplicationEvent[];
}

const statuses: BrowserApplicationStatus[] = [
  'awaiting_review',
  'manual_review',
  'in_review',
  'evidence_requested',
  'review_complete',
];

export function createBrowserApplicationRecordFromSmeApplication(
  application: SmeApplication,
): BrowserApplicationRecord {
  const latestSubmission = application.submissionHistory.at(-1);
  const submittedAt = latestSubmission?.at ?? '2026-08-14T09:00:00.000Z';
  const manualReview = application.status === 'manual_review';

  return {
    reference: application.reference,
    legalName: application.identity.legalName,
    registrationReference: application.identity.registrationReference,
    location: application.identity.location,
    sector: application.identity.sector,
    operatingHistoryYears: application.identity.operatingHistoryYears,
    assetNeed: application.rationale.productiveAssetNeed,
    supplier: application.asset.supplier,
    assetPrice: Number(application.asset.priceMinor) / 100,
    requestedTermMonths: application.structure.requestedTermMonths,
    businessRationale: application.rationale.businessRationale,
    submittedAt,
    status: manualReview ? 'manual_review' : 'awaiting_review',
    evidenceCount: application.evidence.filter((item) => item.status === 'present').length,
    evidenceTotal: application.evidence.length,
    currentLane: 'compliance_risk',
    history: [
      {
        at: submittedAt,
        actor: manualReview ? 'Policy engine and originator' : 'Originator team',
        action: manualReview ? 'Application routed to manual review' : 'Application submitted',
      },
    ],
  };
}

export function createBrowserApplicationRecord(
  draft: SyntheticApplicationDraft,
  reference: string,
  submittedAt: string,
): BrowserApplicationRecord {
  return {
    reference,
    legalName: draft.legalName.trim(),
    registrationReference: draft.registrationReference.trim(),
    location: draft.location,
    sector: draft.sector,
    operatingHistoryYears: Number(draft.operatingHistoryYears),
    assetNeed: draft.assetNeed.trim(),
    supplier: draft.supplier.trim(),
    assetPrice: Number(draft.assetPrice),
    requestedTermMonths: Number(draft.requestedTermMonths),
    businessRationale: draft.businessRationale.trim(),
    submittedAt,
    status: 'awaiting_review',
    evidenceCount: requiredEvidence.filter(([id]) => draft.evidence[id]).length,
    evidenceTotal: requiredEvidence.length,
    currentLane: 'compliance_risk',
    history: [{ at: submittedAt, actor: 'SME/originator', action: 'Application submitted' }],
  };
}

function isBrowserApplicationRecord(value: unknown): value is BrowserApplicationRecord {
  if (!value || typeof value !== 'object') return false;
  const record = value as Partial<BrowserApplicationRecord>;
  return (
    typeof record.reference === 'string' &&
    typeof record.legalName === 'string' &&
    typeof record.registrationReference === 'string' &&
    typeof record.location === 'string' &&
    typeof record.sector === 'string' &&
    typeof record.operatingHistoryYears === 'number' &&
    typeof record.assetNeed === 'string' &&
    typeof record.supplier === 'string' &&
    typeof record.assetPrice === 'number' &&
    typeof record.requestedTermMonths === 'number' &&
    typeof record.businessRationale === 'string' &&
    typeof record.submittedAt === 'string' &&
    typeof record.status === 'string' &&
    statuses.includes(record.status as BrowserApplicationStatus) &&
    typeof record.evidenceCount === 'number' &&
    typeof record.evidenceTotal === 'number' &&
    record.currentLane === 'compliance_risk' &&
    Array.isArray(record.history)
  );
}

export function parseBrowserApplicationRecords(raw: string | null): BrowserApplicationRecord[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isBrowserApplicationRecord) : [];
  } catch {
    return [];
  }
}

export type BrowserReviewAction = 'claim' | 'request_evidence' | 'complete';

export function applyBrowserReviewAction(
  record: BrowserApplicationRecord,
  action: BrowserReviewAction,
  actor: string,
  at: string,
): BrowserApplicationRecord {
  if (action === 'complete' && record.status !== 'in_review') return record;

  const status: BrowserApplicationStatus =
    action === 'claim'
      ? 'in_review'
      : action === 'request_evidence'
        ? 'evidence_requested'
        : 'review_complete';
  const eventAction =
    action === 'claim'
      ? 'Case claimed for review'
      : action === 'request_evidence'
        ? 'Additional evidence requested'
        : 'Review record completed';

  return {
    ...record,
    status,
    ...(action === 'claim' ? { assignedReviewer: actor } : {}),
    history: [...record.history, { at, actor, action: eventAction }],
  };
}
