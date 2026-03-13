import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, locales, isValidLocale } from "@/lib/i18n";

function getPreferredLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get("accept-language");
  if (!acceptLanguage) return defaultLocale;

  const preferred = acceptLanguage
    .split(",")
    .map((lang) => lang.split(";")[0].trim().substring(0, 2))
    .find((lang) => isValidLocale(lang));

  return preferred ?? defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameLocale = locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameLocale) return NextResponse.next();

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const locale = getPreferredLocale(request);
  return NextResponse.redirect(
    new URL(`/${locale}${pathname}`, request.url),
    302
  );
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
