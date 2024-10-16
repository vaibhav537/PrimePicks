"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const page = () => {
  const router = useRouter();
  useEffect(() => {
    if(localStorage.getItem("adminToken")){
    router.push("admin/dashboard");
    }
    else{
      router.push("admin/login");
    }
  });
  return null;
};

export default page;
