# Mizant platform

Secure, synthetic MVP foundation for Mizant's governed productive-asset investment workflow.

> **Safety boundary:** local/demo data only. No real identity, money, investment, custody, regulated
> transfer-agent action, live KYC/AML provider or production blockchain is enabled.

## What is included

- pnpm TypeScript monorepo with separate Next.js web, NestJS API and worker processes
- pure domain package for organisation-scoped RBAC, maker-checker and audit controls
- PostgreSQL/Prisma foundation with append-only audit/outbox models and canonical asset/structure/
  instrument/rights/register separation
- mock provider boundaries and controlled synthetic Ijarah solar-equipment fixture
- branded, responsive platform application covering investor, SME, originator, operations, compliance and
  ownership roles
- public Mizant story, role-aware workspaces, governed product journey, opportunity room, synthetic
  commitment, portfolio, interactive SME application, control console and ownership register
- a captioned, British-English video suite using the real demonstration interface: a one-minute
  introduction, a two-minute investor walkthrough and eight focused onboarding guides
- platform-wide search plus nine plain-English learning notes covering Ijarah, opportunity review,
  SME evidence, Shariah governance, ownership, risk and controlled tokenisation, each with practical
  checklists and links to primary further reading
- permissioned digital-unit pre-flight controls, register reconciliation and an off-chain provider
  boundary that cannot submit to a blockchain network
- typed, versioned asset/pool, legal structure, instrument/rights, economics, register and servicing layers
- two synthetic product fixtures proving reuse through one governed contract without a domain fork
- CI checks for formatting, types, tests, builds, dependencies and leaked secrets

Requirements: Stage P0, E01, E02, E16, IAM-001/002/003/005, ADM-002/003, ABS-001..010,
ADR-001/002/004/005/007/008/011/012/014, BR-12/14/15/16/17/18/19.

## Advanced preview journeys

- `/start`: choose investor, SME or originator access and create a fictional preview request.
- `/admin`: approve access, manage people, inspect platform safeguards and export the audit trail.
- `/tokenisation`: complete the governed off-chain issuance and reconciliation workflow.
- `/shariah`: review Shariah conditions and test ongoing material-event monitoring.
- `/learn`: search role-specific walkthroughs, videos and sourced learning notes.

The preview accepts only fictional records and keeps interactive state in versioned browser storage.
See [`docs/controls/ADVANCED_PLATFORM_WORKFLOWS.md`](docs/controls/ADVANCED_PLATFORM_WORKFLOWS.md)
for workflow boundaries and provider decisions required before a controlled pilot.

## Local setup

Prerequisites: Node.js 22+, pnpm 10+, and optionally Docker Desktop for PostgreSQL/Redis.

```bash
cp .env.example .env
pnpm install
docker compose up -d
pnpm --filter @mizant/database db:migrate
pnpm --filter @mizant/database db:seed
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The API health endpoint is
[http://localhost:3001/v1/health](http://localhost:3001/v1/health).

For the standalone web application, only the web package is required:

```bash
pnpm --filter @mizant/web dev
```

The web package detects port `3000` by default and prints the actual local address if that port is
unavailable.

## Secure preview deployment

The supported hosted preview is the self-contained `apps/web` application. It requires no hosted
database, Redis or API and contains no localhost runtime dependency. Its explicit synthetic demo
routes and approved brand/video assets are public; administration and every unapproved route remain
behind an environment-backed access gate.

Run the deployment readiness check with:

```bash
pnpm preview:check
```

Vercel project settings, required Preview-only environment variables, database migration guidance and
the explicit authentication boundary are documented in
[`docs/deployment/vercel-preview.md`](docs/deployment/vercel-preview.md).

## Guided platform walkthrough

Start at [http://localhost:3000](http://localhost:3000), then use **Enter platform**. A suggested
five-minute walkthrough is:

1. Open **Opportunities** and select the Samarkand solar-equipment Ijarah reference opportunity.
2. Select **Simulate a commitment**, enter an illustrative amount, review the risks and consent, then
   confirm. This creates a synthetic browser-only receipt; no payment or ownership is created.
3. Open **Portfolio** to see the illustrative holding, servicing timetable and evidence health.
4. Open **Applications** to compare the submitted, incomplete and beneficial-ownership manual-review
   SME scenarios, then use **Start an application** to complete the browser-only submission flow.
5. Open **Reviews** to claim the submitted case, request evidence or record a completed human review.
6. Open **Governance**, record an operations hand-off, continue as the independent checker and
   record the separate check.
7. Open **Ownership** to search the synthetic register, inspect holder evidence and export a CSV.
8. Open **Tokenisation** to test the permissioned unit pre-flight scenarios. Eligible instructions
   stop at independent-checker review; blocked scenarios explain exactly which control failed.

Useful direct routes:

- `/demo` — guided role and platform overview
- `/learn` — searchable learning library, practical checklists, captioned platform videos and
  role-specific operating guides
- `/learn/[topic]` — public, source-linked learning notes with relevant platform actions
- `/opportunities` — investor opportunity pipeline
- `/opportunities/solar-ijarah` — controlled reference asset and rights room
- `/subscribe` — interactive synthetic commitment
- `/portfolio` — synthetic ownership and servicing view
- `/applications` — three fictional SME/originator scenarios
- `/applications/new` — validated, browser-saved synthetic application journey
- `/origination` — originator workbench with priorities, cases and permitted actions
- `/reviews` — independent reviewer queue with controlled case actions and history
- `/governance` — actionable operations maker controls
- `/governance?role=compliance` — separate independent-checker workspace
- `/ownership` — searchable, exportable synthetic ownership register
- `/tokenisation` — permissioned digital-unit lifecycle and interactive pre-flight controls

The API also exposes `GET /v1/foundation/tokenisation/profile` and
`POST /v1/foundation/tokenisation/preflight`. Both are control and simulation endpoints only; the
provider response always confirms that nothing was submitted to a network.

The synthetic E05/E17 scenario review is available at
[http://localhost:3000/applications](http://localhost:3000/applications). It contains one complete,
one incomplete, and one manual-review application; all identities and evidence are fictional.

The visual preview itself does not require PostgreSQL or Redis; those services become authoritative
as application workflows are connected in subsequent epics.

The Content Security Policy permits Next.js inline application bootstrapping and permits dynamic
evaluation only while the local development server is running. External script sources remain
blocked; the production policy does not include `unsafe-eval`.

## Quality checks

```bash
pnpm check
```

## Repository map

- `apps/web`: customer and operations shell
- `apps/api`: authenticated HTTP/domain orchestration boundary
- `apps/worker`: background job boundary
- `packages/domain`: pure policies, state/control primitives and invariants
- `packages/database`: Prisma schema, migrations, repositories and synthetic seed
- `packages/ui`: accessible design tokens/components
- `packages/integrations`: mock/sandbox/live provider interfaces
- `packages/contracts`: deliberately empty production-chain boundary
- `packages/testing`: synthetic personas, journeys and provider fixtures
- `docs/adr`, `docs/controls`: architecture and control evidence
- `docs/video-suite.md`: narration-free video editorial, rendering and verification guidance
- `infra`: future reviewed infrastructure-as-code (no public deployment in P0)
