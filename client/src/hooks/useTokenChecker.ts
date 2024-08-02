// hooks/useTokenChecker.ts
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import jwt, { JwtPayload } from "jsonwebtoken";
import { verifyToken, isTokenExpired } from "../lib/utils/verifyToken";

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
        throw new Error("Cannot Get Token");
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

    const intervalId = setInterval(checkToken, 10000);
    checkToken();

    return () => clearInterval(intervalId);
  }, [token, router]);

  return { isValid: isTokenValid, tokenData };
};

export default useTokenChecker;
