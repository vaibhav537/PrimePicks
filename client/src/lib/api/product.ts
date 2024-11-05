import { verifyToken } from "../utils/verifyToken";
import { axiosDelete, createUrl, get, isAdminStoredJWT, post } from "./apiClients";
const constant: string = "/api/auth";
const tokenName: string = "adminToken";

export const addProduct = async (
  data: any
): Promise<{ status: boolean; data: any }> => {
  try {
    const token: string = localStorage.getItem(tokenName) || "";
    if (!isAdminStoredJWT() || data === null) {
      return { status: false, data: 0 };
    }
    if (!await verifyToken(token)) {
      return { status: false, data: 0 };
    }
    const response = await post(createUrl(constant + "/add-product"), {
      ...data,
    });
    console.log(response);
    if (response.status === 200) {
      return { status: true, data: response.data.addMsg };
    } else {
      return { status: false, data: 0 };
    }
  } catch (error) {
    console.log(error);
    return { status: false, data: 0 };
  }
};

export const allProducts = async () => {
  try {
    if (!isAdminStoredJWT()) {
      return { status: false, data: [] };
    }
    const token: string = localStorage.getItem(tokenName) || "";
    if (!(await verifyToken(token))) {
      return { status: false, data: [] };
    }
    const response = await get(createUrl(constant + "/all-products"));
    return response.status === 200
      ? { status: true, data: response.data.addMsg }
      : { status: false, data: [] };
  } catch (error) {
    alert("Error Occured !! ");
    console.log(error);
  }
};

export const deleteProduct = async (id: string) => {
  try {
    if (!isAdminStoredJWT() || id === "") {
      return { status: false };
    }
    const token: string = localStorage.getItem(tokenName) || "";
    if (!(await verifyToken(token))) {
      return { status: false };
    }
    const response = await axiosDelete(
      createUrl(constant + `/deleteProduct/${id}`)
    );
    if (response.data.result === true) {
      return { status: true };
    } else {
      return { status: false };
    }
  } catch (error) {
    console.log(error);
    return { status: false };
  }
};
