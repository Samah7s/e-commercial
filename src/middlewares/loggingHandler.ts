import { Request, Response, NextFunction } from "express";

export default function (req: Request, res: Response, next: NextFunction) {
  console.log(
    `Incoming - METHOD: [${req.method}] - URL:[${req.url}] - IP: [${req.socket.remoteAddress}]`
  );

  res.on("finish", () => {
    console.log(
      `Incoming - METHOD: [${req.method}] - URL:[${req.url}] - IP: [${req.socket.remoteAddress}]`
    );
  });
	next();
}
