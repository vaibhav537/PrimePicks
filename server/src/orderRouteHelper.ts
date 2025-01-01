import pool from "../connection/dbConnection";
import { OrderQueries, OrderType } from "../src/Resources";
const OQH = new OrderQueries();

interface ReqResult {
  status: boolean;
  id: number;
}

export const GetAllOrders = async () => {
  try {
    const client = await pool.connect();
    const res = await client.query(OQH.getAllOrdersQuery);
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
    const res = await client.query(OQH.getOrderDetailsByIDQuery, [id]);
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
    const res = await client.query(OQH.updateOrderPaymentStatusQuery, [
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

export const GenerateNewOrder = async (
  values: (string | number | boolean | null | number[])[],
  newOrder: OrderType
): Promise<any> => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await client.query(OQH.createNewOrderQuery, values);
    const createdOrder = result.rows[0];
    await client.query(OQH.updateProductsQuery, [
      createdOrder.id,
      newOrder.products,
    ]);
    const userIds = Array.isArray(newOrder.users)
       ? newOrder.users.map(Number)
      : [Number(newOrder.users)];
    await client.query(OQH.updateUserQuery, [createdOrder.id, userIds]);
    await client.query("COMMIT");
    return createdOrder;
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error in generating order:", error);
    throw error;
  }
};
