import { describe, expect, it } from 'vitest';
import { canAccess } from './access-policy.js';
import { assertHumanChecker } from './governance.js';
import { assertDemoSafety } from './safety.js';
import type { Actor, GovernedResource } from './model.js';

const resource: GovernedResource = {
  id: 'asset-1',
  organisationId: 'org-a',
  classification: 'confidential',
};
const maker: Actor = {
  id: 'maker-1',
  organisationId: 'org-a',
  roles: ['operations_maker'],
  kind: 'human',
};
const checker: Actor = {
  id: 'checker-1',
  organisationId: 'org-a',
  roles: ['operations_checker'],
  kind: 'human',
};

describe('P0 governance controls', () => {
  it('denies cross-organisation object access', () =>
    expect(canAccess({ ...maker, organisationId: 'org-b' }, 'read', resource)).toBe(false));
  it('requires a different human checker', () => {
    expect(() =>
      assertHumanChecker(
        {
          id: 'a',
          action: 'publish_offering',
          makerId: checker.id,
          organisationId: 'org-a',
          status: 'pending',
        },
        checker,
      ),
    ).toThrow('MAKER_CANNOT_CHECK');
  });
  it('accepts a separate authorised checker', () =>
    expect(() =>
      assertHumanChecker(
        {
          id: 'a',
          action: 'publish_offering',
          makerId: maker.id,
          organisationId: 'org-a',
          status: 'pending',
        },
        checker,
      ),
    ).not.toThrow());
  it('fails closed if real-value flags are enabled', () =>
    expect(() =>
      assertDemoSafety({
        APP_DATA_MODE: 'SYNTHETIC_ONLY',
        ENABLE_REAL_PAYMENTS: 'true',
        ENABLE_LIVE_KYC: 'false',
        ENABLE_PRODUCTION_CHAIN: 'false',
      }),
    ).toThrow());
});
