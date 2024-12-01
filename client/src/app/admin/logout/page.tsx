"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Page = () => {
  const router = useRouter();
  useEffect(() => {
    localStorage.clear();
    router.push("/admin");
  }, [router]);
  return null;
};

export default Page;
