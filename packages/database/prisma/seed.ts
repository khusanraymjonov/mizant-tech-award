import { Prisma, PrismaClient } from '@prisma/client';
import { syntheticSolarJourney } from '@mizant/testing';
import { syntheticSmeApplications } from '@mizant/testing/sme-applications';

const db = new PrismaClient();

const json = (value: unknown): Prisma.InputJsonValue =>
  JSON.parse(
    JSON.stringify(value, (_key, current) =>
      typeof current === 'bigint' ? current.toString() : current,
    ),
  ) as Prisma.InputJsonValue;

const organisations = [
  ...syntheticSolarJourney.organisations,
  { id: 'org-nur-solar', role: 'originator', name: 'Nur Solar Solutions LLC' },
  { id: 'org-zarafshan-foods', role: 'sme_applicant', name: 'Zarafshan Foods LLC' },
  {
    id: 'org-samarkand-cold-chain',
    role: 'sme_applicant',
    name: 'Samarkand Cold Chain LLC',
  },
  {
    id: 'org-meridian-manufacturing',
    role: 'sme_applicant',
    name: 'Meridian Manufacturing LLC',
  },
  { id: 'org-mizant-operations', role: 'platform_operator', name: 'Mizant Operations' },
  { id: 'org-mizant-investors', role: 'investor_group', name: 'Mizant Investor Preview' },
] as const;

const users = [
  { id: 'user-investor-preview', email: 'investor@example.invalid' },
  { id: 'user-sme-preview', email: 'sme@example.invalid' },
  { id: 'user-originator-preview', email: 'originator@example.invalid' },
  { id: 'user-operations-preview', email: 'operations@example.invalid' },
  { id: 'user-compliance-preview', email: 'compliance@example.invalid' },
  { id: 'user-ownership-preview', email: 'ownership@example.invalid' },
  { id: 'user-shariah-preview', email: 'shariah@example.invalid' },
  { id: 'user-legal-preview', email: 'legal@example.invalid' },
  { id: 'user-admin-preview', email: 'admin@example.invalid' },
] as const;

const memberships = [
  ['membership-investor', 'user-investor-preview', 'org-mizant-investors', 'investor'],
  ['membership-sme', 'user-sme-preview', 'org-zarafshan-foods', 'sme_applicant'],
  ['membership-originator', 'user-originator-preview', 'org-nur-solar', 'originator'],
  ['membership-operations', 'user-operations-preview', 'org-mizant-operations', 'operations'],
  [
    'membership-compliance',
    'user-compliance-preview',
    'org-mizant-operations',
    'independent_checker',
  ],
  ['membership-ownership', 'user-ownership-preview', 'org-spv', 'ownership_administrator'],
  ['membership-shariah', 'user-shariah-preview', 'org-mizant-operations', 'shariah_reviewer'],
  ['membership-legal', 'user-legal-preview', 'org-mizant-operations', 'legal_reviewer'],
  ['membership-admin', 'user-admin-preview', 'org-mizant-operations', 'platform_administrator'],
] as const;

const registerPositions = [
  {
    id: 'register-position-001',
    accountReference: 'SYN-HLD-001',
    holderReference: 'Alex Morgan',
    units: 10n,
    status: 'pending_confirmation',
  },
  {
    id: 'register-position-002',
    accountReference: 'SYN-HLD-002',
    holderReference: 'Synthetic Investor Cohort A',
    units: 1_690n,
    status: 'recorded',
  },
  {
    id: 'register-position-003',
    accountReference: 'SYN-POOL-001',
    holderReference: 'Unallocated capacity',
    units: 800n,
    status: 'available',
  },
] as const;

