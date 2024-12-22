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

/**
 * Fetches a product by its ID.
 * @param id - The ID of the product to retrieve
 * @param clientUse - Indicates if the client is calling this function directly
 * @default false
 * @returns An object containing the status and data of the response
 */

export const getProductByID = async (
  id: string,
  clientUse: boolean = false
) => {
  try {
    // Validate inputs and admin privileges
    if (!isAdminStoredJWT(clientUse) || id.trim() === "") {
      return { status: false, data: null };
    }
    // Construct API endpoint URL
    const url = createUrl(protectedUrl + `/productById/${id}`);
    
    // Make the GET request
    const response = await get(url);
    
    // Make the GET request
    if (response.status === 200 && response.data?.addMsg) {
      return { status: true, data: response.data.addMsg };
    }
     // Handle unexpected responses
     return { status: false, data: null };
  } catch (error) {
    console.log("Error fetching product by ID:", error);
    return { status: false, data: null };
  }
};

/**
 * Edits a product by its ID.
 * @param id - The ID of the product to update.
 * @param data - The ID of the product to update.
 * @returns An object containing the status and data of the response.
 */
export const editProduct = async (id: string, data: any) => {
  try {
    // Ensure 'data' is provided and has content; if not, return failure
    if (!isAdminStoredJWT() || id === "" || !data) {
      return { status: false, data: "" };
    }

    const response = await patch(
      createUrl(protectedUrl + `/updateProduct/${id}`),
      {
        ...data,
      }
    );

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

export const getMultipleProductsDetails = async (productIDs: string[]) => {
  try {
    const productDetails = [];
    for (let i = 0; i < productIDs.length; i++) {
      const data = await getProductByID(productIDs[i], true);
      productDetails.push(data?.data);
    }
    return productDetails;
  } catch (error) {
    console.error(error);
    return [];
  }
};
