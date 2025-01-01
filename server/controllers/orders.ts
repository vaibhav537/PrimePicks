import { Request, Response } from "express";
import { Stripe } from "stripe";
import pool from "../connection/dbConnection";
import {
  GenerateNewOrder,
  GetAllOrders,
  GetOrderDetailsById,
  UpdateOrderDetails,
} from "../src/orderRouteHelper";

import { HELPER, OrderCreateInput, OrderType } from "../src/Resources";
const helper = new HELPER();

/**
 * Retrieves all orders from the database and sends them in the response.
 *
 * This function uses the `GetAllOrders` function to fetch all order data and sends it back to the client in a structured response.
 * If an error occurs during data retrieval, it responds with an error message and a status of `500`.
 *
 * @param {any} req - The request object, which contains details of the incoming HTTP request.
 * @param {any} res - The response object, which is used to send the HTTP response.
 *
 * @returns {void} This function does not return a value; it sends a response directly to the client.
 *
 * @throws {Error} In case of a failure during the execution of `GetAllOrders`, an error is caught and handled.
 *
 * @remarks
 * - The function makes use of `GetAllOrders`, which is assumed to retrieve order data from a database or external service.
 * - If successful, the response will include a message of "Success", a `result` flag set to `true`, and the `resultantData` returned by `GetAllOrders`.
 * - If an error occurs during the process, it closes the database connection (`pool.end()`) and sends a "Failure" message, with an empty `addMsg`.
 *
 * @example
 * // Example usage of this function in an Express.js route
 * ```typescript
 * app.get("/orders", allOrders);
 * ```
 */

export const allOrders = async (req: any, res: any): Promise<void> => {
  try {
    const resultantData = await GetAllOrders();
    res
      .status(200)
      .send({ msg: "Success", result: true, addMsg: resultantData.data });
  } catch (error) {
    pool.end();
    res.status(500).send({ msg: "Failure", result: false, addMsg: [] });
  }
};

/**
 * Retrieves the details of an order by its ID and sends the response to the client.
 *
 * This function takes an order ID from the request parameters and retrieves the order details using the `GetOrderDetailsById` function.
 * If the order is found and the status is `true`, it sends the order details in the response. If not, or if an error occurs,
 * it responds with a failure message.
 *
 * @param {object} req - The request object containing the parameters of the incoming HTTP request.
 * @param {object} res - The response object used to send the HTTP response.
 *
 * @returns {void} This function does not return a value; it sends a response directly to the client.
 *
 * @throws {Error} In case of a failure during the execution of `GetOrderDetailsById`, an error is caught and handled.
 *
 * @remarks
 * - The order ID is extracted from `req.params.id`, which is assumed to be a valid ID string.
 * - If `GetOrderDetailsById` returns a successful response (i.e., `status` is `true`), the order details are sent back with a status code of `200`.
 * - If the status is not `true` or if an error occurs during data retrieval, the response returns a failure message with a status code of `500`.
 * - The database connection is closed using `pool.end()` in case of an error.
 *
 * @example
 * // Example usage of this function in an Express.js route
 * app.get("/order/:id", orderById);
 */

export const orderById = async (
  req: { params: { id: string } },
  res: any
): Promise<void> => {
  try {
    const resultantData = await GetOrderDetailsById(req.params.id);

    if (resultantData.status === true) {
      res
        .status(200)
        .send({ msg: "Success", result: true, addMsg: resultantData.data });
    } else {
      res.status(500).send({ msg: "Failure", result: false, addMsg: [] });
    }
  } catch (error) {
    pool.end();
    res.status(500).send({ msg: "Failure", result: false, addMsg: [] });
  }
};

