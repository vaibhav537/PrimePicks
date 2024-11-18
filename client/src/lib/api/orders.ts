import Router from "next/router";
import { verifyToken } from "../utils/verifyToken";
import { createUrl, get, patch } from "./apiClients";
import { AxiosError, AxiosPromise, AxiosResponse } from "axios";
const constant: string = "/api/auth";
const tokenName: string = "adminToken";

export const getAllOrders = async () => {
  try {
    const token: string = localStorage.getItem(tokenName) || "";
    if (!(await verifyToken(token))) {
      Router.push("/admin");
      return { status: false, data: [] };
    }
    const response = await get(createUrl(constant + "/all-orders"));
    return response.status === 200
      ? { status: true, data: response.data.addMsg }
      : { status: false, data: [] };
  } catch (error) {
    console.error(error);
    return { status: false, data: [] };
  }
};

export const getOrder = async (id: string) => {
  try {
    const token: string = localStorage.getItem(tokenName) || "";
    if (!(await verifyToken(token))) {
      Router.push("/admin");
      return { status: false, data: null };
    }
    const response = await get(createUrl(constant + `/orderById/${id}`));
    if (response.status === 200) {
      return { status: true, data: response.data.addMsg };
    }
  } catch (error) {
    console.error(error);
    return { status: false, data: null };
  }
};

export const updateOrderPaymentStatus = async (
  paymentStatus: boolean,
  orderID: string
): Promise<AxiosResponse | AxiosError> => {
  try {
    const token: string = localStorage.getItem(tokenName) || "";
    if (!(await verifyToken(token))) {
      Router.push("/admin");
      throw new Error("Unauthorized");
    }
    const response = await patch(
      createUrl(constant + `/orderById/${orderID}`),
      { paymentStatus }
    );
    return response; // Return AxiosResponse directly
  } catch (error) {
    console.log(error);
    return error as AxiosError; // Return AxiosError directly
  }
};
