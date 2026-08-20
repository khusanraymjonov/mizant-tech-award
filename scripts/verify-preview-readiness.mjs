import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const webRoot = path.join(repositoryRoot, 'apps', 'web');
const failures = [];

const requiredFiles = [
  '.env.preview.example',
  'apps/web/middleware.ts',
  'apps/web/vercel.json',
  'packages/database/prisma/migrations/migration_lock.toml',
];

for (const relativePath of requiredFiles) {
  try {
    await access(path.join(repositoryRoot, relativePath));
  } catch {
    failures.push(`Missing required preview file: ${relativePath}`);
  }
}

const deployedMode =
  process.env.VERCEL_ENV === 'preview' ||
  process.env.VERCEL_ENV === 'production' ||
  process.env.ENABLE_PREVIEW_GATE === 'true';
const password = process.env.PREVIEW_ACCESS_PASSWORD ?? '';
if (deployedMode && password.length < 20) {
  failures.push(
    'PREVIEW_ACCESS_PASSWORD must contain at least 20 characters for restricted deployed routes.',
  );
}
if (deployedMode && /replace|change|example|password/i.test(password)) {
  failures.push('PREVIEW_ACCESS_PASSWORD must not use an example or placeholder value.');
}

if (process.env.APP_DATA_MODE && process.env.APP_DATA_MODE !== 'SYNTHETIC_ONLY') {
  failures.push('APP_DATA_MODE must remain SYNTHETIC_ONLY for the preview deployment.');
}

for (const flag of ['ENABLE_REAL_PAYMENTS', 'ENABLE_LIVE_KYC', 'ENABLE_PRODUCTION_CHAIN']) {
  if (process.env[flag] === 'true')
    failures.push(`${flag} must not be true for the preview deployment.`);
}

const sourceExtensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.json']);
const ignoredDirectories = new Set(['.next', 'node_modules', 'dist', 'coverage']);
const deployedSources = [];

async function collectSources(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (ignoredDirectories.has(entry.name)) continue;
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) await collectSources(absolutePath);
    else if (sourceExtensions.has(path.extname(entry.name))) deployedSources.push(absolutePath);
  }
}

await collectSources(webRoot);
for (const sourcePath of deployedSources) {
  const source = await readFile(sourcePath, 'utf8');
  if (/https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?/i.test(source)) {
    failures.push(
      `Deployed web source contains a localhost-only URL: ${path.relative(repositoryRoot, sourcePath)}`,
    );
  }
}

const previewExample = await readFile(path.join(repositoryRoot, '.env.preview.example'), 'utf8');
for (const forbiddenName of ['DATABASE_URL', 'REDIS_URL', 'OIDC_ISSUER', 'OIDC_CLIENT_SECRET']) {
  if (previewExample.includes(`${forbiddenName}=`)) {
    failures.push(`${forbiddenName} must not be configured for the self-contained web preview.`);
  }
}

if (failures.length > 0) {
  console.error('Mizant preview readiness failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(
    `Mizant preview readiness passed (${deployedSources.length} deployed source files checked).`,
  );
}
