import pool from "../connection/dbConnection";
import { HELPER } from "../src/Resources";
const helper = new HELPER();

interface ReqResult {
  status: boolean;
  id: number;
}

export async function addProductRouteHelper(
  values: Array<any>
): Promise<Boolean> {
  try {
    await pool.query(helper.addProductQuery, values);
    return true;
  } catch (error) {
    console.error("Error inserting product:", error);
    return false;
  }
}

export async function GetProductId(name: string): Promise<ReqResult> {
  try {
    const client = await pool.connect();
    const res = await client.query(helper.getProductIdQuery, [name]);
    client.release();
    return { status: true, id: res.rows[0].id };
  } catch (error) {
    return { status: false, id: 0 };
  }
}
