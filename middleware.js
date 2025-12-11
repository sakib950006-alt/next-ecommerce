import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { USER_DASHBORD, WEBSITE_LOGIN } from "./routes/websiteRoute";
import { ADMIN_DASHBORD } from "./routes/adminPanelRoute";

export async function middleware(request) {
  try {
    const pathname = request.nextUrl.pathname;
    const hasToken = request.cookies.has("access_token");

    if (!hasToken) {
      if (!pathname.startsWith("/auth")) return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.nextUrl));
      return NextResponse.next();
    }

    const access_token = request.cookies.get("access_token").value;
    const { payload } = await jwtVerify(access_token, new TextEncoder().encode(process.env.SECRET_KEY));

    const role = payload.role; // ✅ flat payload

    if (pathname.startsWith("/auth")) {
      const redirectTo = role === "admin" ? ADMIN_DASHBORD : USER_DASHBORD;
      return NextResponse.redirect(new URL(redirectTo, request.nextUrl));
    }

    if (pathname.startsWith("/admin") && role !== "admin") return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.nextUrl));
    if (pathname.startsWith("/my-account") && role !== "user") return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.nextUrl));

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.nextUrl));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/my-account/:path*", "/auth/:path*"],
};
