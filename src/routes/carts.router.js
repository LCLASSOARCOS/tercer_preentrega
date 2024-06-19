//carts-manager-db.js
import express from "express";
const router = express.Router();
import CartsController from "../controllers/carts.controller.js";
import authMiddleware from "../middleware/authmiddleware.js";
const cartsController = new CartsController();
router.use(authMiddleware);

router.post('/', cartsController.addCart);
router.delete('/:cid', cartsController.deleteCart);
router.post('/:cid/product/:pid', cartsController.addProductToCart);
router.get('/', cartsController.getCarts);
router.get('/:cid', cartsController.getCartById);
router.delete('/:cid/product/:pid', cartsController.deleteProductFromCart);
router.put('/:cid', cartsController.updateCart);
router.put('/:cid/product/:pid', cartsController.updateProductsQuantityCart);
router.delete('/:cid', cartsController.emptyCart);
export default router;

