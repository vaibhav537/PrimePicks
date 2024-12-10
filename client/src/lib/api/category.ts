import { decrypter } from "../utils/crypto";
import { protectedUrl } from "../utils/HelperClient";
import {
  createUrl,
  get,
  isAdminStoredJWT,
  patch,
  post,
  axiosDelete,
} from "./apiClients";

export const addCategory = async (name: string) => {
  try {
    if (!isAdminStoredJWT() || name === "") {
      return false;
    }

    const response = await post(createUrl(protectedUrl + "/add-category"), {
      categoryName: name,
    });
    return response.status === 200 ? true : false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const allCategory = async () => {
  try {
    // if (!isAdminStoredJWT()) {
    //   return { status: false, data: [] };
    // }

    const response = await get(createUrl(protectedUrl + "/all-category"));
    return response.status === 200
      ? { status: true, data: response.data.addMsg }
      : { status: false, data: [] };
  } catch (error) {
    //alert("Error Occured !! ");
    console.log(error);
  }
};

export const getCategory = async (id: string) => {
  try {
    if (!isAdminStoredJWT() || id === "") {
      return { status: false, data: null };
    }

    const response = await get(
      createUrl(protectedUrl + `/categoryNameById/${id}`)
    );
    if (response.status === 200) {
      return { status: true, data: response.data.addMsg };
    }
  } catch (error) {
    console.log(error);
    return { status: false, data: null };
  }
};

export const editCategory = async (id: string, category: string) => {
  try {
    console.log({category})
    if (!isAdminStoredJWT() || id === "" || !category) {
      console.log("Here")
      return { status: false, data: "" };
    }
    const decodedID = decrypter(id)
    const response = await patch(
      createUrl(protectedUrl + `/updateCategory/${decodedID}`),
      {
        name: category,
      }
    );
    console.log({ response });
    if (response.data.result === true) {
      return { status: true, data: response.data.addMsg };
    }
  } catch (error) {
    console.log(error);
    return { status: false, data: "" };
  }
};

export const deleteCategory = async (id: string) => {
  try {
    if (!isAdminStoredJWT() || id === "") {
      return { status: false };
    }
    const response = await axiosDelete(
      createUrl(protectedUrl + `/deleteCategory/${id}`)
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
