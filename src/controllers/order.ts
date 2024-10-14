import { Request, Response } from "express";
import { Controller } from "../decorator/controller";
import { Route } from "../decorator/route";
import prisma from "../lib/prismaClients";
import { auth } from "../middlewares/ensureAuth";
import { Status } from "@prisma/client";
import type { OrderItem } from "@prisma/client";

type OrderData = OrderItem & {
  total_price: number;
};

@Controller("/order")
class OrderController {
  @Route("post", "/add", auth)
  async addOder(req: Request, res: Response) {
    const data: OrderData = req.body;
    const id = req.session.user_id as string;
    if (!data) {
      throw new Error("required data not provided");
    }
    const productData = await prisma.product.findUnique({
      where: {
        id: Number(data.product_id),
      },
    });
    if (!productData) {
      throw new Error("Cannot find prodcut with current id");
    }
    const product_price = productData.price;
    const price = product_price * data.quantity;
    try {
      const addingResult = await prisma.order.upsert({
        where: {
          id: data.order_id || "",
          user_id: id || "",
        },
        update: {
          user_id: id,
          status: Status.PENDING,
          total_price: {
            increment: price,
          },
          oder_items: {
            create: {
              product_id: Number(data.product_id),
              quantity: Number(data.quantity),
            },
          },
        },
        create: {
          user_id: id,
          status: Status.PENDING,
          total_price: price,
          oder_items: {
            create: {
              product_id: Number(data.product_id),
              quantity: Number(data.quantity),
            },
          },
        },
      });
      // RESPONSING
      req.session.order_id = addingResult.id;
      res.status(200).json({
        message: "Order placed succesfully",
        data: addingResult,
      });
    } catch (error) {
      res.status(400).json({
        message: "Cannot place order",
        error,
      });
    }
  }
  @Route("get", "/", auth)
  async getAllOrderIts(req: Request, res: Response) {
    const id = req.session.user_id;
    try {
      const gettingResult = await prisma.order.findMany({
        where: {
          user_id: id,
        },
        include: {
          oder_items: true,
        },
      });
      res.status(200).json({
        data: gettingResult,
      });
    } catch (error) {
      res.status(200).json({
        message: "Cannot get orders",
        error,
      });
    }
  }
  @Route("delete", "/item/:id", auth)
  async deleteOrderItem(req: Request, res: Response) {
    const id = req.params.id;
    try {
      const deleteResult = await prisma.orderItem.delete({
        where: {
          id,
        },
      });
      res.status(200).json({
        message: "Deleted succesfully",
        result: deleteResult,
      });
    } catch (error) {
      res.status(402).json({
        message: "cannot detete order item",
      });
    }
  }
  @Route("delete", "/item/:id", auth)
  async deleteOrder(req: Request, res: Response) {
    const id = req.params.id;
    try {
      const deleteResult = await prisma.order.delete({
        where: {
          id,
        },
      });
      res.status(200).json({
        message: "Deleted succesfully",
        result: deleteResult,
      });
      req.session.order_id = null;
    } catch (error) {
      res.status(402).json({
        message: "cannot detete order item",
      });
    }
  }
	@Route("post","/complete/:id",auth)
	async completeOrder(req: Request, res: Response){
		const id = req.params.id;
	}
}

export default OrderController;
