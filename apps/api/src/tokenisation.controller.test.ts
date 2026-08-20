import { BadRequestException } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import { TokenisationController } from './tokenisation.controller.js';

describe('tokenisation foundation API', () => {
  const controller = new TokenisationController();

  it('exposes an off-chain, balanced instrument profile', () => {
    expect(controller.profile()).toMatchObject({
      instrumentId: 'SYN-INST-001',
      mode: 'off_chain_simulation',
      networkSubmissionEnabled: false,
      targetUnits: '2500',
      accountedUnits: '2500',
      balanced: true,
    });
  });

  it('returns a checker-ready decision for an eligible recipient', () => {
    expect(controller.preflight({ scenario: 'eligible', quantity: 10 })).toMatchObject({
      decision: 'ready_for_checker',
      executionEnabled: false,
    });
  });

  it('fails closed for invalid or restricted inputs', () => {
    expect(() => controller.preflight({ scenario: 'eligible', quantity: 0 })).toThrow(
      BadRequestException,
    );
    expect(controller.preflight({ scenario: 'identity_expired', quantity: 10 }).decision).toBe(
      'blocked',
    );
  });
});
