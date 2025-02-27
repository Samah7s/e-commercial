import http from "http";
import express from "express";
import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();
import config from "./config";
import session from "express-session";
import cookieParser from "cookie-parser";
import { PrismaClient } from "@prisma/client";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import corsHandler from "./middlewares/corsHandler";
import { defineRoutes } from "./modules/routes";
import authController from "./controllers/auth";
import MainController from "./controllers/main";
import ProductController from "./controllers/products";
import CartController from "./controllers/cart";
import OrderController from "./controllers/order";

export const app = express();

export let httpServer: ReturnType<typeof http.createServer>;

//MIDDLEWARES DEFINITON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: config.session_secret as string,
    saveUninitialized: false,
    resave: true,
    cookie: {
      secure: false,
      httpOnly: true,
      sameSite: false,
      maxAge: 1000 * 60 * 60,
    },
    store: new PrismaSessionStore(new PrismaClient() as any, {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);
app.use(corsHandler);

//ROUTE DEFINITIONS
defineRoutes(
  [
    authController,
    MainController,
    ProductController,
    CartController,
    OrderController,
  ],
  app
);

httpServer = http.createServer(app);
httpServer.listen(config.port, () => {
  console.log(`Server running at port ${config.port}`);
});

//testing purpose only
export const Shutdown = (callback: any) =>
  httpServer && httpServer.close(callback);
