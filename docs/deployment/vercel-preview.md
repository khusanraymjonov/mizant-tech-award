# Vercel preview deployment

## Scope

The preview deploys only `apps/web`, the self-contained Next.js demonstration application. It uses
fictional fixtures and browser-local state. It does not call the Nest API, PostgreSQL, Redis, an
identity provider, a payment provider, a KYC/AML provider, a custodian or a blockchain network.

This is intentional. The current API endpoints are unauthenticated foundation endpoints and must not
be exposed publicly until user authentication, organisation scoping, route authorization, rate
limiting and durable audit persistence are implemented and independently reviewed.

## Vercel project settings

Import `khusanraymjonov/mizant-platform` as a new Vercel project with:

- Environment: **Preview**, never Production
- Root Directory: `apps/web`
- Framework Preset: Next.js
- Install Command: `pnpm install --frozen-lockfile`
- Build Command: `pnpm build`
- Production domain: leave unconfigured
- `mizant.com`: do not connect

Running `vercel` without `--prod`, or deploying a non-production Git branch, creates a Preview
deployment. Never run `vercel --prod` for this project without explicit approval.

## Preview environment variables

Configure these for the **Preview** environment only:

| Variable                  | Required value                                            |
| ------------------------- | --------------------------------------------------------- |
| `APP_DATA_MODE`           | `SYNTHETIC_ONLY`                                          |
| `ENABLE_REAL_PAYMENTS`    | `false`                                                   |
| `ENABLE_LIVE_KYC`         | `false`                                                   |
| `ENABLE_PRODUCTION_CHAIN` | `false`                                                   |
| `ENABLE_PREVIEW_GATE`     | `true`                                                    |
| `PREVIEW_ACCESS_USERNAME` | A non-sensitive review username, default `mizant-preview` |
| `PREVIEW_ACCESS_PASSWORD` | A random secret of at least 20 characters                 |

Do not add `DATABASE_URL`, `REDIS_URL`, `OIDC_ISSUER` or `OIDC_CLIENT_SECRET` to this web-only
preview project. The committed `.env.preview.example` contains the complete variable names but no
usable secret.

The application rejects a deployed build when the restricted-route password is missing, too short
or resembles a placeholder. It also rejects enabled live-service flags and localhost URLs in
deployed web source.

## Public demo and restricted administration

The synthetic reviewer journey is intentionally public on an explicit route allowlist, beginning at
`/`. Approved brand assets and the MP4, poster and caption files under `/videos/` are public
subresources of those routes. The public role switcher exposes investor, SME, originator,
operations, compliance, Shariah and ownership-administration demonstrations. It does not
authenticate a real participant.

`/admin`, future private API routes and any route outside the public allowlist remain behind the
application-level HTTP Basic gate. The public interface labels administration as restricted and does
not link a signed-out reviewer into the browser credential prompt.

Do not enable project-wide Vercel Authentication or password protection for this dedicated public
demo project: either control would prevent signed-out reviewers from reaching the safe allowlisted
experience. Keep separate production projects and genuinely private deployments protected.

## Database readiness

PostgreSQL is not required by the web preview. The database foundation is nevertheless deployable for
a later private environment:

```bash
pnpm --filter @mizant/database db:migrate:deploy
pnpm --filter @mizant/database db:seed
```

The migration history is committed under `packages/database/prisma/migrations`. The idempotent seed
creates only fictional organisations, users, role memberships, SME cases, review lanes, register
positions and one non-executing digital-unit instruction.

For a future API environment, use a managed PostgreSQL connection string supplied as `DATABASE_URL`.
Do not point a hosted service at `localhost`. Redis is not currently used by the running code and
should not be provisioned until a reviewed job or caching requirement exists.

## Verification

Before any preview deployment, run:

```bash
pnpm preview:check
pnpm check
```

After deployment, verify the generated `*.vercel.app` URL opens signed out without a credential or
Vercel login prompt, returns the expected security headers, renders every public demo route, keeps
`/admin` gated, and is not indexed. Do not add a custom domain and do not promote the deployment to
Production.
