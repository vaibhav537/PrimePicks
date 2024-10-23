import pool from "../connection/dbConnection";
import { HELPER } from "../src/Resources";
import {
  addCategoryRouteHelper,
  DeleteCategoryByID,
  GetAllCategory,
  GetCategoryId,
  GetSpecificCategory,
  UpdateCategory,
} from "../src/routeHelpers";

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
      "PP_DEMO_VALUE",
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
    res
      .status(200)
      .send({ msg: "Success", result: true, addMsg: resultantData.data });
  } catch (error) {
    pool.end();
    res.status(500).send({ msg: "Failure", result: false, addMsg: [] });
  }
};

export const categoryNameById = async (req: any, res: any) => {
  try {
    const resultantData = await GetSpecificCategory(req.params.id);
    if (resultantData.status === true) {
      res
        .status(200)
        .send({ msg: "Success", result: true, addMsg: resultantData.data });
    }
  } catch (error) {
    pool.end();
    res.status(500).send({ msg: "Failure", result: false, addMsg: null });
  }
};

export const updateCategoryNameById = async (
  req: {
    params: { id: string }; // Added 'params' with 'id' type
    body: { name: string };
  },
  res: any
) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const resultantData = await UpdateCategory(id, name);
    if (resultantData.status === true) {
      res
        .status(200)
        .send({ msg: "Success", result: true, addMsg: resultantData.data });
    } else {
      res.status(500).send({ msg: "Failure", result: false, addMsg: null });
    }
  } catch (error) {
    pool.end();
    res.status(500).send({ msg: "Failure", result: false, addMsg: null });
  }
};

export const deleteCategoryById = async (
  req: { params: { id: string } },
  res: any
) => {
  try {
    const { id } = req.params;
    const resultantData = await DeleteCategoryByID(id);
    if (resultantData?.status === true) {
      res.status(200).send({ msg: "Success", result: true });
    } else {
      res.status(404).send({ msg: "Failure", result: false });
    }
  } catch (error) {
    pool.end();
    res.status(500).send({ msg: "Failure", result: false });
  }
};
