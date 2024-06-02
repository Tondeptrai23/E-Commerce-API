import {
    OrderAPIResponseSerializer,
    ProductAPIResponseSerializer,
} from "../utils/apiResponseSerializer.js";
import { CartService } from "../services/cartService.js";

class CartController {
    static getCart = async (req, res) => {
        try {
            const products = await CartService.getProducts(req.user);

            res.status(200).json({
                success: true,
                products: products.map((product) => {
                    return ProductAPIResponseSerializer.serialize(product);
                }),
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                success: false,
                error: "Error in getting cart products.",
            });
        }
    };

    static fetchCartToOrder = async (req, res) => {
        try {
            const newOrder = await CartService.fetchCartToOrder(
                req.user,
                req.body.productIDs
            );

            if (newOrder === null) {
                res.status(400).json({
                    success: false,
                    error: "Cart is empty.",
                });
            } else {
                res.status(200).json({
                    success: true,
                    order: OrderAPIResponseSerializer.serialize(newOrder),
                });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({
                success: false,
                error: "Error in creating order.",
            });
        }
    };

    static updateProduct = async (req, res) => {
        try {
            const product = await CartService.setQuantity(
                req.user,
                req.params.productId,
                Number(req.body.quantity)
            );

            res.status(200).json({
                success: true,
                product: ProductAPIResponseSerializer.serialize(product),
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                success: false,
                error: "Error in updating product.",
            });
        }
    };

    static deleteProduct = async (req, res) => {
        try {
            const result = await CartService.deleteProduct(
                req.user,
                req.params.productId
            );

            if (result === 1) {
                res.status(200).json({
                    success: true,
                });
            } else {
                res.status(200).json({
                    success: true,
                });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({
                success: false,
                error: "Error in removing products.",
            });
        }
    };

    static deleteCart = async (req, res) => {
        try {
            await CartService.deleteAllProducts(req.user);

            res.status(200).json({
                success: true,
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                success: false,
                error: "Error in deleting cart.",
            });
        }
    };
}

export { CartController };
