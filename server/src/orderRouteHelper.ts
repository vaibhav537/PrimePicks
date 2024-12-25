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
): Promise<any> => {
  const client = await pool.connect();
  try {
    // BEGIN TRANSACTION
    await client.query("BEGIN");

    // INSERT ORDER
    const result = await client.query(OQH.createNewOrderQuery, values);
    const createdOrder = result.rows[0]; // The newly created order from the database

    // Step 5: Update related tables (products and users)
    await client.query(OQH.updateProductsQuery, [
      JSON.stringify(newOrder.products), // Products array in JSON format
      createdOrder.id, // Order ID to link products to this order
    ]);

    // Update the user's orders
    await client.query(OQH.updateUserQuery, [createdOrder.id, newOrder.users]); // Correctly using `users`

    // COMMIT THE TRANSACTION
    await client.query("COMMIT");

    return createdOrder;
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error in generating order:", error);
    throw error; // Rethrow error to be handled in the controller
  }
};
