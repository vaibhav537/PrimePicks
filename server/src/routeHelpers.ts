import pool from "../connection/dbConnection";
import { HELPER } from "../src/Resources";
const helper = new HELPER();

export async function signupRouteHelper(values: Array<any>): Promise<boolean> {
  try {
    const client = await pool.connect();
    await client.query(helper.userInputQuery, values);
    client.release();
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export async function GetUserData(id: string): Promise<Array<string>> {
  try {
    const client = await pool.connect();
    const result = await client.query(helper.afterSignupQuery, [id]);
    client.release();
    return result.rows;
  } catch (err) {
    console.log(err);
    return [];
  }
}
