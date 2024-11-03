import express from "express";
import {
  signup,
  invalidResponseHandler,
  login,
} from "../controllers/userController";
import { adminLogin } from "../controllers/adminLogin";
import {
  addCategory,
  allCategory,
  categoryNameById,
  deleteCategoryById,
  updateCategoryNameById,
} from "../controllers/category";
import { addProduct } from "../controllers/product";

const router = express.Router();
router.get("/", invalidResponseHandler);

router.post("/signup", signup);
router.post("/login", login);
router.post("/adminLogin", adminLogin);
router.post("/add-category", addCategory);
router.get("/all-category", allCategory);
router.get("/categoryNameById/:id", categoryNameById);
router.patch("/updateCategory/:id", updateCategoryNameById);
router.delete("/deleteCategory/:id", deleteCategoryById);
router.post("/add-product", addProduct);
export default router;
