import { Request, Response } from "express";
import { Controller } from "../decorator/controller";
import { Route } from "../decorator/route";
import Joi from "joi";
import bcrypt from "bcrypt";
import prisma from "../lib/prismaClients";
import { Validate } from "../decorator/validate";
import jwt from "jsonwebtoken";
import config from "../config";
import { generateAccessToken, generateRefreshToken } from "../lib/tokens";

const registerLoginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

@Controller("/auth")
class AuthController {
  @Route("post", "/register")
  @Validate(registerLoginValidation)
  async register(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const hash = await bcrypt.hash(password, 10);
      const refresh_token = generateRefreshToken(email);
      const result = await prisma.user.create({
        data: {
          email,
          hash,
          refresh_token,
          cart: {
            create: {},
          },
        },

        select: {
          email: true,
          id: true,
          cart: true,
        },
      });
      req.session.access_token = generateAccessToken(result.id, result.email);
      req.session.cart_id = result.cart?.id;
      res
        .status(200)
        .cookie("refreshToken", refresh_token, {
          httpOnly: true,
          secure: false,
        })
        .json({
          message: `Welcome new user`,
          data: result,
        });
    } catch (error) {
      res.status(400).json({
        error,
      });
    }
  }

  @Route("get", "/login")
  @Validate(registerLoginValidation)
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const foundUser = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (!foundUser) {
        throw new Error("User not founded");
      }
      const passed = await bcrypt.compare(password, foundUser.hash);
      if (!passed) {
        throw new Error("Bad credentials");
      }
      // req.session.user_id = foundUser?.id;
      req.session.access_token = generateAccessToken(
        foundUser.id,
        foundUser.email
      );
      res
        .status(200)
        .cookie("refreshToken", generateRefreshToken(foundUser.email), {
          httpOnly: true,
          secure: false,
        })
        .json({
          message: "Welcome back user",
        });
    } catch (error) {
      res.status(400).json({
        error: error,
      });
    }
  }

  @Route("post", "/logout")
  logout(req: Request, res: Response) {
    try {
      // req.session.access_token = null;
      // req.sessionID = "";
      // req.session.user_id = null;
      // console.log(req.session);
      req.session.destroy(() => {
        console.log("Destroyed successfully");
        console.log(req.session);
      });
      res.cookie("refreshToken", "").status(200).json({
        message: "Logged out successfully",
      });
    } catch (error) {}
  }
  @Route("get", "/token")
  async token(req: Request, res: Response) {
    const currentRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;
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
      console.log(foudUser);
      console.log(currentRefreshToken);
      if (foudUser.refresh_token != currentRefreshToken) {
        return res.status(401).json({
          message: "Wrong token, please sign in again",
        });
      }
      const access_token = generateAccessToken(foudUser.id, foudUser.email);
      req.session.access_token = access_token;
      return res.status(200).json({
        message: "Access token refreshed",
      });
    } catch (error) {
      res.status(498).json({
        message: "Something gone wrong while updating token",
      });
    }
  }
}

export default AuthController;
