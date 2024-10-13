import { Request, Response } from "express";
import { Controller } from "../decorator/controller";
import { Route } from "../decorator/route";
import prisma from "../lib/prismaClients";
import { auth } from "../middlewares/ensureAuth";

@Controller("/order")
class OrderController {
  @Route("post", "/")
  async addOder(req: Request, res: Response) {}
  @Route("get", "/:id")
  async getOrder(req: Request, res: Response) {}
  //@Route("get","/")
  // async getAllOrderIts(req:Request, res:Response){

  // }

  @Route("delete", "/:id")
  async deleteOrder(req: Request, res: Response) {}
}

export default OrderController;
