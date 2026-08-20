import type { NextConfig } from 'next';

const scriptSources =
  process.env.NODE_ENV === 'development'
    ? "'self' 'unsafe-inline' 'unsafe-eval'"
    : "'self' 'unsafe-inline'";
const isHosted = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';
const isPreview =
  process.env.VERCEL_ENV === 'preview' || process.env.ENABLE_PREVIEW_GATE === 'true';

const config: NextConfig = {
  poweredByHeader: false,
  transpilePackages: ['@mizant/domain', '@mizant/testing', '@mizant/ui'],
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `default-src 'self'; img-src 'self' data:; media-src 'self'; style-src 'self' 'unsafe-inline'; script-src ${scriptSources}; frame-ancestors 'none'; base-uri 'self'; form-action 'self'`,
          },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=()',
          },
          ...(isHosted
            ? [
                {
                  key: 'Strict-Transport-Security',
                  value: 'max-age=31536000; includeSubDomains',
                },
              ]
            : []),
          ...(isPreview
            ? [
                {
                  key: 'X-Robots-Tag',
                  value: 'noindex, nofollow, noarchive, nosnippet',
                },
              ]
            : []),
        ],
      },
    ];
  },
};
export default config;
