import { JwtPayload } from "./../../node_modules/@types/jsonwebtoken/index.d";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import config from "../config";

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req?.headers.authorization;
      if (!token) {
        throw new Error("Unauthorized Access!!");
      }
      const decoded = jwt.verify(token, config.jwt_secret!) as JwtPayload;

      if (roles?.length && !roles.includes(decoded?.role)) {
        throw new Error("Unauthorized Access!!");
      }
      req.user = decoded;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
