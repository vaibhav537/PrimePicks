import * as crypto from "crypto";
import * as dotEnv from "dotenv";
import pool from "../connection/dbConnection";
import jwt from "jsonwebtoken";
dotEnv.config();

class internalQueries {
  public userInputQuery: string = `INSERT INTO "PrimePicks_Users" (id , username, email, password, phonenumber, firstname, isadmin, lastname, createdat,updatedat) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;
  public checkIdinDBQuery: string = `SELECT COUNT(*) FROM "PrimePicks_Users" WHERE id = $1`;
  public userLoginQuery: string = `SELECT id FROM "PrimePicks_Users" WHERE email = $1 AND password = $2`;
  public afterSignupQuery: string = `SELECT email,firstname,lastname,isadmin FROM "PrimePicks_Users" WHERE id= $1`;
  public adminLoginQuery: string = `SELECT id FROM "PrimePicks_Users" WHERE email = $1 AND password = $2 AND isadmin = true`;
}

//#region class Helper
export class HELPER extends internalQueries {
  public errorMsg: string = "INTERNAL SERVER ERROR";
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
      const count = parseInt(res.rows[0].count, 10);
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
}
//#endregion
