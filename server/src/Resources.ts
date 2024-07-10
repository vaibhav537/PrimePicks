import * as crypto from "crypto";
import * as dotEnv from "dotenv";
import pool from "../connection/dbConnection";

dotEnv.config();

export class HELPER {
  public PasswordHasher(password: string): any {
    try {
      const key = process.env.KEY;
      const salt = process.env.SALT;
      if (!key) {
        throw new Error(`Internal Server Error`);
      }
      if (!password || !salt) {
        throw new Error(`Internal Server Error`);
      }
      const hash = crypto.createHmac("sha256", key);
      hash.update(password + salt);
      return hash.digest("hex");
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  private async CheckIDinDB(id: string): Promise<boolean> {
    const query = `SELECT COUNT(*) FROM "PrimePicks_Users" WHERE id = $1`;
    try {
      pool.connect();
      const res = await pool.query(query, [id]);
      console.log("id:", id, { res });
      const count = parseInt(res.rows[0].count, 10);
      return count === 0;
    } catch (err) {
      console.log(err);
      throw new Error("INTERNAL ERROR");
    }
  }

  public async GenerateId(): Promise<string> {
    try {
      const characters: string = "0123456789";
      const charactersLength: number = characters.length;
      let id = "";
      for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * charactersLength);
        id += characters[randomIndex];
      }
      const Genid = await this.CheckIDinDB(id);
      if (Genid === true) {
        console.log("HERE IS ID");
        return id;
      } else {
        console.log("HERE IS NO ID");
        return this.GenerateId();
      }
    } catch (e) {
      console.log(e);
      return "";
    }
  }
}
