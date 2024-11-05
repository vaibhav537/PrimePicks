import { verifyToken } from "../utils/verifyToken";
import { createUrl, isAdminStoredJWT, post } from "./apiClients";
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
