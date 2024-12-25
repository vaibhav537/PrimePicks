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
  values: (string | number | boolean | null)[],
  newOrder: OrderType
) => {
  const client = await pool.connect();
  try {
    // BEGIN TRANSACTION
    await client.query("BEGIN");
    // INSERT ORDER
    const result = await client.query(OQH.createNewOrderQuery, values);
    const createdOrder = result.rows[0];
    // UPDATE RELATED TABLES (PRIMEPICKS_PRODUCTS AND PRIMEPICKS_USERS)
    await client.query(OQH.updateProductsQuery, [
      createdOrder.id,
      newOrder.products,
    ]);
    // UPDATE PRIMEPICKS_USERS (ADD THE ORDER TO THE USER'S ORDERS)
    await client.query(OQH.updateUserQuery, [createdOrder.id, newOrder.users]);
    // COMMIT THE TRANSACTION
    await client.query("COMMIT");
    return createdOrder;
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    throw error;
  }
};
