import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export function Validate(schema: Joi.ObjectSchema) {
  return function (
    target: any,
    property: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      try {
        await schema.validateAsync(req.body);
      } catch (error) {
        console.error(error);
        res.status(422).json(error);
      }
      return originalMethod.call(this, req, res, next);
    };
    return descriptor;
  };
}
