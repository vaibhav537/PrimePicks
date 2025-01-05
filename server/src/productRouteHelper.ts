import pool from "../connection/dbConnection";
import { HELPER, ProductQueries } from "../src/Resources";
const PQH = new ProductQueries();
const helper = new HELPER();

interface ReqResult {
  status: boolean;
  id: number;
}
/**
 * Adds a new product to the database using the provided values.
 *
 * @param {Array<any>} values - An array containing the values for the new product, such as name, price, category, and other product details.
 * @returns {Promise<boolean>} A promise that resolves to `true` if the product was added successfully, or `false` if an error occurred.
 *
 * @throws This function does not throw errors; it logs the error and returns `false` in case of failure.
 */

export async function addProductRouteHelper(
  values: Array<any>
): Promise<Boolean> {
  try {
    await pool.query(PQH.addProductQuery, values);
    return true;
  } catch (error) {
    console.error("Error inserting product:", error);
    return false;
  }
}
/**
 * Retrieves the ID of a product based on its name.
 *
 * @param {string} name - The name of the product to look up.
 * @returns {Promise<ReqResult>} A promise that resolves to an object containing:
 *   - `status` (boolean): Indicates whether the query was successful.
 *   - `id` (number): The ID of the product if found, or `0` if an error occurred or the product does not exist.
 *
 * @throws This function does not throw errors; it returns a `status: false` object in case of failure.
 */

export async function GetProductId(name: string): Promise<ReqResult> {
  try {
    const client = await pool.connect();
    const res = await client.query(PQH.getProductIdQuery, [name]);
    client.release();
    return { status: true, id: res.rows[0].id };
  } catch (error) {
    return { status: false, id: 0 };
  }
}
/**
 * Retrieves all products from the database.
 *
 * @returns {Promise<{ status: boolean, data: Array<object> }>} A promise that resolves to an object containing:
 *   - `status` (boolean): Indicates whether the query was successful.
 *   - `data` (Array<object>): An array of product objects if successful, or an empty array if an error occurred.
 *
 * @throws This function does not throw errors; it logs the error and returns a `status: false` object in case of failure.
 */

export async function GetAllProducts(): Promise<{
  status: boolean;
  data: Array<object>;
}> {
  try {
    const client = await pool.connect();
    const res = await client.query(PQH.getAllProductsQuery);
    client.release();
    return { status: true, data: res.rows };
  } catch (error) {
    console.error(error);
    return { status: false, data: [] };
  }
}
/**
 * Deletes a product from the database and its associated images.
 *
 * @param {string} id - The ID of the product to delete.
 * @returns {Promise<{ status: boolean }>} A promise that resolves to an object containing:
 *   - `status` (boolean): `true` if the product and its images were successfully deleted, or `false` if an error occurred.
 *
 * Process:
 *   1. Fetches the images associated with the product ID.
 *   2. Deletes each image from the storage using `helper.deleteImage`.
 *   3. Deletes the product record from the database.
 *
 * @throws This function does not throw errors; it logs the error and returns a `status: false` object in case of failure.
 */

export async function DeleteProductByID(
  id: string
): Promise<{ status: boolean }> {
  try {
    const client = await pool.connect();
    const fetchResult = await client.query(PQH.getProductImagesQuery, [id]);
    if (fetchResult.rows.length === 0) {
      client.release();
      return { status: false };
    }
    const PImages: string[] = fetchResult.rows[0].images;
    const deletePromises = PImages.map((IURL) => {
      const publicId = IURL.split("/").pop()?.split(".")[0];
      return helper.deleteImage(publicId || "");
    });
    await Promise.all(deletePromises);
    const res = await client.query(PQH.deleteProductByIDQuery, [id]);
    client.release();
    if (res) {
      return { status: true };
    } else {
      return { status: false };
    }
  } catch (error) {
    console.log(error);
    return { status: false };
  }
}
/**
 * Retrieves details of a specific product based on its ID.
 *
 * @param {string} id - The ID of the product to retrieve.
 * @returns {Promise<{ status: boolean, data: object | null }>} A promise that resolves to an object containing:
 *   - `status` (boolean): Indicates whether the query was successful.
 *   - `data` (object | null): The product details if found, or `null` if an error occurred or the product does not exist.
 *
 * @throws This function does not throw errors; it logs the error and returns a `status: false` object in case of failure.
 */

export async function GetSpecificProduct(
  id: string
): Promise<{ status: boolean; data: object | null }> {
  try {
    const client = await pool.connect();
    const res = await client.query(PQH.getProductByIdQuery, [id]);
    client.release();
    return { status: true, data: res.rows[0] };
  } catch (error) {
    console.error(error);
    return { status: false, data: null };
  }
}
/**
 * Updates the details of a product in the database.
 *
 * @param {Array<string | Array<string>>} values - An array containing the updated values for the product. This may include details such as name, price, category, and other attributes.
 * @returns {Promise<{ status: boolean, data: string | null }>} A promise that resolves to an object containing:
 *   - `status` (boolean): Indicates whether the update was successful.
 *   - `data` (string | null): The ID of the updated product if successful, or `null` if an error occurred.
 *
 * @throws This function does not throw errors; it logs the error and returns a `status: false` object in case of failure.
 */

export async function UpdateProduct(
  values: Array<string | Array<string>>
): Promise<{ status: boolean; data: string | null }> {
  try {
    const client = await pool.connect();
    const res = await client.query(PQH.updateProductDetailsQuery, values);
    client.release();
    return { status: true, data: res.rows[0].id };
  } catch (error) {
    console.log(error);
    return { status: false, data: null };
  }
}
/**
 * Retrieves products based on a search term in their title.
 *
 * @param {string} searchTerm - The search term to match against product titles.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of products matching the search term.
 *
 * Each product object contains information such as ID, title, price, category, and other attributes.
 *
 * @throws This function does not throw errors directly but may propagate database query errors if not handled externally.
 */

/**
 * Retrieves products based on their category ID.
 *
 * @param {string} categoryId - The ID of the category to filter products by.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of products belonging to the specified category.
 *
 * Each product object contains information such as ID, title, price, category, and other attributes.
 *
 * @throws This function does not throw errors directly but may propagate database query errors if not handled externally.
 */

export const getProductsByTitle = async (
  searchTerm: string
): Promise<Array<object>> => {
  const values = [`%${searchTerm}%`];
  const result = await pool.query(PQH.getProductsByTitleQuery, values);
  return result.rows;
};
/**
 * Retrieves products that belong to a specific category.
 *
 * @param {string} categoryId - The ID of the category to filter products by.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of products in the specified category.
 *
 * Each product object contains information such as ID, title, price, and other product details.
 *
 * @throws This function does not throw errors directly but may propagate database query errors if not handled externally.
 */

export const getProductsByCategory = async (
  categoryId: string
): Promise<Array<object>> => {
  const values = [categoryId];
  const result = await pool.query(PQH.getProductsByCategoryQuery, values);
  return result.rows;
};
