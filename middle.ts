import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const isAdmin = req.nextauth.token?.isAdmin; // this comes from JWT
    const url = req.nextUrl;

    if (url.pathname.startsWith("/admin") && !isAdmin) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Allow access if user is logged in
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};
