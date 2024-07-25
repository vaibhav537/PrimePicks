// components/TokenCheckerComponent.tsx
import React from "react";
import useTokenChecker from "./verifyToken";
import { useRouter } from "next/router";

const TokenCheckerComponent = ({ token }) => {
  const isTokenValid = useTokenChecker(token);
  const router = useRouter();
  const removeUser = () => {
    router.push("/");
  };
  return isTokenValid ? removeUser() : true;
};

export default TokenCheckerComponent;
