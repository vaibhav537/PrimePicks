import { createUrl, get, isStoredJWT, post, setStoredJWT } from "./apiClients";

export const signUp = async (email: string, password: string) => {
  try {
    const result = await post(createUrl("/api/auth/signup"), {
      username: "DEMO123456",
      password,
      firstName: "DEMO",
      lastName: "PrimePicks",
      email,
      phoneNumber: "6390330324",
      isAdmin: true,
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

export const me = async () => {
  return isStoredJWT() ? await (await get(createUrl("")))?.data : null;
};
