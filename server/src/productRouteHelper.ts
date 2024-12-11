import pool from "../connection/dbConnection";
import { HELPER } from "../src/Resources";
const helper = new HELPER();

interface ReqResult {
  status: boolean;
  id: number;
}

export async function addProductRouteHelper(
  values: Array<any>
): Promise<Boolean> {
  try {
    await pool.query(helper.addProductQuery, values);
    return true;
  } catch (error) {
    console.error("Error inserting product:", error);
    return false;
  }
}

export async function GetProductId(name: string): Promise<ReqResult> {
  try {
    const client = await pool.connect();
    const res = await client.query(helper.getProductIdQuery, [name]);
    client.release();
    return { status: true, id: res.rows[0].id };
  } catch (error) {
    return { status: false, id: 0 };
  }
}

export async function GetAllProducts() {
  try {
    const client = await pool.connect();
    const res = await client.query(helper.getAllProductsQuery);
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
    const res = await client.query(helper.deleteProductByIDQuery, [id]);
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
    const res = await client.query(helper.getProductByIdQuery, [id]);
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
    const res = await client.query(helper.updateProductDetailsQuery, values);
    client.release();
    return { status: true, data: res.rows[0].id };
  } catch (error) {
    console.log(error);
    return { status: false, data: null };
  }
}
