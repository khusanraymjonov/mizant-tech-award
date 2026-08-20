import type { Actor, OrganisationRole } from './model.js';

export type IssuanceStage =
  | 'asset_modelled'
  | 'evidence_ready'
  | 'governance_review'
  | 'issuance_prepared'
  | 'checker_approved'
  | 'register_confirmed'
  | 'reconciled';

export type ApprovalLane = 'legal' | 'compliance' | 'shariah';

export type IssuanceAction =
  | 'submit_evidence'
  | 'submit_governance'
  | 'approve_legal'
  | 'approve_compliance'
  | 'approve_shariah'
  | 'prepare_issuance'
  | 'approve_issuance'
  | 'confirm_register'
  | 'reconcile';

export interface IssuanceApproval {
  lane: ApprovalLane;
  actorId: string;
  role: OrganisationRole;
  evidenceReference: string;
  recordedAt: string;
}

export interface IssuanceEvent {
  sequence: number;
  action: IssuanceAction;
  actorId: string;
  actorRole: OrganisationRole;
  occurredAt: string;
  objectVersion: number;
  evidenceReference: string;
}

export interface GovernedIssuanceCase {
  id: string;
  organisationId: string;
  stage: IssuanceStage;
  version: number;
  synthetic: true;
  assetPoolId: string;
  legalStructureId: string;
  instrumentId: string;
  rightsVersionId: string;
  economicsVersionId: string;
  disclosureVersionId: string;
  officialRegisterAuthority: string;
  targetUnits: bigint;
  unitPriceMinor: bigint;
  currency: 'USD';
  evidenceComplete: boolean;
  rightsMapped: boolean;
  registerAuthorityDeclared: boolean;
  approvals: readonly IssuanceApproval[];
  instruction?: {
    reference: string;
    makerId: string;
    checkerId?: string;
    idempotencyKey: string;
    mode: 'off_chain_simulation';
  };
  confirmedUnits: bigint;
  events: readonly IssuanceEvent[];
}

export interface IssuanceReadinessCheck {
  code:
    | 'EVIDENCE_COMPLETE'
    | 'RIGHTS_MAPPED'
    | 'REGISTER_AUTHORITY_DECLARED'
    | 'LEGAL_APPROVED'
    | 'COMPLIANCE_APPROVED'
    | 'SHARIAH_APPROVED'
    | 'SUPPLY_RECONCILED';
  label: string;
  passed: boolean;
}

const rolesByAction: Record<IssuanceAction, readonly OrganisationRole[]> = {
  submit_evidence: ['originator'],
  submit_governance: ['operations_maker'],
  approve_legal: ['legal_reviewer'],
  approve_compliance: ['compliance_reviewer'],
  approve_shariah: ['shariah_reviewer'],
  prepare_issuance: ['ownership_administrator'],
  approve_issuance: ['operations_checker'],
  confirm_register: ['ownership_administrator'],
  reconcile: ['operations_checker'],
};

const laneByAction: Partial<Record<IssuanceAction, ApprovalLane>> = {
  approve_legal: 'legal',
  approve_compliance: 'compliance',
  approve_shariah: 'shariah',
};

const hasApproval = (issuance: GovernedIssuanceCase, lane: ApprovalLane) =>
  issuance.approvals.some((approval) => approval.lane === lane);

export function evaluateIssuanceReadiness(
  issuance: GovernedIssuanceCase,
): readonly IssuanceReadinessCheck[] {
  return [
    {
      code: 'EVIDENCE_COMPLETE',
      label: 'Asset and counterparty evidence is complete and version-bound',
      passed: issuance.evidenceComplete,
    },
    {
      code: 'RIGHTS_MAPPED',
      label: 'Legal rights, economics and disclosures are separately versioned',
      passed: issuance.rightsMapped,
    },
    {
      code: 'REGISTER_AUTHORITY_DECLARED',
      label: 'The official register authority and record precedence are declared',
      passed: issuance.registerAuthorityDeclared,
    },
    {
      code: 'LEGAL_APPROVED',
      label: 'Independent legal review is recorded',
      passed: hasApproval(issuance, 'legal'),
    },
    {
      code: 'COMPLIANCE_APPROVED',
      label: 'Independent compliance review is recorded',
      passed: hasApproval(issuance, 'compliance'),
    },
    {
      code: 'SHARIAH_APPROVED',
      label: 'Independent Shariah review is recorded for this version',
      passed: hasApproval(issuance, 'shariah'),
    },
    {
      code: 'SUPPLY_RECONCILED',
      label: 'Confirmed register units reconcile to the approved fixed supply',
      passed: issuance.stage === 'reconciled' && issuance.confirmedUnits === issuance.targetUnits,
    },
  ];
}

function assertActor(
  issuance: GovernedIssuanceCase,
  action: IssuanceAction,
  actor: Actor,
): OrganisationRole {
  if (actor.kind !== 'human') throw new Error('HUMAN_APPROVAL_REQUIRED');
  if (actor.organisationId !== issuance.organisationId)
    throw new Error('CROSS_ORGANISATION_DENIED');
  const role = actor.roles.find((candidate) => rolesByAction[action].includes(candidate));
  if (!role) throw new Error('ROLE_NOT_AUTHORISED');
  return role;
}

