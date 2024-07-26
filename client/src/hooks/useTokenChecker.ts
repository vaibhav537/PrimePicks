// hooks/useTokenChecker.ts
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";
import { verifyToken, isTokenExpired } from "../lib/utils/verifyToken";

const useTokenChecker = (
  token: string
): { isValid: boolean; tokenData: jwt.JwtPayload | null } => {
  const [isTokenValid, setIsTokenValid] = useState<boolean>(true);
  const [tokenData, setTokenData] = useState<jwt.JwtPayload | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkToken = () => {
      const decodedToken = verifyToken(token);
      const tokenExpired = isTokenExpired(token);

      if (decodedToken && !tokenExpired) {
        setIsTokenValid(true);
        setTokenData(decodedToken);
      } else {
        setIsTokenValid(false);
        setTokenData(null);
        localStorage.removeItem("accessToken");
        router.push("/");
      }
    };

    const intervalId = setInterval(checkToken, 1000);
    checkToken(); // Check token immediately on mount

    return () => clearInterval(intervalId);
  }, [token, router]);

  return { isValid: isTokenValid, tokenData };
};

export default useTokenChecker;