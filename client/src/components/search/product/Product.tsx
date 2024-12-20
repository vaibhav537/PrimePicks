import { useAppStore } from "@/app/store/store";
import { encrypter } from "@/lib/utils/crypto";
import { Helper } from "@/lib/utils/HelperClient";
import { ProductType } from "@/lib/utils/types";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

const Product = ({ productData }: { productData: ProductType }) => {
  const router: AppRouterInstance = useRouter();
  const helper: Helper = new Helper();
  const { addToCart } = useAppStore();
  const handleClick = () => {
    const encryptedProductID = encrypter(productData.id);
    router.push(`/product/${encryptedProductID}`);
  };
  const [deliveryDate] = useState(helper.getRandomDateInNext7Days());
  return (
    <div className="flex gap-4 cursor-pointer items-center w-full ">
      <div
        className="bg-gray-100 h-72 w-96 flex items-center justify-center rounded "
        onClick={handleClick}
      >
        <div className="relative h-44 w-64">
          <Image src={productData.images[0]} fill alt="ProductImage" />
        </div>
      </div>
      <div className="w-full">
        <div onClick={handleClick}>
          <h3 className="text-pp-dark hover:text-pp-primary transition-all duration-300">
            <strong className="font-medium">{productData.title}</strong>
          </h3>
          <div className="flex items-center gap-2">
            <div className="flex gap-1 items-center">
              <span className="font-medium">
                <div className="text-yellow-400 flex">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <FaStar key={num} />
                  ))}
                </div>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="text-2xl font-semibold ">
              &#x20B9; {productData.discountedPrice}
            </div>
            <div className="text-gray-600 font-medium">
              List Price:
              <span className="line-through">
                &#x20B9; {+productData.titlePrice}
              </span>
            </div>
          </div>
          <div className="text-sm mb-1 ">Save extra with no cost EMI</div>
          <div className="text-sm mb-1 ">Get it by {deliveryDate}</div>
          <ul className="flex gap-1">
            {productData.colors.map((color) => (
              <li
                className="h-5 w-5 rounded-full"
                style={{ backgroundColor: color }}
                key={color}
              ></li>
            ))}
          </ul>
        </div>

        <div className="flex gap-2 w-full">
          <button
            className="bg-pp-secondary hover:bg-pp-secondary transition-all duration-300 text-white rounded flex px-3 py-2 gap-10 font-bold w-52 items-center justify-center my-3"
            onClick={() =>
              addToCart(productData.id, productData.discountedPrice)
            }
          >
            Add to Cart
          </button>
          <button
            className="bg-pp-blue hover:bg-[#019bcf] transition-all duration-300 text-white rounded flex px-3 py-2 gap-10 font-bold w-52 items-center justify-center my-3"
            onClick={() => {
              addToCart(productData.id, productData.discountedPrice);
              router.push("/cart");
            }}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;
