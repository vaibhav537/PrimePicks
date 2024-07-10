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
    client.query(helper.userInputQuery, [
      id,
      username,
      email,
      hashedPassword,
      phoneNumber,
    ]);
    client.release();
    res.status(200).send({ msg: "Success", result: true });
  } catch {
    pool.end();
    res
      .status(500)
      .send({ msg: "Failure", result: false, addMsg: helper.errorMsg });
  }
};

export const login = async (
  req: {
    body: {
      password: string;
      email: string;
    };
  },
  res: any
) => {
  try {
    const client = await pool.connect();
    const { password, email } = req.body;
    let hashedPassword = helper.PasswordHasher(password);
    const result = await client.query(helper.loginQuery, [
      email,
      hashedPassword,
    ]);
    const res = result.rows[0].name;
    pool.end();
    res.status(200).send({ msg: "Success", result: true, addMsg: res });
  } catch {
    pool.end();
    res.status(500).send({ msg: "Failure", result:false, addMsg: helper.errorMsg });
  }
};
