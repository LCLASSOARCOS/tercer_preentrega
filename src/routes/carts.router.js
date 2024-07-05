import express from "express";
const router = express.Router();
import CartsController from "../controllers/carts.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { userOnly } from "../middleware/authorizationMiddleware.js";

const cartsController = new CartsController();

router.use(authMiddleware);

router.post('/', userOnly, cartsController.addCart); // Solo el usuario puede agregar carrito
router.delete('/:cid', userOnly, cartsController.deleteCart); // Solo el usuario puede borrar carrito
router.post('/:cid/product/:pid', userOnly, cartsController.addProductToCart); // Solo el usuario puede agregar productos al carrito
router.get('/', userOnly, cartsController.getCarts); // Solo el usuario puede ver carritos
router.get('/:cid', userOnly, cartsController.getCartById); // Solo el usuario puede ver un carrito específico
router.delete('/:cid/product/:pid', userOnly, async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const result = await cs.deleteProductCart(cid, pid);
        if (result.status) {
            res.json({ status: 'success' });
        } else {
            res.json({ status: 'failure' });
        }
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});
router.put('/:cid', userOnly, cartsController.updateCart); // Solo el usuario puede actualizar carrito
router.put('/:cid/product/:pid', userOnly, cartsController.updateProductsQuantityCart); // Solo el usuario puede actualizar cantidad de productos en el carrito
router.delete('/:cid', userOnly, cartsController.emptyCart); // Solo el usuario puede vaciar el carrito

export default router;