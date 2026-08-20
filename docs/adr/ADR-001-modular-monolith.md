# ADR-001: Modular monolith

- Status: accepted by MVP specification v1.1
- Requirements: ADR-001, E01, P0

## Decision

Use one TypeScript monorepo with separately runnable web, API, and worker processes. Keep domain,
database, UI, integrations, and test fixtures behind explicit package boundaries. Provider effects
must use adapters and an outbox. Microservices are deferred until measured constraints justify them.

## Consequences

This lowers operating complexity while retaining boundaries that can be extracted later. PostgreSQL
is authoritative; caches, providers, and any future blockchain mirror are not.
