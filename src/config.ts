import { Secret } from "jsonwebtoken";

const config = {
  dev: process.env.NODE_ENV === "development",
  test: process.env.NODE_ENV === "test",
  port: process.env.PORT || 3000,
  session_secret: process.env.SESSION_SECRET,
  access_secret: process.env.ACCESS_TOKEN_SECRET as Secret,
  refresh_secret: process.env.REFRESH_TOKEN_SECRET as Secret,
};

export default config;
