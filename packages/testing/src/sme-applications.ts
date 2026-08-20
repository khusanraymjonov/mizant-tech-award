import type { EvidenceItem, ProvisionalPilotPolicy, SmeApplication } from '@mizant/domain';

export const provisionalUzbekistanPilotPolicy: ProvisionalPilotPolicy = {
  id: 'POL-UZ-SME-PILOT',
  version: 1,
  label: 'PROVISIONAL — PROFESSIONAL APPROVAL REQUIRED',
  jurisdiction: 'UZ',
  sectors: ['food_processing', 'cold_storage_logistics', 'light_manufacturing'],
  assetValueMinor: { minimum: 2_500_000n, maximum: 25_000_000n, currency: 'USD' },
  normalOperatingHistoryYears: 2,
  automaticApprovalEnabled: false,
  manualReviewTriggers: [
    'startup',
    'unusual_structure',
    'prohibited_activity',
    'sanctions_or_pep_concern',
    'ownership_discrepancy',
    'insolvency_indicator',
  ],
};

const evidenceLabels = [
  ['incorporation_tax', 'Incorporation and tax-registration documents'],
  ['beneficial_owners', 'Beneficial-owner declaration and synthetic identity records'],
  ['financial_statements', 'Financial statements'],
  ['bank_statement', 'Latest bank statement'],
  ['electricity_bills', 'Electricity bills'],
  ['supplier_quote', 'Supplier quotation'],
  ['technical_specification', 'Final technical specification'],
  ['site_consent', 'Evidence of site ownership or landlord consent'],
  ['installation_warranty', 'Installation, warranty and maintenance documentation'],
  ['insurance', 'Insurance/takaful placeholder'],
  ['business_shariah', 'Business-use and Shariah-screening declaration'],
] as const;
const evidence = (
  missing: readonly string[] = [],
  review: readonly string[] = [],
): EvidenceItem[] =>
  evidenceLabels.map(([type, label], index) => ({
    id: `ev-${index + 1}`,
    type,
    label,
    required: true,
    version: 1,
    status: missing.includes(type)
      ? 'missing'
      : review.includes(type)
        ? 'requires_review'
        : 'present',
    explanation: missing.includes(type)
      ? `${label} is required before submission.`
      : review.includes(type)
        ? `${label} requires human verification.`
        : 'Synthetic evidence recorded.',
  }));
const reviews = ['legal', 'compliance_risk', 'independent_shariah'].map((lane) => ({
  lane: lane as 'legal' | 'compliance_risk' | 'independent_shariah',
  reviewerRole: lane,
  decision: 'pending' as const,
  conditions: [],
  comments: [],
}));
const base = {
  version: 1,
  synthetic: true as const,
  originatorOrganisationId: 'org-nur-solar',
  policyId: provisionalUzbekistanPilotPolicy.id,
  policyVersion: 1,
  structure: {
    proposedType: 'Illustrative Ijarah — legal and independent Shariah approval required',
    requestedTermMonths: 48,
    approvalDisclaimer: 'No legal, regulatory, credit or Shariah certification is implied.',
  },
  reviews,
  submissionHistory: [],
};

