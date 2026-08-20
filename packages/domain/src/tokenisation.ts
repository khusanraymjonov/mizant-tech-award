export type DigitalUnitOperation =
  | 'allocate'
  | 'transfer'
  | 'freeze'
  | 'unfreeze'
  | 'redeem'
  | 'correct';

export type DigitalUnitDecision = 'ready_for_checker' | 'blocked';

export type DigitalUnitCheckCode =
  | 'REGISTER_BALANCED'
  | 'REGISTER_OUT_OF_BALANCE'
  | 'INSTRUMENT_ACTIVE'
  | 'INSTRUMENT_PAUSED'
  | 'QUANTITY_VALID'
  | 'QUANTITY_INVALID'
  | 'SOURCE_BALANCE_SUFFICIENT'
  | 'SOURCE_BALANCE_INSUFFICIENT'
  | 'SOURCE_ACCOUNT_ACTIVE'
  | 'SOURCE_ACCOUNT_RESTRICTED'
  | 'RECIPIENT_IDENTITY_VERIFIED'
  | 'RECIPIENT_IDENTITY_NOT_VERIFIED'
  | 'RECIPIENT_JURISDICTION_ALLOWED'
  | 'RECIPIENT_JURISDICTION_RESTRICTED'
  | 'RECIPIENT_ACCOUNT_ACTIVE'
  | 'RECIPIENT_ACCOUNT_RESTRICTED'
  | 'POLICY_VERSION_ACTIVE'
  | 'POLICY_VERSION_INACTIVE'
  | 'MAKER_CHECKER_SEPARATED'
  | 'CHECKER_REQUIRED';

export interface RegisterPosition {
  accountReference: string;
  units: bigint;
}

export interface RegisterReconciliation {
  targetUnits: bigint;
  accountedUnits: bigint;
  difference: bigint;
  balanced: boolean;
}

export interface DigitalUnitInstrumentState {
  instrumentId: string;
  registerAuthority: string;
  targetUnits: bigint;
  paused: boolean;
  policyVersion: number;
  policyActive: boolean;
  mode: 'off_chain_simulation';
}

export interface DigitalUnitAccountState {
  reference: string;
  availableUnits: bigint;
  frozenUnits: bigint;
  status: 'active' | 'frozen' | 'closed';
  identityStatus: 'verified' | 'expired' | 'not_verified';
  jurisdictionAllowed: boolean;
}

export interface DigitalUnitOperationRequest {
  reference: string;
  operation: DigitalUnitOperation;
  quantity: bigint;
  makerId: string;
  checkerId?: string;
  source: DigitalUnitAccountState;
  destination?: DigitalUnitAccountState;
}

export interface DigitalUnitCheck {
  code: DigitalUnitCheckCode;
  label: string;
  passed: boolean;
}

export interface DigitalUnitPreflightResult {
  reference: string;
  decision: DigitalUnitDecision;
  checks: readonly DigitalUnitCheck[];
  blockingCodes: readonly DigitalUnitCheckCode[];
  requiredApprovals: readonly ['ownership_administrator', 'independent_checker'];
  executionEnabled: false;
}

const check = (code: DigitalUnitCheckCode, label: string, passed: boolean): DigitalUnitCheck => ({
  code,
  label,
  passed,
});

export function reconcileDigitalUnitRegister(
  targetUnits: bigint,
  positions: readonly RegisterPosition[],
): RegisterReconciliation {
  const accountedUnits = positions.reduce((total, position) => total + position.units, 0n);
  const difference = targetUnits - accountedUnits;
  return { targetUnits, accountedUnits, difference, balanced: difference === 0n };
}

export function evaluateDigitalUnitOperation(
  instrument: DigitalUnitInstrumentState,
  reconciliation: RegisterReconciliation,
  request: DigitalUnitOperationRequest,
): DigitalUnitPreflightResult {
  const checks: DigitalUnitCheck[] = [];

  checks.push(
    reconciliation.balanced
      ? check('REGISTER_BALANCED', 'Canonical register reconciles to the fixed supply', true)
      : check(
          'REGISTER_OUT_OF_BALANCE',
          'Canonical register must reconcile before any action',
          false,
        ),
  );
  checks.push(
    instrument.paused
      ? check('INSTRUMENT_PAUSED', 'Instrument operations are paused', false)
      : check('INSTRUMENT_ACTIVE', 'Instrument is available for controlled operations', true),
  );
  checks.push(
    request.quantity > 0n
      ? check('QUANTITY_VALID', 'Quantity is a positive whole-unit amount', true)
      : check('QUANTITY_INVALID', 'Quantity must be greater than zero', false),
  );

  const usableSourceBalance = request.source.availableUnits - request.source.frozenUnits;
  checks.push(
    usableSourceBalance >= request.quantity
      ? check('SOURCE_BALANCE_SUFFICIENT', 'Source account has sufficient available units', true)
      : check('SOURCE_BALANCE_INSUFFICIENT', 'Source account lacks available units', false),
  );
  checks.push(
    request.source.status === 'active'
      ? check('SOURCE_ACCOUNT_ACTIVE', 'Source account is active', true)
      : check('SOURCE_ACCOUNT_RESTRICTED', 'Source account is frozen or closed', false),
  );

  if (request.destination) {
    checks.push(
      request.destination.identityStatus === 'verified'
        ? check('RECIPIENT_IDENTITY_VERIFIED', 'Recipient identity record is verified', true)
        : check(
            'RECIPIENT_IDENTITY_NOT_VERIFIED',
            'Recipient identity must be verified before allocation or transfer',
            false,
          ),
    );
    checks.push(
      request.destination.jurisdictionAllowed
        ? check('RECIPIENT_JURISDICTION_ALLOWED', 'Recipient jurisdiction is permitted', true)
        : check(
            'RECIPIENT_JURISDICTION_RESTRICTED',
            'Recipient jurisdiction is not permitted by this policy version',
            false,
          ),
    );
    checks.push(
      request.destination.status === 'active'
        ? check('RECIPIENT_ACCOUNT_ACTIVE', 'Recipient account is active', true)
        : check('RECIPIENT_ACCOUNT_RESTRICTED', 'Recipient account is frozen or closed', false),
    );
  }

  checks.push(
    instrument.policyActive
      ? check(
          'POLICY_VERSION_ACTIVE',
          `Transfer policy v${instrument.policyVersion} is active`,
          true,
        )
      : check('POLICY_VERSION_INACTIVE', 'Transfer policy is unavailable or superseded', false),
  );

  const checkerSeparated = Boolean(request.checkerId && request.checkerId !== request.makerId);
  checks.push(
    checkerSeparated
      ? check('MAKER_CHECKER_SEPARATED', 'A separate human checker is assigned', true)
      : check('CHECKER_REQUIRED', 'A separate human checker must approve execution', true),
  );

  const blockingCodes = checks
    .filter((item) => !item.passed)
    .map((item) => item.code)
    .filter((code) => code !== 'CHECKER_REQUIRED');

  return {
    reference: request.reference,
    decision: blockingCodes.length === 0 ? 'ready_for_checker' : 'blocked',
    checks,
    blockingCodes,
    requiredApprovals: ['ownership_administrator', 'independent_checker'],
    executionEnabled: false,
  };
}