async function seedFoundation() {
  for (const organisation of organisations) {
    await db.organisation.upsert({
      where: { id: organisation.id },
      update: { name: organisation.name, synthetic: true },
      create: { id: organisation.id, name: organisation.name, synthetic: true },
    });
  }

  for (const user of users) {
    await db.user.upsert({ where: { id: user.id }, update: user, create: user });
  }

  for (const [id, userId, organisationId, role] of memberships) {
    await db.membership.upsert({
      where: { id },
      update: { userId, organisationId, role, revokedAt: null },
      create: { id, userId, organisationId, role },
    });
  }

  await db.assetPool.upsert({
    where: { id: syntheticSolarJourney.assetPool.id },
    update: { name: syntheticSolarJourney.assetPool.name, synthetic: true },
    create: {
      id: syntheticSolarJourney.assetPool.id,
      name: syntheticSolarJourney.assetPool.name,
      synthetic: true,
    },
  });

  await db.legalStructure.upsert({
    where: { id: syntheticSolarJourney.legalStructure.id },
    update: {
      templateKey: syntheticSolarJourney.legalStructure.template,
      approvalStatus: syntheticSolarJourney.legalStructure.status,
    },
    create: {
      id: syntheticSolarJourney.legalStructure.id,
      templateKey: syntheticSolarJourney.legalStructure.template,
      approvalStatus: syntheticSolarJourney.legalStructure.status,
    },
  });

  await db.instrument.upsert({
    where: { id: syntheticSolarJourney.instrument.id },
    update: {
      targetUnits: BigInt(syntheticSolarJourney.instrument.targetUnits),
      unitPriceMinor: BigInt(syntheticSolarJourney.instrument.targetUnitPriceMinor),
      currency: 'USD',
    },
    create: {
      id: syntheticSolarJourney.instrument.id,
      legalStructureId: syntheticSolarJourney.legalStructure.id,
      targetUnits: BigInt(syntheticSolarJourney.instrument.targetUnits),
      unitPriceMinor: BigInt(syntheticSolarJourney.instrument.targetUnitPriceMinor),
      currency: 'USD',
    },
  });

  await db.rightsVersion.upsert({
    where: { instrumentId_version: { instrumentId: 'SYN-INST-001', version: 1 } },
    update: {},
    create: {
      id: 'rights-SYN-INST-001-v1',
      instrumentId: 'SYN-INST-001',
      version: 1,
      rights: json({
        description: 'Restricted illustrative participation rights only.',
        returnSource: 'Approved net rental cash flows from the operating SME.',
        transferRestricted: true,
        liquidity: 'No secondary market or guaranteed exit.',
      }),
    },
  });

  await db.registerAuthority.upsert({
    where: { id: 'register-SYN-INST-001' },
    update: { providerMode: 'off_chain_simulation', legalAuthority: false },
    create: {
      id: 'register-SYN-INST-001',
      instrumentId: 'SYN-INST-001',
      authorityType: 'issuer_administered_reference',
      providerMode: 'off_chain_simulation',
      legalAuthority: false,
    },
  });

  for (const position of registerPositions) {
    await db.registerPosition.upsert({
      where: { id: position.id },
      update: position,
      create: { ...position, instrumentId: 'SYN-INST-001', frozenUnits: 0n, synthetic: true },
    });
  }

  await db.digitalUnitInstruction.upsert({
    where: { reference: 'SYN-DUI-001' },
    update: {},
    create: {
      id: 'digital-unit-instruction-001',
      reference: 'SYN-DUI-001',
      organisationId: 'org-spv',
      instrumentId: 'SYN-INST-001',
      operation: 'allocate',
      quantity: 10n,
      destinationAccount: 'SYN-HLD-001',
      policyVersion: 1,
      makerId: 'user-ownership-preview',
      status: 'ready_for_checker',
      idempotencyKey: 'SYN-DUI-001-v1',
      providerMode: 'off_chain_simulation',
      blockingReasons: json([]),
      synthetic: true,
    },
  });
}

async function seedApplications() {
  for (const application of syntheticSmeApplications) {
    await db.smeApplicationRecord.upsert({
      where: { id: application.id },
      update: {
        status: application.status,
        currentVersion: application.version,
        policyVersion: application.policyVersion,
      },
      create: {
        id: application.id,
        reference: application.reference,
        organisationId: application.organisationId,
        originatorOrganisationId: application.originatorOrganisationId,
        policyId: application.policyId,
        policyVersion: application.policyVersion,
        currentVersion: application.version,
        status: application.status,
        synthetic: true,
      },
    });

    await db.smeApplicationVersion.upsert({
      where: {
        applicationId_version: { applicationId: application.id, version: application.version },
      },
      update: { payload: json(application), status: application.status },
      create: {
        id: `${application.id}-version-${application.version}`,
        applicationId: application.id,
        version: application.version,
        payload: json(application),
        status: application.status,
        actorId: application.submissionHistory.at(-1)?.actorId ?? 'synthetic-seed',
      },
    });

    for (const evidence of application.evidence) {
      await db.smeEvidenceVersion.upsert({
        where: {
          applicationId_evidenceType_version: {
            applicationId: application.id,
            evidenceType: evidence.type,
            version: evidence.version,
          },
        },
        update: { status: evidence.status, explanation: evidence.explanation },
        create: {
          id: `${application.id}-${evidence.type}-v${evidence.version}`,
          applicationId: application.id,
          evidenceType: evidence.type,
          version: evidence.version,
          status: evidence.status,
          explanation: evidence.explanation,
          synthetic: true,
        },
      });
    }

    for (const review of application.reviews) {
      await db.governanceReview.upsert({
        where: { applicationId_lane: { applicationId: application.id, lane: review.lane } },
        update: {
          decision: review.decision,
          conditions: json(review.conditions),
          comments: json(review.comments),
        },
        create: {
          id: `${application.id}-review-${review.lane}`,
          applicationId: application.id,
          lane: review.lane,
          decision: review.decision,
          conditions: json(review.conditions),
          comments: json(review.comments),
        },
      });
    }

    await db.auditEvent.upsert({
      where: { id: `audit-seed-${application.id}` },
      update: {},
      create: {
        id: `audit-seed-${application.id}`,
        actorId: application.submissionHistory.at(-1)?.actorId ?? 'synthetic-seed',
        actorKind: 'synthetic_user',
        actorRoles: json(['originator']),
        organisationId: application.organisationId,
        objectType: 'sme_application',
        objectId: application.id,
        action: `seed_${application.status}`,
        newReference: `${application.reference}:v${application.version}`,
        requestId: `seed-request-${application.id}`,
        source: 'prisma_seed',
      },
    });
  }
}