/**
 * Updates the payment status of an order by its ID.
 *
 * This function receives the order ID from the request parameters and the new `paymentStatus` from the request body.
 * It uses the `UpdateOrderDetails` function to update the payment status of the order in the database.
 * If the update is successful, it responds with a success message.
 * If any error occurs or the update fails, it responds with a failure message.
 *
 * @param {object} req - The request object containing the parameters and body of the incoming HTTP request.
 * @param {object} res - The response object used to send the HTTP response.
 *
 * @returns {void} This function does not return a value; it sends a response directly to the client.
 *
 * @throws {Error} In case of a failure during the execution of `UpdateOrderDetails`, an error is caught and handled.
 *
 * @remarks
 * - The order ID is passed as a URL parameter (e.g., `/order/:id`), and the new payment status is passed in the request body as a boolean.
 * - The `UpdateOrderDetails` function is expected to return `true` if the update was successful, or `false` if it failed.
 * - In case of a failure or an error, the function logs the error to the console and returns a `500` status code with a failure message.
 *
 * @example
 * // Example usage of this function in an Express.js route
 * app.put("/order/:id", updateOrderById);
 */
export const updateOrderById = async (
  req: { params: { id: string }; body: { paymentStatus: boolean } },
  res: any
) => {
  try {
    const resultantData = await UpdateOrderDetails(
      req.params.id,
      req.body.paymentStatus
    );
    if (resultantData === true) {
      res.status(200).send({ msg: "Success", result: true });
    } else {
      res.status(500).send({ msg: "Failure", result: false });
    }
  } catch (error) {
    console.error("ERROR UPDATING ORDER", error);
    res.status(500).send({ msg: "Failure", result: false });
  }
};

/**
 * Adds a new order to the database and responds with the order details.
 *
 * This function receives the order data from the request body, generates additional server-side values such as a unique order ID and timestamps,
 * and then inserts the new order into the database. If the order creation is successful, it responds with the created order details.
 * If any error occurs during the process, it returns a failure message.
 *
 * @param {Request} req - The request object containing the incoming HTTP request, including the order details in the body.
 * @param {Response} res - The response object used to send the HTTP response.
 *
 * @returns {void} This function does not return a value but sends a response directly to the client.
 *
 * @throws {Error} In case of a failure during order creation or while interacting with the database, an error is caught and handled.
 *
 * @remarks
 * - The `OrderType` interface defines the expected structure of the incoming order, which includes fields like `users`, `products`, `price`, `status`, etc.
 * - The `helper.GenerateId()` method generates a unique ID for the order, and `helper.getTime("Asia/Kolkata")` generates the current timestamp in the specified timezone.
 * - The order is inserted into the database with the values in the `values` array, including the `createdAt` and `updatedAt` timestamps.
 * - If the payment method is "Stripe", the `client_secret` is generated using `helper.uuidv4()`.
 * - If an error occurs during the creation of the order, a `500` status code with a failure message is returned.
 *
 * @example
 * ```typescript
 * app.post("/order", addOrder);
 * ```
 */

export const addOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const data: OrderType = req.body;
    let pMODE = "";
    let client_secret = "";
    if (data.paymentIntent === "Stripe") {
      const stripe = new Stripe(process.env.STRIPE_KEY || "", {
        apiVersion: "2024-12-18.acacia",
      });
      const paymentData = await stripe.paymentIntents.create({
        amount: data.price * 100, // Price in paise (smallest currency unit for INR)
        currency: "inr",
        automatic_payment_methods: {
          enabled: true,
        },
      });
      pMODE = paymentData.id;
      client_secret = paymentData.client_secret as string;
    }
    const newOrder: OrderType = {
      ...data,
      id: Number(await helper.GenerateId()),
      createdAt: helper.getTime("Asia/Kolkata"),
      updatedAt: helper.getTime("Asia/Kolkata"),
      status: { status: data.status.status, key: pMODE },
      paymentStatus: false,
      users: data.users,
    };
    const productsArray = newOrder.products;
    const formattedArray = `{${productsArray.join(",")}}`;
    const values = [
      newOrder.id,
      newOrder.createdAt,
      newOrder.updatedAt,
      newOrder.users,
      formattedArray,
      newOrder.price,
      JSON.stringify(newOrder.status),
      newOrder.paymentIntent,
      newOrder.paymentStatus,
    ];
    const createOrder = await GenerateNewOrder(values, newOrder);
    res.status(200).json({ client_secret });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};
