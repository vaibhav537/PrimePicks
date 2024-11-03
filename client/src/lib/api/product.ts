import { createUrl, isAdminStoredJWT, post } from "./apiClients";
const constant: string = "/api/auth";

export const addProduct = async (
  data: any
): Promise<{ status: boolean; data: any }> => {
  try {
    if (!isAdminStoredJWT() || data === null) {
      return { status: false, data: 0 };
    }
    const response = await post(createUrl(constant + "/add-product"), {
      ...data,
    });
    console.log(response)
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
