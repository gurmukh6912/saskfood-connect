import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    console.log({token})

    // Redirect users based on role
    if (token) {
      // Customer routes
      if (path.startsWith("/customer") && token.role !== "CUSTOMER") {
        return NextResponse.redirect(new URL("/", req.url));
      }
      
      // Driver routes
      if (path.startsWith("/driver") && token.role !== "DRIVER") {
        return NextResponse.redirect(new URL("/", req.url));
      }
      
      // Restaurant routes
      if (path.startsWith("/restaurant") && token.role !== "RESTAURANT_OWNER") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/customer/:path*", "/driver/:path*", "/restaurant/:path*"],
};