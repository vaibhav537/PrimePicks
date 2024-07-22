import pool from "../connection/dbConnection";
import { HELPER } from "../src/Resources";
import { signupRouteHelper } from "../src/routeHelpers";
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
      firstName: string;
      isAdmin: boolean;
      lastName: string;
    };
  },
  res: any
) => {
  try {
    const {
      username,
      password,
      email,
      phoneNumber,
      firstName,
      isAdmin,
      lastName,
    } = req.body;
    let hashedPassword = helper.PasswordHasher(password);
    let id = await helper.GenerateId();
    let createdAt  = helper.getCreatedAtTime("Asia/Kolkata");
    
    let values =  [
      id,
      username,
      email,
      hashedPassword,
      phoneNumber,
      firstName,
      isAdmin,
      lastName,
    ];
    const insertRes: Boolean = await  signupRouteHelper(values);
    
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
    res
      .status(500)
      .send({ msg: "Failure", result: false, addMsg: helper.errorMsg });
  }
};
