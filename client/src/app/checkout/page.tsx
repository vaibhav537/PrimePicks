"use client";
import React, { useEffect, useState } from "react";
import { useAppStore } from "../store/store";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Helper } from "@/lib/utils/HelperClient";
import { createOrder } from "@/lib/api/orders";

const stripePromise = loadStripe(
  "pk_test_51BTUDGJAJfZb9HEBwDg86TN1KNprHjkfipXmEDMb0gSCassK5T3ZfxsAbcgKVmAIXF7oZ6ItlZZbXO6idTHE67IM007EwQ4uN3"
);
const Page = () => {
  const [clientSecret, setClientSecret] = useState<string>("");
  const { orderInfo, emptyCart } = useAppStore();
  const router = useRouter();
  const helper = new Helper();
  const [isCod, setIsCod] = useState<boolean>(false);
  const [orderCreated, setOrderCreated] = useState<boolean>(false);

  useEffect(() => {
    const handleCreateOrder = async () => {
      const response = await createOrder(orderInfo);
      if (orderInfo?.paymentIntent === "Stripe" && response?.client_secret) {
        setClientSecret(response?.client_secret);
      }
      setOrderCreated(true);
    };
    if (orderInfo) {
      handleCreateOrder();
      emptyCart();
      if (orderInfo.paymentIntent === "cash-on-delivery") {
        setIsCod(true);
      }
    } else {
      helper.showInfoMessage("Please add product in cart");
      router.push("/");
    }
  }, [orderInfo, emptyCart, router]);
  const appereance = {};
  const options = {};
  return (
    <div>
      {" "}
      <button onClick={() => helper.showInfoMessage("This is a information")}>
        BUTTON
      </button>{" "}
      Page
    </div>
  );
};

export default Page;
