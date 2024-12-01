import pool from "../connection/dbConnection";
import { HELPER } from "../src/Resources";
const helper = new HELPER();

interface ReqResult {
  status: boolean;
  id: number;
}

export const GetAllOrders = async () => {
  try {
    const client = await pool.connect();
    const res = await client.query(helper.getAllOrdersQuery);
    client.release();
    return { status: true, data: res.rows };
  } catch (error) {
    console.error(error);
    return { status: false, data: [] };
  }
};

export const GetOrderDetailsById = async (id: string) => {
  try {
    const client = await pool.connect();
    const res = await client.query(helper.getOrderDetailsByIDQuery, [id]);
    client.release();
    return { status: true, data: res.rows };
  } catch (error) {
    console.error(error);
    return { status: false, data: [] };
  }
};

export const UpdateOrderDetails = async (id: string, pStatus: boolean) => {
  try {
    const client = await pool.connect();
    const res = await client.query(helper.updateOrderPaymentStatusQuery, [
      id,
      pStatus,
    ]);
    client.release();
    if (res) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
};
