import { Op } from "sequelize";

import { OrderItem } from "../models/OrderItemModel.js";
import { Product } from "../models/ProductModel.js";
import { ProductService } from "./ProductService.js";
import { OrderSerivce } from "./OrderService.js";
import { Order } from "../models/OrderModel.js";

class CartService {
    static #getProductByID = async (user, productID) => {
        const result = await user.getProduct({
            where: { id: productID },
        });
        return result[0];
    };

    static addProduct = async (user, productID, quantity = 1) => {
        if (!(await user.hasProduct(productID))) {
            const product = await ProductService.findOneByID(productID);
            await user.addProduct(product);
        }

        const productWithCart = await this.#getProductByID(user, productID);

        productWithCart.cart.quantity += quantity;
        await productWithCart.cart.save();

        return productWithCart;
    };

    static getProducts = async (user) => {
        const products = await user.getProduct();
        return products;
    };

    static fetchCartToOrder = async (user, productIDs) => {
        // Get products from cart
        const products = await user.getProduct({
            where: {
                id: {
                    [Op.in]: productIDs,
                },
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

        return OrderSerivce.getOrder(newOrder.id);
    };

    static deleteProduct = async (user, productID) => {
        const result = await user.removeProduct(productID);
        return result;
    };

    static setQuantity = async (user, productID, newQuantity) => {
        const product = await this.#getProductByID(user, productID);

        product.cart.quantity = newQuantity;
        await product.cart.save();
        return product;
    };

    static deleteAllProducts = async (user) => {
        await user.setProduct([]);
    };
}

export { CartService };
