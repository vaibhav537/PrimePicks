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

export interface CustomRequest extends Request {
  user?: {
    id: number;
    username: string;
    email: string;
    firstname: string;
    lastname: string;
    isadmin: boolean;
  };
}

export const authenticateToken = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  const helper = new HELPER();

  if (!token) {
    return res.status(401).json({ message: "Access denied" });
  }

  try {
    const decoded = jwt.verify(token, key) as JwtPayload;
    const result = await pool.query(helper.authQuery, [decoded.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }
    req.user = result.rows[0];
    next();
  } catch (error) {
    console.error(error);
    return res.status(403).json({ message: "Token is invalid or expired." });
  }
};
