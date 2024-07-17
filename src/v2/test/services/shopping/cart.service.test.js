import seedData from "../../../seedData.js";
import cartService from "../../../services/shopping/cart.service.js";
import User from "../../../models/userOrder/user.model.js";
import Order from "../../../models/userOrder/order.model.js";
import Variant from "../../../models/products/variant.model.js";

beforeAll(async () => {
    await seedData();
}, 15000);

describe("CartService", () => {
    describe("CartService.getCart", () => {
        test("should retrieve the user's cart items", async () => {
            const user = await User.findByPk("1");

            const cartItems = await cartService.getCart(user);

            expect(cartItems).toBeDefined();
            expect(Array.isArray(cartItems)).toBe(true);
            expect(cartItems.length).toBeGreaterThan(0);
        });

        test("should return empty array if the user's cart is empty", async () => {
            const user = await User.findByPk("4");

            const cartItems = await cartService.getCart(user);

            expect(cartItems).toBeDefined();
            expect(Array.isArray(cartItems)).toBe(true);
            expect(cartItems.length).toBe(0);
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
                variantID
            );

            expect(updatedCartItem).toBeDefined();
            expect(updatedCartItem.variantID).toEqual(variantID);
            expect(updatedCartItem.quantity).toBeGreaterThan(0);
        });

        test("should increment the quantity of an existing variant in the user's cart", async () => {
            const user = await User.findByPk(1);

            // Get an existing variant ID from the user's cart
            const variant = await cartService.getCart(user);
            const variantID = variant[0].variantID;
            const quantity = variant[0].cartItem.quantity;

            const updatedCartItem = await cartService.addToCart(
                user,
                variantID
            );

            expect(updatedCartItem).toBeDefined();
            expect(updatedCartItem.variantID).toEqual(variantID);
            expect(updatedCartItem.quantity).toBeGreaterThan(quantity);
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

            const cartItems = await cartService.getCart(user);
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

            const cartItems = await cartService.getCart(user);
            expect(cartItems.length).toBe(0);
        });
    });
});
