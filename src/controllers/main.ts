import { Request, Response } from "express";
import { Controller } from "../decorator/controller";
import { Route } from "../decorator/route";
import { auth } from "../middlewares/ensureAuth";

@Controller()
class MainController {
  @Route("get", "/")
  getHomePage(req: Request, res: Response) {
    console.log(req.session);
    return res.status(200).json({ message: "Welcome to the home page" });
  }
  //Middleware test purpose only
  @Route("get", "/protected", auth)
  getProtectedPage(req: Request, res: Response) {
    console.log(req.session);
    res.status(200).json({
      message: `Your id: ${req.session.user_id}`,
      status: `${req.session.isAuthenticated}`,
    });
  }
}

export default MainController;
