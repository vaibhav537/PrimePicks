import { Request, Response, NextFunction } from "express";
import * as dotenv from "dotenv";
import jwt from "jsonwebtoken";
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

export const authenticateToken = (
  req: AuthenticateRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];  // Extract token from Authorization header
  const helper = new HELPER();

  if (!token) {
    // Send a response if the token is missing, but do NOT return the response
    res.status(401).json({ message: "Access denied" });
    return;  // Terminate the middleware execution
  }

  // Using jwt.verify to validate the token with a callback
  jwt.verify(token, key, (err, user: any) => {
    if (err) {
      // Send a response if the token is invalid, but do NOT return the response
      res.status(403).json({ message: "Forbidden: Invalid Token" });
      return;  // Terminate the middleware execution
    }

    // Attach the user to the req object if the token is valid
    req.user = { id: user.id };

    // Proceed to the next middleware or route handler
    next();
  });
};