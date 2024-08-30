import pool from "../connection/dbConnection";
import { HELPER } from "../src/Resources";
import { addCategoryRouteHelper } from "../src/routeHelpers";

const helper = new HELPER();

export const addCategory = async (
  req: {
    body: {
      categoryName: string;
    };
  },
  res: any
) => {
  try {
    const { categoryName } = req.body;
    const result = await addCategoryRouteHelper([categoryName]);
  } catch (error) {
    pool.end();
    res
      .status(500)
      .send({ msg: "Failure", result: false, addMsg: helper.errorMsg });
  }
};
