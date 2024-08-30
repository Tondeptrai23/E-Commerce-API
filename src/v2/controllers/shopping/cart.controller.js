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
            const { cart, currentPage, totalPages, totalItems } =
                await cartService.getCart(user);

            // Serialize data
            const serializedCart = CartSerializer.parse(cart);

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
                currentPage: currentPage,
                totalPages: totalPages,
                totalItems: totalItems,
                cart: serializedCart,
            });
        } catch (err) {
            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    errors: [
                        {
                            error: "NotFound",
                            message: err.message,
                        },
                    ],
                });
            } else {
                console.log(err);
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    errors: [
                        {
                            error: "ServerError",
                            message: "Server error when get cart",
                        },
                    ],
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
                order: serializedOrder,
            });
        } catch (err) {
            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    errors: [
                        {
                            error: "NotFound",
                            message: err.message,
                        },
                    ],
                });
            } else {
                console.log(err);
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    errors: [
                        {
                            error: "ServerError",
                            message: "Server error when fetch cart to order",
                        },
                    ],
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
            await cartService.addToCart(user, variantID, quantity);
            const cartItem = await cartService.getDetailedCartItem(
                user,
                variantID
            );

            // Serialize data
            const serializedCartItem = CartSerializer.parse(cartItem);

            // Response
            res.status(StatusCodes.CREATED).json({
                success: true,
                cartItem: serializedCartItem,
            });
        } catch (err) {
            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    errors: [
                        {
                            error: "NotFound",
                            message: err.message,
                        },
                    ],
                });
            } else {
                console.log(err);
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    errors: [
                        {
                            error: "ServerError",
                            message: "Server error when add to cart",
                        },
                    ],
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
            await cartService.updateCart(user, variantID, quantity);
            const cartItem = await cartService.getDetailedCartItem(
                user,
                variantID
            );

            // Serialize data
            const serializedCartItem = CartSerializer.parse(cartItem);

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
                cartItem: serializedCartItem,
            });
        } catch (err) {
            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    errors: [
                        {
                            error: "NotFound",
                            message: err.message,
                        },
                    ],
                });
            } else {
                console.log(err);
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    errors: [
                        {
                            error: "ServerError",
                            message: "Server error when update cart",
                        },
                    ],
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
            await cartService.deleteItem(user, variantID);

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
            });
        } catch (err) {
            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    errors: [
                        {
                            error: "NotFound",
                            message: err.message,
                        },
                    ],
                });
            } else {
                console.log(err);
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    errors: [
                        {
                            error: "ServerError",
                            message: "Server error when delete item",
                        },
                    ],
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
            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    errors: [
                        {
                            error: "NotFound",
                            message: err.message,
                        },
                    ],
                });
            } else {
                console.log(err);
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    errors: [
                        {
                            error: "ServerError",
                            message: "Server error when delete cart",
                        },
                    ],
                });
            }
        }
    }
}

export default new CartController();
