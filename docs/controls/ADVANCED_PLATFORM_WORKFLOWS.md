# Advanced governed platform workflows

## Purpose

This increment turns the Mizant preview from a collection of role screens into connected, testable operating procedures. It remains a controlled synthetic environment: it does not accept real identity data or money, issue legal rights, perform regulated transfer-agent functions, make automated decisions or submit transactions to a production blockchain.

## What is now demonstrable

### External access and role exploration

- Investors, SMEs and originators can choose their role, create a fictional preview profile and open the correct guided workspace.
- A preview access request is persisted in the browser and appears in the administrator queue.
- Only `@example.test` fictional email addresses are accepted in the preview workflow.

### Platform administration

- The administrator can approve or decline access requests with a reason.
- Approval creates a scoped user record; the administrator can suspend, reactivate or remove access.
- Every action creates an append-only access audit record that can be exported as CSV.
- Technical administration is explicitly separated from legal, compliance, Shariah, finance and ownership approval authority.

### Governed tokenisation

- The reference transaction separates the asset pool, legal structure, rights/economics, instrument and register authority.
- The workflow requires evidence freeze, independent legal/compliance/Shariah reviews, an ownership-administrator maker, a separate checker, mock register confirmation and final reconciliation.
- The issuance instruction is idempotent and fixed-supply. The functional preview records 2,500 off-chain unit references and reconciles 1,700 holder positions plus 800 unallocated units.
- The transfer-policy laboratory demonstrates identity expiry, restricted jurisdiction and instrument-pause failures before an operation can proceed.

### Independent Shariah assurance

- The Shariah case records methodology, reviewer independence, reviewed evidence, decision scope and ongoing conditions.
- Conditions have status, evidence, owner and due date.
- Material asset-use or contract changes recommend containment and open a human impact-assessment case; the rules never make the final Shariah decision.

### Guided operating procedures

- The learning centre provides practical walkthroughs for investors, SMEs, originators, control reviewers, ownership administrators and platform administrators.
- Each walkthrough ends at an observable record, decision or audit event.

## Architecture and persistence

- Domain invariants and state transitions live in `packages/domain`.
- Database-ready records and migrations live in `packages/database/prisma`.
- The Vercel preview uses versioned browser storage to demonstrate connected state without collecting real personal data or requiring a localhost database.
- A production identity provider, managed PostgreSQL service and approved provider adapters can replace the preview persistence without changing the domain workflow.

## Authoritative design references

- AAOIFI Governance Standards 1, 19, 20, 21 and 22: Shariah governance framework, board appointment, operations, review and reporting.
- IFSB-19: understandable and Shariah-specific disclosure for Islamic capital-market products.
- ERC-3643: identity-linked compliance checks, pre-transfer verification, pause, freeze, recovery, mint/burn and controlled agent roles for permissioned tokens.
- FCA and Bank of England Digital Securities Sandbox: gated progression from testing to live activity.
- FATF Recommendation 15 implementation material: risk-based controls for virtual-asset activity where applicable.
- SEC transfer-agent material and the UK Digitisation Taskforce report: accurate ownership records, registered/beneficial-owner distinction, corporate actions and reconciliation.
- OpenZeppelin access-control guidance: least privilege, specialised roles, delayed high-risk administration and auditable role changes.

These references inform workflow design only. Applicable law, regulatory permissions, approved partner responsibilities and an independent Shariah authority remain controlling.

## Required before a controlled pilot

1. Select a production identity provider and require MFA for privileged users.
2. Connect managed PostgreSQL, apply migrations and run backup/restore evidence.
3. Obtain jurisdiction-specific legal and regulatory perimeter advice.
4. Appoint the independent Shariah authority and approve the methodology, opinion form and monitoring procedure.
5. Select approved KYC/KYB, sanctions, payment/escrow and register/custody partners.
6. Complete threat modelling, security review, penetration testing, privacy assessment and operational-resilience exercises.
7. Obtain a dated release decision from every accountable control owner before any real data, money or legal right is used.
