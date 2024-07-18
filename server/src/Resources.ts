import * as crypto from "crypto";
import * as dotEnv from "dotenv";
import pool from "../connection/dbConnection";

dotEnv.config();

class internalQueries {
  public userInputQuery: string = `INSERT INTO "PrimePicks_Users" (id , name, email, password, phonenumber) VALUES ($1, $2, $3, $4, $5)`;
  public checkIdinDBQuery: string = `SELECT COUNT(*) FROM "PrimePicks_Users" WHERE id = $1`;
  public loginQuery: string = `SELECT name FROM "PrimePicks_Users" WHERE email = $1 AND password = $2`;
}

//#region class Helper
export class HELPER extends internalQueries{
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
      for (let i:number = 0; i < 8; i++) {
        const randomIndex: number = Math.floor(Math.random() * charactersLength);
        id += characters[randomIndex];
      }
      const Genid : Boolean = await this.CheckIDinDB(id);
      if (Genid === true) {
        return id;
      } else {
        return this.GenerateId();
      }
    } catch (e) {
      throw new Error(this.errorMsg);
    }
  }
}
//#endregion