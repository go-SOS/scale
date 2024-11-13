import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const baseURL: string = process.env.NEXT_PUBLIC_NEXTAUTH_URL as string;

  const url = request.nextUrl.clone();

  let isLogin = request.cookies.get("logged");
  if (!isLogin) {
    if (request.nextUrl.pathname.startsWith("/scale")) {
      // return NextResponse.rewrite(new URL("/", request.url));
      return NextResponse.redirect(baseURL);
    }
    if (request.nextUrl.pathname.startsWith("/onboard")) {
      // return NextResponse.rewrite(new URL("/", request.url));
      return NextResponse.redirect(baseURL);
    }
  } else {
    if (url.pathname === "/" || url.pathname === "/register") {
      url.pathname = "/scale/home";
      return NextResponse.redirect(url);
    }
  }

  if (request.nextUrl.pathname.startsWith("/signin")) {
    return NextResponse.rewrite(new URL("/", request.url));
  }
}
