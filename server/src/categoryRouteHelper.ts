import pool from "../connection/dbConnection";
import { CategoryQueries } from "../src/Resources";
const CQH = new CategoryQueries();

interface ReqResult {
  status: boolean;
  id: number;
}

/**
 * Adds a new category to the database using the provided values.
 *
 * @param {Array<string | bigint[]>} values - An array containing the values for the new category, such as name or related IDs.
 * @returns {Promise<boolean>} A promise that resolves to `true` if the category was added successfully, or `false` if an error occurred.
 *
 * @throws This function does not throw errors; it returns `false` if an error occurs.
 */
export async function addCategoryRouteHelper(
  values: Array<string | bigint[]>
): Promise<Boolean> {
  try {
    const client = await pool.connect();
    await client.query(CQH.addCategoryQuery, values);
    client.release();
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Retrieves the ID of a category based on its name.
 *
 * @param {string} name - The name of the category to look up.
 * @returns {Promise<ReqResult>} A promise that resolves to an object containing:
 *   - `status` (boolean): Indicates whether the query was successful.
 *   - `id` (number): The ID of the category if successful, or `0` if an error occurred.
 *
 * @throws This function does not throw errors; it returns a `status: false` object in case of failure.
 */

export async function GetCategoryId(name: string): Promise<ReqResult> {
  try {
    const client = await pool.connect();
    const res = await client.query(CQH.getCategoryIdQuery, [name]);
    client.release();
    return { status: true, id: res.rows[0].id };
  } catch (error) {
    return { status: false, id: 0 };
  }
}

/**
 * Retrieves all categories from the database.
 *
 * @returns {Promise<{ status: boolean, data: Array<object> }>} A promise that resolves to an object containing:
 *   - `status` (boolean): Indicates whether the query was successful.
 *   - `data` (Array<object>): An array of category objects if successful, or an empty array if an error occurred.
 * 
 * @throws This function does not throw errors; it logs the error and returns a `status: false` object in case of failure.
 */

export async function GetAllCategory(): Promise<{ status: boolean; data: Array<object>; }> {
  try {
    const client = await pool.connect();
    const res = await client.query(CQH.getAllCategoryQuery);
    client.release();
    return { status: true, data: res.rows };
  } catch (error) {
    console.error(error);
    return { status: false, data: [] };
  }
}

/**
 * Retrieves the name of a specific category based on its ID.
 *
 * @param {string} id - The ID of the category to retrieve.
 * @returns {Promise<{ status: boolean, data: string | null }>} A promise that resolves to an object containing:
 *   - `status` (boolean): Indicates whether the query was successful.
 *   - `data` (string | null): The name of the category if successful, or `null` if an error occurred.
 * 
 * @throws This function does not throw errors; it logs the error and returns a `status: false` object in case of failure.
 */

export async function GetSpecificCategory(id: string): Promise<{ status: boolean; data: string | null; }> {
  try {
    const client = await pool.connect();
    const res = await client.query(CQH.getCategoryNameByIdQuery, [id]);
    client.release();
    return { status: true, data: res.rows[0].name };
  } catch (error) {
    console.error(error);
    return { status: false, data: null };
  }
}

/**
 * Updates the name and updated timestamp of a specific category based on its ID.
 *
 * @param {string} id - The ID of the category to update.
 * @param {string} CategoryName - The new name for the category.
 * @param {string} updatedAt - The timestamp indicating when the category was last updated.
 * @returns {Promise<{ status: boolean, data: string | null }>} A promise that resolves to an object containing:
 *   - `status` (boolean): Indicates whether the update was successful.
 *   - `data` (string | null): The updated category name if successful, or `null` if an error occurred.
 * 
 * @throws This function does not throw errors; it logs the error and returns a `status: false` object in case of failure.
 */

export async function UpdateCategory(
  id: string,
  CategoryName: string,
  updatedAt: string
): Promise<{ status: boolean; data: string | null; }> {
  try {
    const client = await pool.connect();
    const res = await client.query(CQH.updateCategoryNameByIdQuery, [
      id,
      CategoryName,
      updatedAt,
    ]);
    client.release();
    return { status: true, data: res.rows[0].name };
  } catch (error) {
    console.log(error);
    return { status: false, data: null };
  }
}

/**
 * Deletes a category from the database based on its ID.
 *
 * @param {string} id - The ID of the category to delete.
 * @returns {Promise<{ status: boolean }>} A promise that resolves to an object containing:
 *   - `status` (boolean): `true` if the deletion was successful, or `false` if an error occurred.
 * 
 * @throws This function does not throw errors; it logs the error and returns a `status: false` object in case of failure.
 */

export async function DeleteCategoryByID(id: string): Promise<{ status: boolean; }> {
  try {
    const client = await pool.connect();
    const res = await client.query(CQH.deleteCategoryByIDQuery, [id]);
    client.release();
    if (res) {
      return { status: true };
    }else{
      return { status: false };
    }
  } catch (error) {
    console.log(error);
    return { status: false };
  }
}
