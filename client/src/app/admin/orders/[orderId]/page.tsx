"use client";
import React, { useEffect, useState } from "react";
import { Product } from "./components";
import { getOrder, updateOrderPaymentStatus } from "@/lib/api/orders";
import { Button, Radio, RadioGroup } from "@nextui-org/react";
import { Helper } from "@/lib/utils/HelperClient";
import { verifyToken } from "@/lib/utils/verifyToken";
import { redirect, useRouter } from "next/navigation";
import { decrypter } from "@/lib/utils/crypto";

export interface ProductType {
  categoryId: string;
  colors: string[];
  createdAt: string;
  description: string[];
  discountedPrice: number;
  id: string;
  images: string[];
  salePrice: number;
  title: string;
  updatedAt: string;
  variants: string[];
}

interface Status {
  status: string;
}

interface User {
  id: string;
  email: string;
  usernames: string;
}

interface Order {
  createdAt: string;
  orderId: string;
  paymentintent: string;
  paymentStatus: boolean;
  price: number;
  status: Status;
  updatedAt: string;
  user: User;
  products: ProductType[];
}

const Page = ({ params: { orderId } }: { params: { orderId: string } }) => {
  const [order, setOrder] = useState<Order | undefined>(undefined);
  const [paymentStatus, setPaymentStatus] = useState<"completed" | "pending">(
    "pending"
  );
  const router = useRouter();
  const helper = new Helper();
  const decodedID = decrypter(orderId);
  const token = localStorage.getItem(helper.tokenName);
  useEffect(() => {
    const getData = async () => {
      if (decodedID) {
        if (!token || !(await verifyToken(token))) redirect("/admin");
        const response = await getOrder(decodedID);
        setOrder(response?.data[0]);
        setPaymentStatus(
          response?.data[0].paymentStatus ? "completed" : "pending"
        );
      } else {
        setOrder(undefined);
      }
    };

    if (orderId) {
      getData();
    }
  }, [orderId]);

  const updatePaymentStatus = async () => {
    if (!decodedID) {
      helper.showErrorMessage(
        "Decoded ID is null. Cannot update payment status."
      );
      return;
    }
    if (!token || !(await verifyToken(token))) router.push("/admin");
    const response = await updateOrderPaymentStatus(
      paymentStatus === "completed" ? true : false,
      decodedID
    );
    if (response.status === 200) {
      setOrder({
        ...(order as Order),
        paymentStatus: paymentStatus === "completed" ? true : false,
      });
      helper.showSuccessMessage("Order Status updated.");
    }
  };

  console.log(order);
  return (
    <div>
      {order && (
        <div className="p-10">
          <h2 className="mb-10 text-3xl text-pp-dark">
            <strong>Order Summary</strong>
          </h2>
          <div className="flex gap-10">
            <div className="w-3/4">
              <div className="flex flex-col gap-10">
                <div className="flex flex-col gap-5">
                  {order.products.map((product) => (
                    <Product key={product.id} productData={product} />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <div className="bg-gray-100 p-10 h-max">
                <div className="">
                  Order Total: <span>&#x20B9;</span>
                  <strong>{order.price}</strong>
                </div>
                <div className="">
                  Payment Method:{" "}
                  <strong>
                    {order.paymentintent === "Stripe"
                      ? "Stripe"
                      : "Cash on Delivery"}
                  </strong>
                </div>
                <div className="">
                  Payment Status:{" "}
                  <strong>
                    {order.paymentStatus ? "Completed" : "Pending"}
                  </strong>
                </div>
              </div>
              <div className="bg-gray-100 p-10">
                <h2>
                  <strong>Change Payment Status </strong>
                </h2>
                <RadioGroup
                  className="my-4"
                  value={paymentStatus}
                  onValueChange={(value) =>
                    setPaymentStatus(value as "completed" | "pending")
                  }
                >
                  <Radio value="pending" checked={!order.paymentStatus}>
                    Pending
                  </Radio>
                  <Radio value="completed" checked={order.paymentStatus}>
                    Completed
                  </Radio>
                </RadioGroup>
                <Button color="primary" onClick={updatePaymentStatus}>
                  Update
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
