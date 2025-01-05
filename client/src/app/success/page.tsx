"use client";
import { recordStripePayment } from "@/lib/api/orders";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

const Success = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentIntent = searchParams.get("payment_intent");
  useEffect(() => {
    const updateOrderInfo = async () => {
      const response = await recordStripePayment(paymentIntent as string);
      return response;
    };
    if (paymentIntent) {
      updateOrderInfo();
      setTimeout(() => {
        router.push("/my-orders");
      }, 3000);
    }
  }, []);

  return (
    <div className="h-[80vh] flex items-center px-20 pt-20 flex-col">
      <h1 className="text-4xl text-center">
        <span className="font-bold">Payment Successful.</span> You are being
        redirected to the orders page.
      </h1>
      <h1 className="text-4xl text-center">Please don't close the page.</h1>
    </div>
  );
};

export default Success;
