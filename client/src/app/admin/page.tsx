"use client";
import { verifyToken } from "@/lib/utils/verifyToken";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    const verifyAndRedirect = async () => {
      const token = localStorage.getItem("adminToken") || "";
      const isTokenValid = await verifyToken(token);

      if (isTokenValid) {
        router.push("admin/dashboard");
      } else {
        localStorage.removeItem("adminToken");
        router.push("admin/login");
      }
    }; 

    verifyAndRedirect();
  }, [router]); // Run only once on mount

  return null;
};

export default Page;
