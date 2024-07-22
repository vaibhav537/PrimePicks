import { createUrl, get, isStoredJWT, post, setStoredJWT } from "./apiClients";

export const signUp = async (username: string, password: string) => {
  try {
    const result = await post(createUrl("/api/signup"), {
      username,
      password,
      firstName: "DEMO",
      lastName: "PrimePicks",
    });
    if (!result) {
      return alert("Could not sign up");
    }
    setStoredJWT(result.data.acccessToken);
    return me();
  } catch (error) {
    console.log(error);
  }
};

export const me = async () => {
    return isStoredJWT() ? await (await get(createUrl("/api/me")))?.data : null;
}