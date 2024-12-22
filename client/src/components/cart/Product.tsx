import { useAppStore } from "@/app/store/store";
import { ProductType } from "@/lib/utils/types";
import Image from "next/image";
import React from "react";
import { FaTrash } from "react-icons/fa6";

const Product = ({ productData }: { productData: ProductType }) => {
  const {
    increaseQuantity,
    decreaseQuantity,
    getQuantityByID,
    getTotalAmount,
    removeFromCart,
  } = useAppStore();
  return (
    <div className="flex gap-10 bg-gray-100 p-10 rounded-sm items-center">
      <div>
        <input
          id="default-checkbox"
          type="checkbox"
          value=""
          className="w-4 h-4 text-pp-primary bg-gray-100 border-gray-300 rounded focus:ring-pp-primary accent-pp-primary transition-all duration-500"
        />
      </div>
      <div className="relative h-24 w-24">
        <Image src={productData.images[0]} fill alt="Product Image" />
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-lg">{productData.title}</h3>
        <div className="flex gap-5 text-sm mt-2">
          <div className="flex gap-1">
            <span>Color: </span>
            <span className="font-bold">Titanium White</span>
          </div>
          <div>
            <span>Variant: </span>
            <span className="font-bold ">{productData.variants[0]}</span>
          </div>
        </div>
      </div>
      <div className="flex gap-5 font-bold">
        <span
          className="cursor-pointer"
          onClick={() => increaseQuantity(productData.id)}
        >
          +
        </span>
        <span>{getQuantityByID(productData.id)}</span>
        <span
          className="cursor-pointer"
          onClick={() => decreaseQuantity(productData.id)}
        >
          -
        </span>
      </div>
      <div className="w-16 text-center">
        <strong>
          {" "}
          &#x20B9;{" "}
          {productData.discountedPrice * getQuantityByID(productData.id)}
        </strong>
      </div>
      <div
        className="cursor-pointer"
        onClick={() => removeFromCart(productData.id)}
      >
        <FaTrash />
      </div>
    </div>
  );
};

export default Product;
