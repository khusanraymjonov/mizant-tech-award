import { describe, expect, it } from 'vitest';
import {
  evaluateDigitalUnitOperation,
  reconcileDigitalUnitRegister,
  type DigitalUnitAccountState,
  type DigitalUnitInstrumentState,
} from './tokenisation.js';

const instrument: DigitalUnitInstrumentState = {
  instrumentId: 'SYN-INST-001',
  registerAuthority: 'Synthetic issuer register',
  targetUnits: 2_500n,
  paused: false,
  policyVersion: 1,
  policyActive: true,
  mode: 'off_chain_simulation',
};

const source: DigitalUnitAccountState = {
  reference: 'SYN-POOL-001',
  availableUnits: 800n,
  frozenUnits: 0n,
  status: 'active',
  identityStatus: 'verified',
  jurisdictionAllowed: true,
};

const destination: DigitalUnitAccountState = {
  reference: 'SYN-HLD-001',
  availableUnits: 10n,
  frozenUnits: 0n,
  status: 'active',
  identityStatus: 'verified',
  jurisdictionAllowed: true,
};

const balancedRegister = reconcileDigitalUnitRegister(2_500n, [
  { accountReference: 'SYN-HLD-001', units: 10n },
  { accountReference: 'SYN-HLD-002', units: 1_690n },
  { accountReference: 'SYN-POOL-001', units: 800n },
]);

describe('permissioned digital-unit controls', () => {
  it('reconciles every unit to the canonical register', () => {
    expect(balancedRegister).toEqual({
      targetUnits: 2_500n,
      accountedUnits: 2_500n,
      difference: 0n,
      balanced: true,
    });
  });

  it('prepares a compliant allocation for a separate checker without executing it', () => {
    const result = evaluateDigitalUnitOperation(instrument, balancedRegister, {
      reference: 'SYN-UNIT-OP-001',
      operation: 'allocate',
      quantity: 10n,
      makerId: 'ownership-maker-01',
      source,
      destination,
    });

    expect(result.decision).toBe('ready_for_checker');
    expect(result.executionEnabled).toBe(false);
    expect(result.checks.at(-1)?.code).toBe('CHECKER_REQUIRED');
  });

  it('blocks an allocation to an unverified recipient', () => {
    const result = evaluateDigitalUnitOperation(instrument, balancedRegister, {
      reference: 'SYN-UNIT-OP-002',
      operation: 'allocate',
      quantity: 10n,
      makerId: 'ownership-maker-01',
      source,
      destination: { ...destination, identityStatus: 'expired' },
    });

    expect(result.decision).toBe('blocked');
    expect(result.blockingCodes).toContain('RECIPIENT_IDENTITY_NOT_VERIFIED');
  });

  it('blocks all operations while the instrument is paused', () => {
    const result = evaluateDigitalUnitOperation({ ...instrument, paused: true }, balancedRegister, {
      reference: 'SYN-UNIT-OP-003',
      operation: 'transfer',
      quantity: 5n,
      makerId: 'ownership-maker-01',
      source,
      destination,
    });

    expect(result.decision).toBe('blocked');
    expect(result.blockingCodes).toContain('INSTRUMENT_PAUSED');
  });

  it('blocks operations when the register no longer balances', () => {
    const result = evaluateDigitalUnitOperation(
      instrument,
      reconcileDigitalUnitRegister(2_500n, [
        { accountReference: 'SYN-HLD-001', units: 10n },
        { accountReference: 'SYN-POOL-001', units: 800n },
      ]),
      {
        reference: 'SYN-UNIT-OP-004',
        operation: 'transfer',
        quantity: 5n,
        makerId: 'ownership-maker-01',
        source,
        destination,
      },
    );

    expect(result.decision).toBe('blocked');
    expect(result.blockingCodes).toContain('REGISTER_OUT_OF_BALANCE');
  });
});
