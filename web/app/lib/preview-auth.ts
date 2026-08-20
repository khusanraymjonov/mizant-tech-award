export type PreviewEnvironment = Readonly<{
  VERCEL_ENV?: string | undefined;
  ENABLE_PREVIEW_GATE?: string | undefined;
  PREVIEW_ACCESS_USERNAME?: string | undefined;
  PREVIEW_ACCESS_PASSWORD?: string | undefined;
}>;

export type PreviewCredentials = Readonly<{
  username: string;
  password: string;
}>;

export const DEFAULT_PREVIEW_USERNAME = 'mizant-preview';

const publicDemoExactRoutes = [
  '/',
  '/demo',
  '/start',
  '/learn',
  '/opportunities',
  '/subscribe',
  '/portfolio',
  '/applications',
  '/origination',
  '/governance',
  '/reviews',
  '/shariah',
  '/tokenisation',
  '/ownership',
] as const;

const publicDemoNestedRoutes = ['/opportunities', '/applications', '/learn'] as const;
const publicDemoAssetPrefixes = ['/brand/', '/videos/'] as const;

export function isPublicDemoPath(pathname: string): boolean {
  return (
    publicDemoExactRoutes.some((route) => pathname === route) ||
    publicDemoNestedRoutes.some((route) => pathname.startsWith(`${route}/`)) ||
    publicDemoAssetPrefixes.some((prefix) => pathname.startsWith(prefix))
  );
}

export function previewGateRequired(environment: PreviewEnvironment): boolean {
  return (
    environment.VERCEL_ENV === 'preview' ||
    environment.VERCEL_ENV === 'production' ||
    environment.ENABLE_PREVIEW_GATE === 'true'
  );
}

export function parseBasicAuthorization(header: string | null): PreviewCredentials | null {
  if (!header?.startsWith('Basic ')) return null;

  try {
    const decoded = atob(header.slice('Basic '.length));
    const separator = decoded.indexOf(':');
    if (separator < 1) return null;

    return {
      username: decoded.slice(0, separator),
      password: decoded.slice(separator + 1),
    };
  } catch {
    return null;
  }
}

async function digest(value: string): Promise<Uint8Array> {
  const bytes = new TextEncoder().encode(value);
  return new Uint8Array(await crypto.subtle.digest('SHA-256', bytes));
}

async function secureEqual(left: string, right: string): Promise<boolean> {
  const [leftDigest, rightDigest] = await Promise.all([digest(left), digest(right)]);
  let difference = 0;

  for (let index = 0; index < leftDigest.length; index += 1) {
    difference |= leftDigest[index]! ^ rightDigest[index]!;
  }

  return difference === 0;
}

export async function previewCredentialsValid(
  authorization: string | null,
  environment: PreviewEnvironment,
): Promise<boolean> {
  const supplied = parseBasicAuthorization(authorization);
  const expectedPassword = environment.PREVIEW_ACCESS_PASSWORD;
  if (!supplied || !expectedPassword) return false;

  const expectedUsername = environment.PREVIEW_ACCESS_USERNAME ?? DEFAULT_PREVIEW_USERNAME;
  const [usernameMatches, passwordMatches] = await Promise.all([
    secureEqual(supplied.username, expectedUsername),
    secureEqual(supplied.password, expectedPassword),
  ]);

  return usernameMatches && passwordMatches;
}
