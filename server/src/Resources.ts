import * as crypto from "crypto";
import * as dotEnv from "dotenv";
import pool from "../connection/dbConnection";
import jwt from "jsonwebtoken";
import CryptoJS from "crypto-js";
import cloudinary from "../connection/cloudinaryConnection";
dotEnv.config();

function applyMixins(derivedCtor: any, baseCtors: any[]) {
  baseCtors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      derivedCtor.prototype[name] = baseCtor.prototype[name];
    });
  });
}

// #region class Product Queries
export class ProductQueries {
  public getProductsByCategoryQuery: string = `SELECT p.* FROM "PrimePicks_Products" p JOIN "PrimePicks_Category" c ON c.id = p.category_id WHERE c.id = $1;`;
  public addProductQuery: string = `INSERT INTO public."PrimePicks_Products" (id,title,description,"titlePrice","discountedPrice",colors,variants,images,createdat,updatedat,reviews,category_id, orders) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`;
  public getProductIdQuery: string = `SELECT id FROM "PrimePicks_Products" WHERE title = $1`;
  public getAllProductsQuery: string = `SELECT * FROM "PrimePicks_Products"`;
  public getProductsByTitleQuery: string = `SELECT * FROM "PrimePicks_Products" WHERE title ILIKE $1;`;
  public getProductImagesQuery: string = `SELECT images FROM "PrimePicks_Products" WHERE id = $1`;
  //public deleteProductByIDQuery: string = `DELETE FROM "PrimePicks_Products" WHERE id =$1`;
  public deleteProductByIDQuery: string = `WITH deleted_product AS (DELETE FROM "PrimePicks_Products" WHERE id = $1 RETURNING id) UPDATE "PrimePicks_Category" SET products = array_remove(products, (SELECT id FROM deleted_product)) WHERE $1 = ANY(products);`;
  public getProductByIdQuery: string = `SELECT * FROM "PrimePicks_Products" WHERE id = $1`;
  public updateProductDetailsQuery: string = `UPDATE "PrimePicks_Products" SET updatedat = $1, title = $2, "discountedPrice" = $3, "titlePrice" = $4, description = $5, colors = $6, variants = $7, category_id = $8 WHERE id = $9 RETURNING id`;
}
//#endregion
//#region class Order Queries
export class OrderQueries {
  public getAllOrdersQuery: string = `SELECT o.*, u.username AS user FROM public."PrimePicks_Orders" o JOIN public."PrimePicks_Users" u ON o.users::oid = u.id;`;
  public getOrderDetailsByIDQuery: string = `WITH order_products AS (SELECT po.id AS order_id, UNNEST(po.products) AS product_id FROM public."PrimePicks_Orders" po WHERE po.id = $1) SELECT po.id AS "orderId", po."createdAt", po."updatedAt", po.paymentintent, po."paymentStatus" AS "paymentStatus", po.price, po.status AS "status", JSON_BUILD_OBJECT('id', pu.id::TEXT, 'username', pu.username, 'email', pu.email) AS "user", JSON_AGG(JSON_BUILD_OBJECT('id', pp.id::TEXT, 'categoryId', pp.category_id::TEXT, 'title', pp.title, 'description', pp.description, 'colors', pp.colors, 'images', pp.images, 'createdAt', pp.createdat, 'updatedAt', pp.updatedat, 'salePrice', pp."titlePrice", 'discountedPrice', pp."discountedPrice", 'variants', pp.variants)) AS "products" FROM public."PrimePicks_Orders" po JOIN public."PrimePicks_Users" pu ON po.users = pu.id::TEXT LEFT JOIN order_products op ON po.id = op.order_id LEFT JOIN public."PrimePicks_Products" pp ON op.product_id = pp.id WHERE po.id = $1 GROUP BY po.id, pu.id;`;
  public updateOrderPaymentStatusQuery: string = `UPDATE public."PrimePicks_Orders" SET "paymentStatus" = $2 WHERE id = $1; `;
  public allOrdersQuery: string = `SELECT * FROM public."PrimePicks_Orders"`;
 // public updateProductsQuery: string = `UPDATE "PrimePicks_Products" SET orders = array_append(orders, $1) WHERE id = ANY($2)`;
  public updateProductsQuery: string = `UPDATE "PrimePicks_Products" SET orders = array_append(orders, $1) WHERE id = ANY($2::bigint[])`;
 // public updateUserQuery: string = `UPDATE "PrimePicks_Users"SET orders = array_append(orders, $1) WHERE id = ANY($2::bigint[])`;
  public updateUserQuery: string = `UPDATE "PrimePicks_Users" SET orders = array_append(orders, $1) WHERE id = ANY($2::bigint[]);`;
  public createNewOrderQuery: string = `INSERT INTO "PrimePicks_Orders" (id, "createdAt", "updatedAt", users, products, price, status, paymentintent, "paymentStatus") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;`;
  //public createNewOrderQuery: string = `INSERT INTO "PrimePicks_Orders" ("createdAt", "updatedAt", users, products, price, status, paymentintent, "paymentStatus") VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, "createdAt", "updatedAt";`;
}
//#endregion

