import { describe, expect, it } from 'vitest';
import { assessApplication, mayPublish } from '@mizant/domain';
import { provisionalUzbekistanPilotPolicy, syntheticSmeApplications } from './sme-applications.js';

describe('E05/E17 synthetic submission scenarios', () => {
  it('queues the complete application for separate human reviews', () =>
    expect(
      assessApplication(syntheticSmeApplications[0]!, provisionalUzbekistanPilotPolicy).nextStatus,
    ).toBe('submitted'));
  it('blocks the incomplete draft with three human-readable outstanding items', () => {
    const result = assessApplication(
      syntheticSmeApplications[1]!,
      provisionalUzbekistanPilotPolicy,
    );
    expect(result.maySubmit).toBe(false);
    expect(result.outstandingItems).toHaveLength(3);
  });
  it('routes ownership discrepancies to manual review without approving or rejecting', () =>
    expect(
      assessApplication(syntheticSmeApplications[2]!, provisionalUzbekistanPilotPolicy).nextStatus,
    ).toBe('manual_review'));
  it('blocks publication while any mandatory review remains pending', () =>
    expect(mayPublish(syntheticSmeApplications[0]!)).toBe(false));
  it('never enables autonomous approval in provisional policy', () =>
    expect(provisionalUzbekistanPilotPolicy.automaticApprovalEnabled).toBe(false));
});
