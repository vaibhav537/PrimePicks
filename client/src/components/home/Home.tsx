"use client";

import { useEffect, useState } from "react";
import HomeCarousels from "./HCarousels";
import Loader from "@/components/Loader";
import { allProducts } from "@/lib/api/product";
import { Helper } from "@/lib/utils/HelperClient";
import HomeCards from "./HCard";
import ProductsGrid from "./ProductsGrid";
import AppleCards from "../AppleCards";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [isMounted, setIsMounted] = useState(false); // Track component mount status
  const helper = new Helper();

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await allProducts();
      if (response?.status === true) {
        setProducts(response.data);
      } else {
        helper.showErrorMessage("Failed to fetch products!");
      }
    };

    setIsMounted(true);
    fetchProducts();
  }, []);

  const getProducts = (rangeFrom: number, rangeTo: number) => {
    const clonedProducts = [...products];
    return clonedProducts.splice(rangeFrom, rangeTo);
  };

  // Render loader until component mounts
  if (!isMounted) {
    return <Loader />;
  }

  return (
    <main className="flex flex-col gap-10 mb-10">
      <HomeCarousels />
      <ProductsGrid
        title="Related to items you've viewed"
        products={getProducts(0, 5)}
      />
      <AppleCards />
      <ProductsGrid
        title="Inspired by shopping trends"
        products={getProducts(5, 5)}
      />
      <HomeCards />
      <ProductsGrid
        title="Your shopping history"
        products={getProducts(10, 5)}
      />

    </main>
  );
}
