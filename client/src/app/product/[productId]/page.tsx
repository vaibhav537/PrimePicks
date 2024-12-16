"use client";
import { Colors, ImageSlider, PaymentInfo, TrustSlider, Variants } from "@/components/product/index";
import { getProductByID } from "@/lib/api/product";
import { decrypter } from "@/lib/utils/crypto";
import { ProductType } from "@/lib/utils/types";
import React, { useEffect, useState } from "react";
import { FaCaretDown, FaStar } from "react-icons/fa";

const Product = ({
  params: { productId },
}: {
  params: { productId: string };
}) => {
  const [productDetails, setProductDetails] = useState<ProductType | undefined>(
    undefined
  );
  useEffect(() => {
    const getData = async () => {
      try {
        const decodedProductID = decrypter(productId);
        if (decodedProductID !== null) {
          const response = await getProductByID(decodedProductID, true);
          if (response?.status === true) {
            setProductDetails(response.data);
          }
        }
      } catch (err) {
        console.log(err);
      }
    };
    getData();
  }, [productId]);

  return (
    <div className="mt-5 mx-10">
      {productDetails && (
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: "50% 25% 25%" }}
        >
          <ImageSlider/>
          <div>
            {" "}
            <div className="font-semibold text-2xl">
              <h4>{productDetails.title}</h4>
              <div className="flex items-center gap-2">
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
                </div>
              </div>
              <div className="border-y border-y-gray-300 py-2 my-2">
                <div className="flex gap-2 mt-2 flex-col">
                  <div className="flex gap-2 items-center">
                    <div className="text-2xl font-semibold">
                      &#x20B9; {productDetails.discountedPrice}
                    </div>
                    <div className="text-gray-600 text-base font-medium ">
                      List Price:
                      <span className="line-through">
                        &#x20B9; {productDetails.titlePrice}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h6 className="text-sm">Inclusive of all taxes</h6>
                    <div className="flex gap-3 items-center">
                      <h6 className="text-sm">No Cost EMI available</h6>
                      <h6 className="text-xs flex text-pp-blue underline items-center cursor-pointer">
                        EMI Options <FaCaretDown />
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <TrustSlider />
            <Colors  colors = {productDetails.colors}/>
            <Variants variants = {productDetails.variants}/>
            <div className="mt-3">
              <h5 className="text-sm font-semibold">About this item</h5>
              <ul className="text-sm flex flex-col gap-1 list-disc pl-3">
                {productDetails.description.map((stat) => (
                  <li key={stat}>{stat}</li>
                ))}
              </ul>
            </div>
          </div>
          <PaymentInfo/>
        </div>
      )}
    </div>
  );
};

export default Product;
