import { BadRequestException, Body, Controller, Get, Post } from '@nestjs/common';
import {
  evaluateDigitalUnitOperation,
  reconcileDigitalUnitRegister,
  type DigitalUnitAccountState,
  type DigitalUnitInstrumentState,
} from '@mizant/domain';

type PreflightScenario =
  | 'eligible'
  | 'identity_expired'
  | 'jurisdiction_restricted'
  | 'instrument_paused';

interface PreflightBody {
  scenario?: unknown;
  quantity?: unknown;
}

const scenarios: readonly PreflightScenario[] = [
  'eligible',
  'identity_expired',
  'jurisdiction_restricted',
  'instrument_paused',
];

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

const recipient: DigitalUnitAccountState = {
  reference: 'SYN-HLD-001',
  availableUnits: 10n,
  frozenUnits: 0n,
  status: 'active',
  identityStatus: 'verified',
  jurisdictionAllowed: true,
};

const register = reconcileDigitalUnitRegister(2_500n, [
  { accountReference: 'SYN-HLD-001', units: 10n },
  { accountReference: 'SYN-HLD-002', units: 1_690n },
  { accountReference: 'SYN-POOL-001', units: 800n },
]);

@Controller('foundation/tokenisation')
export class TokenisationController {
  @Get('profile')
  profile() {
    return {
      instrumentId: instrument.instrumentId,
      mode: instrument.mode,
      networkSubmissionEnabled: false,
      registerAuthority: instrument.registerAuthority,
      targetUnits: instrument.targetUnits.toString(),
      accountedUnits: register.accountedUnits.toString(),
      balanced: register.balanced,
      policyVersion: instrument.policyVersion,
      requiredApprovals: ['ownership_administrator', 'independent_checker'],
    };
  }

  @Post('preflight')
  preflight(@Body() body: PreflightBody) {
    const scenario = body.scenario;
    const quantity = body.quantity;
    if (typeof scenario !== 'string' || !scenarios.includes(scenario as PreflightScenario)) {
      throw new BadRequestException('INVALID_SCENARIO');
    }
    if (typeof quantity !== 'number' || !Number.isSafeInteger(quantity) || quantity < 1) {
      throw new BadRequestException('INVALID_QUANTITY');
    }

    const typedScenario = scenario as PreflightScenario;
    const scenarioInstrument =
      typedScenario === 'instrument_paused' ? { ...instrument, paused: true } : instrument;
    const scenarioRecipient =
      typedScenario === 'identity_expired'
        ? { ...recipient, identityStatus: 'expired' as const }
        : typedScenario === 'jurisdiction_restricted'
          ? { ...recipient, jurisdictionAllowed: false }
          : recipient;

    return evaluateDigitalUnitOperation(scenarioInstrument, register, {
      reference: 'SYN-UNIT-OP-API-001',
      operation: 'allocate',
      quantity: BigInt(quantity),
      makerId: 'ownership-maker-01',
      source,
      destination: scenarioRecipient,
    });
  }
}
