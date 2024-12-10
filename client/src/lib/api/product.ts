import { protectedUrl } from "../utils/HelperClient";
import {
  axiosDelete,
  createUrl,
  get,
  isAdminStoredJWT,
  patch,
  post,
} from "./apiClients";



export const addProduct = async (
  data: any
): Promise<{ status: boolean; data: any }> => {
  try {
    if (!isAdminStoredJWT() || data === null) {
      return { status: false, data: 0 };
    }
    const response = await post(createUrl(protectedUrl + "/add-product"), {
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
    const response = await get(createUrl(protectedUrl + "/all-products"));
    return response.status === 200
      ? { status: true, data: response.data.addMsg }
      : { status: false, data: [] };
  } catch (error) {
    console.log(error);
  }
};

export const deleteProduct = async (id: string) => {
  try {
    if (!isAdminStoredJWT() || id === "") {
      return { status: false };
    }

    const response = await axiosDelete(
      createUrl(protectedUrl + `/deleteProduct/${id}`)
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

export const getProductByID = async (id: string) => {
  try {
    if (!isAdminStoredJWT() || id === "") {
      return { status: false, data: null };
    }
    const response = await get(createUrl(protectedUrl + `/productById/${id}`));
    if (response.status === 200) {
      return { status: true, data: response.data.addMsg };
    }
  } catch (error) {
    console.log(error);
    return { status: false, data: null };
  }
};

export const editProduct = async (id: string, data: any) => {
  try {
    // Ensure 'data' is provided and has content; if not, return failure
    if (!isAdminStoredJWT() || id === "" || !data) {
      return { status: false, data: "" };
    }

    const response = await patch(createUrl(protectedUrl + `/updateProduct/${id}`), {
      ...data,
    });

    if (response.data.result === true) {
      return { status: true, data: response.data.addMsg };
    } else {
      return { status: false, data: null };
    }
  } catch (error) {
    console.log(error);
    return { status: false, data: null };
  }
};
