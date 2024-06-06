import seedData, { cartData } from "../setup.js";
import { CartService } from "../../../services/cartService.js";
import { db } from "../../../models/index.js";
import { Cart } from "../../../models/cartModel.js";
import { User } from "../../../models/userModel.js";

beforeEach(async () => {
    await seedData();
});

afterAll(async () => {
    await db.close();
});

describe("CartService.addProduct", () => {
    test("should add a new product to the cart", async () => {
        const user = await User.findOne({ where: { id: 3 } });
        const productID = "1";

        await CartService.addProduct(user, productID);

        const products = await CartService.getProducts(user);
        expect(products.length).toBe(1);
        expect(products[0].id).toBe(productID);
        expect(products[0].cart.quantity).toBe(1);
    });

    test("should add a new product to the cart with quantity", async () => {
        const user = await User.findOne({ where: { id: 3 } });
        const productID = "1";

        await CartService.addProduct(user, productID, 3);

        const products = await CartService.getProducts(user);
        expect(products.length).toBe(1);
        expect(products[0].id).toBe(productID);
        expect(products[0].cart.quantity).toBe(3);
    });

    test("should increment quantity for a product which is already in cart", async () => {
        const user = await User.findOne({ where: { id: 3 } });
        const productID = "1";

        // Add the product to the cart with quantity 1
        await CartService.addProduct(user, productID);

        // Add the same product to the cart again with quantity 2
        await CartService.addProduct(user, productID);

        const products = await CartService.getProducts(user);
        expect(products.length).toBe(1);
        expect(products[0].id).toBe(productID);
        expect(products[0].cart.quantity).toBe(2);
    });

    test("should increment quantity for a product which is already in cart", async () => {
        const user = await User.findOne({ where: { id: 3 } });
        const productID = "1";

        // Add the product to the cart with quantity 1
        await CartService.addProduct(user, productID, 3);

        // Add the same product to the cart again with quantity 2
        await CartService.addProduct(user, productID, 4);

        const products = await CartService.getProducts(user);
        expect(products.length).toBe(1);
        expect(products[0].id).toBe(productID);
        expect(products[0].cart.quantity).toBe(7);
    });

    test("should add two products to the cart", async () => {
        const user = await User.findOne({ where: { id: 3 } });
        const productID1 = "1";
        const productID2 = "2";

        await CartService.addProduct(user, productID1);
        await CartService.addProduct(user, productID2);

        const products = await CartService.getProducts(user);
        expect(products.length).toBe(2);
        expect(products[0].id).toBe(productID1);
        expect(products[0].cart.quantity).toBe(1);
        expect(products[1].id).toBe(productID2);
        expect(products[1].cart.quantity).toBe(1);
    });

    test("should return null if product not found", async () => {
        const user = await User.findOne({ where: { id: 3 } });
        const productID = "999";

        const result = await CartService.addProduct(user, productID);

        expect(result).toBeNull();
    });
});

describe("CartService.getProducts", () => {
    test("should get all products in cart of User 1", async () => {
        const user = await User.findOne({ where: { id: 1 } });
        const products = await CartService.getProducts(user);

        expect(products.length).toBe(2);
        expect(products[0].id).toBe(cartData[0].productID);
        expect(products[0].cart.quantity).toBe(cartData[0].quantity);
        expect(products[1].id).toBe(cartData[1].productID);
        expect(products[1].cart.quantity).toBe(cartData[1].quantity);
    });
});

describe("CartService.fetchCartToOrder", () => {
    test("should fetch all products in cart to the new order", async () => {
        const user = await User.findOne({ where: { id: 1 } });
        const productIDs = ["1", "3"];

        const order = await CartService.fetchCartToOrder(user, productIDs);
        const products = await CartService.getProducts(user);
        expect(products.length).toBe(0);

        expect(order.products.length).toBe(2);
        expect(order.products[0].id).toBe("1");
        expect(order.products[1].id).toBe("3");
    });

    test("should truncate productIDs that are not found", async () => {
        const user = await User.findOne({ where: { id: 1 } });
        const productIDs = ["1", "3", "999"];

        const order = await CartService.fetchCartToOrder(user, productIDs);

        const products = await CartService.getProducts(user);
        expect(products.length).toBe(0);

        expect(order.products.length).toBe(2);
        expect(order.products[0].id).toBe("1");
        expect(order.products[1].id).toBe("3");
    });

    test("should return null if productIDs is empty", async () => {
        const user = await User.findOne({ where: { id: 1 } });
        const productIDs = [];

        const order = await CartService.fetchCartToOrder(user, productIDs);

        expect(order).toBeNull();
    });

    test("should return null if there are no selected products in cart", async () => {
        const user = await User.findOne({ where: { id: 1 } });
        const productIDs = ["2"];

        const order = await CartService.fetchCartToOrder(user, productIDs);

        expect(order).toBeNull();
    });
});

describe("CartService.deleteProduct", () => {
    test("should delete a product in cart", async () => {
        const user = await User.findOne({ where: { id: 3 } });
        const productID = "1";

        // Add the product to the cart
        await CartService.addProduct(user, productID);

        // Delete the product from the cart
        await CartService.deleteProduct(user, productID);

        const products = await CartService.getProducts(user);
        expect(products.length).toBe(0);
    });

    test("should return false if the product is not found in the cart", async () => {
        const user = await User.findOne({ where: { id: 3 } });
        const productID = "999";

        const result = await CartService.deleteProduct(user, productID);

        expect(result).toBe(false);
    });
});

describe("CartService.deleteAllProducts", () => {
    test("should delete all products in cart", async () => {
        const user = await User.findOne({ where: { id: 3 } });
        const productID1 = "1";
        const productID2 = "2";

        // Add products to the cart
        await CartService.addProduct(user, productID1);
        await CartService.addProduct(user, productID2);

        // Delete all products from the cart
        await CartService.deleteAllProducts(user);

        const products = await CartService.getProducts(user);
        expect(products.length).toBe(0);
    });
});
