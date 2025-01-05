import pool from "../connection/dbConnection";
import { OrderQueries, OrderType } from "../src/Resources";
const OQH = new OrderQueries();

interface OrderStatus {
  key: string;
  status: string;
}

interface Order {
  id: string;
  createdAt: string;
  updatedAt: string;
  users: string;
  products: string[];
  price: string;
  status: OrderStatus;
  paymentintent: string;
  paymentStatus: boolean;
  user: string;
}

/**
 * Retrieves all orders from the database.
 *
 * @returns {Promise<{ status: boolean, data: Array<object> }>} A promise that resolves to an object containing:
 *   - `status` (boolean): Indicates whether the query was successful.
 *   - `data` (Array<object>): An array of order objects if successful, or an empty array if an error occurred.
 *
 * @throws This function does not throw errors; it logs the error and returns a `status: false` object in case of failure.
 */

export const GetAllOrders = async (): Promise<{
  status: boolean;
  data: Array<object>;
}> => {
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

/**
 * Retrieves the details of a specific order based on its ID.
 *
 * @param {string} id - The ID of the order to retrieve details for.
 * @returns {Promise<{ status: boolean, data: Array<object> }>} A promise that resolves to an object containing:
 *   - `status` (boolean): Indicates whether the query was successful.
 *   - `data` (Array<object>): An array of order details if successful, or an empty array if an error occurred.
 *
 * @throws This function does not throw errors; it logs the error and returns a `status: false` object in case of failure.
 */

export const GetOrderDetailsById = async (
  id: string
): Promise<{ status: boolean; data: Array<object> }> => {
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

/**
 * Updates the payment status of a specific order based on its ID.
 *
 * @param {string} id - The ID of the order to update.
 * @param {boolean} pStatus - The new payment status of the order (true for paid, false for unpaid).
 * @returns {Promise<boolean>} A promise that resolves to `true` if the update was successful, or `false` if an error occurred.
 *
 * @throws This function does not throw errors; it logs the error and returns `false` in case of failure.
 */

export const UpdateOrderDetails = async (
  id: string,
  pStatus: boolean
): Promise<boolean> => {
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

/**
 * Generates a new order in the database, including order details, products, and associated users.
 *
 * @param {Array<string | number | boolean | null | number[]>} values - The values for the new order to be inserted into the database.
 * @param {OrderType} newOrder - The order details, including product information and associated user IDs.
 * @returns {Promise<any>} A promise that resolves to the created order object if successful, or throws an error if the transaction fails.
 *
 * @throws {Error} This function throws an error if the transaction fails at any step, and it performs a rollback.
 */

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

/**
 * Checks the payment intent in the database and retrieves the associated order ID and status.
 *
 * @param {string} paymentIntent - The payment intent identifier to verify.
 * @returns {Promise<{ id: number, status: boolean }>} A promise that resolves to an object containing:
 *   - `id` (number): The ID of the associated order if found, or `0` if not found or an error occurs.
 *   - `status` (boolean): `true` if the payment intent exists, or `false` if it does not or an error occurs.
 *
 * @throws This function does not throw errors; it logs the error, performs a rollback if necessary, and returns a default response in case of failure.
 */

export const checkPaymentIntent = async (
  paymentIntent: string
): Promise<{ id: number; status: boolean }> => {
  const client = await pool.connect();
  try {
    const result = await client.query(OQH.paymentIntentQuery, [paymentIntent]);
    if (result.rows.length === 0) {
      return { id: 0, status: false };
    } else {
      return { id: result.rows[0].id, status: true };
    }
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    return { id: 0, status: false };
  } finally {
    client.release();
  }
};
/**
 * Updates the payment status of a specific order in the database.
 *
 * @param {number} id - The ID of the order to update the payment status for.
 * @returns {Promise<boolean>} A promise that resolves to `true` if the update was successful, or `false` if an error occurred.
 *
 * @throws This function does not throw errors; it logs the error, performs a rollback in case of failure, and returns `false`.
 */

export const updateOrderPaymentStatus = async (
  id: number
): Promise<boolean> => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(OQH.updateOrderStatusQuery, [id]);
    await client.query("COMMIT");
    return true;
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    return false;
  } finally {
    client.release();
  }
};
/**
 * Retrieves all orders associated with a specific user by their user ID.
 *
 * @param {number} userId - The ID of the user whose orders are to be retrieved.
 * @returns {Promise<Order[]>} A promise that resolves to an array of `Order` objects if successful, or an empty array if no orders are found or an error occurs.
 * 
 * Each `Order` object contains:
 *   - `id` (number): The order ID.
 *   - `createdAt` (string): The creation timestamp of the order.
 *   - `updatedAt` (string): The last updated timestamp of the order.
 *   - `users` (Array<number>): IDs of users associated with the order.
 *   - `products` (Array<number>): IDs of products included in the order.
 *   - `price` (number): The total price of the order.
 *   - `status` (string): The status of the order.
 *   - `paymentintent` (string): The payment intent ID for the order.
 *   - `paymentStatus` (boolean): The payment status of the order.
 *   - `user` (string): Additional user information.
 * 
 * @throws This function does not throw errors; it logs the error and returns an empty array in case of failure.
 */

export const getOrderByUserId = async (userId: number): Promise<Order[]> => {
  const client = await pool.connect();
  try {
    const result = await client.query(OQH.userOrderQuery, [userId]);
    if (result.rows.length > 0) {
      const orders: Order[] = result.rows.map((row) => ({
        id: row.id,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        users: row.users,
        products: row.products,
        price: row.price,
        status: row.status,
        paymentintent: row.paymentintent,
        paymentStatus: row.paymentStatus,
        user: row.user,
      }));
      return orders;
    } else {
      return [];
    }
  } catch (error) {
    console.error(error);
    return [];
  } finally {
    client.release();
  }
};
