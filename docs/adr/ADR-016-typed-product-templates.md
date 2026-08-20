# ADR-016: Typed product templates, not a universal product language

- Status: accepted for synthetic architecture validation
- Requirements: E16, ABS-001..011, BR-15..19, ADR-011, ADR-014

## Decision

Represent each transaction through explicit, versioned layers: asset pool, legal structure and party
roles, instrument and rights, economic terms, official-register authority, and servicing. Concrete
product fixtures implement a governed TypeScript contract with mandatory legal, compliance, Shariah,
and maker-checker gates.

The second fixture is an illustrative equipment sale/leaseback used only for contract testing. Its
selection is not a legal, commercial, regulatory, or Shariah product decision.

## Consequences

The Ijarah reference journey remains focused while common controls are reusable. New live structures
still require independent approval and a new effective-dated template version. A generic no-code DSL
is deliberately deferred until evidence from multiple approved use cases justifies it.