//#region class Category Queries
export class CategoryQueries {
  public addCategoryQuery: string = `INSERT INTO "PrimePicks_Category"(id, name, products, createdat,updatedat) VALUES ($1,$2,$3,$4,$5)`;
  public getCategoryIdQuery: string = `SELECT id FROM "PrimePicks_Category" WHERE name = $1`;
  public getAllCategoryQuery: string = `SELECT id, name, cardinality(products) AS product_count FROM "PrimePicks_Category"`;
  public getCategoryNameByIdQuery: string = `SELECT name FROM "PrimePicks_Category" WHERE id = $1`;
  public updateCategoryNameByIdQuery: string = `UPDATE "PrimePicks_Category" SET name = $2, updatedat = $3 WHERE id = $1 RETURNING name;`;
  public deleteCategoryByIDQuery: string = `DELETE FROM "PrimePicks_Category" WHERE id =$1`;
  public updateCategoryQuery: string = `UPDATE public."PrimePicks_Category" SET products = array_append (products::bigint[], $1) WHERE id = $2;`;
  public topCategoriesQuery: string = `SELECT c.id AS category_id, c.name AS category_name, SUM(p."discountedPrice") AS total_revenue FROM "PrimePicks_Category" c JOIN UNNEST(c.products) product_id ON true JOIN "PrimePicks_Products" p ON p.id = product_id GROUP BY c.id, c.name ORDER BY total_revenue DESC LIMIT 5;`;
}
//#endregion
//#region class internalQueries
export class internalQueries {
  public userInputQuery: string = `INSERT INTO "PrimePicks_Users" (id , username, email, password, phonenumber, firstname, isadmin, lastname, createdat,updatedat) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;
  public checkIdinDBQuery: string = `SELECT SUM(count) FROM (SELECT COUNT(*) AS count FROM "PrimePicks_Users" WHERE id = $1 UNION ALL SELECT COUNT(*) AS count FROM "PrimePicks_Category" WHERE id = $1 UNION ALL SELECT COUNT(*) AS count FROM "PrimePicks_Products" WHERE id = $1 UNION ALL SELECT COUNT(*) AS count FROM "PrimePicks_Orders" WHERE id = $1) AS combined_count;`;
  public userLoginQuery: string = `SELECT id FROM "PrimePicks_Users" WHERE email = $1 AND password = $2`;
  public afterSignupQuery: string = `SELECT id, username,email,firstname,lastname,isadmin FROM "PrimePicks_Users" WHERE id= $1`;
  public authQuery: string = `SELECT id, username, email, phonenumber, firstname, lastname, isadmin FROM "PrimePicks_Users" WHERE id = $1`;
  public adminLoginQuery: string = `SELECT id FROM "PrimePicks_Users" WHERE email = $1 AND password = $2 AND isadmin = true`;
  public dashboardStatsQuery: string = `SELECT (SELECT COUNT(*) FROM "PrimePicks_Category") AS category_count, (SELECT COUNT(*) FROM "PrimePicks_Products") AS product_count, (SELECT COUNT(*) FROM "PrimePicks_Users") AS user_count, (SELECT COUNT(*) FROM "PrimePicks_Orders") AS order_count;`;
  public revenueQuery: string = `SELECT COALESCE(SUM(price), 0) AS total_revenue FROM "PrimePicks_Orders" WHERE "paymentStatus" = true;`;
  public revenueDataQuery: string = `SELECT DATE("createdAt") AS order_date, SUM(price) AS daily_revenue FROM "PrimePicks_Orders" WHERE "paymentStatus" = true GROUP BY DATE("createdAt") ORDER BY DATE("createdAt") DESC LIMIT 30;`;
  public recentOrdersQuery: string = `SELECT o.id AS order_id, o.price AS order_price, u.username AS user_name FROM "PrimePicks_Orders" o JOIN "PrimePicks_Users" u ON o.users::bigint = u.id ORDER BY o."createdAt" DESC LIMIT 5;`;
  public monthlySalesQuery: string = `SELECT TO_CHAR("createdAt", 'YYYY-MM') AS sales_month, SUM(price) AS total_sales, COUNT(id) AS total_orders, AVG(price) AS avg_order_value FROM public."PrimePicks_Orders" WHERE "paymentStatus" = true GROUP BY TO_CHAR("createdAt", 'YYYY-MM') ORDER BY sales_month;`;
}
//#endregion

//#region class Helper
export class HELPER extends internalQueries {
  public errorMsg: string = "INTERNAL SERVER ERROR";
  protected SECRET_KEY: string =
    process.env.CRYPTO_KEY || "fallback-secret-key";

  constructor() {
    super();
    applyMixins(HELPER, [CategoryQueries, OrderQueries, ProductQueries]);
  }

  /**
   * Hashes a given password using HMAC with SHA-256 and a salt value.
   *
   * @param {string} password - The plaintext password to hash.
   *
   * @returns {string} The resulting hashed password as a hexadecimal string.
   * @throws {Error} Throws an error if any required values are missing or if hashing fails.
   *
   * @remarks
   * This function uses HMAC (Hash-based Message Authentication Code) with the SHA-256 hashing algorithm
   * to hash the provided password. The `KEY` and `SALT` values are retrieved from environment variables
   * (`process.env.KEY` and `process.env.SALT`), and both must be defined for the function to work correctly.
   * The password is first combined with the salt before being passed into the hashing function.
   *
   * If either the `KEY` or `SALT` is missing, or if the password is not provided, the function throws an error with a custom error message (`this.errorMsg`).
   *
   * @example
   * ```typescript
   * const hashedPassword = PasswordHasher("myPassword123");
   * console.log(hashedPassword); // Output: e.g., "9a0f3d9a5b212d568d2b1ec204f6f165a38027a705c3f17f5720f0d4f3d5b2"
   * ```
   */
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

  /**
   * Checks if a given ID already exists in the database.
   *
   * @param {string} id - The ID to check for uniqueness in the database.
   *
   * @returns {Promise<boolean>} A promise that resolves to `true` if the ID does not exist in the database, or `false` if it does.
   * @throws {Error} Throws an error if the database query fails.
   *
   * @remarks
   * This function queries the database using the provided `checkIdinDBQuery` to check if the given ID already exists.
   * It assumes the query returns a `sum` field which represents the count of matching IDs in the database.
   * If the `sum` is zero, it indicates that the ID is unique, and the function returns `true`. Otherwise, it returns `false`.
   * In case of any database-related error (e.g., connection issues or invalid query), the function throws an error with a custom error message (`this.errorMsg`).
   *
   * @example
   * ```typescript
   * const idExists = await CheckIDinDB("12345678");
   * if (!idExists) {
   *   console.log("ID is unique.");
   * } else {
   *   console.log("ID already exists.");
   * }
   * ```
   */
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

  /**
   * Generates a unique 8-digit ID composed of random numeric characters.
   * The function ensures the generated ID does not already exist in the database by checking with `CheckIDinDB`.
   *
   * @returns {Promise<string>} A promise that resolves to the generated unique ID.
   * If the generated ID already exists in the database, it retries until a unique ID is found.
   *
   * @throws {Error} Throws an error if an exception occurs during ID generation or database checking.
   *
   * @remarks
   * The ID is composed of random digits (0-9) and is 8 characters long.
   * If the generated ID already exists in the database, the function recursively generates a new one until a unique ID is found.
   * The `CheckIDinDB` function is expected to return a boolean indicating whether the ID already exists in the database.
   * If any error occurs during the process (including database queries), an error is thrown with a message stored in `this.errorMsg`.
   *
   * @example
   * ```typescript
   * const uniqueId = await GenerateId();
   * console.log(uniqueId); // Output: A unique 8-digit ID, e.g., "12345678"
   * ```
   */

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

  /**
   * Retrieves the current date and time formatted as an ISO 8601 string in the specified timezone.
   *
   * @param {string} timezone - The IANA timezone identifier (e.g., "Asia/Kolkata").
   *
   * @returns {string} A string representing the current date and time in the specified timezone, formatted as `YYYY-MM-DDTHH:mm:ss`.
   *
   * @throws {Error} If an invalid timezone is provided, the function may throw an error internally during formatting.
   *
   * @remarks
   * This function uses the `Intl.DateTimeFormat` API to format the current date and time based on the provided timezone.
   * The resulting string includes both date (`YYYY-MM-DD`) and time (`HH:mm:ss`) in a 24-hour format, separated by a `T`.
   *
   * The function parses the `formatToParts` output to extract individual components like year, month, day, hour, minute, and second.
   *
   * @example
   * ```typescript
   * const timezone = "Asia/Kolkata";
   * const currentTime = getTime(timezone);
   * console.log(currentTime); // Output: e.g., "2024-12-25T14:30:45"
   * ```
   */

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

  /**
   * Generates a JSON Web Token (JWT) for a given user ID with a 2-hour expiration time.
   *
   * @param {string | number} id - The user ID to include in the JWT payload.
   *
   * @returns {Promise<string>} A promise that resolves to the generated JWT as a string, or an empty string if an error occurs.
   *
   * @throws {Error} Logs an error to the console if token generation fails.
   *
   * @remarks
   * This function generates a JWT using the `jsonwebtoken` library. The token's payload contains the user ID,
   * and the token is signed with a secret key retrieved from the environment variable `JWTKEY`.
   * If `JWTKEY` is not defined, a fallback secret key (`JWT_FALLBACK_SECRET`) is used.
   *
   * The token expires after 2 hours, as specified in the options.
   * If an error occurs during token generation, the function logs the error and returns an empty string.
   *
   * @example
   * ```typescript
   * const userId = 123;
   * const token = await GenerateKey(userId);
   * if (token) {
   *   console.log("Generated Token:", token);
   * } else {
   *   console.log("Token generation failed.");
   * }
   * ```
   */

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

  /**
   * Updates the `updated_at` timestamp of a record in the database with the given `id`.
   *
   * @param {number} id - The ID of the record to be updated.
   *
   * @returns {Promise<void>} A promise that resolves when the update operation is complete.
   *
   * @throws {Error} Logs an error to the console if the database query fails.
   *
   * @remarks
   * This function updates the `updated_at` column in the database table `your_table` with the current timestamp for the specified record ID.
   * The timestamp is generated based on the provided timezone (`Asia/Kolkata`).
   * It uses a PostgreSQL client from the connection pool (`pool`) to execute the update query.
   * After the query, the database connection is released back to the pool.
   *
   * @example
   * ```typescript
   * await updateRecord(123);
   * // Logs: "Record updated successfully" on success
   * // Logs: "Error updating record:" followed by error details on failure
   * ```
   */

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
  /**
   * Encrypts a given string using AES encryption and returns the URI-encoded ciphertext.
   *
   * @param {string} data - The plaintext string to encrypt.
   *
   * @returns {string | null} The AES-encrypted and URI-encoded ciphertext if successful, or `null` if an error occurs during encryption.
   *
   * @throws {Error} Logs an error to the console if encryption fails, but does not throw the error explicitly.
   *
   * @remarks
   * This function uses the AES encryption algorithm provided by CryptoJS, encrypting the input data with a predefined `SECRET_KEY`.
   * The resulting ciphertext is then URI-encoded using `encodeURIComponent` to make it safe for use in URLs or other transmission mechanisms.
   * If encryption fails, the function logs the error and returns `null`.
   *
   * @example
   * ```typescript
   * const plainText = "Hello, world!";
   * const encryptedText = encrypter(plainText);
   * if (encryptedText) {
   *   console.log(encryptedText); // Output: e.g., "U2FsdGVkX1+O9ZlYkYXH44smQ%2ByJ9PSF"
   * } else {
   *   console.log("Encryption failed.");
   * }
   * ```
   */
  public encrypter = (data: string): string | null => {
    try {
      const cipherText = CryptoJS.AES.encrypt(data, this.SECRET_KEY).toString();
      return encodeURIComponent(cipherText);
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  /**
   * Decrypts a given AES-encrypted ciphertext and returns the decrypted string.
   *
   * @param {string} cipherText - The AES-encrypted string to decrypt.
   * The input is expected to be a URI-encoded string.
   *
   * @returns {string | null} The decrypted string if successful, or `null` if an error occurs during decryption.
   *
   * @throws {Error} Logs an error to the console if decryption fails, but does not throw the error explicitly.
   *
   * @remarks
   * The function first decodes the URI-encoded ciphertext using `decodeURIComponent`.
   * It then decrypts the result using the AES algorithm provided by CryptoJS with a pre-defined `SECRET_KEY`.
   * If decryption fails, the function logs the error and returns `null` instead of throwing an exception.
   *
   * @example
   * ```typescript
   * const encryptedText = "U2FsdGVkX1+O9ZlYkYXH44smQ%2ByJ9PSF";
   * const decryptedText = decrypter(encryptedText);
   * if (decryptedText) {
   *   console.log(decryptedText); // Output: e.g., "Hello, world!"
   * } else {
   *   console.log("Decryption failed.");
   * }
   * ```
   */

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

  /**
   * Deletes an image from Cloudinary using its public ID.
   *
   * @param publicId - The public ID of the image to be deleted from Cloudinary.
   * @returns A Promise that resolves to a boolean indicating whether the deletion was successful.
   * @throws Will throw an error if the deletion process fails.
   *
   * @remarks
   * This function attempts to delete an image from Cloudinary using the provided public ID.
   * It returns true if the deletion was successful, and false otherwise.
   * If an error occurs during the deletion process, it is logged and then re-thrown.
   *
   * @example
   * ```typescript
   * try {
   *   const isDeleted = await deleteImage('sample_image_id');
   *   console.log(isDeleted ? 'Image deleted successfully' : 'Image deletion failed');
   * } catch (error) {
   *   console.error('Error occurred while deleting image:', error);
   * }
   * ```
   */
  public async deleteImage(publicId: string): Promise<boolean> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      if (result.result === "ok") {
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error deleting image:", error);
      throw error;
    }
  }

  /**
   * Generates a UUID (Universally Unique Identifier) version 4.
   * UUIDs are used to uniquely identify information in computer systems.
   *
   * @returns {string} A string representation of the generated UUID.
   *
   * @remarks
   * The generated UUID follows the standard UUID format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx.
   * The 'x' characters are replaced with random hexadecimal digits, and the 'y' character is replaced with a random digit from 8 to B.
   * This ensures that the generated UUID is globally unique and unpredictable.
   *
   * @example
   * ```typescript
   * const uuid = new HELPER().uuidv4();
   * console.log(uuid); // Output: e.g., "123e4567-e89b-12d3-a456-426614174000"
   * ```
   */
  public uuidv4(): string {
    //GENERATE A UUID V4 USING RANDOMNESS AND SPECIFIC PLACEMENT FOR VERSION AND VARIANT BITS
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
      const random = (Math.random() * 16) | 0; //GENERATE A RANDOM INTEGER BETWEEN 0 AND 15
      const value = char === "x" ? random : (random & 0x3) | 0x8; // SET BITS FOR VERSIONS AND VARIANTS
      return value.toString(16); // CONVERT TO HEXADECIMAL VALUE
    });
  }
}
//#endregion

/**
 * Represents the structure of an order in the system.
 *
 * This interface defines all the necessary fields that describe an order,
 * including its unique identifier, timestamps, user information, associated products,
 * payment details, and status.
 *
 * @interface OrderType
 *
 * @property {number} id - The unique identifier of the order.
 * @property {string} createdAt - The timestamp when the order was created, in ISO format.
 * @property {string} updatedAt - The timestamp when the order was last updated, in ISO format.
 * @property {string} users - The ID or username of the user who placed the order.
 * @property {number[]} products - An array of product IDs included in the order.
 * @property {number} price - The total price for the order.
 * @property {object} status - An object containing the payment method and additional status-related fields.
 * @property {string} status.paymentMode - The payment method used for the order (e.g., "stripe").
 * @property {any} status[key] - Flexible key-value pairs for additional status-related fields.
 * @property {string | null} paymentIntent - The payment intent ID (if applicable) for tracking payment transactions.
 * @property {boolean} paymentStatus - Indicates whether the payment for the order is successful (`true`) or not (`false`).
 *
 * @example
 * ```typescript
 * const order: OrderType = {
 *   id: 1,
 *   createdAt: "2024-12-25T12:34:56Z",
 *   updatedAt: "2024-12-25T14:00:00Z",
 *   users: "user123",
 *   products: [101, 102, 103],
 *   price: 250.75,
 *   status: {
 *     paymentMode: "stripe",
 *     transactionId: "txn_12345",
 *   },
 *   paymentIntent: "pi_12345",
 *   paymentStatus: true,
 * };
 * ```
 */

export interface OrderType {
  id: number;
  createdAt: string;
  updatedAt: string;
  users: string; // Changed from `user` to `users` for consistency
  products: number[];
  price: number;
  status: {
    status: string;
    [key: string]: any;
  };
  paymentIntent: string | null;
  paymentStatus: boolean;
}

/**
 * Defines the structure of the input data required to create a new order.
 *
 * This interface is used to specify the necessary information for creating an order.
 * It includes fields such as the user ID or username, the list of product IDs, the total price of the order,
 * and the payment status, including the payment method and any additional status-related data.
 *
 * @interface OrderCreateInput
 *
 * @property {string} user - The ID or username of the user placing the order.
 * @property {number[]} products - An array of product IDs included in the order.
 * @property {number} price - The total price of the order.
 * @property {object} status - An object containing the payment mode and additional status-related data.
 * @property {string} status.paymentMode - The method of payment (e.g., "stripe" or another payment method).
 * @property {any} status[key] - A flexible key-value pair that allows for additional fields related to the payment status.
 *
 * @example
 * ```typescript
 * const orderInput: OrderCreateInput = {
 *   user: "user123",
 *   products: [1, 2, 3],
 *   price: 100.50,
 *   status: {
 *     paymentMode: "stripe",
 *     transactionId: "txn_12345",
 *   },
 * };
 * ```
 */

export interface OrderCreateInput {
  user: string;
  products: number[];
  price: number;
  status: {
    paymentMode: string;
    [key: string]: any;
  };
}
