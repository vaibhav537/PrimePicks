import { adminLogin, userLogin } from "../utils/HelperClient";
import { createUrl, post, setStoredJWT } from "./apiClients";

export const signUp = async (
  email: string,
  password: string,
  isAdmin: boolean = false
) => {
  try {
    const result = await post(createUrl("/api/auth/signup"), {
      username: "DEMO123456",
      password,
      firstName: "DEMO",
      lastName: "PrimePicks",
      email,
      phoneNumber: "6390330324",
      isAdmin,
    });
    if (!result) {
      return alert("Could not sign up");
    }
    setStoredJWT(result.data.addMsg);
    return result.data;
  } catch (error) {
    console.log(error);
  }
};

export const login = async (
  email: string,
  password: string,
  isLoginforAdmin: boolean = false
) => {
  try {
    if(isLoginforAdmin) {

      const adminResult = await adminLogin(password,email);
      return adminResult;
    }
    else{
   const userResult = await userLogin(email, password);
   return userResult;
  }

  } catch (error) {
    console.log(error);
  }
};
