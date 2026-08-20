export interface IdentityProvider {
  verifyBearerToken(token: string): Promise<{ subject: string; emailVerified: boolean }>;
}
export interface RegisterProvider {
  confirmPosition(reference: string): Promise<{ status: 'synthetic_confirmed'; reference: string }>;
}
export interface DigitalUnitProvider {
  readonly mode: 'off_chain_simulation';
  prepareInstruction(input: {
    reference: string;
    instrumentId: string;
    operation: 'allocate' | 'transfer' | 'freeze' | 'unfreeze' | 'redeem' | 'correct';
    quantity: bigint;
    idempotencyKey: string;
  }): Promise<{
    providerReference: string;
    status: 'prepared_for_human_approval';
    submittedToNetwork: false;
  }>;
}
export interface VerificationProvider {
  startHostedCase(subjectId: string): Promise<{ status: 'mock_pending'; reference: string }>;
}

export class MockVerificationProvider implements VerificationProvider {
  async startHostedCase(subjectId: string) {
    return { status: 'mock_pending' as const, reference: `mock-kyc-${subjectId}` };
  }
}

export class OffChainDigitalUnitProvider implements DigitalUnitProvider {
  readonly mode = 'off_chain_simulation' as const;

  async prepareInstruction(input: {
    reference: string;
    instrumentId: string;
    operation: 'allocate' | 'transfer' | 'freeze' | 'unfreeze' | 'redeem' | 'correct';
    quantity: bigint;
    idempotencyKey: string;
  }) {
    return {
      providerReference: `off-chain-${input.reference}`,
      status: 'prepared_for_human_approval' as const,
      submittedToNetwork: false as const,
    };
  }
}
