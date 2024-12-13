import qs from "qs";
import { createUrl, get } from "./apiClients";
import { protectedUrl } from "../utils/HelperClient";
import { decrypter } from "../utils/crypto";

export const getSearchResults = async (
  searchTerm: string,
  category: string
) => {
  try {
    let query;
    const decodedCategory = decrypter(category);
    const decodedSearchTerm = decrypter(searchTerm);
    if (searchTerm && searchTerm.length > 0) {
      query = qs.stringify({
        where: {
          title: {
            contains: decodedSearchTerm,
          },
        },
      });
    } else if (category && category.length > 0) {
      query = qs.stringify({
        where: {
          category: { id: decodedCategory },
        },
      });
    }
    const result = await get(
      createUrl(protectedUrl + `/searchProducts?${query}`)
    );
    if (result.data) {
      return result.data;
    }
    return [];
  } catch (error) {
    console.error(error);
    return [];
  }
};
