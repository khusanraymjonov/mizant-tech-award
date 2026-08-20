ALTER TABLE "User"
ADD COLUMN "status" TEXT NOT NULL DEFAULT 'active',
ADD COLUMN "mfaPolicy" TEXT NOT NULL DEFAULT 'optional';

CREATE TABLE "AccessRequest" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "organisationName" TEXT NOT NULL,
  "requestedRole" TEXT NOT NULL,
  "purpose" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "reviewedAt" TIMESTAMP(3),
  "reviewedBy" TEXT,
  "decisionReason" TEXT,
  "synthetic" BOOLEAN NOT NULL DEFAULT true,
  CONSTRAINT "AccessRequest_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "IssuanceCase" (
  "id" TEXT NOT NULL,
  "organisationId" TEXT NOT NULL,
  "stage" TEXT NOT NULL,
  "version" INTEGER NOT NULL DEFAULT 1,
  "assetPoolId" TEXT NOT NULL,
  "legalStructureId" TEXT NOT NULL,
  "instrumentId" TEXT NOT NULL,
  "rightsVersionId" TEXT NOT NULL,
  "economicsVersionId" TEXT NOT NULL,
  "disclosureVersionId" TEXT NOT NULL,
  "officialRegisterAuthority" TEXT NOT NULL,
  "targetUnits" BIGINT NOT NULL,
  "unitPriceMinor" BIGINT NOT NULL,
  "currency" TEXT NOT NULL,
  "confirmedUnits" BIGINT NOT NULL DEFAULT 0,
  "synthetic" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "IssuanceCase_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "IssuanceApprovalRecord" (
  "id" TEXT NOT NULL,
  "issuanceCaseId" TEXT NOT NULL,
  "lane" TEXT NOT NULL,
  "actorId" TEXT NOT NULL,
  "actorRole" TEXT NOT NULL,
  "evidenceReference" TEXT NOT NULL,
  "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "IssuanceApprovalRecord_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "IssuanceLifecycleEvent" (
  "id" TEXT NOT NULL,
  "issuanceCaseId" TEXT NOT NULL,
  "sequence" INTEGER NOT NULL,
  "action" TEXT NOT NULL,
  "actorId" TEXT NOT NULL,
  "actorRole" TEXT NOT NULL,
  "objectVersion" INTEGER NOT NULL,
  "evidenceReference" TEXT NOT NULL,
  "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "IssuanceLifecycleEvent_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ShariahReviewCase" (
  "id" TEXT NOT NULL,
  "organisationId" TEXT NOT NULL,
  "offeringReference" TEXT NOT NULL,
  "methodologyVersion" TEXT NOT NULL,
  "reviewerId" TEXT,
  "independenceStatus" TEXT NOT NULL,
  "decision" TEXT NOT NULL,
  "effectiveAt" TIMESTAMP(3),
  "nextReviewAt" TIMESTAMP(3),
  "opinionReference" TEXT,
  "synthetic" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ShariahReviewCase_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ShariahCondition" (
  "id" TEXT NOT NULL,
  "reviewCaseId" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "severity" TEXT NOT NULL,
  "ownerId" TEXT NOT NULL,
  "evidenceRef" TEXT,
  "dueAt" TIMESTAMP(3),
  "resolvedAt" TIMESTAMP(3),
  CONSTRAINT "ShariahCondition_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AccessRequest_status_submittedAt_idx" ON "AccessRequest"("status", "submittedAt");
CREATE INDEX "AccessRequest_email_idx" ON "AccessRequest"("email");
CREATE INDEX "IssuanceCase_organisationId_stage_idx" ON "IssuanceCase"("organisationId", "stage");
CREATE INDEX "IssuanceCase_instrumentId_idx" ON "IssuanceCase"("instrumentId");
CREATE UNIQUE INDEX "IssuanceApprovalRecord_issuanceCaseId_lane_key" ON "IssuanceApprovalRecord"("issuanceCaseId", "lane");
CREATE UNIQUE INDEX "IssuanceLifecycleEvent_issuanceCaseId_sequence_key" ON "IssuanceLifecycleEvent"("issuanceCaseId", "sequence");
CREATE INDEX "IssuanceLifecycleEvent_action_occurredAt_idx" ON "IssuanceLifecycleEvent"("action", "occurredAt");
CREATE INDEX "ShariahReviewCase_organisationId_decision_idx" ON "ShariahReviewCase"("organisationId", "decision");
CREATE INDEX "ShariahReviewCase_nextReviewAt_idx" ON "ShariahReviewCase"("nextReviewAt");
CREATE UNIQUE INDEX "ShariahCondition_reviewCaseId_code_key" ON "ShariahCondition"("reviewCaseId", "code");
CREATE INDEX "ShariahCondition_status_dueAt_idx" ON "ShariahCondition"("status", "dueAt");

ALTER TABLE "IssuanceApprovalRecord" ADD CONSTRAINT "IssuanceApprovalRecord_issuanceCaseId_fkey" FOREIGN KEY ("issuanceCaseId") REFERENCES "IssuanceCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "IssuanceLifecycleEvent" ADD CONSTRAINT "IssuanceLifecycleEvent_issuanceCaseId_fkey" FOREIGN KEY ("issuanceCaseId") REFERENCES "IssuanceCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ShariahCondition" ADD CONSTRAINT "ShariahCondition_reviewCaseId_fkey" FOREIGN KEY ("reviewCaseId") REFERENCES "ShariahReviewCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
