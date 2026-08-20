export type IsoDate = `${number}-${number}-${number}`;

export interface EffectivePeriod {
  effectiveFrom: IsoDate;
  effectiveTo?: IsoDate;
}

export interface AssetDefinition extends EffectivePeriod {
  id: string;
  kind: 'equipment' | 'property' | 'receivable' | 'other_productive_asset';
  description: string;
  verificationStatus: 'synthetic_verified' | 'pending' | 'rejected';
  allocationBasisBps: number;
}

export interface AssetPoolDefinition {
  id: string;
  version: number;
  assets: readonly AssetDefinition[];
}

export type TransactionPartyRole =
  | 'issuer'
  | 'spv'
  | 'asset_owner'
  | 'sme_lessee'
  | 'originator'
  | 'vendor'
  | 'trustee_nominee'
  | 'custodian'
  | 'registrar'
  | 'servicer';

export interface PartyRoleDefinition extends EffectivePeriod {
  organisationId: string;
  role: TransactionPartyRole;
  conflictDisclosureRequired: boolean;
}

export interface LegalStructureDefinition {
  id: string;
  version: number;
  structureType: string;
  parties: readonly PartyRoleDefinition[];
  approvalStatus: 'illustrative_not_approved' | 'under_review' | 'approved';
}

export interface RightsDefinition {
  id: string;
  version: number;
  ownershipDescription: string;
  returnSource: string;
  lossRisks: readonly string[];
  liquidityStatement: string;
  priority: number;
  transferRestricted: boolean;
}

export interface InstrumentDefinition {
  id: string;
  version: number;
  className: string;
  targetUnits: bigint;
  unitPriceMinor: bigint;
  currency: string;
  rights: RightsDefinition;
}

export interface EconomicTermsDefinition {
  id: string;
  version: number;
  formulaReference: string;
  cashFlowType: 'rent' | 'sale_receivable' | 'other_approved_cash_flow';
  termMonths: number;
  fees: readonly { label: string; amountMinor: bigint }[];
  reserveMinor: bigint;
  maturityTreatment: string;
  defaultTreatment: string;
}

export interface RegisterDefinition {
  id: string;
  version: number;
  authority: 'issuer' | 'registrar' | 'nominee' | 'undecided';
  providerMode: 'mock';
  registeredAndBeneficialOwnerEquivalent: boolean;
}

export interface ServicingDefinition {
  id: string;
  version: number;
  evidenceCadence: 'monthly' | 'quarterly' | 'event_driven';
  lifecycleHooks: readonly string[];
}

export interface ProductTemplate {
  key: string;
  version: number;
  label: string;
  liveScope: false;
  assetPool: AssetPoolDefinition;
  legalStructure: LegalStructureDefinition;
  instrument: InstrumentDefinition;
  economics: EconomicTermsDefinition;
  register: RegisterDefinition;
  servicing: ServicingDefinition;
  requiredEvidence: readonly string[];
  mandatoryGates: readonly ('legal' | 'compliance' | 'shariah' | 'maker_checker')[];
}

export interface TemplateValidationResult {
  valid: boolean;
  errors: readonly string[];
}

export function validateProductTemplate(template: ProductTemplate): TemplateValidationResult {
  const errors: string[] = [];
  const allocation = template.assetPool.assets.reduce(
    (sum, asset) => sum + asset.allocationBasisBps,
    0,
  );
  if (allocation !== 10_000) errors.push('ASSET_ALLOCATION_MUST_EQUAL_100_PERCENT');
  if (template.assetPool.assets.length === 0) errors.push('ASSET_POOL_MUST_NOT_BE_EMPTY');
  if (template.instrument.targetUnits <= 0n) errors.push('TARGET_UNITS_MUST_BE_POSITIVE');
  if (template.instrument.unitPriceMinor <= 0n) errors.push('UNIT_PRICE_MUST_BE_POSITIVE');
  if (template.economics.formulaReference.trim().length === 0)
    errors.push('FORMULA_REFERENCE_REQUIRED');
  if (template.legalStructure.parties.every((party) => party.role !== 'issuer'))
    errors.push('ISSUER_ROLE_REQUIRED');
  if (template.register.authority === 'undecided')
    errors.push('REGISTER_AUTHORITY_REQUIRED_BEFORE_PUBLICATION');
  const gates = new Set(template.mandatoryGates);
  for (const gate of ['legal', 'compliance', 'shariah', 'maker_checker'] as const) {
    if (!gates.has(gate)) errors.push(`MANDATORY_GATE_MISSING:${gate}`);
  }
  if (template.liveScope !== false) errors.push('SYNTHETIC_TEMPLATE_CANNOT_HAVE_LIVE_SCOPE');
  return { valid: errors.length === 0, errors };
}
