"use client";
import CategoryList from "@/components/admin/categoryList";
import Loader from "@/components/Loader";
import { allCategory } from "@/lib/api/category";
import React, { useEffect, useState } from "react";

const page = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [categoryBoolean, setCategoryBoolean] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await allCategory();
      setCategoryData(response?.data);
      setCategoryBoolean(response?.status ?? false);
    };
    fetchData();
  }, []);
  return (
    <div>
      {categoryBoolean ? (
        <CategoryList categories={categoryData} />
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default page;
