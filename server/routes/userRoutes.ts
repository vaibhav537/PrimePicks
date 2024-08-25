import express from "express";
import { signup, invalidResponseHandler, login } from "../controllers/userController";
import { adminLogin } from "../controllers/adminLogin";

const router = express.Router();
router.get("/", invalidResponseHandler);

router.post("/signup", signup);
router.post("/login", login);
router.post("/adminLogin", adminLogin);
export default router;
