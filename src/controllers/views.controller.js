//views.controller.js
import ProductsService from "../service/products.service.js";
import CartsController from "../controllers/carts.controller.js";
import CartsRepository from "../repositories/carts.repository.js";
import ProductsModel from "../models/products.model.js";
import UserDTO from "../dto/user.dto.js";
const ps = new ProductsService();
const cc = new CartsController();
const cr = new CartsRepository();
const pm = new ProductsModel();

class ViewsController {
    async renderProducts(req, res) {
        try {
            const { page = 1, limit = 2, sort, query } = req.query;
            //console.log('Request query parameters (view):', { page, limit, sort, query });

            const productList = await ps.getProducts({ page: parseInt(page), limit: parseInt(limit), sort, query });

            if (!productList || !productList.docs) {
                throw new Error("Lista de productos es indefinida o vacía");
            }

            //console.log('Product list (view):', productList);

            const requiredProperties = ['hasPrevPage', 'hasNextPage', 'prevPage', 'nextPage', 'page', 'totalPages'];

            requiredProperties.forEach(prop => {
                if (productList[prop] === undefined) {
                    throw new Error(`La propiedad '${prop}' es indefinida en productList`);
                }
            });
            const cartId = req.session.user.cart;
            res.render("products", {
                user: req.session.user,
                products: productList.docs,
                hasPrevPage: productList.hasPrevPage,
                hasNextPage: productList.hasNextPage,
                prevPage: productList.prevPage,
                nextPage: productList.nextPage,
                currentPage: productList.page,
                totalPages: productList.totalPages,
                cartId,
            });
        } catch (error) {
            console.error("Error al obtener productos (view):", error.message);
            res.status(500).json({
                status: "error",
                error: "Error interno del servidor",
            });
        }
    }
    async renderProfile(req, res) {
        //Con DTO: 
        const userDto = new UserDTO(req.user.first_name, req.user.last_name, req.user.role);
        const isAdmin = req.user.role === 'admin';
        res.render("profile", { user: userDto, isAdmin });
    }
    async renderCart(req, res) {
        const cartId = req.session.user.cart;
        try {
            const carrito = await cr.getCartById(cartId);

            if (!carrito) {
                console.log("No existe ese carrito con el id");
                return res.status(404).json({ error: "Carrito no encontrado" });
            }


            let totalCompra = 0;

            const productosEnCarrito = carrito.products.map(item => {
                const product = item.product.toObject();
                const quantity = item.quantity;
                const totalPrice = product.price * quantity;

                
                totalCompra += totalPrice;

                return {
                    product: { ...product, totalPrice, thumbnail: product.thumbnail},
                    quantity,
                    cartId
                };
            });

            res.render("carts", { productos: productosEnCarrito, totalCompra, cartId });
        } catch (error) {
            console.error("Error al obtener el carrito", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async renderLogin(req, res) {
        res.render("login");
    }

    async renderRegister(req, res) {
        res.render("register");
    }

    async renderRealTimeProducts(req, res) {
        try {
            res.render("realtimeproducts");
        } catch (error) {
            console.log("error en la vista real time", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async renderChat(req, res) {
        res.render("chat");
    }

    async renderHome(req, res) {
        res.render("home");
    }
}

export default ViewsController;