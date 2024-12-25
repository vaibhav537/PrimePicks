import express, { Request, Response, NextFunction } from "express";
import { authenticateToken } from "../middleware/authMiddleware"; // import without AuthenticateRequest here
import { getUserDetails } from "../controllers/userController";
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
  searchProducts,
  updateProductDetails,
} from "../controllers/product";
import { addOrder, allOrders, orderById, updateOrderById } from "../controllers/orders";
import { getDashboardData } from "../controllers/dashboard";

const protectedRouter = express.Router();

// Apply the authentication middleware globally to the routes
protectedRouter.use(authenticateToken); // No need for casting req as AuthenticateRequest

// User routes
protectedRouter.get("/userDetails", getUserDetails);

// Category routes
protectedRouter.post("/add-category", addCategory);
protectedRouter.get("/all-category", allCategory);
protectedRouter.get("/categoryNameById/:id", categoryNameById);
protectedRouter.patch("/updateCategory/:id", updateCategoryNameById);
protectedRouter.delete("/deleteCategory/:id", deleteCategoryById);

// Product routes
protectedRouter.post("/add-product", addProduct);
protectedRouter.get("/all-products", allProducts);
protectedRouter.delete("/deleteProduct/:id", deleteProductById);
protectedRouter.get("/productById/:id", productById);
protectedRouter.patch("/updateProduct/:id", updateProductDetails);

// Order routes
protectedRouter.get("/all-orders", allOrders);
protectedRouter.get("/orderById/:id", orderById);
protectedRouter.patch("/orderById/:id", updateOrderById);
protectedRouter.post("/orders", addOrder)

// Dashboard routes
protectedRouter.get("/dashboard-stats", getDashboardData);

// Product search
protectedRouter.get("/searchProducts", searchProducts);

export default protectedRouter;
