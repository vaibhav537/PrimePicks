import { Request, Response } from "express";
import pool from "../connection/dbConnection";
import { HELPER } from "../src/Resources";
import { loginRouteHelper, signupRouteHelper } from "../src/routeHelpers";
import { AuthenticateRequest } from "../middleware/authMiddleware";
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
    const { password, email } = req.body;
    let hashedPassword = helper.PasswordHasher(password);
    const values = [email, hashedPassword];
    const result = await loginRouteHelper(values);
    if (result.status === true && result.id !== 0) {
      const accessKey: string = await helper.GenerateKey(result.id);
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

export const getUserDetails = async (
  req: AuthenticateRequest,
  res: Response
):Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
     res.status(400).json({ message: "User ID not found" });
     return;
    }
    const { rows } = await pool.query(helper.authQuery, [userId]);

    if (rows.length === 0) {
     res.status(404).json({ message: "User not found" });
     return;
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
