import { describe, expect, it } from 'vitest';
import {
  DEFAULT_PREVIEW_USERNAME,
  isPublicDemoPath,
  parseBasicAuthorization,
  previewCredentialsValid,
  previewGateRequired,
} from './preview-auth';

const authorization = (username: string, password: string) =>
  `Basic ${btoa(`${username}:${password}`)}`;

describe('preview access protection', () => {
  it('requires the gate for Vercel preview deployments', () => {
    expect(previewGateRequired({ VERCEL_ENV: 'preview' })).toBe(true);
    expect(previewGateRequired({ VERCEL_ENV: 'production' })).toBe(true);
    expect(previewGateRequired({ VERCEL_ENV: 'development' })).toBe(false);
    expect(previewGateRequired({ ENABLE_PREVIEW_GATE: 'true' })).toBe(true);
  });

  it('allows only the synthetic reviewer experience through the public route boundary', () => {
    expect(isPublicDemoPath('/')).toBe(true);
    expect(isPublicDemoPath('/demo')).toBe(true);
    expect(isPublicDemoPath('/opportunities/solar-ijarah')).toBe(true);
    expect(isPublicDemoPath('/applications/new')).toBe(true);
    expect(isPublicDemoPath('/learn/controlled-tokenisation-from-rights-to-units')).toBe(true);
    expect(isPublicDemoPath('/brand/mizant-logo-light.png')).toBe(true);
    expect(isPublicDemoPath('/videos/introducing-mizant.mp4')).toBe(true);
    expect(isPublicDemoPath('/videos/introducing-mizant.vtt')).toBe(true);
    expect(isPublicDemoPath('/videos/posters/introducing-mizant.jpg')).toBe(true);
    expect(isPublicDemoPath('/admin')).toBe(false);
    expect(isPublicDemoPath('/governance/private')).toBe(false);
    expect(isPublicDemoPath('/api/private')).toBe(false);
  });

  it('parses basic credentials without losing colons in the password', () => {
    expect(parseBasicAuthorization(authorization('reviewer', 'long:password'))).toEqual({
      username: 'reviewer',
      password: 'long:password',
    });
  });

  it('rejects malformed authorization values', () => {
    expect(parseBasicAuthorization(null)).toBeNull();
    expect(parseBasicAuthorization('Bearer token')).toBeNull();
    expect(parseBasicAuthorization('Basic invalid-base64')).toBeNull();
  });

  it('validates both username and password', async () => {
    const environment = { PREVIEW_ACCESS_PASSWORD: 'a-long-preview-password' };

    await expect(
      previewCredentialsValid(
        authorization(DEFAULT_PREVIEW_USERNAME, 'a-long-preview-password'),
        environment,
      ),
    ).resolves.toBe(true);
    await expect(
      previewCredentialsValid(authorization(DEFAULT_PREVIEW_USERNAME, 'incorrect'), environment),
    ).resolves.toBe(false);
    await expect(
      previewCredentialsValid(
        authorization('incorrect-user', 'a-long-preview-password'),
        environment,
      ),
    ).resolves.toBe(false);
  });
});
