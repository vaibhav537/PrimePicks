import { createUrl, post } from "./apiClients";

export const addCategory = async (name: string) => {
  try {
    const response = await post(createUrl("/api/categories"), { name });
return response.status === 200 ? true : false;
  } catch (error) {
    console.log(error);
  }
};
