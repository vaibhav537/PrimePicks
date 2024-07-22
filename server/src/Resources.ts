import * as crypto from "crypto";
import * as dotEnv from "dotenv";
import pool from "../connection/dbConnection";

dotEnv.config();

class internalQueries {
  public userInputQuery: string = `INSERT INTO "PrimePicks_Users" (id , username, email, password, phonenumber, firstname, isadmin, lastname) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
  public checkIdinDBQuery: string = `SELECT COUNT(*) FROM "PrimePicks_Users" WHERE id = $1`;
  public loginQuery: string = `SELECT name FROM "PrimePicks_Users" WHERE email = $1 AND password = $2`;
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

  public getCreatedAtTime(timezone: string): string {
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

    const dateTime = parts.reduce((acc, part) => {
      switch (part.type) {
        case "year":
          return acc + part.value + "-";
        case "month":
          return acc + part.value + "-";
        case "day":
          return acc + part.value + "T";
        case "hour":
          return acc + part.value + ":";
        case "minute":
          return acc + part.value + ":";
        case "second":
          return acc + part.value;
        default:
          return acc;
      }
    }, "");

    const offset = -date.getTimezoneOffset();
    const sign = offset >= 0 ? "+" : "-";
    const pad = (n: number) => (n < 10 ? "0" : "") + Math.abs(n);
    const offsetHours = pad(Math.floor(offset / 60));
    const offsetMinutes = pad(offset % 60);

    return `${dateTime}${sign}${offsetHours}:${offsetMinutes}`;
  }

  public async updateRecord(id: number) {
    const timezoneISO = "Asia/Kolkata";
    const timestamp = this.getCreatedAtTime(timezoneISO);

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
