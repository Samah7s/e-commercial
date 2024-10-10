import { Request, Response } from "express";
import { Controller } from "../decorator/controller";
import { Route } from "../decorator/route";
import prisma from "../lib/prismaClients";
import { auth } from "../middlewares/ensureAuth";
import { Validate } from "../decorator/validate";
import Joi from "joi";
import type { Product } from "@prisma/client";

const productDataValidation = Joi.object({
  name: Joi.string().required(),
  url: Joi.string().required(),
  description: Joi.string(),
  price: Joi.number().required(),
});

@Controller("/products")
class ProductController {
  @Route("post", "/add", auth)
  @Validate(productDataValidation)
  async addProduct(req: Request, res: Response) {
    const { name, url, description, price } = req.body;
    try {
      const result = await prisma.product.create({
        data: {
          name,
          url,
          description,
          price: Number(price),
        },
      });
      res.status(200).json({
        message: "Product added succesfully",
        data: result,
      });
    } catch (error) {
      res.status(404).json({
        error,
      });
    }
  }
  @Route("put", "/:id", auth)
  @Validate(productDataValidation)
  async updateProduct(req: Request, res: Response) {
    const data: Pick<Product, "name" | "description" | "price" | "url"> =
      req.body;
    const id = Number(req.params.id);
    try {
      if (!data) {
        throw new Error("Required data not provided");
      }
      const result = await prisma.product.update({
        where: {
          id,
        },
        data: {
          name: data.name,
          price: Number(data.price),
          description: data.description,
          url: data.url,
        },
      });
      res.status(200).json({
        message: "Product data updated successfully",
        data: result,
      });
    } catch (error) {
      res.status(404).json({
        message:
          "Something gone wrong while updating, please check your values",
        error: error,
      });
    }
  }
  @Route("get", "/:id", auth)
  async getProduct(req: Request, res: Response) {
    const id = Number(req.params.id);
    try {
      const productData = await prisma.product.findUnique({
        where: {
          id,
        },
      });
      console;
      if (!productData) {
        throw new Error("Bad credentials for product data");
      }
      res.status(200).json({
        message: "Product data recieved successfully",
        data: productData,
      });
    } catch (error) {
      res.status(404).json({
        message: "Something gone wrong",
        error: error,
      });
    }
  }
  @Route("delete", "/:id", auth)
  async deleteProduct(req: Request, res: Response) {
    const id = Number(req.params.id);
    try {
      const result = await prisma.product.delete({
        where: {
          id,
        },
      });
      res.status(200).json({
        message: "Produc deleted successfully",
        result: result,
      });
    } catch (error) {}
  }
}

export default ProductController;
