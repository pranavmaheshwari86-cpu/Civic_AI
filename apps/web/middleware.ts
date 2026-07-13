import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'hi'],
 
  // Used when no locale matches
  defaultLocale: 'en'
});

export default function middleware(req: NextRequest) {
  const isProtected = req.nextUrl.pathname.includes('/dashboard') || req.nextUrl.pathname.includes('/admin');
  if (isProtected) {
    const authCookie = req.cookies.get('auth') || req.cookies.get('refreshToken');
    if (!authCookie) {
      const locale = req.nextUrl.pathname.split('/')[1] || 'en';
      return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
    }
  }
  return intlMiddleware(req);
}
 
export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(hi|en)/:path*']
};
