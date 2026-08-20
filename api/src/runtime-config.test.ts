import { describe, expect, it } from 'vitest';
import { resolveApiRuntimeConfig } from './runtime-config.js';

describe('API runtime configuration', () => {
  it('uses safe local defaults for development', () => {
    expect(resolveApiRuntimeConfig({ NODE_ENV: 'development' })).toEqual({
      port: 3001,
      host: '127.0.0.1',
      corsOrigins: ['http://localhost:3000'],
    });
  });

  it('requires an explicit web origin in production', () => {
    expect(() => resolveApiRuntimeConfig({ NODE_ENV: 'production' })).toThrow(
      'WEB_ORIGINS is required',
    );
  });

  it('accepts HTTPS preview origins and binds to all interfaces in production', () => {
    expect(
      resolveApiRuntimeConfig({
        NODE_ENV: 'production',
        WEB_ORIGINS: 'https://mizant-preview.vercel.app',
      }),
    ).toEqual({
      port: 3001,
      host: '0.0.0.0',
      corsOrigins: ['https://mizant-preview.vercel.app'],
    });
  });

  it('rejects localhost as a production origin', () => {
    expect(() =>
      resolveApiRuntimeConfig({
        NODE_ENV: 'production',
        WEB_ORIGINS: 'http://localhost:3000',
      }),
    ).toThrow('must not contain localhost');
  });
});
