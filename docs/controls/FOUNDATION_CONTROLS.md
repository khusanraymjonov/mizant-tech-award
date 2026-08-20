# P0 foundation controls

This repository implements a synthetic demo foundation only. It is not authorised for real
customers, money, investments, custody, transfer-agent activity, live KYC/AML, or production smart
contracts.

| Control     | Foundation implementation                                                                |
| ----------- | ---------------------------------------------------------------------------------------- |
| IAM-001/002 | OIDC adapter boundary; local identity is clearly marked mock-only                        |
| IAM-003/005 | Server policy evaluates actor, role, organisation, object and action                     |
| ADM-002     | Append-only audit event model with actor, role, object, before/after refs and request ID |
| ADM-003     | Reusable maker-checker policy rejects self-approval                                      |
| BR-12/14    | Automated/AI actors cannot grant controlled approvals                                    |
| BR-15/16/17 | Asset, structure, instrument, rights and register authority remain distinct              |
| E01         | Monorepo, CI, tests, local services, synthetic fixtures and setup documentation          |

## Deliberate safety locks

All real-value capabilities default to false and application startup rejects them outside a formally
approved future configuration. Logs must contain identifiers, not personal or confidential payloads.
