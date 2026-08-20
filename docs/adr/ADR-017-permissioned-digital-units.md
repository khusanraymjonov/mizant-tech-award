# ADR-017: Permissioned digital-unit control layer

## Status

Accepted for the controlled MVP demonstration.

## Context

Mizant needs to demonstrate how an approved instrument could be represented by digital units without implying that a blockchain record is the legal register or enabling live issuance, custody, payments or unrestricted transfers.

Regulated-token patterns commonly separate the token, identity registry, compliance policy and authorised operator roles. They also pre-check transfers, support pausing and freezing, and restrict operations to verified eligible holders. Mizant additionally requires maker-checker separation and a human-controlled canonical register.

The control vocabulary is informed by the permissioned architecture described in
[ERC-3643](https://eips.ethereum.org/EIPS/eip-3643). This is a design reference, not a claim that
Mizant has deployed or certified an ERC-3643 contract.

## Decision

- The canonical ownership register remains the source of truth.
- A digital unit is a restricted representation of an approved instrument; it is not the asset, legal structure, investor right or official register itself.
- Every operation is first represented as an idempotent instruction with an exact instrument and policy version.
- Pre-flight checks cover register reconciliation, pause state, available balance, account status, identity status, jurisdiction policy and maker-checker separation.
- The P0 adapter is `off_chain_simulation` and cannot submit a transaction to a blockchain network.
- Issuance, allocation, transfer, freeze, recovery, redemption and correction remain distinct operations with attributable audit events.
- Production smart contracts, wallets, custody and public transfers remain out of scope until legal, regulatory, security and independent Shariah decisions are complete.

## Consequences

The product can demonstrate a credible permissioned lifecycle and test its controls without creating live value. A future network adapter can be added behind the same interface, but the register authority, approval workflow and reconciliation controls remain unchanged.
