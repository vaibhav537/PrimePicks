// hooks/useTokenChecker.ts
import { useEffect, useState } from "react";
import { verifyToken, isTokenExpired } from "../lib/utils/verifyToken";
import jwt from "jsonwebtoken";

const useTokenChecker = (
  token: string
): { isValid: boolean; tokenData: jwt.JwtPayload | null } => {
  const [isTokenValid, setIsTokenValid] = useState<boolean>(true);
  const [tokenData, setTokenData] = useState<jwt.JwtPayload | null>(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const decodedToken = verifyToken(token);
      const tokenExpired = isTokenExpired(token);
      setIsTokenValid(!!decodedToken && !tokenExpired);
      setTokenData(decodedToken);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [token]);

  return { isValid: isTokenValid, tokenData };
};

export default useTokenChecker;
