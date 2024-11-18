import pool from "../connection/dbConnection";
import { GetAllOrders } from "../src/orderRouteHelper";
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