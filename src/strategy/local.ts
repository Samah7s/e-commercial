import passport from "passport";
import { Strategy } from "passport-local";
import prisma from "../lib/prismaClients";
import bcrypt from "bcrypt";
import type { User } from "@prisma/client";

passport.serializeUser((user: Partial<Pick<User, "email">>, done) => {
  done(null, user.email);
});

passport.deserializeUser(async (email: string, done) => {
  try {
    const findUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    console.log(findUser);
    if (!findUser) throw new Error("User not found");
    done(null, findUser);
  } catch (error) {}
});

export default passport.use(
  new Strategy(async (email, password, done) => {
    try {
      const findUser = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      bcrypt
        .compare(password, findUser?.hash as string)
        .then(() => {
          done(null, findUser as User);
        })
        .catch((error) => {
          throw new Error("Bad credentials");
        });
      if (!findUser) throw new Error("User not found");
      done(null, findUser);
    } catch (error) {
      done(error, undefined);
    }
  })
);
