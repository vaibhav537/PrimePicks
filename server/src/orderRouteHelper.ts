import pool from "../connection/dbConnection";
import { HELPER } from "../src/Resources";
const helper = new HELPER();

interface ReqResult {
  status: boolean;
  id: number;
}

export const GetAllOrders  = async() => {
    try {
        const client = await pool.connect();
        const res = await client.query(helper.getAllOrdersQuery);
        client.release();
        return { status: true, data: res.rows };
      } catch (error) {
        console.error(error);
        return { status: false, data: [] };
      }
}