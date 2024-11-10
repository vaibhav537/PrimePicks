"use client";
import { verifyToken } from "@/lib/utils/verifyToken";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Helper } from "../../lib/utils/HelperClient";

const Page = () => {
  const router = useRouter();
  const helper: Helper = new Helper();
  const tokenExpiredMsg: string = "Sessions Expired!";

  useEffect(() => {
    const verifyAndRedirect = async () => {
      const token = localStorage.getItem("adminToken") || "";
      const isTokenValid = await verifyToken(token);

      if (isTokenValid) {
        router.push("admin/dashboard");
      } else {
        helper.showErrorMessage(tokenExpiredMsg);
        localStorage.removeItem("adminToken");
        router.push("admin/login");
      }
    };

    verifyAndRedirect();
  }, [router]); // Run only once on mount

  return null;
};

export default Page;