export const syntheticSmeApplications: readonly SmeApplication[] = [
  {
    ...base,
    id: 'app-001',
    reference: 'SYN-UZ-SME-001',
    status: 'submitted',
    organisationId: 'org-zarafshan-foods',
    identity: {
      legalName: 'Zarafshan Foods LLC',
      registrationReference: 'SYN-REG-001',
      sector: 'food_processing',
      location: 'Samarkand',
      operatingHistoryYears: 5,
      employees: 48,
      premises: 'Synthetic incorporated operating premises, Samarkand',
      beneficialOwners: ['Synthetic Owner A', 'Synthetic Owner B'],
    },
    rationale: {
      productiveAssetNeed: 'Rooftop solar PV system',
      businessRationale: 'Reduce exposure to electricity cost and improve productive resilience.',
      expectedOperationalBenefit: 'Illustrative lower grid consumption during operating hours.',
    },
    financials: {
      annualRevenueMinor: 120_000_000n,
      monthlyElectricityCostMinor: 1_050_000n,
      existingDebtSummary: 'Synthetic current obligations disclosed for human review.',
      currency: 'USD',
    },
    asset: {
      description:
        'Commercial rooftop solar PV including panels, inverters, mounting and installation',
      supplier: 'Nur Solar Solutions LLC',
      priceMinor: 12_000_000n,
      currency: 'USD',
      installationSite: 'Synthetic Samarkand food-processing site',
      warranty: 'Synthetic supplier warranty placeholder',
      maintenance: 'Synthetic planned-maintenance placeholder',
    },
    evidence: evidence(),
    manualReviewReasons: [],
    submissionHistory: [
      {
        version: 1,
        status: 'submitted',
        at: '2026-08-14T09:00:00Z',
        actorId: 'synthetic-originator-user',
      },
    ],
  },
  {
    ...base,
    id: 'app-002',
    reference: 'SYN-UZ-SME-002',
    status: 'draft',
    organisationId: 'org-samarkand-cold-chain',
    identity: {
      legalName: 'Samarkand Cold Chain LLC',
      registrationReference: 'SYN-REG-002',
      sector: 'cold_storage_logistics',
      location: 'Samarkand',
      operatingHistoryYears: 3,
      premises: 'Synthetic leased cold-storage premises',
      beneficialOwners: ['Synthetic Owner C'],
    },
    rationale: {
      productiveAssetNeed: 'Commercial solar PV for cold storage',
      businessRationale: 'Support refrigeration load with productive solar equipment.',
      expectedOperationalBenefit: 'Illustrative electricity-cost resilience.',
    },
    financials: {
      existingDebtSummary: 'Pending final synthetic financial review.',
      currency: 'USD',
    },
    asset: {
      description: 'Commercial solar PV system',
      supplier: 'Nur Solar Solutions LLC',
      priceMinor: 14_500_000n,
      currency: 'USD',
      installationSite: 'Synthetic leased cold-storage site',
      warranty: 'Synthetic warranty placeholder',
      maintenance: 'Synthetic maintenance placeholder',
    },
    evidence: evidence(['site_consent', 'bank_statement', 'technical_specification']),
    manualReviewReasons: [],
    submissionHistory: [
      { version: 1, status: 'draft', at: '2026-08-14T09:10:00Z', actorId: 'synthetic-sme-user' },
    ],
  },
  {
    ...base,
    id: 'app-003',
    reference: 'SYN-UZ-SME-003',
    status: 'manual_review',
    organisationId: 'org-meridian-manufacturing',
    identity: {
      legalName: 'Meridian Manufacturing LLC',
      registrationReference: 'SYN-REG-003',
      sector: 'light_manufacturing',
      location: 'Tashkent',
      operatingHistoryYears: 4,
      premises: 'Synthetic manufacturing premises',
      beneficialOwners: ['Synthetic Owner D', 'Synthetic Holding Entity E'],
    },
    rationale: {
      productiveAssetNeed: 'Commercial solar PV for manufacturing load',
      businessRationale: 'Support productive machinery electricity demand.',
      expectedOperationalBenefit: 'Illustrative peak-hour grid reduction.',
    },
    financials: {
      existingDebtSummary: 'Synthetic obligations provided; human assessment required.',
      currency: 'USD',
    },
    asset: {
      description: 'Commercial solar PV system',
      supplier: 'Nur Solar Solutions LLC',
      priceMinor: 21_000_000n,
      currency: 'USD',
      installationSite: 'Synthetic manufacturing site',
      warranty: 'Synthetic warranty placeholder',
      maintenance: 'Synthetic maintenance placeholder',
    },
    evidence: evidence([], ['beneficial_owners']),
    manualReviewReasons: [
      'Beneficial-owner information mismatch',
      'Unusually complex ownership structure',
    ],
    submissionHistory: [
      {
        version: 1,
        status: 'manual_review',
        at: '2026-08-14T09:20:00Z',
        actorId: 'synthetic-originator-user',
      },
    ],
  },
];
