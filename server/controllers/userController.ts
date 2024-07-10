import pool from "../connection/dbConnection";
import { HELPER } from "../src/Resources";
const helper = new HELPER();

export const invalidResponseHandler = (req: any, res: any) => {
  res.send("Invalid response");
};

export const signup = async (
  req: {
    body: {
      username: string;
      password: string;
      email: string;
      phoneNumber: number;
    };
  },
  res: any
) => {
  try {
    const client = await pool.connect();
    const { username, password, email, phoneNumber } = req.body;
    let hashedPassword = helper.PasswordHasher(password);
    let id = await helper.GenerateId();
    console.log("id: ", id);
    console.log("name: ", username);
    console.log("email: ", email);
    console.log("phoneNumber", phoneNumber);
    console.log("password", hashedPassword);
    const result = client.query(
      `INSERT INTO "PrimePicks_Users" (id , name, email, password, phonenumber) VALUES ($1, $2, $3, $4, $5)`,
      [id, username, email, hashedPassword, phoneNumber]
    );
    client.release();
    res.status(200).send({ msg: "Success", result });
  } catch (e) {
    console.error("Error executing query", e);
    res.status(500).send("Internal Server Error");
  }
};
