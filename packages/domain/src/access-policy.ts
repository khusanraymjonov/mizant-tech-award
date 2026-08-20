import type { Actor, GovernedResource, OrganisationRole } from './model.js';

export type ProtectedAction = 'read' | 'create' | 'amend' | 'submit' | 'approve' | 'export';

const actionRoles: Record<ProtectedAction, readonly OrganisationRole[]> = {
  read: [
    'investor',
    'sme_applicant',
    'originator',
    'operations_maker',
    'operations_checker',
    'compliance_reviewer',
    'legal_reviewer',
    'shariah_reviewer',
    'release_manager',
    'ownership_administrator',
    'auditor',
    'platform_administrator',
  ],
  create: ['sme_applicant', 'originator', 'operations_maker'],
  amend: ['sme_applicant', 'originator', 'operations_maker'],
  submit: ['sme_applicant', 'originator', 'operations_maker'],
  approve: [
    'operations_checker',
    'compliance_reviewer',
    'legal_reviewer',
    'shariah_reviewer',
    'release_manager',
    'ownership_administrator',
  ],
  export: ['operations_checker', 'compliance_reviewer', 'auditor'],
};

export function canAccess(
  actor: Actor,
  action: ProtectedAction,
  resource: GovernedResource,
): boolean {
  const sameOrganisation = actor.organisationId === resource.organisationId;
  const authorisedRole = actor.roles.some((role) => actionRoles[action].includes(role));
  if (!authorisedRole) return false;
  if (resource.classification === 'public' && action === 'read') return true;
  return sameOrganisation;
}

export function assertAccess(
  actor: Actor,
  action: ProtectedAction,
  resource: GovernedResource,
): void {
  if (!canAccess(actor, action, resource)) throw new Error('ACCESS_DENIED');
}
