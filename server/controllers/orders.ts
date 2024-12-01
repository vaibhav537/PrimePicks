import pool from "../connection/dbConnection";
import {
  GetAllOrders,
  GetOrderDetailsById,
  UpdateOrderDetails,
} from "../src/orderRouteHelper";
import { HELPER } from "../src/Resources";

const helper = new HELPER();

export const allOrders = async (req: any, res: any) => {
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

export const orderById = async (req: { params: { id: string } }, res: any) => {
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
  } catch {}
};
