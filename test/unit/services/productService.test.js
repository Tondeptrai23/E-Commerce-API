import seedData from "../setup.js";
import { ProductService } from "../../../services/productService.js";
import { db } from "../../../models/index.js";

beforeEach(async () => {
    await seedData();
});

afterAll(async () => {
    await db.close();
});

describe("ProductService.createOne", () => {
    test("should create a new product", async () => {
        const newProduct = {
            name: "Mango",
            price: 3000,
            description: "Another fruit",
        };

        const product = await ProductService.createOne(newProduct);

        expect(product.name).toBe(newProduct.name);
        expect(product.price).toBe(newProduct.price);
        expect(product.description).toBe(newProduct.description);
    });

    test("should create a new product without description", async () => {
        const newProduct = {
            name: "Apple",
            price: 2000,
        };

        const product = await ProductService.createOne(newProduct);

        expect(product.name).toBe(newProduct.name);
        expect(product.price).toBe(newProduct.price);
        expect(product.description).toBeUndefined();
    });

    test("should not create a new product if name is missing", async () => {
        const newProduct = {
            price: 3000,
            description: "Another fruit",
        };

        try {
            await ProductService.createOne(newProduct);
        } catch (error) {
            expect(error.message).toBe(
                "notNull Violation: product.name cannot be null"
            );
        }
    });

    test("should not create a new product if price is missing", async () => {
        const newProduct = {
            name: "Mango",
            description: "Another fruit",
        };

        try {
            await ProductService.createOne(newProduct);
        } catch (error) {
            expect(error.message).toBe(
                "notNull Violation: product.price cannot be null"
            );
        }
    });
});

describe("ProductService.findOneByID", () => {
    test("should get a product by ID", async () => {
        const productID = "1";

        const product = await ProductService.findOneByID(productID);

        expect(product).toBeDefined();
        expect(product.id).toBe(productID);
    });

    test("should return null if product ID does not exist", async () => {
        const productID = 999;

        const product = await ProductService.findOneByID(productID);

        expect(product).toBeNull();
    });
});

describe("ProductService.findAllProducts", () => {
    test("should get all products", async () => {
        const products = await ProductService.findAllProducts({});

        expect(products.quantity).toBe(3);
        expect(products.products.length).toBe(3);
    });

    test("should get all products with [gte]", async () => {
        const query = {
            price: "[gte]1500",
        };
        const products = await ProductService.findAllProducts(query);

        for (const product of products.products) {
            expect(product.price).toBeGreaterThanOrEqual(1500);
        }
    });

    test("should get all products with [between]", async () => {
        const query = {
            price: "[between]1500,3000",
        };
        const products = await ProductService.findAllProducts(query);

        for (const product of products.products) {
            expect(product.price).toBeGreaterThanOrEqual(1500);
            expect(product.price).toBeLessThanOrEqual(3000);
        }
    });

    test("should get all products with multiple filters", async () => {
        const query = {
            price: "[gte]1500",
            name: "Mango",
        };
        const products = await ProductService.findAllProducts(query);

        for (const product of products.products) {
            expect(product.price).toBeGreaterThanOrEqual(1500);
            expect(product.name).toBe("Mango");
        }
    });

    test("should get all products with multiple filters 2", async () => {
        const query = {
            price: ["[gte]1500", "[lte]3000"],
            name: "Mango",
        };
        const products = await ProductService.findAllProducts(query);

        for (const product of products.products) {
            expect(product.price).toBeGreaterThanOrEqual(1500);
            expect(product.name).toBe("Mango");
        }
    });
});

describe("ProductService.updateOneByID", () => {
    test("should update a product by ID", async () => {
        const productID = "1";
        const newProductInfo = {
            name: "Banana",
            price: 500,
        };

        const product = await ProductService.updateOneByID(
            productID,
            newProductInfo
        );

        expect(product.id).toBe(productID);
        expect(product.name).toBe(newProductInfo.name);
        expect(product.price).toBe(newProductInfo.price);
    });

    test("should not update a product if product ID does not exist", async () => {
        const productID = 999;
        const newProductInfo = {
            name: "Banana",
            price: 500,
        };

        const product = await ProductService.updateOneByID(
            productID,
            newProductInfo
        );

        expect(product).toBeNull();
    });
});

describe("ProductService.deleteOneByID", () => {
    test("should delete a product by ID", async () => {
        const productID = "1";

        const product = await ProductService.deleteOneByID(productID);

        expect(product.id).toBe(productID);

        // Double check in db
        const deletedProduct = await ProductService.findOneByID(productID);
        expect(deletedProduct).toBeNull();
    });

    test("should not delete a product if product ID does not exist", async () => {
        const productID = 999;

        const product = await ProductService.deleteOneByID(productID);

        expect(product).toBeNull();
    });
});
