export type ApiEnvironment = Readonly<{
  NODE_ENV?: string | undefined;
  API_PORT?: string | undefined;
  API_HOST?: string | undefined;
  WEB_ORIGINS?: string | undefined;
}>;

export type ApiRuntimeConfig = Readonly<{
  port: number;
  host: string;
  corsOrigins: readonly string[];
}>;

export function resolveApiRuntimeConfig(environment: ApiEnvironment): ApiRuntimeConfig {
  const productionLike = environment.NODE_ENV === 'production';
  const port = Number(environment.API_PORT ?? 3001);
  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error('API_PORT must be a valid TCP port.');
  }

  const corsOrigins = (environment.WEB_ORIGINS ?? (productionLike ? '' : 'http://localhost:3000'))
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (productionLike && corsOrigins.length === 0) {
    throw new Error('WEB_ORIGINS is required when NODE_ENV=production.');
  }

  for (const origin of corsOrigins) {
    const parsed = new URL(origin);
    if (!['http:', 'https:'].includes(parsed.protocol) || parsed.pathname !== '/') {
      throw new Error(`WEB_ORIGINS contains an invalid origin: ${origin}`);
    }
    if (productionLike && ['localhost', '127.0.0.1', '[::1]'].includes(parsed.hostname)) {
      throw new Error('WEB_ORIGINS must not contain localhost in production.');
    }
  }

  return {
    port,
    host: environment.API_HOST ?? (productionLike ? '0.0.0.0' : '127.0.0.1'),
    corsOrigins,
  };
}
