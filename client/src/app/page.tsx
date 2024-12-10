"use client";

import useTokenChecker from "../hooks/useTokenChecker";
import { useEffect, useState } from "react";
import HomeComponent from "../components/home/Home";
import Loader from "@/components/Loader";
import { Helper } from "@/lib/utils/HelperClient";

export default function Home() {
  const [token, setToken] = useState<string>("");
  const [isMounted, setIsMounted] = useState(false); // Track component mount status
  const helper = new Helper();

  useEffect(() => {
    const fetchedToken = localStorage.getItem("accessToken") || "";
    setToken(fetchedToken);
    setIsMounted(true); // Mark as mounted
  }, []);

  const { isValid, tokenData } = useTokenChecker(token);
  useEffect(() => {
    if (!isValid) {
      helper.showErrorMessage("SESSION EXPIRED!!");
    }
  }, [isValid]);

  // Render a loader until the component is mounted
  if (!isMounted) {
    return <Loader />;
  }

  return isValid ? <HomeComponent /> : <Loader />;
}
