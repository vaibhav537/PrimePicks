import { HELPER } from "../src/Resources";
import pool from "../connection/dbConnection";
import { adminLoginRouteHelper } from "../src/routeHelpers";

const helper = new HELPER();


export const adminLogin = async (
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
      const values = [email,hashedPassword];
      const result = await adminLoginRouteHelper(values);
      if(result.status === true && result.id !== 0) {
        const accessKey: string = await helper.GenerateKey(result.id);
        res.status(200).send({ msg: "Success", result: true, addMsg: accessKey });
      }else{
        res.status(400).send({ msg: "Failure", result: result.status });
      }
    } catch {
      pool.end();
      res
        .status(500)
        .send({ msg: "Failure", result: false, addMsg: helper.errorMsg });
    }
  };