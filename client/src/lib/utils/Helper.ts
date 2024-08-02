"use server";
import path from "path";
import fs from "fs";

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
