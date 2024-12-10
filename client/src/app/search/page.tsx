import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { ProductType } from "@/lib/utils/types";

const Search = () => {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("query");
  const category = searchParams.get("category");
  const [products, setProducts] = useState<ProductType[]>([]);
  return <div>Search</div>;
};

export default Search;
