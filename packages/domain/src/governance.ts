import type { Actor } from './model.js';

export interface ApprovalRequest {
  id: string;
  action:
    | 'publish_offering'
    | 'override_eligibility'
    | 'adjust_ledger'
    | 'release_distribution'
    | 'confirm_register_break';
  makerId: string;
  organisationId: string;
  status: 'pending' | 'approved' | 'rejected';
}

export function assertHumanChecker(request: ApprovalRequest, checker: Actor): void {
  if (checker.kind !== 'human') throw new Error('HUMAN_APPROVAL_REQUIRED');
  if (request.makerId === checker.id) throw new Error('MAKER_CANNOT_CHECK_OWN_ACTION');
  if (request.organisationId !== checker.organisationId)
    throw new Error('CROSS_ORGANISATION_APPROVAL_DENIED');
  if (!checker.roles.includes('operations_checker')) throw new Error('CHECKER_ROLE_REQUIRED');
}
