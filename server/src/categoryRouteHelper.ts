import pool from "../connection/dbConnection";
import { HELPER } from "../src/Resources";
const helper = new HELPER();

interface ReqResult {
  status: boolean;
  id: number;
}

export async function addCategoryRouteHelper(
  values: Array<string | bigint[]>
): Promise<Boolean> {
  try {
    const client = await pool.connect();
    await client.query(helper.addCategoryQuery, values);
    client.release();
    return true;
  } catch (error) {
    return false;
  }
}

export async function GetCategoryId(name: string): Promise<ReqResult> {
  try {
    const client = await pool.connect();
    const res = await client.query(helper.getCategoryIdQuery, [name]);
    client.release();
    return { status: true, id: res.rows[0].id };
  } catch (error) {
    return { status: false, id: 0 };
  }
}

export async function GetAllCategory() {
  try {
    const client = await pool.connect();
    const res = await client.query(helper.getAllCategoryQuery);
    client.release();
    return { status: true, data: res.rows };
  } catch (error) {
    console.error(error);
    return { status: false, data: [] };
  }
}

export async function GetSpecificCategory(id: string) {
  try {
    const client = await pool.connect();
    const res = await client.query(helper.getCategoryNameByIdQuery, [id]);
    client.release();
    return { status: true, data: res.rows[0].name };
  } catch (error) {
    console.error(error);
    return { status: false, data: null };
  }
}

export async function UpdateCategory(
  id: string,
  CategoryName: string,
  updatedAt: string
) {
  try {
    const client = await pool.connect();
    const res = await client.query(helper.updateCategoryNameByIdQuery, [
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

export async function DeleteCategoryByID(id: string) {
  try {
    const client = await pool.connect();
    const res = await client.query(helper.deleteCategoryByIDQuery, [id]);
    client.release();
    if (res) {
      return { status: true };
    }
  } catch (error) {
    console.log(error);
    return { status: false };
  }
}
