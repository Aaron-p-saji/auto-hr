import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const currentPath = request.nextUrl.pathname;

  // Exclude static assets from middleware logic
  const staticAssetPaths = [
    "/_next/static",
    "/_next/image",
    "/favicon.ico",
    "/error",
  ];
  const isStaticAsset = staticAssetPaths.some((path) =>
    currentPath.startsWith(path)
  );

  if (isStaticAsset) {
    return NextResponse.next();
  }

  if (currentPath === "/error") {
    return NextResponse.next();
  }

  // Check server status
  const isServerUp = await checkServer();

  if (!isServerUp) {
    return NextResponse.redirect(new URL("/error", request.url));
  }

  // Retrieve the token from cookies
  const token = request.cookies.get("accessToken")?.value;

  const protectedPaths = ["/intern-management", "/mail-suite", "/editor"];

  const isProtectedPath = protectedPaths.some((path) =>
    currentPath.startsWith(path)
  );

  if (isProtectedPath) {
    if (!token) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // const isValidToken = await validateToken(token);

    // if (!isValidToken) {
    //   return NextResponse.redirect(new URL("/", request.url));
    // }
  }

  return NextResponse.next();
}

async function checkServer(): Promise<boolean> {
  try {
    const res = await fetch("http://127.0.0.1:8000/check_server/", {
      method: "GET",
    });
    return res.ok;
  } catch (error) {
    return false;
  }
}

// Define the config for middleware
export const config = {
  matcher: ["/:path*"],
};
