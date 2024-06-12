import { NextResponse } from "next/server";
import { authMiddleware, redirectToSignIn } from "@clerk/nextjs/server";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({
  publicRoutes: ["/home"],
  afterAuth(auth, req, evt) {
    const home = new URL("/home", req.url);
    // Handle users who aren't authenticated
    if (!auth.userId && !auth.isPublicRoute) {
      // return NextResponse.redirect(home);
      return redirectToSignIn({ returnBackUrl: req.url });
    }
    // Redirect signed in users to organization selection page if they are not active in an organization
    // if (
    //   auth.userId && !auth.orgId && req.nextUrl.pathname !== "/org-selection"
    // ) {
    //   const orgSelection = new URL("/org-selection", req.url);
    //   return NextResponse.redirect(orgSelection);
    // }
    // If the user is signed in and trying to access a protected route, allow them to access route
    if (auth.userId && !auth.isPublicRoute) {
      return NextResponse.next();
    }
    // Allow users visiting public routes to access them
    return NextResponse.next();
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
