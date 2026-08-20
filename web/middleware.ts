import { NextRequest, NextResponse } from 'next/server';
import {
  isPublicDemoPath,
  previewCredentialsValid,
  previewGateRequired,
} from './app/lib/preview-auth';

const previewEnvironment = () => ({
  VERCEL_ENV: process.env.VERCEL_ENV,
  ENABLE_PREVIEW_GATE: process.env.ENABLE_PREVIEW_GATE,
  PREVIEW_ACCESS_USERNAME: process.env.PREVIEW_ACCESS_USERNAME,
  PREVIEW_ACCESS_PASSWORD: process.env.PREVIEW_ACCESS_PASSWORD,
});

const protectedHeaders = {
  'Cache-Control': 'private, no-store, max-age=0',
  'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet',
};

const publicDemoHeaders = {
  'Cache-Control': 'public, max-age=0, must-revalidate',
  'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet',
};

function responseWithHeaders(headers: Record<string, string>) {
  const response = NextResponse.next();
  for (const [key, value] of Object.entries(headers)) response.headers.set(key, value);
  return response;
}

export async function middleware(request: NextRequest) {
  const environment = previewEnvironment();

  if (isPublicDemoPath(request.nextUrl.pathname)) {
    return responseWithHeaders(publicDemoHeaders);
  }

  if (!previewGateRequired(environment)) return NextResponse.next();

  if (!environment.PREVIEW_ACCESS_PASSWORD) {
    return new NextResponse('Preview unavailable: access protection is not configured.', {
      status: 503,
      headers: protectedHeaders,
    });
  }

  const allowed = await previewCredentialsValid(request.headers.get('authorization'), environment);
  if (!allowed) {
    return new NextResponse('Authentication is required to view this Mizant preview.', {
      status: 401,
      headers: {
        ...protectedHeaders,
        'WWW-Authenticate': 'Basic realm="Mizant secure preview", charset="UTF-8"',
      },
    });
  }

  const response = responseWithHeaders(protectedHeaders);
  response.headers.set('Vary', 'Authorization');
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt).*)'],
};
