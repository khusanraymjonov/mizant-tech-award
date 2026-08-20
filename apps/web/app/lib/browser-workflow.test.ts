import { describe, expect, it } from 'vitest';
import { emptyApplicationDraft } from './application-draft';
import { syntheticSmeApplications } from '@mizant/testing/sme-applications';
import {
  applyBrowserReviewAction,
  createBrowserApplicationRecord,
  createBrowserApplicationRecordFromSmeApplication,
  parseBrowserApplicationRecords,
} from './browser-workflow';

const completeDraft = {
  ...emptyApplicationDraft,
  legalName: 'Atlas Foods LLC',
  registrationReference: 'SYN-REG-220',
  location: 'Samarkand',
  sector: 'food_processing',
  operatingHistoryYears: '4',
  assetNeed: 'Commercial solar equipment',
  supplier: 'Synthetic Supplier LLC',
  assetPrice: '120000',
  requestedTermMonths: '48',
  businessRationale: 'Reduce energy costs and improve operating resilience.',
  evidence: { incorporation: true, ownership: true, supplierQuote: true },
  declarationAccepted: true,
};

const submittedAt = '2026-08-14T10:00:00.000Z';

describe('browser application workflow', () => {
  it('creates an awaiting-review record from a completed draft', () => {
    const record = createBrowserApplicationRecord(completeDraft, 'SYN-APP-220001', submittedAt);

    expect(record.status).toBe('awaiting_review');
    expect(record.evidenceCount).toBe(3);
    expect(record.history[0]?.action).toBe('Application submitted');
  });

  it('ignores malformed browser storage safely', () => {
    expect(parseBrowserApplicationRecords('{bad json')).toEqual([]);
    expect(parseBrowserApplicationRecords(JSON.stringify([{ reference: 12 }]))).toEqual([]);
  });

  it('claims a case and records the reviewer in its history', () => {
    const record = createBrowserApplicationRecord(completeDraft, 'SYN-APP-220002', submittedAt);
    const updated = applyBrowserReviewAction(record, 'claim', 'Daniel Reed', submittedAt);

    expect(updated.status).toBe('in_review');
    expect(updated.assignedReviewer).toBe('Daniel Reed');
    expect(updated.history).toHaveLength(2);
  });

  it('requires a case to be claimed before completing its review record', () => {
    const record = createBrowserApplicationRecord(completeDraft, 'SYN-APP-220003', submittedAt);

    expect(applyBrowserReviewAction(record, 'complete', 'Daniel Reed', submittedAt)).toBe(record);
  });

  it('derives the review queue from the canonical SME fixture without changing its identity', () => {
    const fixture = syntheticSmeApplications.find(
      (application) => application.reference === 'SYN-UZ-SME-003',
    );
    expect(fixture).toBeDefined();

    const record = createBrowserApplicationRecordFromSmeApplication(fixture!);

    expect(record.legalName).toBe('Meridian Manufacturing LLC');
    expect(record.operatingHistoryYears).toBe(4);
    expect(record.assetNeed).toBe('Commercial solar PV for manufacturing load');
    expect(record.status).toBe('manual_review');
  });
});
