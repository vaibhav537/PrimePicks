"use server";
import jwt from "jsonwebtoken";
import { useEffect, useState } from "react";

export const verifyToken = (token: string): jwt.JwtPayload | null => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWTKEY || "JWT_FALLBACK_SECRET"
    ) as jwt.JwtPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};

const useTokenChecker = (token: string): boolean => {
  const [isTokenValid, setIsTokenValid] = useState<boolean>(true);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const decodedToken = verifyToken(token);
      setIsTokenValid(!!decodedToken);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [token]);

  return isTokenValid;
};

export default useTokenChecker;
