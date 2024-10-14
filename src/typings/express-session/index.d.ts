import { User } from "@prisma/client";
import "express-session";

declare module "express-session" {
  interface SessionData {
    user_id?: string;
    access_token?: string;
    cart_id?: string;
    order_id?: string | null;
    isAuthenticated?: boolean;
  }
}
