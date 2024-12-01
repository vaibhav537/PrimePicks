import React from "react";
import { ProductType } from "../page";
import Image from "next/image";

const Product = ({ productData }: { productData: ProductType }) => {
  return (
    <div className="flex gap-10 bg-gray-100 p-10 items-center rounded-sm">
      <div className="relative h-24  w-24">
        <Image src={productData.images[0]} fill alt="product" />
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-lg">{productData.title}</h3>
      </div>
      <div className="w-16 text-center">
        {" "}
        <strong>{productData.discountedPrice}</strong>
      </div>
    </div>
  );
};

export default Product;
