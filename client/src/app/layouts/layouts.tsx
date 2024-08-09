"use client";
import React from "react";
import AdminLayout from "./admin-layout";
import { usePathname } from "next/navigation";
import ClientStoreLayout from "./client-store-layout";

const Layouts = ({ children }: { children: React.ReactNode }) => {
    const pathName = usePathname();
    return !pathName.includes("/admin")? <AdminLayout>{children}</AdminLayout>: <ClientStoreLayout>{children}</ClientStoreLayout>
};

export default Layouts;
