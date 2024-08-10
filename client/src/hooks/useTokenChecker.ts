// hooks/useTokenChecker.ts
import { useEffect, useState } from "react";
import jwt, { JwtPayload } from "jsonwebtoken";
import { verifyToken, isTokenExpired } from "../lib/utils/verifyToken";
import { useRouter } from "next/navigation";
const callingInterval: number = 30000;

const useTokenChecker = (
  token: string
): { isValid: boolean; tokenData: JwtPayload | null } => {
  const [isTokenValid, setIsTokenValid] = useState<boolean>(true);
  const [tokenData, setTokenData] = useState<jwt.JwtPayload | null>(null);
  const router = useRouter();
  useEffect(() => {
    const checkToken = async () => {
      if (token === "accessToken") {
        token = localStorage.getItem("accessToken") || "null";
      }
      if (token === "null") {
        setIsTokenValid(false);
        setTokenData(null);
        console.error("Cannot Get Token");
      }
      const decodedToken = await verifyToken(token);
      const tokenExpired: boolean = await isTokenExpired(token);
      if (!tokenExpired) {
        setIsTokenValid(true);
        setTokenData(decodedToken);
      } else {
        setIsTokenValid(false);
        setTokenData(null);
        localStorage.removeItem("accessToken");
        router.push("/signup");
      }
    };

    const intervalId = setInterval(checkToken, callingInterval);
    checkToken();

    return () => clearInterval(intervalId);
  }, [token]);

  return { isValid: isTokenValid, tokenData };
};

export default useTokenChecker;
