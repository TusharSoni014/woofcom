import { User } from "@prisma/client";

/**
 * Declares a module for the next-auth library, which is likely used for authentication in the application.
 */
declare module "next-auth" {
  interface Session {
    user: User;
  }
}
