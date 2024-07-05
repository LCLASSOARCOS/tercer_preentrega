import express from "express";
import ProductsController from "../controllers/products.controller.js";
import authMiddleware from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/authorizationMiddleware.js';

const pc = new ProductsController();
const router = express.Router();

router.get("/", pc.getProductsApi);
router.get("/:pid", pc.getProductById);
router.post("/", authMiddleware, adminOnly, pc.addProduct); // Agregar producto solo para admin
router.put("/:pid", authMiddleware, adminOnly, pc.updateProduct); // Actualizar producto solo para admin
router.delete("/:pid", authMiddleware, adminOnly, pc.deleteProduct); // Eliminar producto solo para admin

export default router;