import CartsService from "../service/carts.service.js";
import mongoose from "mongoose";

const cs = new CartsService();

class CartsController {
    // 1. Comenzar carrito nuevo 
    async addCart(req, res) {
        try {
            const respuesta = await cs.addCart(req.body);
            if (respuesta.status) {
                res.status(200).send(respuesta);
            } else {
                res.status(400).send(respuesta);
            }
        } catch (error) {
            res.status(500).send("Error interno del servidor: " + error.message);
        }
    }

    // 2. Borrar carrito
    async deleteCart(req, res) {
        try {
            const respuesta = await cs.deleteCart(req.params.cid);
            if (respuesta.status) {
                res.status(200).send(respuesta);
            } else {
                res.status(400).send(respuesta);
            }
        } catch (error) {
            res.status(500).send("Error interno del servidor: " + error.message);
        }
    }

    // 3. Agregar productos al carrito
    async addProductToCart(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity || 1;
        try {
            const respuesta = await cs.addProductToCart(cartId, productId, quantity);
            if (respuesta.status) {
                const carritoID = (req.user.cart).toString();
                res.redirect(`/carts/${carritoID}`);
            } else {
                res.status(400).send(respuesta);
            }
        } catch (error) {
            res.status(500).send("Error interno del servidor: " + error.message);
        }
    }

    // 4. Mostrar carritos
    async getCarts(req, res) {
        try {
            const respuesta = await cs.getCarts();
            if (respuesta.status) {
                res.status(200).send(respuesta);
            } else {
                res.status(400).send(respuesta);
            }
        } catch (error) {
            res.status(500).send("Error interno del servidor: " + error.message);
        }
    }

    // 5. Mostrar carrito según ID
    async getCartById(req, res) {
        const cartId = req.params.cid;

        try {
          const resultado = await  cs.getCartById(cartId); // Verifica que se devuelve un resultado
          const carrito = resultado && resultado.cart; // Asegúrate de obtener `cart`
      
      
          if (!carrito || !Array.isArray(carrito.products) || carrito.products.length === 0) { // Verificar si tiene productos
            return res.status(404).json({ error: "Carrito no encontrado o sin productos" }); // Manejar el error
          }
          const productosEnCarrito = carrito.products.map(item => ({
            product: item.product.toObject(), // Verificar que `product` es un documento completo
            quantity: item.quantity
          }));
           res.render("carts", { productos: productosEnCarrito });
        } catch (error) {
           console.error("Error al obtener el carrito", error);
           res.status(500).json({ error: "Error interno del servidor" });
        }



        /*
        try {
            const respuesta = await cs.getCartById(req.params.cid);
            if (respuesta.status) {
                res.status(200).send(respuesta);
            } else {
                res.status(400).send(respuesta);
            }
        } catch (error) {
            res.status(500).send("Error interno del servidor: " + error.message);
        }*/
    }

    // 6. Borrar un producto del carrito
    async deleteProductFromCart(req, res) {
        try {
            const respuesta = await cs.deleteProductCart(req.params.cid, req.params.pid);
            if (respuesta.status) {
                res.status(200).send(respuesta);
            } else {
                res.status(400).send(respuesta);
            }
        } catch (error) {
            res.status(500).send("Error interno del servidor: " + error.message);
        }
    }

    // 7. Actualizar productos del carrito
    async updateCart(req, res) {
        try {
            const respuesta = await cs.updateCart(req.params.cid, req.body);
            if (respuesta.status) {
                res.status(200).send(respuesta);
            } else {
                res.status(400).send(respuesta);
            }
        } catch (error) {
            res.status(500).send("Error interno del servidor: " + error.message);
        }
    }

    // 8. Actualizar la cantidad de productos de un carrito
    async updateProductsQuantityCart(req, res) {
        try {
            const respuesta = await cs.updateProductsQuantityCart(req.params.cid, req.params.pid, req.body.newQuantity);
            if (respuesta.status) {
                res.status(200).send(respuesta);
            } else {
                res.status(400).send(respuesta);
            }
        } catch (error) {
            res.status(500).send("Error interno del servidor: " + error.message);
        }
    }

    // 9. Vaciar carrito
    async emptyCart(req, res) {
        try {
            const respuesta = await cs.emptyCart(req.params.cid);
            if (respuesta.status) {
                res.redirect(`/carts/${req.params.cid}`);
            } else {
                res.status(400).send(respuesta);
            }
        } catch (error) {
            res.status(500).send("Error interno del servidor: " + error.message);
        }
    }
}

export default CartsController;