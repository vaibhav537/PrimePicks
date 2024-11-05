import pool from "../connection/dbConnection";
import { HELPER } from "../src/Resources";
import {
  addProductRouteHelper,
  GetAllProducts,
  GetProductId,
} from "../src/productRouteHelper";
const helper = new HELPER();

export const addProduct = async (
  req: {
    body: {
      category: { id: string };
      colors: string[];
      description: string[];
      discountedPrice: number;
      images: string[];
      titlePrice: number;
      title: string;
      variants: string[];
    };
  },
  res: any
) => {
  try {
    const {
      category,
      colors,
      description,
      discountedPrice,
      images,
      titlePrice,
      title,
      variants,
    } = req.body;

    // Generate unique product ID
    let PId:string = await helper.GenerateId();

    // Get current time for createdAt and updatedAt timestamps
    let createdAt:string = helper.getTime("Asia/Kolkata");
    let updatedAt:string = helper.getTime("Asia/Kolkata");
    // Set a default value for reviews
    const reviews:string = "No reviews yet";
    const orders:bigint[] = [];

    const values: Array<string | number | bigint[]> = [
      PId,
      title,
      JSON.stringify(description), // Convert description array to JSON
      titlePrice,
      discountedPrice,
      JSON.stringify(colors), // Convert colors array to JSON
      JSON.stringify(variants), // Convert variants array to JSON
      JSON.stringify(images), // Convert images array to JSON
      createdAt,
      updatedAt,
      reviews,
      category.id, // Assuming this is the category ID
      orders,
    ];

    if (await addProductRouteHelper(values)) {
      const result = await GetProductId(title);
      if (result.status === true && result.id !== 0) {
        const productId = result.id;
        await pool.query(helper.updateCategoryQuery, [productId, category.id]);
        res.status(200).send({
          msg: "Success",
          result: true,
          addMsg: productId,
        });
      }
    } else {
      res.status(500).send({
        msg: "Failure",
        result: false,
        addMsg: helper.errorMsg,
      });
    }
  } catch (error) {
    // Handle any errors and respond with failure
    console.error("Error adding product:", error);
    res.status(500).send({
      msg: "Failure",
      result: false,
      addMsg: helper.errorMsg,
    });
  }
};

export const allProducts = async (req: any, res: any) => {
  try {
    const resultantData = await GetAllProducts();
    res
      .status(200)
      .send({ msg: "Success", result: true, addMsg: resultantData.data });
  } catch (error) {
    pool.end();
    res.status(500).send({ msg: "Failure", result: false, addMsg: [] });
  }
};
