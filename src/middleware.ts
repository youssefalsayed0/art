import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { LOCALES, routing } from "./i18n/routing";
import { getToken } from "next-auth/jwt";

const authPages = [
  "/auth/login",
  "/auth/register",
  "/auth/forget-password",
  "/auth/set-password",
];

const handleI18nRouting = createMiddleware(routing);

export default async function middleware(req: NextRequest) {
  const token = await getToken({ req });

  const authPageRegex = new RegExp(
    `^(/(${LOCALES.join("|")}))?(${authPages.map((p) => (p === "/" ? "" : p)).join("|")})/?$`,
    "i"
  );

  const isAuthPage = authPageRegex.test(req.nextUrl.pathname);

  if (isAuthPage && token) {
    // Redirect authenticated users away from auth pages to home
    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
  }

  return handleI18nRouting(req);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
