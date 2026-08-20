import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const preview =
    process.env.VERCEL_ENV === 'preview' || process.env.ENABLE_PREVIEW_GATE === 'true';

  return preview
    ? { rules: { userAgent: '*', disallow: '/' } }
    : { rules: { userAgent: '*', allow: '/' } };
}
