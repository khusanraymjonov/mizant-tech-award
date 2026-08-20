export type ApplicationDraftStep = 1 | 2 | 3;

export const requiredEvidence = [
  ['incorporation', 'Synthetic incorporation record'],
  ['ownership', 'Synthetic beneficial-owner declaration'],
  ['supplierQuote', 'Synthetic supplier quotation'],
] as const;

export interface SyntheticApplicationDraft {
  legalName: string;
  registrationReference: string;
  location: string;
  sector: string;
  operatingHistoryYears: string;
  assetNeed: string;
  supplier: string;
  assetPrice: string;
  requestedTermMonths: string;
  businessRationale: string;
  evidence: Record<(typeof requiredEvidence)[number][0], boolean>;
  declarationAccepted: boolean;
}

export const emptyApplicationDraft: SyntheticApplicationDraft = {
  legalName: '',
  registrationReference: '',
  location: '',
  sector: '',
  operatingHistoryYears: '',
  assetNeed: '',
  supplier: '',
  assetPrice: '',
  requestedTermMonths: '48',
  businessRationale: '',
  evidence: { incorporation: false, ownership: false, supplierQuote: false },
  declarationAccepted: false,
};

export function validateApplicationDraft(
  step: ApplicationDraftStep,
  draft: SyntheticApplicationDraft,
): string[] {
  if (step === 1) {
    return [
      !draft.legalName.trim() && 'Enter a fictional legal business name.',
      !draft.registrationReference.trim() && 'Enter a synthetic registration reference.',
      !draft.location && 'Choose a location.',
      !draft.sector && 'Choose a business sector.',
      (!draft.operatingHistoryYears || Number(draft.operatingHistoryYears) < 0) &&
        'Enter the operating history in years.',
    ].filter(Boolean) as string[];
  }

  if (step === 2) {
    const price = Number(draft.assetPrice);
    return [
      !draft.assetNeed.trim() && 'Describe the productive asset required.',
      !draft.supplier.trim() && 'Enter a fictional supplier.',
      (!price || price < 25_000 || price > 250_000) &&
        'The illustrative asset value must be between $25,000 and $250,000.',
      draft.businessRationale.trim().length < 20 &&
        'Explain the operating need in at least 20 characters.',
    ].filter(Boolean) as string[];
  }

  return [
    ...requiredEvidence
      .filter(([id]) => !draft.evidence[id])
      .map(([, label]) => `Confirm ${label.toLowerCase()}.`),
    !draft.declarationAccepted &&
      'Confirm that the submission is synthetic and requires independent human review.',
  ].filter(Boolean) as string[];
}

export function applicationDraftCompletion(draft: SyntheticApplicationDraft): number {
  const checks = [
    draft.legalName,
    draft.registrationReference,
    draft.location,
    draft.sector,
    draft.operatingHistoryYears,
    draft.assetNeed,
    draft.supplier,
    draft.assetPrice,
    draft.requestedTermMonths,
    draft.businessRationale,
    ...requiredEvidence.map(([id]) => draft.evidence[id]),
    draft.declarationAccepted,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}
