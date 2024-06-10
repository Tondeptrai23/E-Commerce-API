import {
    OrderAPIResponseSerializer,
    ProductAPIResponseSerializer,
} from "../utils/apiResponseSerializer.js";
import { CartService } from "../services/cartService.js";
import { ResourceNotFoundError } from "../utils/error.js";
import { StatusCodes } from "http-status-codes";

class CartController {
    static getCart = async (req, res) => {
        try {
            const products = await CartService.getProducts(req.user);

            res.status(StatusCodes.OK).json({
                success: true,
                products: products.map((product) => {
                    return ProductAPIResponseSerializer.serialize(product);
                }),
            });
        } catch (err) {
            console.log(err);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: "Error in getting cart products",
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
                throw new ResourceNotFoundError("Products not found in cart");
            }

            res.status(StatusCodes.CREATED).json({
                success: true,
                order: OrderAPIResponseSerializer.serialize(newOrder),
            });
        } catch (err) {
            console.log(err);
            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    error: err.message,
                });
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    error: "Error in creating order",
                });
            }
        }
    };

    static updateProduct = async (req, res) => {
        try {
            const product = await CartService.setQuantity(
                req.user,
                req.params.productId,
                Number(req.body.quantity)
            );

            if (product === null) {
                throw new ResourceNotFoundError("Product not found in cart");
            }

            res.status(StatusCodes.OK).json({
                success: true,
                product: ProductAPIResponseSerializer.serialize(product),
            });
        } catch (err) {
            console.log(err);
            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    error: err.message,
                });
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    error: "Error in updating product",
                });
            }
        }
    };

    static deleteProduct = async (req, res) => {
        try {
            const result = await CartService.deleteProduct(
                req.user,
                req.params.productId
            );

            if (result === false) {
                throw new ResourceNotFoundError("Product not found in cart");
            }

            res.status(StatusCodes.OK).json({
                success: true,
            });
        } catch (err) {
            console.log(err);
            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    error: err.message,
                });
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    error: "Error in removing product",
                });
            }
        }
    };

    static deleteCart = async (req, res) => {
        try {
            await CartService.deleteAllProducts(req.user);

            res.status(StatusCodes.OK).json({
                success: true,
            });
        } catch (err) {
            console.log(err);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: "Error in deleting cart",
            });
        }
    };
}

export { CartController };
