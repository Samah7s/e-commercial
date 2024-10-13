import { Request, Response, NextFunction } from "express";
import url from "url";
import jwt from "jsonwebtoken";
import config from "../config";

export async function auth(req: Request, res: Response, next: NextFunction) {
  try {
    const token =
      req.session.access_token ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      console.log("token not exist");
      console.log(req.session);
      req.session.isAuthenticated = false;
      throw new Error("Invalid token");
    }
    const decodedToken = <jwt.JwtPayload>(
      jwt.verify(token, config.access_secret)
    );
    req.session.user_id = decodedToken.id;
    req.session.isAuthenticated = true;
    next();
  } catch (error) {
    req.session.isAuthenticated = false;
    return res.status(498).redirect(
      url.format({
        pathname: "/auth/token",
      })
    );
  }
}
