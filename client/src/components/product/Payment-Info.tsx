import { useAppStore } from "@/app/store/store";
import { Helper } from "@/lib/utils/HelperClient";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaLock } from "react-icons/fa6";

const PaymentInfo = ({
  data,
}: {
  data: { price: number; originalPrice: number; id: string };
}) => {
  const router = useRouter();
  const helper: Helper = new Helper();
  const { addToCart } = useAppStore();
  const [deliverDate] = useState<string>(helper.getRandomDateInNext7Days());

  return (
    <div className="p-5 m-2 ml-5 border-2 border-gray-200 rounded-sm min-h-[50%] h-max w-max">
      <h4 className="font-medium "> Price</h4>
      <div className="flex gap-2 items-center">
        <span className="font-medium text-red-500 ">&#x20B9; {data.price}</span>
        <span className="font-medium line-through text-xs">
          &#x20B9; {data.originalPrice}
        </span>
      </div>
      <div className="text-sm mt-2">Save extra with no cost EMI</div>
      <div className="text-sm"> Get it by {deliverDate}</div>
      <div className="text-green-500 font-semibold">In Stock</div>
      <button
        className="bg-pp-secondary hover:bg-pp-secondary transition-all duration-300 text-white rounded flex px-3 py-2 gap-10 font-bold w-52 items-center justify-center my-3"
        onClick={() => addToCart(data.id, data.price)}
      >
        Add to Cart
      </button>
      <button
        onClick={() => {
          addToCart(data.id, data.price);
          router.push("/cart");
        }}
        className="bg-pp-blue hover:bg-[#019bcf] transition-all duration-300 text-white rounded flex px-3 py-2 gap-10 font-bold w-52 items-center justify-center my-3"
      >
        Buy Now
      </button>
      <div className="flex gap-3 items-center text-gray-600">
        <FaLock />
        Secure Transaction
      </div>
    </div>
  );
};

export default PaymentInfo;
