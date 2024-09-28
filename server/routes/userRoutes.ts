import express from "express";
import { signup, invalidResponseHandler, login } from "../controllers/userController";
import { adminLogin } from "../controllers/adminLogin";
import { addCategory, allCategory } from "../controllers/category";

const router = express.Router();
router.get("/", invalidResponseHandler);

router.post("/signup", signup);
router.post("/login", login);
router.post("/adminLogin", adminLogin);
router.post("/add-category", addCategory);
router.get("/all-category", allCategory);
export default router;
