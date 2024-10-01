import { authOptions } from "@/lib/authOptions";
import NextAuth from "next-auth";

/**
 * Handles the NextAuth.js authentication middleware for the API route.
 * This function is exported as both the GET and POST handlers for the API route.
 */
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
