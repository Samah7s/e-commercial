import { Request, Response } from "express";
import { Controller } from "../decorator/controller";
import { Route } from "../decorator/route";
import prisma from "../lib/prismaClients";
import { auth } from "../middlewares/ensureAuth";
import type { CartItem } from "@prisma/client";

@Controller("/cart")
class CartController {
  @Route("post", "/add", auth)
  async addCartItem(req: Request, res: Response) {
    const data: CartItem = req.body;
    if (!data) {
      throw new Error("Errro");
    }
    const id = req.session.user_id as string;
    const cart_id = req.session.cart_id as string;
    try {
      const cartItem = await prisma.cart.update({
        where: {
          id: cart_id,
          user_id: id,
        },
        data: {
          cart_items: {
            create: {
              product_id: Number(data.product_id),
              quantitiy: Number(data.quantitiy),
            },
          },
        },
      });

      res.status(200).json({
        message: "Item added to cart succesfully",
        data: cartItem,
      });
    } catch (error) {
      res.status(402).json({
        message: "Cannot add item to cart",
        error,
      });
    }
  }
  @Route("get", "/:id")
  async getCartItem(req: Request, res: Response) {
    const id = req.params.id;
    if (!id) {
      throw new Error("CartItem id not provided");
    }
    try {
      const requestedData = await prisma.cartItem.findUnique({
        where: {
          id: id,
        },
      });
      res.status(200).json({
        data: requestedData,
      });
    } catch (error) {}
  }
  @Route("get", "/")
  async getAllCartItems(req: Request, res: Response) {
    try {
      const requestedData = await prisma.cart.findFirst({
        where: {
          user_id: req.session.user_id,
        },
        include: {
          cart_items: true,
        },
      });
      res.status(200).json({
        data: requestedData,
      });
    } catch (error) {
      res.status(404).json({
        message: "Cannot get cartItems",
        error,
      });
    }
  }
  //Update route(add, your custom filed to update a cartItem)
  @Route("put", "/:id", auth)
  async updateCartItem(req: Request, res: Response) {
    const id = req.params.id;
    if (!id) {
      throw new Error("CartItem id not provided");
    }
    const data: CartItem = req.body;
    try {
      const updateResult = await prisma.cartItem.update({
        where: {
          id,
        },
        data: {
          quantitiy: data.quantitiy,
        },
      });
      res.status(204).json({
        message: "CartItem updated successfully",
        data: updateResult,
      });
    } catch (error) {
      res.status(404).json({
        message: "Cannot update the item",
        error,
      });
    }
  }
  @Route("delete", "/:id", auth)
  async deleteCartItem(req: Request, res: Response) {
    const id = req.params.id;
    try {
      const result = await prisma.cartItem.delete({
        where: {
          id: id,
        },
      });
      res.status(200).json({
        message: "Cart item removed succesfully",
        dbResponse: result,
      });
    } catch (error) {
      res.status(403).json({
        message: "Something gone wrong while deleting",
        error,
      });
    }
  }
}

export default CartController;
