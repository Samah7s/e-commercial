import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import prisma from "../lib/prismaClients";
import config from "../config";

export function generateAccessToken(id: string, email: string) {
  return jwt.sign({ id, email }, config.access_secret, {
    expiresIn: 1000 * 60 * 60,
  });
}

export function generateRefreshToken(email: string) {
  return jwt.sign({ email }, config.refresh_secret, {
    expiresIn: "14d",
  });
}

export async function refreshAccessToken(req: Request, res: Response) {
  const currentRefreshToken =
    req.cookies.refresh_token || req.body.refresh_token;
  if (!currentRefreshToken) {
    return res.status(401).json({
      message: "Refresh token not found, pleas sign in",
    });
  }
  try {
    const decodedToken = <jwt.JwtPayload>(
      jwt.verify(currentRefreshToken, config.refresh_secret)
    );
    const foudUser = await prisma.user.findUnique({
      where: {
        email: decodedToken.email,
      },
    });
    if (!foudUser) {
      return res.status(404).json({
        message: "Bad credentials",
      });
    }
    if (!foudUser.refresh_token !== currentRefreshToken) {
      return res.status(401).json({
        message: "Wrong token, please sign in again",
      });
    }
    const access_token = generateAccessToken(foudUser.id, foudUser.email);
    req.session.access_token = access_token;
    return res.status(200).json({
      message: "Access token refreshed",
    });
  } catch (error) {}
}
