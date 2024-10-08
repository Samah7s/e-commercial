import { Request, Response, NextFunction } from "express";
import { Controller } from "../decorator/controller";
import { Route } from "../decorator/route";

@Controller()
class MainController {
  @Route("get", "/")
  getHomePage(req: Request, res: Response, next: NextFunction) {
    return res.status(200).json({ message: "Welcome to the home page" });
  }
}

export default MainController;
