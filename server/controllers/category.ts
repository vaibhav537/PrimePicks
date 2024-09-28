import pool from "../connection/dbConnection";
import { HELPER } from "../src/Resources";
import { addCategoryRouteHelper, GetAllCategory, GetCategoryId } from "../src/routeHelpers";

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
    let CId = await helper.GenerateId();
    let createdAt = helper.getTime("Asia/Kolkata");
    let updatedAt = helper.getTime("Asia/Kolkata");
    const values: Array<string> = [
      CId,
      categoryName,
      "DEMO_VALUE",
      createdAt,
      updatedAt,
    ];
    if (await addCategoryRouteHelper(values)) {
      const result = await GetCategoryId(categoryName);
      res.status(200).send({
        msg: result.status === false ? "Failure" : "Success",
        result: result.status === false ? false : true,
        addMsg: result.id === 0 ? helper.errorMsg : result.id,
      });
    }
  } catch (error) {
    pool.end();
    res
      .status(500)
      .send({ msg: "Failure", result: false, addMsg: helper.errorMsg });
  }
};

export const allCategory = async (req: any, res: any) => {
  try {
    const resultantData = await GetAllCategory();
    res.status(200).send({ msg: "Success" , result: true, addMsg: resultantData.data});
  } catch (error) { 
    pool.end();
    res
      .status(500)
      .send({ msg: "Failure", result: false, addMsg: [] });
  }
};
