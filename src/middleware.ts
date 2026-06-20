import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // 放行登录页，避免重定向循环
        const { pathname } = req.nextUrl;
        if (pathname === "/admin/login") return true;
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};
