import type { ProductTemplate } from '@mizant/domain';

export const syntheticSolarJourney = {
  marker: 'SYNTHETIC_ONLY',
  assetPool: {
    id: 'asset-solar-001',
    name: 'Illustrative solar equipment pool',
    valueMinor: 25_000_000,
    currency: 'USD',
  },
  legalStructure: {
    id: 'structure-ijarah-001',
    template: 'IJARAH_EQUIPMENT_V1',
    status: 'illustrative_not_approved',
  },
  instrument: { id: 'SYN-INST-001', targetUnits: 2_500, targetUnitPriceMinor: 10_000 },
  organisations: [
    { id: 'org-originator', role: 'originator', name: 'Synthetic Responsible Assets Ltd' },
    { id: 'org-sme', role: 'sme_applicant', name: 'Synthetic Sunworks SME Ltd' },
    { id: 'org-spv', role: 'issuer', name: 'Synthetic Solar Vehicle 1 Ltd' },
  ],
  controls: {
    realMoney: false,
    liveKyc: false,
    productionBlockchain: false,
    humanApprovalRequired: true,
  },
} as const;

const mandatoryGates = ['legal', 'compliance', 'shariah', 'maker_checker'] as const;

export const syntheticIjarahSolarTemplate: ProductTemplate = {
  key: 'IJARAH_EQUIPMENT_V1',
  version: 1,
  label: 'Synthetic Ijarah solar equipment',
  liveScope: false,
  assetPool: {
    id: 'pool-solar-001',
    version: 1,
    assets: [
      {
        id: 'solar-array-001',
        kind: 'equipment',
        description: 'Illustrative rooftop solar equipment',
        verificationStatus: 'synthetic_verified',
        allocationBasisBps: 10_000,
        effectiveFrom: '2026-01-01',
      },
    ],
  },
  legalStructure: {
    id: 'structure-ijarah-001',
    version: 1,
    structureType: 'illustrative_ijarah_spv',
    approvalStatus: 'illustrative_not_approved',
    parties: [
      {
        organisationId: 'org-spv',
        role: 'issuer',
        conflictDisclosureRequired: false,
        effectiveFrom: '2026-01-01',
      },
      {
        organisationId: 'org-spv',
        role: 'asset_owner',
        conflictDisclosureRequired: false,
        effectiveFrom: '2026-01-01',
      },
      {
        organisationId: 'org-sme',
        role: 'sme_lessee',
        conflictDisclosureRequired: false,
        effectiveFrom: '2026-01-01',
      },
      {
        organisationId: 'org-originator',
        role: 'originator',
        conflictDisclosureRequired: true,
        effectiveFrom: '2026-01-01',
      },
    ],
  },
  instrument: {
    id: 'instrument-solar-001',
    version: 1,
    className: 'Illustrative participation units',
    targetUnits: 2_500n,
    unitPriceMinor: 10_000n,
    currency: 'USD',
    rights: {
      id: 'rights-solar-001',
      version: 1,
      ownershipDescription:
        'Illustrative contractual or beneficial participation rights; final legal form is undecided.',
      returnSource: 'Approved net rental cash flows from the operating SME.',
      lossRisks: ['Rental interruption', 'Asset damage', 'Limited liquidity'],
      liquidityStatement: 'No secondary market or guaranteed exit.',
      priority: 1,
      transferRestricted: true,
    },
  },
  economics: {
    id: 'economics-solar-001',
    version: 1,
    formulaReference: 'SYNTH-IJARAH-RENT-V1',
    cashFlowType: 'rent',
    termMonths: 48,
    fees: [],
    reserveMinor: 0n,
    maturityTreatment: 'Human-approved asset sale or other legally approved exit.',
    defaultTreatment: 'Human legal, operational and Shariah review required.',
  },
  register: {
    id: 'register-solar-001',
    version: 1,
    authority: 'issuer',
    providerMode: 'mock',
    registeredAndBeneficialOwnerEquivalent: false,
  },
  servicing: {
    id: 'servicing-solar-001',
    version: 1,
    evidenceCadence: 'monthly',
    lifecycleHooks: ['rent_due', 'insurance_refresh', 'maintenance_evidence', 'material_event'],
  },
  requiredEvidence: [
    'asset_title',
    'vendor_quote',
    'delivery_acceptance',
    'insurance',
    'shariah_opinion',
  ],
  mandatoryGates,
};

export const syntheticSaleLeasebackTemplate: ProductTemplate = {
  ...syntheticIjarahSolarTemplate,
  key: 'SYNTHETIC_EQUIPMENT_SALE_LEASEBACK_V1',
  label: 'Architecture-test equipment sale and leaseback',
  assetPool: {
    id: 'pool-machinery-001',
    version: 1,
    assets: [
      {
        id: 'machine-press-001',
        kind: 'equipment',
        description: 'Illustrative manufacturing press A',
        verificationStatus: 'synthetic_verified',
        allocationBasisBps: 6_000,
        effectiveFrom: '2026-02-01',
      },
      {
        id: 'machine-press-002',
        kind: 'equipment',
        description: 'Illustrative manufacturing press B',
        verificationStatus: 'synthetic_verified',
        allocationBasisBps: 4_000,
        effectiveFrom: '2026-02-01',
      },
    ],
  },
  legalStructure: {
    id: 'structure-sale-leaseback-001',
    version: 1,
    structureType: 'illustrative_equipment_sale_leaseback',
    approvalStatus: 'illustrative_not_approved',
    parties: [
      {
        organisationId: 'org-test-issuer',
        role: 'issuer',
        conflictDisclosureRequired: false,
        effectiveFrom: '2026-02-01',
      },
      {
        organisationId: 'org-test-sme',
        role: 'sme_lessee',
        conflictDisclosureRequired: true,
        effectiveFrom: '2026-02-01',
      },
      {
        organisationId: 'org-test-servicer',
        role: 'servicer',
        conflictDisclosureRequired: false,
        effectiveFrom: '2026-02-01',
      },
    ],
  },
  instrument: {
    ...syntheticIjarahSolarTemplate.instrument,
    id: 'instrument-machinery-001',
    className: 'Illustrative restricted equipment interests',
    targetUnits: 1_000n,
    unitPriceMinor: 5_000n,
    rights: {
      ...syntheticIjarahSolarTemplate.instrument.rights,
      id: 'rights-machinery-001',
      ownershipDescription:
        'Illustrative restricted economic interests; not a live or legally approved product.',
      returnSource: 'Illustrative approved leaseback cash flows.',
    },
  },
  economics: {
    ...syntheticIjarahSolarTemplate.economics,
    id: 'economics-machinery-001',
    formulaReference: 'SYNTH-SALE-LEASEBACK-V1',
    termMonths: 24,
  },
  register: {
    id: 'register-machinery-001',
    version: 1,
    authority: 'registrar',
    providerMode: 'mock',
    registeredAndBeneficialOwnerEquivalent: false,
  },
  servicing: {
    id: 'servicing-machinery-001',
    version: 1,
    evidenceCadence: 'quarterly',
    lifecycleHooks: ['lease_payment_due', 'equipment_condition', 'material_event'],
  },
  requiredEvidence: ['asset_title', 'independent_valuation', 'sale_contract', 'leaseback_contract'],
  mandatoryGates,
};

export const syntheticProductTemplates = [
  syntheticIjarahSolarTemplate,
  syntheticSaleLeasebackTemplate,
] as const;
