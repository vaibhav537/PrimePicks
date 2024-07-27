"use client";
import useTokenChecker from "../hooks/useTokenChecker";
import { useEffect, useState } from "react";
import HomeComponent from "../components/Home";

export default function Home() {
  const [token, setToken] = useState<string>("accessToken");

  useEffect(() => {
    const fetchedToken = localStorage.getItem("accessToken") || "";
    setToken(fetchedToken);
  }, []);
  const { isValid, tokenData } = useTokenChecker(token);
  return isValid ? <HomeComponent /> : <div className="">PLEASE SIGNUP</div>;
}
