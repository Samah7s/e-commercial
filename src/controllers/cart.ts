import { Request, Response } from "express";
import { Controller } from "../decorator/controller";
import { Route } from "../decorator/route";
import prisma from "../lib/prismaClients";
import { auth } from "../middlewares/ensureAuth";
import type { CartItem } from "@prisma/client";

@Controller("/cart")
class CartController {
  @Route("post", "/", auth)
  async addItem(req: Request, res: Response) {
    const data: CartItem = req.body.data;
    if (!data) {
      throw new Error("Errro");
    }
    const id = req.session.user_id as string;
    try {
      const cart = await prisma.cart.upsert({
        where: {
          user_id: id,
        },
        update: {
          cart_items: {
            create: {
              product_id: data.product_id,
              quantitiy: data.quantitiy,
            },
          },
        },
        create: {
          user_id: id,
        },
      });
    } catch (error) {}
  }
}

export default CartController;
