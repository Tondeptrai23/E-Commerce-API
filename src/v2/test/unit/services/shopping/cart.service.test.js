import seedData from "../../../../seedData.js";
import cartService from "../../../../services/shopping/cart.service.js";
import User from "../../../../models/user/user.model.js";
import Order from "../../../../models/shopping/order.model.js";
import Variant from "../../../../models/products/variant.model.js";

beforeAll(async () => {
    await seedData();
}, 15000);

describe("CartService", () => {
    describe("CartService.getCart", () => {
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
                                url: expect.any(String),
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

    describe("CartService.getDetailedCartItem", () => {
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
                            url: expect.any(String),
                        }),
                    ]),
                })
            );
        });
    });

    describe("CartService.fetchCartToOrder", () => {
        test("should fetch the user's cart items and prepare them for ordering", async () => {
            const user = await User.findByPk(3);
            const variantIDs = ["501"];

            const order = await cartService.fetchCartToOrder(user, variantIDs);

            expect(order).toBeDefined();
            expect(order).toBeInstanceOf(Order);
            expect(order.products).toBeDefined();
            expect(order.products).toBeInstanceOf(Array);
            expect(order.products[0]).toBeInstanceOf(Variant);
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
    });

    describe("CartService.addToCart", () => {
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

    describe("CartService.updateCart", () => {
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

    describe("CartService.deleteItem", () => {
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

    describe("CartService.deleteCart", () => {
        test("should delete all cart items for the given user", async () => {
            const user = await User.findByPk("1");

            await cartService.deleteCart(user);

            const { cart: cartItems } = await cartService.getCart(user);
            expect(cartItems.length).toBe(0);
        });
    });
});
