import passport from "passport";
import { Strategy } from "passport-local";
import prisma from "../lib/prismaClients";


export default passport.use(
  new Strategy(async (email, password, done) => {
    try {
      const findUser = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (!findUser) throw new Error("User not found");
      done(null, findUser);
    } catch (error) {
      done(error, undefined);
    }
  })
);

