import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { locales, defaultLocale } from '@/lib/i18n'

export function middleware(request: NextRequest) {
  // احصل على المسار من الرابط
  const { pathname } = request.nextUrl

  // تحقق مما إذا كان المسار يحتوي بالفعل على لغة (مثل /ar/about)
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) {
    return
  }

  // إذا لم يكن هناك لغة، قم بإعادة التوجيه إلى اللغة الافتراضية
  const newUrl = new URL(`/${defaultLocale}${pathname}`, request.url)
  return NextResponse.redirect(newUrl)
}

export const config = {
  // هذا يحدد المسارات التي سيعمل عليها الـ middleware
  // تم استثناء api, admin, uploads, والصور والملفات الثابتة
  matcher: [
    '/((?!api|admin|uploads|_next/static|_next/image|images|videos|favicon.ico).*)',
  ],
}