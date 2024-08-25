"use server";
import path from "path";
import fs from "fs";
import { createUrl, post, setStoredJWT } from "../api/apiClients";


export async function logger(msg: string) {
  try{
  const logDirectory = path.join(__dirname, "logs");
  const logFile = path.join(logDirectory, "primePicks.log");

  if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
  }
  
  console.log(logDirectory + ": " + logFile);
  const message = `${new Date().toISOString()} - ${msg} \n`;
  fs.appendFileSync(logFile, message, "utf8");
  return {status: true , path: logDirectory + ": " + logFile} ;
}
catch(error){
  console.log(error);
  return {status: true , path: "No path"} ;
}
}

export async function userLogin(password: string , email: string) {
  const result = await post(createUrl("/api/auth/login"), {
    password,
    email,
  });

  if (!result) {
    return alert("Could not login!");
  }
  setStoredJWT(result.data.addMsg);
  return result.data;
}
