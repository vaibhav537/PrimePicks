import QueryString from "qs";
import { Helper, protectedUrl } from "../utils/HelperClient";
import { createUrl, get, isAdminStoredJWT, patch, post } from "./apiClients";
import { AxiosError, AxiosPromise, AxiosResponse } from "axios";
const helper: Helper = new Helper();

export const getAllOrders = async () => {
  try {
    const response = await get(createUrl(protectedUrl + "/all-orders"));
    return response.status === 200
      ? { status: true, data: response.data.addMsg }
      : { status: false, data: [] };
  } catch (error) {
    console.error(error);
    return { status: false, data: [] };
  }
};

export const getOrder = async (id: string, clientUse = false) => {
  try {
    if (!isAdminStoredJWT(clientUse) || id === "") {
      return { status: false, data: null };
    }
    const response = await get(createUrl(protectedUrl + `/orderById/${id}`));
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
    if (!isAdminStoredJWT()) {
      throw new Error("Unauthorized");
    }
    const response = await patch(
      createUrl(protectedUrl + `/orderById/${orderID}`),
      { paymentStatus }
    );
    return response; // Return AxiosResponse directly
  } catch (error) {
    console.log(error);
    return error as AxiosError; // Return AxiosError directly
  }
};

export const createOrder = async (order: any) => {
  try {
    const response = await post(createUrl(protectedUrl + "/orders"), {
      ...order,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const recordStripePayment = async (
  payment_intent: string
): Promise<boolean> => {
  try {
    const query = QueryString.stringify({ paymentIntent: payment_intent });
    const response = await post(
      createUrl(`${protectedUrl}/updateOrders?${query}`)
    );
    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const getUserOrders = async (
  userId: number
): Promise<AxiosResponse<any> | never[]> => {
  try {
    const response = await get(
      createUrl(protectedUrl + `/userOrders/${userId}`)
    );
    return response.status === 200 ? response : [];
  } catch (error) {
    console.error(error);
    return [];
  }
};
