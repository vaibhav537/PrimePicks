"use client";
import jwt, { JwtPayload } from "jsonwebtoken";
import { useEffect, useState } from "react";

export const verifyToken = (token: string): JwtPayload | null => {
  try {
    console.log(process.env.JWTKEY);
    const decoded = jwt.verify(
      token,
      process.env.JWTKEY || "JWT_FALLBACK_SECRET"
    ) as JwtPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwt.decode(token) as JwtPayload;
    if (decoded && decoded.exp) {
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    }
    return true;
  } catch (error) {
    return true;
  }
};
