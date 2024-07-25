// components/TokenCheckerComponent.tsx
import React from "react";
import useTokenChecker from "./verifyToken";
import { useRouter } from "next/router";

const TokenCheckerComponent = ({ token }) => {
  const isTokenValid = useTokenChecker(token);
  const router = useRouter();
  const removeUser = () => {
    localStorage.clear();
    router.push("/");
    return false;
  };
  return isTokenValid ? true : removeUser();
};

export default TokenCheckerComponent;
