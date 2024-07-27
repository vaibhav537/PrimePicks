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
    let createdAt = helper.getTime("Asia/Kolkata");
    let updatedAt = helper.getTime("Asia/Kolkata");
    let values = [
      id,
      username,
      email,
      hashedPassword,
      phoneNumber,
      firstName,
      isAdmin,
      lastName,
      createdAt,
      updatedAt,
    ];
    if (await signupRouteHelper(values)) {
      const accessKey: string = await helper.GenerateKey(id);
      res.status(200).send({ msg: "Success", result: true, addMsg: accessKey });
    } else {
      res.status(400).send({ msg: "Failure", result: false });
    }
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

    console.log(result);
    pool.end();
    //res.status(200).send({ msg: "Success", result: true, addMsg: res });
  } catch {
    pool.end();
    res
      .status(500)
      .send({ msg: "Failure", result: false, addMsg: helper.errorMsg });
  }
};
