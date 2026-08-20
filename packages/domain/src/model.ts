export type OrganisationRole =
  | 'investor'
  | 'sme_applicant'
  | 'originator'
  | 'operations_maker'
  | 'operations_checker'
  | 'compliance_reviewer'
  | 'legal_reviewer'
  | 'shariah_reviewer'
  | 'release_manager'
  | 'ownership_administrator'
  | 'auditor'
  | 'platform_administrator';

export interface Actor {
  id: string;
  organisationId: string;
  roles: readonly OrganisationRole[];
  kind: 'human' | 'service' | 'ai_assistant';
}

export interface GovernedResource {
  id: string;
  organisationId: string;
  classification: 'public' | 'internal' | 'confidential' | 'restricted';
}

export interface CanonicalTransaction {
  assetPoolId: string;
  legalStructureId: string;
  instrumentId: string;
  rightsVersionId: string;
  economicsVersionId: string;
  officialRegisterAuthority: string;
  servicingPlanId: string;
}
