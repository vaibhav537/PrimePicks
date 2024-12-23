"use client";
import React, { useEffect, useState } from "react";
import { useAppStore } from "../store/store";
import { OrderType, ProductType } from "@/lib/utils/types";
import { getMultipleProductsDetails } from "@/lib/api/product";
import { Product } from "@/components/cart";
import { CgDanger } from "react-icons/cg";
import { useUserDetails } from "@/hooks/useAppStore";
import { useRouter } from "next/navigation";
const Cart = () => {
  const { cartProducts, getTotalAmount, setOrderInfo} = useAppStore();
  const { user } = useUserDetails();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [primeShipping, setPrimeShipping] = useState<boolean>(false);
  const [isCod, setIsCod] = useState<boolean>(false);
  const router = useRouter();
  useEffect(() => {
    const getData = async () => {
      const productIds = cartProducts.map((product) => product.id);
      const response: ProductType[] | undefined =
        await getMultipleProductsDetails(productIds);
      if (response) {
        setProducts(response);
      }
    };

    getData();
  }, [cartProducts]);

  const handleCheckoutRedirect = () => {
    const data:OrderType = {
      id:0,
      createdAt: "",
      updatedAt: "",
      products: products.map((product) =>Number(product.id)),
      users: (user?.id)?.toString() || "",
      status: {
        status: "pending",
      },
      paymentIntent: isCod ? "cash-on-delivery" : "Stripe",
      price: getTotalAmount() + (primeShipping ? 3400 : 0),
      paymentStatus: false
    };
    setOrderInfo(data)
    router.push("/checkout");
  };
  return (
    <div className="px-10 py-10">
      <h2 className="mb-10 text-3xl text-pp-dark">
        <strong>Shopping Cart</strong>
      </h2>
      {cartProducts.length > 0 ? (
        <div className="flex gap-10">
          <div className="w-3/4">
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-5">
                {products.map((product) => (
                  <Product key={product.id} productData={product} />
                ))}
              </div>
            </div>
            <div className="flex gap-1 mt-10 justify-between items-center">
              <div>
                <h4>
                  <strong>Choose Shipping</strong>
                </h4>
                <div className="flex gap-4 items-center justify-center mt-3">
                  <div className="flex">
                    <div className="flex gap-5 items-center h-5">
                      <input
                        type="radio"
                        name="shipping-method"
                        id="helper-radio"
                        aria-describedby="helper-radio-text"
                        value=""
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        onClick={() => setPrimeShipping(false)}
                        checked={!primeShipping}
                      />
                    </div>
                    <div className="ml-2 text-sm">
                      <label
                        className="font-medium text-gray-900 dark:text-gray-300"
                        htmlFor="helper-radio"
                      >
                        Free Shipping
                      </label>
                      <p
                        id="helper-radio-text"
                        className="text-xs font-normal text-gray-500 dark:text-gray-300"
                      >
                        Expected Delivery in 7 Days
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="flex items-center h-5">
                      <input
                        type="radio"
                        name="shipping-method"
                        id="helper-radio2"
                        aria-describedby="helper-radio-text"
                        value=""
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        onClick={() => setPrimeShipping(true)}
                        checked={primeShipping}
                      />
                    </div>
                    <div className="ml-2 text-sm">
                      <label
                        className="font-medium text-gray-900 dark:text-gray-300"
                        htmlFor="helper-radio2"
                      >
                        Prime Shipping (&#x20B9;3400 Extra)
                      </label>
                      <p
                        id="helper-radio-text"
                        className="text-xs font-normal text-gray-500 dark:text-gray-300"
                      >
                        Expected Delivery in 2 Days
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <h4>Subtotal ({cartProducts.length} item):</h4>
                <h4>
                  <strong>&#x20B9;{getTotalAmount()}</strong>
                </h4>
              </div>
            </div>
          </div>
          <div className="flex-1 bg-gray-100 p-10 h-max">
            <h5>
              <strong>{user?.firstname}, the last step remain!</strong>
            </h5>
            <div className="flex flex-col gap-2 my-5">
              <div className="flex">
                <div className="flex items-center h-5">
                  <input
                    id="stripe"
                    aria-describedby="payment-method-text"
                    type="radio"
                    value=""
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    name="payment-method"
                    onClick={() => setIsCod(false)}
                    checked={!isCod}
                  />
                </div>
                <div className="ml-2 text-sm">
                  <label
                    className="font-medium text-gray-900 dark:text-gray-300"
                    htmlFor="stripe"
                  >
                    Stripe
                  </label>
                </div>
              </div>
              <div className="flex">
                <div className="flex items-center h-5">
                  <input
                    id="cod"
                    aria-describedby="payment-method-text"
                    type="radio"
                    value=""
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    name="payment-method"
                    onClick={() => setIsCod(true)}
                    checked={isCod}
                  />
                </div>
                <div className="ml-2 text-sm">
                  <label
                    className="font-medium text-gray-900 dark:text-gray-300"
                    htmlFor="cod"
                  >
                    Cash on Delivery
                  </label>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1 my-5">
              <div className="flex gap-3 justify-between">
                <h4>Subtotal({cartProducts.length}):</h4>
                <h4>
                  <strong>&#x20B9;{getTotalAmount()}</strong>
                </h4>
              </div>
              <div className="flex gap-3 justify-between">
                <h4> Shipping ({primeShipping ? "Prime" : "Free"}):</h4>
                <h4>
                  <strong>&#x20B9;{primeShipping ? "3400" : "0"}</strong>
                </h4>
              </div>
              <div className="flex gap-3 justify-between">
                <h4>Total:</h4>
                <h4>
                  <strong>
                    &#x20B9;{getTotalAmount() + (primeShipping ? 3400 : 0)}
                  </strong>
                </h4>
              </div>
            </div>
            <button
              className="bg-pp-secondary hover:bg-pp-secondary transition-all duration-300 text-white rounded flex px-3 py-2 gap-10 font-bold w-52 items-center justify-center my-3"
              onClick={() => handleCheckoutRedirect()}
            >
              <span>Checkout</span>
              <span>
                &#x20B9;{getTotalAmount() + (primeShipping ? 3400 : 0)}
              </span>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-6 justify-center h-[50vh] text-5xl bg-pp-background font-bold">
          <CgDanger className="text-danger-400 text-[100px]" />
          <div>Cart is Empty</div>
        </div>
      )}
    </div>
  );
};

export default Cart;
