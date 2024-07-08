import express from "express";
import { signup, invalidResponseHandler } from "../controllers/userController";

const router = express.Router();
router.get("/", invalidResponseHandler);

router.post("/signup", signup);

export default router;
