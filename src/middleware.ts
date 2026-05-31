import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ token }) {
      // Allow access if no DATABASE_URL configured (demo mode)
      if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("user:password")) {
        return true;
      }
      return !!token;
    },
  },
});

export const config = {
  matcher: [
    "/((?!login|api/auth|_next/static|_next/image|favicon.ico|api).*)",
  ],
};
