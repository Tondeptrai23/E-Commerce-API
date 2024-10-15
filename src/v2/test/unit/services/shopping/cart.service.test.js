import seedData from "../../../../seedData.js";
import cartService from "../../../../services/shopping/cart.service.js";
import User from "../../../../models/user/user.model.js";
import Order from "../../../../models/shopping/order.model.js";
import Variant from "../../../../models/products/variant.model.js";
import { jest } from "@jest/globals";
import OrderItem from "../../../../models/shopping/orderItem.model.js";
import { db } from "../../../../models/index.model.js";

beforeAll(async () => {
    await seedData();
});

afterAll(async () => {
    await db.close();
});
describe("CartService", () => {
    describe("getCart", () => {
        test("should retrieve the user's cart items", async () => {
            const user = await User.findByPk("1");

            const { cart, totalPages, currentPage, totalItems } =
                await cartService.getCart(user);

            expect(currentPage).toBe(1);
            expect(totalPages).toBeGreaterThanOrEqual(0);
            expect(totalItems).toBeGreaterThanOrEqual(0);

            for (const item of cart) {
                expect(item).toEqual(
                    expect.objectContaining({
                        productID: expect.any(String),
                        name: expect.any(String),
                        variantID: expect.any(String),
                        price: expect.any(Number),
                        discountPrice: expect.toBeOneOf([
                            null,
                            expect.any(Number),
                        ]),
                        cartItem: expect.objectContaining({
                            quantity: expect.any(Number),
                        }),
                        image: expect.toBeOneOf([
                            null,
                            expect.objectContaining({
                                contentType: expect.any(String),
                            }),
                        ]),
                    })
                );
            }
        });

        test("should return empty array if the user's cart is empty", async () => {
            const user = await User.findByPk("4");

            const { cart, totalPages, currentPage, totalItems } =
                await cartService.getCart(user);

            expect(totalItems).toBe(0);
            expect(currentPage).toBe(1);
            expect(totalPages).toBe(0);
            expect(cart.length).toBe(0);
        });

        test("should return the user's cart items with pagination", async () => {
            const user = await User.findByPk("1");
            const pagination = {
                page: 1,
                size: 1,
            };

            const { cart, totalPages, currentPage, totalItems } =
                await cartService.getCart(user, pagination);

            expect(currentPage).toBe(1);
            expect(totalPages).toBeGreaterThanOrEqual(0);
            expect(totalItems).toBeGreaterThanOrEqual(0);
            expect(cart.length).toBeLessThanOrEqual(pagination.size);

            const {
                cart: cart2,
                currentPage: currentPage2,
                totalPages: totalPages2,
            } = await cartService.getCart(user, {
                page: 2,
                size: 1,
            });

            expect(currentPage2).toBe(2);
            expect(totalPages2).toEqual(totalPages);
            expect(cart2.length).toBeLessThanOrEqual(pagination.size);
        });
    });

    describe("getDetailedCartItem", () => {
        test("should retrieve a detailed cart item", async () => {
            const user = await User.findByPk("1");
            const variantID = "102";

            const detailedCartItem = await cartService.getDetailedCartItem(
                user,
                variantID
            );

            expect(detailedCartItem).toEqual(
                expect.objectContaining({
                    productID: expect.any(String),
                    name: expect.any(String),
                    variantID: expect.any(String),
                    price: expect.any(Number),
                    discountPrice: expect.toBeOneOf([null, expect.any(Number)]),
                    cartItem: expect.objectContaining({
                        quantity: expect.any(Number),
                    }),
                    image: expect.toBeOneOf([
                        null,
                        expect.objectContaining({
                            contentType: expect.any(String),
                        }),
                    ]),
                })
            );
        });
    });

    describe("fetchCartToOrder", () => {
        test("should fetch the user's cart items and prepare them for ordering", async () => {
            const user = await User.findByPk(3);
            const variantIDs = ["501"];

            const order = await cartService.fetchCartToOrder(user, variantIDs);

            expect(order).toBeDefined();
            expect(order).toBeInstanceOf(Order);
            expect(order.products).toBeDefined();
            expect(order.products).toBeInstanceOf(Array);
            expect(order.products[0]).toBeInstanceOf(Variant);
            expect(order.subTotal).toBeGreaterThan(0);
            expect(order.finalTotal).toBeGreaterThan(0);
        });

        test("should fetch the user's cart items and replace the existing order items", async () => {
            const user = await User.findByPk(1);
            await cartService.addToCart(user, "101", 5);
            await cartService.addToCart(user, "104", 2);
            const variantIDs = ["101", "104"];

            const pendingOrder = await Order.findOne({
                where: { userID: user.userID, status: "pending" },
                include: {
                    model: Variant,
                    as: "products",
                },
            });

            const order = await cartService.fetchCartToOrder(user, variantIDs);

            expect(order).toBeDefined();
            expect(order).toBeInstanceOf(Order);
            expect(order.products).toBeDefined();
            expect(order.products).toBeInstanceOf(Array);
            expect(order.products.length).toBe(2);
            expect(order.couponID).not.toBeNull();
            expect(order.shippingAddressID).not.toBeNull();
            expect(order.message).toBeNull();

            const orderItems = await OrderItem.findAll({
                where: { orderID: order.orderID },
            });
            expect(orderItems.length).toBe(2);
            expect(pendingOrder.orderID).toEqual(order.orderID);
        });

        test("should throw an error if the variantIDs is not found", async () => {
            const user = await User.findByPk(3);
            const variantIDs = ["999"];

            await expect(
                cartService.fetchCartToOrder(user, variantIDs)
            ).rejects.toThrow();
        });

        test("should throw an error if the cart is empty", async () => {
            const user = await User.findByPk(4);
            const variantIDs = ["501"];

            await expect(
                cartService.fetchCartToOrder(user, variantIDs)
            ).rejects.toThrow();
        });

        test("should throw an error and not create an order if something goes wrong", async () => {
            const user = await User.findByPk(1);
            await cartService.addToCart(user, "101", 5);
            await cartService.addToCart(user, "104", 2);
            const variantIDs = ["101", "104"];

            const pendingOrder = await Order.findOne({
                where: { userID: user.userID, status: "pending" },
            });

            jest.spyOn(OrderItem, "bulkCreate").mockImplementation(() => {
                throw new Error("Error creating order items");
            });

            await expect(
                cartService.fetchCartToOrder(user, variantIDs)
            ).rejects.toThrow();

            jest.restoreAllMocks();

            // Check for order to not be created
            const orders = await Order.findAll({
                where: { userID: user.userID, status: "pending" },
            });

            expect(orders[0]).toEqual(pendingOrder);
            expect(orders.length).toBe(1);
        });
    });

    describe("addToCart", () => {
        test("should add a new variant to the user's cart", async () => {
            const user = await User.findByPk(1);
            const variantID = "101";

            const updatedCartItem = await cartService.addToCart(
                user,
                variantID,
                5
            );

            expect(updatedCartItem).toBeDefined();
            expect(updatedCartItem.variantID).toEqual(variantID);
            expect(updatedCartItem.quantity).toBeGreaterThanOrEqual(5);
        });

        test("should increment the quantity of an existing variant in the user's cart", async () => {
            const user = await User.findByPk(1);

            // Get an existing variant ID from the user's cart
            const { cart } = await cartService.getCart(user);
            const variantID = cart[0].variantID;
            const quantity = cart[0].cartItem.quantity;

            const updatedCartItem = await cartService.addToCart(
                user,
                variantID,
                10
            );

            expect(updatedCartItem).toBeDefined();
            expect(updatedCartItem.variantID).toEqual(variantID);
            expect(updatedCartItem.quantity).toEqual(quantity + 10);
        });

        test("should throw an error if the variant is not found", async () => {
            const user = await User.findByPk("1");
            const variantID = "999";

            await expect(
                cartService.addToCart(user, variantID)
            ).rejects.toThrow();
        });
    });

    describe("updateCart", () => {
        test("should update the quantity of a variant in the user's cart", async () => {
            const user = await User.findByPk("1");
            const variantID = "102";
            const quantity = 5;

            const updatedCartItem = await cartService.updateCart(
                user,
                variantID,
                quantity
            );

            expect(updatedCartItem).toBeDefined();
            expect(updatedCartItem.variantID).toEqual(variantID);
            expect(updatedCartItem.quantity).toEqual(quantity);
        });

        test("should throw an error if the cart item is not found", async () => {
            const user = await User.findByPk("1");
            const variantID = "999";
            const quantity = 5;

            await expect(
                cartService.updateCart(user, variantID, quantity)
            ).rejects.toThrow();
        });
    });

    describe("deleteItem", () => {
        test("should delete a variant from the user's cart", async () => {
            const user = await User.findByPk("1");
            const variantID = "102";

            await cartService.deleteItem(user, variantID);

            const { cart: cartItems } = await cartService.getCart(user);
            const deletedItem = cartItems.find(
                (item) => item.variantID === variantID
            );
            expect(deletedItem).toBeUndefined();
        });
    });

    describe("deleteCart", () => {
        test("should delete all cart items for the given user", async () => {
            const user = await User.findByPk("1");

            await cartService.deleteCart(user);

            const { cart: cartItems } = await cartService.getCart(user);
            expect(cartItems.length).toBe(0);
        });
    });
});
