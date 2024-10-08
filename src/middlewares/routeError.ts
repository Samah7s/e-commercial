import { Request, Response, NextFunction } from "express";

export function routeError(req: Request, res: Response, next: NextFunction) {
  const error = new Error("Route not found");

  console.error(error);
  return res.status(404).json({ error: error.message });
}
