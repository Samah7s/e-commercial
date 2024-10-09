import { Request, Response, NextFunction } from "express";

function testMiddleware(req: Request, res: Response, next: NextFunction) {
  console.log("Test passed succesfully");
  next();
}

export default testMiddleware;
