import * as crypto from "crypto";
import * as dotEnv from "dotenv";
import pool from "../connection/dbConnection";
import jwt from "jsonwebtoken";
import CryptoJS from "crypto-js";
dotEnv.config();
// #region class Queries
class internalQueries {
  public userInputQuery: string = `INSERT INTO "PrimePicks_Users" (id , username, email, password, phonenumber, firstname, isadmin, lastname, createdat,updatedat) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;
  public checkIdinDBQuery: string = `SELECT SUM(count) FROM (SELECT COUNT(*) AS count FROM "PrimePicks_Users" WHERE id = $1 UNION ALL SELECT COUNT(*) AS count FROM "PrimePicks_Category" WHERE id = $1 UNION ALL SELECT COUNT(*) AS count FROM "PrimePicks_Products" WHERE id = $1 UNION ALL SELECT COUNT(*) AS count FROM "PrimePicks_Orders" WHERE id = $1) AS combined_count;`;
  public userLoginQuery: string = `SELECT id FROM "PrimePicks_Users" WHERE email = $1 AND password = $2`;
  public afterSignupQuery: string = `SELECT email,firstname,lastname,isadmin FROM "PrimePicks_Users" WHERE id= $1`;
  public adminLoginQuery: string = `SELECT id FROM "PrimePicks_Users" WHERE email = $1 AND password = $2 AND isadmin = true`;
  public addCategoryQuery: string = `INSERT INTO "PrimePicks_Category"(id, name, products, createdat,updatedat) VALUES ($1,$2,$3,$4,$5)`;
  public getCategoryIdQuery: string = `SELECT id FROM "PrimePicks_Category" WHERE name = $1`;
  public getAllCategoryQuery: string = `SELECT id, name, cardinality(products) AS product_count FROM "PrimePicks_Category"`;
  public getCategoryNameByIdQuery: string = `SELECT name FROM "PrimePicks_Category" WHERE id = $1`;
  public updateCategoryNameByIdQuery: string = `UPDATE "PrimePicks_Category" SET name = $2, updatedat = $3 WHERE id = $1 RETURNING name`;
  public deleteCategoryByIDQuery: string = `DELETE FROM "PrimePicks_Category" WHERE id =$1`;
  public topCategoriesQuery: string = `SELECT c.id AS category_id, c.name AS category_name, SUM(p."discountedPrice") AS total_revenue FROM "PrimePicks_Category" c JOIN UNNEST(c.products) product_id ON true JOIN "PrimePicks_Products" p ON p.id = product_id GROUP BY c.id, c.name ORDER BY total_revenue DESC LIMIT 5;`;
  public addProductQuery: string = `INSERT INTO public."PrimePicks_Products" (id,title,description,"titlePrice","discountedPrice",colors,variants,images,createdat,updatedat,reviews,category_id, orders) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`;
  public getProductIdQuery: string = `SELECT id FROM "PrimePicks_Products" WHERE title = $1`;
  public updateCategoryQuery: string = `UPDATE public."PrimePicks_Category" SET products = array_append (products::bigint[], $1) WHERE id = $2;`;
  public getAllProductsQuery: string = `SELECT * FROM "PrimePicks_Products"`;
  public deleteProductByIDQuery: string = `DELETE FROM "PrimePicks_Products" WHERE id =$1`;
  public getProductByIdQuery: string = `SELECT * FROM "PrimePicks_Products" WHERE id = $1`;
  public updateProductDetailsQuery: string = `UPDATE "PrimePicks_Products" SET updatedat = $1, title = $2, "discountedPrice" = $3, "titlePrice" = $4, description = $5, colors = $6, variants = $7, category_id = $8 WHERE id = $9 RETURNING id`;
  public getAllOrdersQuery: string = `SELECT o.*, u.username AS user FROM public."PrimePicks_Orders" o JOIN public."PrimePicks_Users" u ON o.users::oid = u.id;`;
  public getOrderDetailsByIDQuery: string = `WITH order_products AS (SELECT po.id AS order_id, UNNEST(po.products) AS product_id FROM public."PrimePicks_Orders" po WHERE po.id = $1) SELECT po.id AS "orderId", po."createdAt", po."updatedAt", po.paymentintent, po."paymentStatus" AS "paymentStatus", po.price, po.status AS "status", JSON_BUILD_OBJECT('id', pu.id::TEXT, 'username', pu.username, 'email', pu.email) AS "user", JSON_AGG(JSON_BUILD_OBJECT('id', pp.id::TEXT, 'categoryId', pp.category_id::TEXT, 'title', pp.title, 'description', pp.description, 'colors', pp.colors, 'images', pp.images, 'createdAt', pp.createdat, 'updatedAt', pp.updatedat, 'salePrice', pp."titlePrice", 'discountedPrice', pp."discountedPrice", 'variants', pp.variants)) AS "products" FROM public."PrimePicks_Orders" po JOIN public."PrimePicks_Users" pu ON po.users = pu.id::TEXT LEFT JOIN order_products op ON po.id = op.order_id LEFT JOIN public."PrimePicks_Products" pp ON op.product_id = pp.id WHERE po.id = $1 GROUP BY po.id, pu.id;`;
  public updateOrderPaymentStatusQuery: string = `UPDATE public."PrimePicks_Orders" SET "paymentStatus" = $2 WHERE id = $1; `;
  public allOrdersQuery: string = `SELECT * FROM public."PrimePicks_Orders"`;
  public dashboardStatsQuery: string = `SELECT (SELECT COUNT(*) FROM "PrimePicks_Category") AS category_count, (SELECT COUNT(*) FROM "PrimePicks_Products") AS product_count, (SELECT COUNT(*) FROM "PrimePicks_Users") AS user_count, (SELECT COUNT(*) FROM "PrimePicks_Orders") AS order_count;`;
  public revenueQuery: string = `SELECT COALESCE(SUM(price), 0) AS total_revenue FROM "PrimePicks_Orders" WHERE "paymentStatus" = true;`;
  public revenueDataQuery: string = `SELECT DATE("createdAt") AS order_date, SUM(price) AS daily_revenue FROM "PrimePicks_Orders" WHERE "paymentStatus" = true GROUP BY DATE("createdAt") ORDER BY DATE("createdAt") DESC LIMIT 30;`;
  public recentOrdersQuery: string = `SELECT o.id AS order_id, o.price AS order_price, u.username AS user_name FROM "PrimePicks_Orders" o JOIN "PrimePicks_Users" u ON o.users::bigint = u.id ORDER BY o."createdAt" DESC LIMIT 5;`;
  public yearlySalesQuery:string = `SELECT TO_CHAR("createdAt", 'Month') AS sales_month, SUM(price) AS monthly_sales FROM "PrimePicks_Orders" WHERE "createdAt" BETWEEN '2023-01-01' AND '2023-12-31' GROUP BY TO_CHAR("createdAt", 'Month') ORDER BY MIN("createdAt");`
}
//#endregion

//#region class Helper
export class HELPER extends internalQueries {
  public errorMsg: string = "INTERNAL SERVER ERROR";
  protected SECRET_KEY: string =
    process.env.CRYPTO_KEY || "fallback-secret-key";
  public PasswordHasher(password: string): any {
    try {
      const key: any = process.env.KEY;
      const salt: any = process.env.SALT;
      if (!key) {
        throw new Error(this.errorMsg);
      }
      if (!password || !salt) {
        throw new Error(this.errorMsg);
      }
      const hash: any = crypto.createHmac("sha256", key);
      hash.update(password + salt);
      return hash.digest("hex");
    } catch {
      throw new Error(this.errorMsg);
    }
  }

  private async CheckIDinDB(id: string): Promise<boolean> {
    try {
      pool.connect();
      const res = await pool.query(this.checkIdinDBQuery, [id]);
      const count = parseInt(res.rows[0].sum || "0", 10);
      return count === 0;
    } catch {
      throw new Error(this.errorMsg);
    }
  }

  public async GenerateId(): Promise<string> {
    try {
      const characters: string = "0123456789";
      const charactersLength: number = characters.length;
      let id: string = "";
      for (let i: number = 0; i < 8; i++) {
        const randomIndex: number = Math.floor(
          Math.random() * charactersLength
        );
        id += characters[randomIndex];
      }
      const Genid: Boolean = await this.CheckIDinDB(id);
      if (Genid === true) {
        return id;
      } else {
        return this.GenerateId();
      }
    } catch (e) {
      throw new Error(this.errorMsg);
    }
  }

  public getTime(timezone: string): string {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };

    const formatter = new Intl.DateTimeFormat("en-US", options);
    const parts = formatter.formatToParts(date);

    let year = "",
      month = "",
      day = "",
      hour = "",
      minute = "",
      second = "";

    parts.forEach((part) => {
      if (part.type === "year") year = part.value;
      if (part.type === "month") month = part.value;
      if (part.type === "day") day = part.value;
      if (part.type === "hour") hour = part.value;
      if (part.type === "minute") minute = part.value;
      if (part.type === "second") second = part.value;
    });
    const result = `${year}-${month}-${day}T${hour}:${minute}:${second}`;
    return result;
  }

  public async GenerateKey(id: string | number): Promise<string> {
    try {
      const payload = { id };
      const options = {
        expiresIn: `2h`,
      };
      const secretKey = process.env.JWTKEY || "JWT_FALLBACK_SECRET";
      if (secretKey) {
        const token = jwt.sign(payload, secretKey, options);
        return token;
      }
      return "";
    } catch (err) {
      console.error(err);
      return "";
    }
  }

  public async updateRecord(id: number) {
    const timezoneISO = "Asia/Kolkata";
    const timestamp = this.getTime(timezoneISO);

    const query = "UPDATE your_table SET updated_at = $1 WHERE id = $2";
    const values = [timestamp, id];

    try {
      const client = await pool.connect();
      await client.query(query, values);
      client.release();
      console.log("Record updated successfully");
    } catch (err) {
      console.error("Error updating record:", err);
    }
  }

  public encrypter = (data: string): string | null => {
    try {
      const cipherText = CryptoJS.AES.encrypt(data, this.SECRET_KEY).toString();
      return encodeURIComponent(cipherText);
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  public decrypter = (cipherText: string): string | null => {
    try {
      const decodedCipherText = decodeURIComponent(cipherText);
      const bytes = CryptoJS.AES.decrypt(decodedCipherText, this.SECRET_KEY);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (err) {
      console.error(err);
      return null;
    }
  };
}
//#endregion
