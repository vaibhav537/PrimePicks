import pool from "../connection/dbConnection";
import { HELPER, ProductQueries } from "../src/Resources";
const PQH = new ProductQueries();
const helper = new HELPER();


interface ReqResult {
  status: boolean;
  id: number;
}

export async function addProductRouteHelper(
  values: Array<any>
): Promise<Boolean> {
  try {
    await pool.query(PQH.addProductQuery, values);
    return true;
  } catch (error) {
    console.error("Error inserting product:", error);
    return false;
  }
}

export async function GetProductId(name: string): Promise<ReqResult> {
  try {
    const client = await pool.connect();
    const res = await client.query(PQH.getProductIdQuery, [name]);
    client.release();
    return { status: true, id: res.rows[0].id };
  } catch (error) {
    return { status: false, id: 0 };
  }
}

export async function GetAllProducts() {
  try {
    const client = await pool.connect();
    const res = await client.query(PQH.getAllProductsQuery);
    client.release();
    return { status: true, data: res.rows };
  } catch (error) {
    console.error(error);
    return { status: false, data: [] };
  }
}

export async function DeleteProductByID(id: string) {
  try {
    const client = await pool.connect();
    const fetchResult = await client.query(PQH.getProductImagesQuery, [id]);
    if (fetchResult.rows.length === 0) {
      client.release();
      return { status: false };
    }
    const PImages: string[] = fetchResult.rows[0].images;
    const deletePromises = PImages.map((IURL) => {
      const publicId = IURL.split("/").pop()?.split(".")[0];
      return helper.deleteImage(publicId || "");
    });
    await Promise.all(deletePromises);
    const res = await client.query(PQH.deleteProductByIDQuery, [id]);
    client.release();
    if (res) {
      return { status: true };
    }
  } catch (error) {
    console.log(error);
    return { status: false };
  }
}

export async function GetSpecificProduct(id: string) {
  try {
    const client = await pool.connect();
    const res = await client.query(PQH.getProductByIdQuery, [id]);
    client.release();
    return { status: true, data: res.rows[0] };
  } catch (error) {
    console.error(error);
    return { status: false, data: null };
  }
}

export async function UpdateProduct(values: Array<string | Array<string>>) {
  try {
    const client = await pool.connect();
    const res = await client.query(PQH.updateProductDetailsQuery, values);
    client.release();
    return { status: true, data: res.rows[0].id };
  } catch (error) {
    console.log(error);
    return { status: false, data: null };
  }
}

export const getProductsByTitle = async (searchTerm: string) => {
  const values = [`%${searchTerm}%`];
  const result = await pool.query(PQH.getProductsByTitleQuery, values);
  return result.rows;
};

export const getProductsByCategory = async (categoryId: string) => {
  const values = [categoryId];
  const result = await pool.query(PQH.getProductsByCategoryQuery, values);
  return result.rows;
};
