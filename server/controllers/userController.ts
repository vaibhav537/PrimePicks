import pool from "../connection/dbConnection";
import { HELPER } from "../src/Resources";
const helper = new HELPER();

export const invalidResponseHandler = (req: any, res: any) => {
  res.send("Invalid response");
};

export const signup = async (
  req: { body: { username: string; password: string; email: string } },
  res: any
) => {
  try {
    const client = await pool.connect();
    const { username, password, email } = req.body;
    let hashedPassword = helper.PasswordHasher(password);
    let id = await helper.GenerateId();
    const result = client.query(
      `INSERT INTO "PrimePicks_Users" (id , name, email, password) VALUES ($1, $2, $3, $4)`,
      [id, username, email, hashedPassword]
    );
    client.release();
    res.status(200).send({ msg: "Success", result });
  } catch (e) {
    console.error("Error executing query", e);
    res.status(500).send("Internal Server Error");
  }
};
