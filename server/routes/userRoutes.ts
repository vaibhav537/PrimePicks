import express from "express";
import { signup, invalidResponseHandler, login } from "../controllers/userController";

const router = express.Router();
router.get("/", invalidResponseHandler);

router.post("/signup", signup);
router.post("/login", login);
export default router;
