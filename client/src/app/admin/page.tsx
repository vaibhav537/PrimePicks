"use client";
import Side from "@/components/admin/sidebar";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Sidebar } from "react-pro-sidebar";

const page = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("admin/dashboard");
  });
  return null;
};

export default page;
