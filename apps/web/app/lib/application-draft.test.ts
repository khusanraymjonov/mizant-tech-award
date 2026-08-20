import { describe, expect, it } from 'vitest';
import {
  applicationDraftCompletion,
  emptyApplicationDraft,
  validateApplicationDraft,
} from './application-draft';

describe('synthetic SME application draft', () => {
  it('requires business identity before progressing', () => {
    expect(validateApplicationDraft(1, emptyApplicationDraft)).toHaveLength(5);
  });

  it('enforces the provisional illustrative asset-value range', () => {
    const draft = {
      ...emptyApplicationDraft,
      assetNeed: 'Commercial solar equipment',
      supplier: 'Synthetic Supplier LLC',
      assetPrice: '10000',
      businessRationale: 'Reduce operating costs using productive equipment.',
    };
    expect(validateApplicationDraft(2, draft)).toContain(
      'The illustrative asset value must be between $25,000 and $250,000.',
    );
  });

  it('requires evidence declarations and human-review consent', () => {
    expect(validateApplicationDraft(3, emptyApplicationDraft)).toHaveLength(4);
  });

  it('reports full completion only when every field is supplied', () => {
    const draft = {
      legalName: 'Synthetic Foods LLC',
      registrationReference: 'SYN-REG-104',
      location: 'Samarkand',
      sector: 'food_processing',
      operatingHistoryYears: '4',
      assetNeed: 'Commercial solar equipment',
      supplier: 'Synthetic Supplier LLC',
      assetPrice: '120000',
      requestedTermMonths: '48',
      businessRationale: 'Reduce operating costs using productive equipment.',
      evidence: { incorporation: true, ownership: true, supplierQuote: true },
      declarationAccepted: true,
    };
    expect(applicationDraftCompletion(draft)).toBe(100);
  });
});
