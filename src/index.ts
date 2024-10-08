import http from "http";
import express from "express";
import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();
import config from "./config";
import session from "express-session";
import { PrismaClient } from "@prisma/client";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import passport from "passport";
import corsHandler from "./middlewares/corsHandler";
import { defineRoutes } from "./modules/routes";
import UserController from "./controllers/user";
import MainController from "./controllers/main";

export const app = express();

export let httpServer: ReturnType<typeof http.createServer>;

//MIDDLEWARES DEFINITON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: config.session_secret as string,
    saveUninitialized: false,
    resave: true,
    cookie: {
      secure: false,
      httpOnly: true,
      sameSite: false,
      maxAge: 1000 * 60 * 2,
    },
    store: new PrismaSessionStore(new PrismaClient() as any, {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(corsHandler);

//ROUTE DEFINITIONS
defineRoutes([UserController, MainController], app);

httpServer = http.createServer(app);
httpServer.listen(config.port, () => {
  console.log(`Server running at port ${config.port}`);
});

export const Shutdown = (callback: any) =>
  httpServer && httpServer.close(callback);
