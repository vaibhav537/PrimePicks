"use client";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ProductType } from "@/lib/utils/types";
import { verifyToken } from "@/lib/utils/verifyToken";
import { clientTokenName } from "@/lib/utils/HelperClient";
import { getSearchResults } from "@/lib/api/search";
import { Filters } from "@/components/search/filters";
import Product from "@/components/search/product/Product";

const Search = () => {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("query");
  const category = searchParams.get("category");
  const [products, setProducts] = useState<ProductType[]>([]);
  useEffect(() => {
    const getProducts = async () => {
      const response = await getSearchResults(
        searchTerm as string,
        category ?? ""
      );
      setProducts(response.data || []);
    };

    if (
      searchTerm ||
      category ||
      verifyToken(localStorage.getItem(clientTokenName) || "")
    ) {
      getProducts();
    }
  }, [searchTerm, category]);

  return (
    <div className="grid mt-5 " style={{ gridTemplateColumns: "15% 85%" }}>
      <Filters />
      <div className="">
        <div className="">
          <h3 className="mb-3">
            <strong className="font-semibold">Results</strong>
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-10 pb-10">
          {products.map((product) => (
            <Product key={product.id} productData={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;
