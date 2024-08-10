"use client"
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { usePathname } from "next/navigation";
import React from "react";

const ClientStoreLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  return !pathname.includes("login") && !pathname.includes("signup") ? (
    <div className="flex flex-col min-h-[100vh]">
      <Navbar />
      <main className="flex-1 min-h-[100vh]">{children}</main>
      <Footer/>
    </div>
  ) : (
    children
  );
};

export default ClientStoreLayout;
