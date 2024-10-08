import { Request, Response, NextFunction } from "express";

function corsHandler(req: Request, res: Response, next: NextFunction) {
  res.header("Access-Control-Origin", req.header("origin"));
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept,Authorization"
  );
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT,PATCH, DELETE");
    res.status(200).json({});
  }

  next();
}

export default corsHandler;
