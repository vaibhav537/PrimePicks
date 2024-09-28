import { createUrl, get, isAdminStoredJWT, post } from "./apiClients";

export const addCategory = async (name: string) => {
  try {
    if (!isAdminStoredJWT() || name === "") {
      return false;
    }
    const response = await post(createUrl("/add-category"), {
      categoryName: name,
    });
    return response.status === 200 ? true : false;
  } catch (error) {
    alert("Error Occured !! ");
    console.log(error);
  }
};

export const allCategory = async () => {
  try {
    if (!isAdminStoredJWT()) {
      return {status: false, data: []};
    }
    const response = await get(createUrl("/all-categories"));
    response.status === 200 ? {status: true, data: response.data}: {status: false, data: []};
  } catch (error) {
    alert("Error Occured!! ");
    console.log(error);
  }
};
