"use client";
import React, { useEffect, useRef, useState } from "react";
import { useAppStore } from "../store/store";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Helper } from "@/lib/utils/HelperClient";
import { createOrder } from "@/lib/api/orders";
import { CheckoutFrom } from "@/components/checkout/index";
import { Elements } from "@stripe/react-stripe-js";
import Link from "next/link";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
const Page = () => {
  const [clientSecret, setClientSecret] = useState<string>("");
  const { orderInfo, emptyCart } = useAppStore();
  const router = useRouter();
  const helper = new Helper();
  const [isCod, setIsCod] = useState<boolean>(false);
  const [orderCreated, setOrderCreated] = useState<boolean>(false);
  const effectRun = useRef(false);
  useEffect(() => {
    if (effectRun.current) return;
    effectRun.current = true
    console.log("useEffect triggered", { orderInfo, orderCreated });
    const handleCreateOrder = async () => {
      if (orderCreated) return; // Prevent multiple order creations
      console.log("CREATE ORDER CALLED");
      const response = await createOrder(orderInfo);
      console.log("Order response:", response);
      if (orderInfo?.paymentIntent === "Stripe" && response?.client_secret) {
        setClientSecret(response?.client_secret);
      }
      if (!orderCreated) {
        setOrderCreated(true);
      }
    };
    if (orderInfo) {
      handleCreateOrder();
      if (orderInfo.paymentIntent === "cash-on-delivery") {
        setIsCod(true);
        emptyCart();
      }
    } else {
      helper.showInfoMessage("Please add product in cart");
      router.push("/");
    }
  }, [orderInfo, emptyCart]);
  const appereance = {};
  const options = {};
  return (
    <div>
      {orderCreated && (
        <>
          {!isCod &&
            clientSecret.length > 0 &&
            (console.log("Rendering Elements with clientSecret:", clientSecret),
            (
              <Elements
                stripe={stripePromise}
                options={{ clientSecret, appearance: { theme: "stripe" } }}
              >
                <CheckoutFrom clientSecret={clientSecret}></CheckoutFrom>
              </Elements>
            ))}
          {isCod && (
            <h2 className="flex items-center justify-center h-[80vh] w-full text-3xl gap-2">
              <span>Order Created Successfully.</span>
              <Link className="underline" href={"/my-orders"}>
                View orders.
              </Link>
            </h2>
          )}
        </>
      )}
    </div>
  );
};

export default Page;