function assertStage(issuance: GovernedIssuanceCase, action: IssuanceAction): void {
  const allowed: Record<IssuanceAction, readonly IssuanceStage[]> = {
    submit_evidence: ['asset_modelled'],
    submit_governance: ['evidence_ready'],
    approve_legal: ['governance_review'],
    approve_compliance: ['governance_review'],
    approve_shariah: ['governance_review'],
    prepare_issuance: ['governance_review'],
    approve_issuance: ['issuance_prepared'],
    confirm_register: ['checker_approved'],
    reconcile: ['register_confirmed'],
  };
  if (!allowed[action].includes(issuance.stage)) throw new Error('INVALID_ISSUANCE_TRANSITION');
}

function nextStage(issuance: GovernedIssuanceCase, action: IssuanceAction): IssuanceStage {
  if (action === 'submit_evidence') return 'evidence_ready';
  if (action === 'submit_governance') return 'governance_review';
  if (action === 'prepare_issuance') return 'issuance_prepared';
  if (action === 'approve_issuance') return 'checker_approved';
  if (action === 'confirm_register') return 'register_confirmed';
  if (action === 'reconcile') return 'reconciled';
  return issuance.stage;
}

export function advanceIssuance(
  issuance: GovernedIssuanceCase,
  action: IssuanceAction,
  actor: Actor,
  occurredAt: string,
): GovernedIssuanceCase {
  assertStage(issuance, action);
  const actorRole = assertActor(issuance, action, actor);
  const lane = laneByAction[action];
  if (lane && hasApproval(issuance, lane)) throw new Error('APPROVAL_ALREADY_RECORDED');

  if (action === 'submit_evidence' && (!issuance.evidenceComplete || !issuance.rightsMapped))
    throw new Error('EVIDENCE_OR_RIGHTS_INCOMPLETE');

  if (action === 'prepare_issuance') {
    const blockers = evaluateIssuanceReadiness(issuance)
      .filter((item) => item.code !== 'SUPPLY_RECONCILED' && !item.passed)
      .map((item) => item.code);
    if (blockers.length > 0) throw new Error(`ISSUANCE_BLOCKED:${blockers.join(',')}`);
  }

  if (
    (action === 'approve_issuance' || action === 'confirm_register') &&
    issuance.instruction?.makerId === actor.id
  )
    throw new Error('MAKER_CANNOT_CHECK_OWN_ACTION');

  const version = issuance.version + 1;
  const evidenceReference = lane
    ? `${issuance.id}-${lane}-opinion-v1`
    : `${issuance.id}-${action}-v${version}`;
  const approval = lane
    ? ({
        lane,
        actorId: actor.id,
        role: actorRole,
        evidenceReference,
        recordedAt: occurredAt,
      } as const)
    : undefined;
  const instruction =
    action === 'prepare_issuance'
      ? {
          reference: `${issuance.instrumentId}-ISS-001`,
          makerId: actor.id,
          idempotencyKey: `${issuance.id}:${issuance.version}:issue`,
          mode: 'off_chain_simulation' as const,
        }
      : action === 'approve_issuance' && issuance.instruction
        ? { ...issuance.instruction, checkerId: actor.id }
        : issuance.instruction;

  return {
    ...issuance,
    stage: nextStage(issuance, action),
    version,
    approvals: approval ? [...issuance.approvals, approval] : issuance.approvals,
    ...(instruction ? { instruction } : {}),
    confirmedUnits: action === 'confirm_register' ? issuance.targetUnits : issuance.confirmedUnits,
    events: [
      ...issuance.events,
      {
        sequence: issuance.events.length + 1,
        action,
        actorId: actor.id,
        actorRole,
        occurredAt,
        objectVersion: version,
        evidenceReference,
      },
    ],
  };
}

export type ShariahMonitoringScenario =
  | 'operating_as_approved'
  | 'evidence_overdue'
  | 'asset_use_changed'
  | 'contract_terms_changed';

export interface ShariahMonitoringResult {
  status: 'within_conditions' | 'human_review_required' | 'suspension_recommended';
  triggers: readonly string[];
  automaticDecision: false;
}

export function evaluateShariahMonitoring(
  scenario: ShariahMonitoringScenario,
): ShariahMonitoringResult {
  if (scenario === 'operating_as_approved')
    return {
      status: 'within_conditions',
      triggers: ['Scheduled evidence remains current', 'No material change reported'],
      automaticDecision: false,
    };
  if (scenario === 'evidence_overdue')
    return {
      status: 'human_review_required',
      triggers: ['Insurance/takaful evidence is overdue', 'Condition owner must provide evidence'],
      automaticDecision: false,
    };
  return {
    status: 'suspension_recommended',
    triggers: [
      scenario === 'asset_use_changed'
        ? 'A material asset-use change was reported'
        : 'A material contract-term change was reported',
      'Independent Shariah impact assessment is required before continuation',
    ],
    automaticDecision: false,
  };
}
