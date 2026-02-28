import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const { pathname } = req.nextUrl;

        // Allow auth routes
        if (
          pathname.startsWith("/api/auth") ||
          pathname === "/login" ||
          pathname === "/register"
        ) {
          return true;
        }

        // Public routes
        if (pathname === "/" || pathname.startsWith("/api/videos")) {
          return true;
        }

        // Protected routes
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};