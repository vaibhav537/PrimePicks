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
import {
  addProduct,
  allProducts,
  deleteProductById,
  productById,
  updateProductDetails,
} from "../controllers/product";
import { allOrders, orderById, updateOrderById } from "../controllers/orders";

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
router.get("/all-products", allProducts);
router.delete("/deleteProduct/:id", deleteProductById);
router.get("/productById/:id", productById);
router.patch("/updateProduct/:id", updateProductDetails);
router.get("/all-orders", allOrders);
router.get("/orderById/:id", orderById);
router.patch("/orderById/:id", updateOrderById);
export default router;
