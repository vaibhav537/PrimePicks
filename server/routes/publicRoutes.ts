import express from "express";
import { signup, login, invalidResponseHandler } from "../controllers/userController";

const publicRouter = express.Router();

publicRouter.get("/", invalidResponseHandler);
publicRouter.post("/signup", signup);
publicRouter.post("/login", login);

export default publicRouter;