async function seedAdvancedGovernance() {
  const accessRequests = [
    {
      id: 'ACCESS-1024',
      name: 'Mariam Yusupova',
      email: 'mariam.yusupova@example.test',
      organisationName: 'Silk Road Foods',
      requestedRole: 'sme',
      purpose: 'Prepare a productive-equipment application',
    },
    {
      id: 'ACCESS-1023',
      name: 'Timur Akhmedov',
      email: 'timur.akhmedov@example.test',
      organisationName: 'Tashkent Originations',
      requestedRole: 'originator',
      purpose: 'Coordinate SME evidence and asset submissions',
    },
  ] as const;

  for (const request of accessRequests) {
    await db.accessRequest.upsert({
      where: { id: request.id },
      update: request,
      create: { ...request, status: 'pending', synthetic: true },
    });
  }

  await db.issuanceCase.upsert({
    where: { id: 'MZT-SYN-001' },
    update: {},
    create: {
      id: 'MZT-SYN-001',
      organisationId: 'org-mizant-operations',
      stage: 'asset_modelled',
      version: 1,
      assetPoolId: 'SYN-ASSET-POOL-001',
      legalStructureId: 'SYN-IJARAH-SPV-001',
      instrumentId: 'SYN-INST-001',
      rightsVersionId: 'SYN-RIGHTS-001-v1',
      economicsVersionId: 'SYN-ECON-001-v1',
      disclosureVersionId: 'SYN-DISC-001-v1',
      officialRegisterAuthority: 'Synthetic issuer register',
      targetUnits: 2_500n,
      unitPriceMinor: 10_000n,
      currency: 'USD',
      confirmedUnits: 0n,
      synthetic: true,
    },
  });

  await db.shariahReviewCase.upsert({
    where: { id: 'SHR-MZT-001' },
    update: {},
    create: {
      id: 'SHR-MZT-001',
      organisationId: 'org-mizant-operations',
      offeringReference: 'MZT-SYN-001',
      methodologyVersion: 'AAOIFI-IFSB-reference-v1',
      reviewerId: 'user-shariah-preview',
      independenceStatus: 'declared_independent',
      decision: 'controlled_demonstration_review_recorded',
      effectiveAt: new Date('2026-08-18T09:00:00.000Z'),
      nextReviewAt: new Date('2026-11-18T09:00:00.000Z'),
      opinionReference: 'SHR-MZT-001-opinion-v1',
      synthetic: true,
    },
  });

  const conditions = [
    ['SHR-C01', 'Asset ownership before lease', 'satisfied', 'material', 'ownership-maker-01'],
    ['SHR-C02', 'Permitted productive use', 'satisfied', 'material', 'sme-demo-01'],
    ['SHR-C03', 'Maintenance responsibility', 'satisfied', 'standard', 'operations-maker-01'],
    ['SHR-C04', 'Insurance / takaful evidence', 'due', 'material', 'sme-demo-01'],
    ['SHR-C05', 'Late-payment treatment', 'satisfied', 'material', 'legal-reviewer-01'],
  ] as const;

  for (const [code, title, status, severity, ownerId] of conditions) {
    await db.shariahCondition.upsert({
      where: { reviewCaseId_code: { reviewCaseId: 'SHR-MZT-001', code } },
      update: { title, status, severity, ownerId },
      create: {
        id: `SHR-MZT-001-${code}`,
        reviewCaseId: 'SHR-MZT-001',
        code,
        title,
        status,
        severity,
        ownerId,
        evidenceRef: `${code}-evidence-v1`,
        dueAt: code === 'SHR-C04' ? new Date('2026-09-12T09:00:00.000Z') : null,
      },
    });
  }
}

async function main() {
  await seedFoundation();
  await seedApplications();
  await seedAdvancedGovernance();
}

main()
  .catch((error) => {
    console.error('Synthetic seed failed.', error);
    process.exitCode = 1;
  })
  .finally(async () => db.$disconnect());
