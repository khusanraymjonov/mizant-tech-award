-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "Organisation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "synthetic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Organisation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Membership" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "effectiveFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),
    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditEvent" (
    "id" TEXT NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actorId" TEXT NOT NULL,
    "actorKind" TEXT NOT NULL,
    "actorRoles" JSONB NOT NULL,
    "organisationId" TEXT NOT NULL,
    "objectType" TEXT NOT NULL,
    "objectId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "previousReference" TEXT,
    "newReference" TEXT,
    "requestId" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    CONSTRAINT "AuditEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutboxEvent" (
    "id" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "aggregateType" TEXT NOT NULL,
    "aggregateId" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),
    "attempts" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "OutboxEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApprovalRequest" (
    "id" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "objectType" TEXT NOT NULL,
    "objectId" TEXT NOT NULL,
    "makerId" TEXT NOT NULL,
    "checkerId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "decidedAt" TIMESTAMP(3),
    CONSTRAINT "ApprovalRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetPool" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "synthetic" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "AssetPool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LegalStructure" (
    "id" TEXT NOT NULL,
    "templateKey" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "approvalStatus" TEXT NOT NULL,
    CONSTRAINT "LegalStructure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Instrument" (
    "id" TEXT NOT NULL,
    "legalStructureId" TEXT NOT NULL,
    "targetUnits" BIGINT NOT NULL,
    "unitPriceMinor" BIGINT NOT NULL,
    "currency" TEXT NOT NULL,
    CONSTRAINT "Instrument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RightsVersion" (
    "id" TEXT NOT NULL,
    "instrumentId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "rights" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RightsVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegisterAuthority" (
    "id" TEXT NOT NULL,
    "instrumentId" TEXT NOT NULL,
    "authorityType" TEXT NOT NULL,
    "providerMode" TEXT NOT NULL DEFAULT 'mock',
    "legalAuthority" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "RegisterAuthority_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegisterPosition" (
    "id" TEXT NOT NULL,
    "instrumentId" TEXT NOT NULL,
    "accountReference" TEXT NOT NULL,
    "holderReference" TEXT NOT NULL,
    "units" BIGINT NOT NULL,
    "frozenUnits" BIGINT NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "synthetic" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "RegisterPosition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DigitalUnitInstruction" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "instrumentId" TEXT NOT NULL,
    "operation" TEXT NOT NULL,
    "quantity" BIGINT NOT NULL,
    "sourceAccount" TEXT,
    "destinationAccount" TEXT,
    "policyVersion" INTEGER NOT NULL,
    "makerId" TEXT NOT NULL,
    "checkerId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'prepared',
    "idempotencyKey" TEXT NOT NULL,
    "providerMode" TEXT NOT NULL DEFAULT 'off_chain_simulation',
    "providerReference" TEXT,
    "blockingReasons" JSONB NOT NULL,
    "synthetic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "decidedAt" TIMESTAMP(3),
    CONSTRAINT "DigitalUnitInstruction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SmeApplicationRecord" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "originatorOrganisationId" TEXT NOT NULL,
    "policyId" TEXT NOT NULL,
    "policyVersion" INTEGER NOT NULL,
    "currentVersion" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "synthetic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SmeApplicationRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SmeApplicationVersion" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "payload" JSONB NOT NULL,
    "status" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SmeApplicationVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SmeEvidenceVersion" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "evidenceType" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "synthetic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SmeEvidenceVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GovernanceReview" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "lane" TEXT NOT NULL,
    "reviewerId" TEXT,
    "decision" TEXT NOT NULL DEFAULT 'pending',
    "conditions" JSONB NOT NULL,
    "comments" JSONB NOT NULL,
    "decidedAt" TIMESTAMP(3),
    CONSTRAINT "GovernanceReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Membership_userId_organisationId_role_key" ON "Membership"("userId", "organisationId", "role");
CREATE INDEX "AuditEvent_organisationId_occurredAt_idx" ON "AuditEvent"("organisationId", "occurredAt");
CREATE INDEX "AuditEvent_objectType_objectId_idx" ON "AuditEvent"("objectType", "objectId");
CREATE INDEX "ApprovalRequest_organisationId_status_idx" ON "ApprovalRequest"("organisationId", "status");
CREATE UNIQUE INDEX "RightsVersion_instrumentId_version_key" ON "RightsVersion"("instrumentId", "version");
CREATE INDEX "RegisterPosition_instrumentId_holderReference_idx" ON "RegisterPosition"("instrumentId", "holderReference");
CREATE UNIQUE INDEX "RegisterPosition_instrumentId_accountReference_version_key" ON "RegisterPosition"("instrumentId", "accountReference", "version");
CREATE UNIQUE INDEX "DigitalUnitInstruction_reference_key" ON "DigitalUnitInstruction"("reference");
CREATE UNIQUE INDEX "DigitalUnitInstruction_idempotencyKey_key" ON "DigitalUnitInstruction"("idempotencyKey");
CREATE INDEX "DigitalUnitInstruction_organisationId_status_idx" ON "DigitalUnitInstruction"("organisationId", "status");
CREATE INDEX "DigitalUnitInstruction_instrumentId_createdAt_idx" ON "DigitalUnitInstruction"("instrumentId", "createdAt");
CREATE UNIQUE INDEX "SmeApplicationRecord_reference_key" ON "SmeApplicationRecord"("reference");
CREATE INDEX "SmeApplicationRecord_organisationId_status_idx" ON "SmeApplicationRecord"("organisationId", "status");
CREATE UNIQUE INDEX "SmeApplicationVersion_applicationId_version_key" ON "SmeApplicationVersion"("applicationId", "version");
CREATE UNIQUE INDEX "SmeEvidenceVersion_applicationId_evidenceType_version_key" ON "SmeEvidenceVersion"("applicationId", "evidenceType", "version");
CREATE UNIQUE INDEX "GovernanceReview_applicationId_lane_key" ON "GovernanceReview"("applicationId", "lane");

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "AuditEvent" ADD CONSTRAINT "AuditEvent_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "SmeApplicationVersion" ADD CONSTRAINT "SmeApplicationVersion_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "SmeApplicationRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "SmeEvidenceVersion" ADD CONSTRAINT "SmeEvidenceVersion_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "SmeApplicationRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "GovernanceReview" ADD CONSTRAINT "GovernanceReview_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "SmeApplicationRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
