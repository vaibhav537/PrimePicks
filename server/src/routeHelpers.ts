import pool from "../connection/dbConnection";
import { HELPER } from "../src/Resources";
const helper = new HELPER();

export async function signupRouteHelper(values: Array<any>): Promise<boolean> {
  try {
    const client = await pool.connect();
    await client.query(helper.userInputQuery, values);
    client.release();
    return true;
  } catch {
    return false;
  }
}
