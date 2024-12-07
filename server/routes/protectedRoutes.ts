import express from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import { getUserDetails } from "../controllers/userController";
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
import { getDashboardData } from "../controllers/dashboard";

const protectedRouter = express.Router();

protectedRouter.use(authenticateToken);

protectedRouter.get("/userDetails", getUserDetails);
protectedRouter.post("/adminLogin", adminLogin);
protectedRouter.post("/add-category", addCategory);
protectedRouter.get("/all-category", allCategory);
protectedRouter.get("/categoryNameById/:id", categoryNameById);
protectedRouter.patch("/updateCategory/:id", updateCategoryNameById);
protectedRouter.delete("/deleteCategory/:id", deleteCategoryById);
protectedRouter.post("/add-product", addProduct);
protectedRouter.get("/all-products", allProducts);
protectedRouter.delete("/deleteProduct/:id", deleteProductById);
protectedRouter.get("/productById/:id", productById);
protectedRouter.patch("/updateProduct/:id", updateProductDetails);
protectedRouter.get("/all-orders", allOrders);
protectedRouter.get("/orderById/:id", orderById);
protectedRouter.patch("/orderById/:id", updateOrderById);
protectedRouter.get("/dashboard-stats", getDashboardData);

export default protectedRouter;
