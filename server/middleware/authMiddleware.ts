import { Request, Response, NextFunction } from "express";
import * as dotenv from "dotenv";
import jwt from "jsonwebtoken";
import pool from "../connection/dbConnection";
import { HELPER } from "../src/Resources";

dotenv.config();

const key: string = process.env.JWTKEY || "fall-back-key";

interface JwtPayload {
  id: number;
}

export interface AuthenticateRequest extends Request {
  user?: {
    id: number;
  };
}

export const authenticateToken = async (
  req: AuthenticateRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  const helper = new HELPER();

  if (!token) {
    return res.status(401).json({ message: "Access denied" });
  }

  try {
    jwt.verify(token, key, (err, user: any) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden: Invalid Token" });
      }
      req.user = { id: user.id };
      next();
    });
  } catch (error) {
    console.error(error);
    return res.status(403).json({ message: "Token is invalid or expired." });
  }
};
