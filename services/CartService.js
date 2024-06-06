import { Op } from "sequelize";

import { ProductService } from "./productService.js";
import { OrderService } from "./orderService.js";

class CartService {
    static #getProductByID = async (user, productID) => {
        const result = await user.getProducts({
            where: { id: productID },
            attributes: {
                exclude: ["updatedAt", "createdAt"],
            },
        });

        return result[0];
    };

    static addProduct = async (user, productID, quantity) => {
        let product = await ProductService.findOneByID(productID);
        if (product === null) return null;

        if (await user.hasProduct(productID)) {
            product = await this.#getProductByID(user, productID);
            product.cart.quantity += quantity === undefined ? 1 : quantity;
            await product.cart.save();
        } else {
            product = await ProductService.findOneByID(productID);

            await user.addProduct(product, {
                through: {
                    quantity: quantity === undefined ? 1 : quantity,
                },
            });
        }

        const productWithCart = await this.#getProductByID(user, productID);
        return productWithCart;
    };

    static getProducts = async (user) => {
        const products = await user.getProducts({
            attributes: {
                exclude: ["updatedAt", "createdAt"],
            },
        });
        return products;
    };

    static fetchCartToOrder = async (user, productIDs) => {
        // Get products from cart

        const products = await user.getProducts({
            where: {
                id: {
                    [Op.in]: productIDs,
                },
            },
            attributes: {
                exclude: ["updatedAt", "createdAt"],
            },
        });

        if (products.length === 0) return null;

        // Create new order
        const newOrder = await user.createOrder();
        for (const product of products) {
            await newOrder.addProduct(product, {
                through: {
                    quantity: product.cart.quantity,
                },
            });
        }

        // Flush cart
        await this.deleteAllProducts(user);

        return OrderService.getOrder(user.id, newOrder.id);
    };

    static deleteProduct = async (user, productID) => {
        const result = await user.removeProduct(productID);
        return result === 0 ? false : true;
    };

    static setQuantity = async (user, productID, newQuantity) => {
        const product = await this.#getProductByID(user, productID);

        product.cart.quantity = newQuantity;
        await product.cart.save();
        return product;
    };

    static deleteAllProducts = async (user) => {
        await user.setProducts([]);
    };
}

export { CartService };
