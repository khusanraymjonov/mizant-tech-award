import { describe, expect, it } from 'vitest';
import type { Actor } from './model.js';
import {
  advanceIssuance,
  evaluateIssuanceReadiness,
  evaluateShariahMonitoring,
  type GovernedIssuanceCase,
} from './issuance-lifecycle.js';

const actor = (id: string, role: Actor['roles'][number]): Actor => ({
  id,
  organisationId: 'mizant-platform',
  roles: [role],
  kind: 'human',
});

const initialCase: GovernedIssuanceCase = {
  id: 'MZT-SYN-001',
  organisationId: 'mizant-platform',
  stage: 'asset_modelled',
  version: 1,
  synthetic: true,
  assetPoolId: 'SYN-ASSET-POOL-001',
  legalStructureId: 'SYN-IJARAH-SPV-001',
  instrumentId: 'SYN-INST-001',
  rightsVersionId: 'SYN-RIGHTS-001-v1',
  economicsVersionId: 'SYN-ECON-001-v1',
  disclosureVersionId: 'SYN-DISC-001-v1',
  officialRegisterAuthority: 'Synthetic issuer register',
  targetUnits: 2_500n,
  unitPriceMinor: 10_000n,
  currency: 'USD',
  evidenceComplete: true,
  rightsMapped: true,
  registerAuthorityDeclared: true,
  approvals: [],
  confirmedUnits: 0n,
  events: [],
};

describe('governed issuance lifecycle', () => {
  it('completes the controlled issuance and reconciliation journey', () => {
    let value = advanceIssuance(
      initialCase,
      'submit_evidence',
      actor('originator-1', 'originator'),
      't1',
    );
    value = advanceIssuance(value, 'submit_governance', actor('maker-1', 'operations_maker'), 't2');
    value = advanceIssuance(value, 'approve_legal', actor('legal-1', 'legal_reviewer'), 't3');
    value = advanceIssuance(
      value,
      'approve_compliance',
      actor('compliance-1', 'compliance_reviewer'),
      't4',
    );
    value = advanceIssuance(value, 'approve_shariah', actor('shariah-1', 'shariah_reviewer'), 't5');
    value = advanceIssuance(
      value,
      'prepare_issuance',
      actor('register-maker-1', 'ownership_administrator'),
      't6',
    );
    value = advanceIssuance(
      value,
      'approve_issuance',
      actor('checker-1', 'operations_checker'),
      't7',
    );
    value = advanceIssuance(
      value,
      'confirm_register',
      actor('register-checker-2', 'ownership_administrator'),
      't8',
    );
    value = advanceIssuance(value, 'reconcile', actor('checker-1', 'operations_checker'), 't9');

    expect(value.stage).toBe('reconciled');
    expect(value.confirmedUnits).toBe(2_500n);
    expect(value.events).toHaveLength(9);
    expect(evaluateIssuanceReadiness(value).every((check) => check.passed)).toBe(true);
  });

  it('blocks issuance before all independent approvals exist', () => {
    let value = advanceIssuance(
      initialCase,
      'submit_evidence',
      actor('originator-1', 'originator'),
      't1',
    );
    value = advanceIssuance(value, 'submit_governance', actor('maker-1', 'operations_maker'), 't2');
    expect(() =>
      advanceIssuance(
        value,
        'prepare_issuance',
        actor('register-maker-1', 'ownership_administrator'),
        't3',
      ),
    ).toThrow('ISSUANCE_BLOCKED');
  });

  it('prevents an issuance maker from checking the same instruction', () => {
    let value = advanceIssuance(
      initialCase,
      'submit_evidence',
      actor('originator-1', 'originator'),
      't1',
    );
    value = advanceIssuance(value, 'submit_governance', actor('maker-1', 'operations_maker'), 't2');
    value = advanceIssuance(value, 'approve_legal', actor('legal-1', 'legal_reviewer'), 't3');
    value = advanceIssuance(value, 'approve_compliance', actor('c-1', 'compliance_reviewer'), 't4');
    value = advanceIssuance(value, 'approve_shariah', actor('s-1', 'shariah_reviewer'), 't5');
    value = advanceIssuance(
      value,
      'prepare_issuance',
      actor('dual-role-1', 'ownership_administrator'),
      't6',
    );
    expect(() =>
      advanceIssuance(value, 'approve_issuance', actor('dual-role-1', 'operations_checker'), 't7'),
    ).toThrow('MAKER_CANNOT_CHECK');
  });
});

describe('Shariah monitoring', () => {
  it('routes material change to independent human review and recommends containment', () => {
    const result = evaluateShariahMonitoring('asset_use_changed');
    expect(result.status).toBe('suspension_recommended');
    expect(result.automaticDecision).toBe(false);
  });
});
