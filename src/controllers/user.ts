import { Request, Response, NextFunction } from "express";
import { Controller } from "../decorator/controller";
import { Route } from "../decorator/route";
import Joi from "joi";
import bcrypt from "bcrypt";
import prisma from "../lib/prismaClients";
import { Validate } from "../decorator/validate";

const registerLoginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

@Controller()
class UserController {
  @Route("post", "/register")
  @Validate(registerLoginValidation)
  async registerUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const hash = await bcrypt.hash(password, 10);
      const result = await prisma.user.create({
        data: {
          email,
          hash,
        },
        select: {
          email: true,
        },
      });
      res.status(200).json({
        message: `Welcome new user`,
        data: result,
      });
    } catch (error) {}
  }

  @Route("get", "/login")
  @Validate(registerLoginValidation)
  loginUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
    } catch (error) {}
  }

  @Route("post", "/logout")
  logoutUser(req: Request, res: Response, next: NextFunction) {
    return res.status(200).json({ hello: "World!", ...req.body });
  }
}

export default UserController;
