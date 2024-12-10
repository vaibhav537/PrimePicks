import express from "express";
import { signup, login, invalidResponseHandler } from "../controllers/userController";
import { adminLogin } from "../controllers/adminLogin";

const publicRouter = express.Router();

publicRouter.get("/", invalidResponseHandler);
publicRouter.post("/signup", signup);
publicRouter.post("/login", login);
publicRouter.post("/adminLogin", adminLogin);

export default publicRouter;
