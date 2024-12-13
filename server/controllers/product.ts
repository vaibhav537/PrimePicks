import pool from "../connection/dbConnection";
import qs from "qs";
import { HELPER } from "../src/Resources";
import { Request, Response } from "express";
import {
  addProductRouteHelper,
  DeleteProductByID,
  GetAllProducts,
  GetProductId,
  getProductsByCategory,
  getProductsByTitle,
  GetSpecificProduct,
  UpdateProduct,
} from "../src/productRouteHelper";
const helper = new HELPER();

interface SearchQuery {
  where?: string; // The query string will be a JSON string
}
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
    let PId: string = await helper.GenerateId();

    // Get current time for createdAt and updatedAt timestamps
    let createdAt: string = helper.getTime("Asia/Kolkata");
    let updatedAt: string = helper.getTime("Asia/Kolkata");
    // Set a default value for reviews
    const reviews: string = "No reviews yet";
    const orders: bigint[] = [];

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

export const deleteProductById = async (
  req: { params: { id: string } },
  res: any
) => {
  try {
    const { id } = req.params;
    const resultantData = await DeleteProductByID(id);
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

export const productById = async (req: any, res: any) => {
  try {
    const resultantData = await GetSpecificProduct(req.params.id);

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

export const updateProductDetails = async (
  req: {
    params: { id: string }; // Added 'params' with 'id' type
    body: {
      title: string;
      discountedPrice: string;
      titlePrice: string;
      description: Array<string>;
      colors: Array<string>;
      variants: Array<string>;
      categoryID: string;
    };
  },
  res: any
) => {
  try {
    const { id } = req.params;
    const {
      title,
      discountedPrice,
      titlePrice,
      description,
      colors,
      variants,
      categoryID,
    } = req.body;
    const updatedAt = helper.getTime("Asia/Kolkata");
    const values = [
      updatedAt,
      title,
      discountedPrice,
      titlePrice,
      JSON.stringify(description), // Convert to JSON
      JSON.stringify(colors), // Convert to JSON
      JSON.stringify(variants), // Convert to JSON
      categoryID,
      id,
    ];
    const resultantData = await UpdateProduct(values);
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

export const searchProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { where } = req.query;

    if (!where || typeof where !== "object") {
      res.status(400).json({ message: "Invalid query" });
      return;
    }

    const filters = where as {
      title?: { contains?: string };
      category?: { id?: string };
    };
    let products;

    if (filters.title?.contains) {
      products = await getProductsByTitle(filters.title.contains);
    } else if (filters.category?.id) {
      products = await getProductsByCategory(filters.category.id);
    } else {
      res.status(400).json({ message: "Invalid filters" });
      return;
    }

    res.status(200).json({ data: products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
