import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Retrieve the token from cookies
  const token = request.cookies.get("accessToken")?.value;

  const protectedPaths = ["/intern-management", "/mail-suite", "/editor"];

  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
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

// async function validateToken(token: string): Promise<boolean> {
//   try {
//     const res = await fetch("http://127.0.0.1:8000/api/user/", {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return res.ok;
//   } catch (error) {
//     console.error("Failed to validate token:", error);
//     return false;
//   }
// }

// Define the config for middleware
export const config = {
  matcher: ["/:path*"],
};
