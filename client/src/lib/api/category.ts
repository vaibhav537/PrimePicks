import {
  createUrl,
  get,
  isAdminStoredJWT,
  patch,
  post,
  axiosDelete,
} from "./apiClients";
const constant: string = "/api/auth";

export const addCategory = async (name: string) => {
  try {
    if (!isAdminStoredJWT() || name === "") {
      return false;
    }

    const response = await post(createUrl(constant + "/add-category"), {
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
    if (!isAdminStoredJWT()) {
      return { status: false, data: [] };
    }

    const response = await get(createUrl(constant + "/all-category"));
    return response.status === 200
      ? { status: true, data: response.data.addMsg }
      : { status: false, data: [] };
  } catch (error) {
    alert("Error Occured !! ");
    console.log(error);
  }
};

export const getCategory = async (id: string) => {
  try {
    if (!isAdminStoredJWT() || id === "") {
      return { status: false, data: null };
    }

    const response = await get(createUrl(constant + `/categoryNameById/${id}`));
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
    if (!isAdminStoredJWT() || id === "" || category) {
      return { status: false, data: "" };
    }
    const response = await patch(
      createUrl(constant + `/updateCategory/${id}`),
      {
        name: category,
      }
    );
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
      createUrl(constant + `/deleteCategory/${id}`)
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
