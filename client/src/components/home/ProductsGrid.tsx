
import { encrypter } from "@/lib/utils/crypto";
import { Helper } from "@/lib/utils/HelperClient";
import { ProductType } from "@/lib/utils/types";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { FaStar } from "react-icons/fa";

const ProductsGrid = ({
  title,
  products,
}: {
  title: string;
  products: ProductType[];
}) => {
  console.log({ products });
  const helper: Helper = new Helper();
  const router: AppRouterInstance = useRouter();
  return (
    <div className="mx-20 flex flex-col gap-6">
      <div className="flex justify-between">
        <h4 className="font-semibold">{title}</h4>
        <h4 className="text-pp-primary cursor-pointer"> View All</h4>
      </div>
      <div className="grid grid-cols-5 gap-5">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex flex-col justify-center items-center cursor-pointer"
            onClick={() => router.push(`/product/${encrypter(product.id)}`)}
          >
            <div className="flex flex-col items-start">
              <div className="flex justify-center mb-2 relative h-40 w-64 ">
                <Image src={product.images[0]} fill alt="product" />
              </div>
              <h3 className="truncate w-64">{product.title}</h3>
              <div className="flex items-center flex-col gap-2">
                <div className="flex gap-1 items-center">
                  <span className="font-medium">
                    <div className="text-yellow-400 flex">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <FaStar key={num} />
                      ))}
                    </div>
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <div className="font-medium">
                    <span>&#x20B9;</span>
                    <span>{product.discountedPrice}</span>
                  </div>
                  <div className="text-[12px] mt-1 line-through">
                    <span>&#x20B9;</span>
                    <span>{product.titlePrice}</span>
                  </div>
                </div>
                <div className="text-sm">
                  Get it by {helper.getRandomDateInNext7Days()}
                </div>
                <div className="text-green-500 font-semibold capitalize">
                  in stock
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsGrid;
