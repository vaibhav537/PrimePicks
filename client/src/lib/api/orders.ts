import { createUrl, get, isAdminStoredJWT, patch } from "./apiClients";
import { AxiosError, AxiosPromise, AxiosResponse } from "axios";
const constant: string = "/api/auth";

export const getAllOrders = async () => {
  try {
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
    if (!isAdminStoredJWT() || id === "") {
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
  orderID: string,
): Promise<AxiosResponse | AxiosError> => {
  try {
    if (!isAdminStoredJWT()) {
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
