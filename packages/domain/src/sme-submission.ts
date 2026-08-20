export type ApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'manual_review'
  | 'approved_for_governance'
  | 'blocked';
export type EvidenceStatus = 'present' | 'missing' | 'requires_review';
export type ReviewLane = 'legal' | 'compliance_risk' | 'independent_shariah';
export type ReviewDecision = 'pending' | 'conditions_set' | 'approved' | 'not_approved';

export interface ProvisionalPilotPolicy {
  id: string;
  version: number;
  label: 'PROVISIONAL — PROFESSIONAL APPROVAL REQUIRED';
  jurisdiction: string;
  sectors: readonly string[];
  assetValueMinor: { minimum: bigint; maximum: bigint; currency: 'USD' };
  normalOperatingHistoryYears: number;
  automaticApprovalEnabled: false;
  manualReviewTriggers: readonly string[];
}

export interface EvidenceItem {
  id: string;
  type: string;
  label: string;
  required: boolean;
  version: number;
  status: EvidenceStatus;
  explanation: string;
}

export interface ReviewRecord {
  lane: ReviewLane;
  reviewerRole: string;
  decision: ReviewDecision;
  conditions: readonly string[];
  comments: readonly string[];
  decidedAt?: string;
}

export interface SmeApplication {
  id: string;
  reference: string;
  version: number;
  status: ApplicationStatus;
  synthetic: true;
  organisationId: string;
  originatorOrganisationId: string;
  policyId: string;
  policyVersion: number;
  identity: {
    legalName: string;
    registrationReference: string;
    sector: string;
    location: string;
    operatingHistoryYears: number;
    employees?: number;
    premises: string;
    beneficialOwners: readonly string[];
  };
  rationale: {
    productiveAssetNeed: string;
    businessRationale: string;
    expectedOperationalBenefit: string;
  };
  financials: {
    annualRevenueMinor?: bigint;
    monthlyElectricityCostMinor?: bigint;
    existingDebtSummary: string;
    currency: 'USD';
  };
  asset: {
    description: string;
    supplier: string;
    priceMinor: bigint;
    currency: 'USD';
    installationSite: string;
    warranty: string;
    maintenance: string;
  };
  structure: { proposedType: string; requestedTermMonths: number; approvalDisclaimer: string };
  evidence: readonly EvidenceItem[];
  manualReviewReasons: readonly string[];
  reviews: readonly ReviewRecord[];
  submissionHistory: readonly {
    version: number;
    status: ApplicationStatus;
    at: string;
    actorId: string;
  }[];
}

export interface ApplicationAssessment {
  nextStatus: ApplicationStatus;
  maySubmit: boolean;
  outstandingItems: readonly string[];
  manualReviewReasons: readonly string[];
  explanation: string;
}

export function assessApplication(
  application: SmeApplication,
  policy: ProvisionalPilotPolicy,
): ApplicationAssessment {
  if (application.policyId !== policy.id || application.policyVersion !== policy.version)
    throw new Error('POLICY_VERSION_MISMATCH');
  const outstandingItems = application.evidence
    .filter((item) => item.required && item.status === 'missing')
    .map((item) => item.label);
  if (outstandingItems.length > 0)
    return {
      nextStatus: 'draft',
      maySubmit: false,
      outstandingItems,
      manualReviewReasons: application.manualReviewReasons,
      explanation: `Submission blocked until ${outstandingItems.length} mandatory evidence item${outstandingItems.length === 1 ? ' is' : 's are'} supplied.`,
    };
  if (
    application.manualReviewReasons.length > 0 ||
    application.evidence.some((item) => item.status === 'requires_review')
  )
    return {
      nextStatus: 'manual_review',
      maySubmit: true,
      outstandingItems: [],
      manualReviewReasons: application.manualReviewReasons,
      explanation:
        'Submitted to a human compliance review. The platform has not approved or rejected this application.',
    };
  return {
    nextStatus: 'submitted',
    maySubmit: true,
    outstandingItems: [],
    manualReviewReasons: [],
    explanation:
      'Submission is complete and queued for separate human legal, compliance/risk and independent Shariah review.',
  };
}

export function mayPublish(application: SmeApplication): boolean {
  return (
    application.reviews.length === 3 &&
    application.reviews.every((review) => review.decision === 'approved')
  );
}
