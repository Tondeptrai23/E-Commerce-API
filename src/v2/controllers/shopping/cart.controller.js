import { StatusCodes } from "http-status-codes";
import { ResourceNotFoundError } from "../../utils/error.js";
import cartService from "../../services/shopping/cart.service.js";
import CartSerializer from "../../services/serializers/cart.serializer.service.js";
import OrderSerializer from "../../services/serializers/order.serializer.service.js";

class CartController {
    async getCart(req, res) {
        try {
            // Get user
            const user = req.user;

            // Call services
            const cart = await cartService.getCart(user);

            // Serialize data
            const serializedCart = CartSerializer.parse(cart);

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
                data: {
                    cart: serializedCart,
                },
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
                    error: "Server error when get cart",
                });
            }
        }
    }

    async fetchCartToOrder(req, res) {
        try {
            // Get user
            const user = req.user;
            const { variantIDs } = req.body;

            // Call services
            const newOrder = await cartService.fetchCartToOrder(
                user,
                variantIDs
            );

            // Serialize data
            const serializedOrder = OrderSerializer.parse(newOrder, {
                detailAddress: true,
            });

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
                data: {
                    order: serializedOrder,
                },
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
                    error: "Server error when fetch cart to order",
                });
            }
        }
    }

    async addToCart(req, res) {
        try {
            // Get user
            const user = req.user;
            const { variantID } = req.params;
            const { quantity } = req.body;

            // Call services
            const cartItem = await cartService.addToCart(
                user,
                variantID,
                quantity
            );

            // Response
            res.status(StatusCodes.CREATED).json({
                success: true,
                data: {
                    cartItem: {
                        quantity: cartItem.quantity,
                        variantID: cartItem.variantID,
                    },
                },
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
                    error: "Server error when add to cart",
                });
            }
        }
    }

    async updateCart(req, res) {
        try {
            // Get user
            const user = req.user;
            const { variantID } = req.params;
            const { quantity } = req.body;

            // Call services
            const cartItem = await cartService.updateCart(
                user,
                variantID,
                quantity
            );

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
                data: {
                    cartItem: {
                        quantity: cartItem.quantity,
                        variantID: cartItem.variantID,
                    },
                },
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
                    error: "Server error when update cart",
                });
            }
        }
    }

    async deleteItem(req, res) {
        try {
            // Get user
            const user = req.user;
            const { variantID } = req.params;

            // Call services
            let cart = await cartService.deleteItem(user, variantID);

            // Serialize data

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
                cart: cart,
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
                    error: "Server error when delete item",
                });
            }
        }
    }

    async deleteCart(req, res) {
        try {
            // Get user
            const user = req.user;

            // Call services
            await cartService.deleteCart(user);

            // Response
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
                    error: "Server error when delete cart",
                });
            }
        }
    }
}

export default new CartController();
