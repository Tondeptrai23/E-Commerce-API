import seedData from "../setup.js";
import { ProductService } from "../../services/productService.js";
import { db } from "../../models/index.js";
import e from "cors";

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
        const { products, quantity, totalPages, currentPage } =
            await ProductService.findAllProducts({});

        expect(quantity).toBe(10);
        expect(products.length).toBe(10);
        expect(totalPages).toBe(1);
        expect(currentPage).toBe(1);
    });

    test("should get all products with [gte]", async () => {
        const query = {
            price: "[gte]1700",
        };
        const { products, quantity, totalPages, currentPage } =
            await ProductService.findAllProducts(query);

        for (const product of products) {
            expect(product.price).toBeGreaterThanOrEqual(1700);
        }
        expect(quantity).toBe(6);
        expect(totalPages).toBe(1);
        expect(currentPage).toBe(1);
    });

    test("should get all products with [between]", async () => {
        const query = {
            price: "[between]1700,2500",
        };
        const { products, quantity, totalPages, currentPage } =
            await ProductService.findAllProducts(query);

        for (const product of products) {
            expect(product.price).toBeGreaterThanOrEqual(1700);
            expect(product.price).toBeLessThanOrEqual(2500);
        }
        expect(quantity).toBe(6);
        expect(totalPages).toBe(1);
        expect(currentPage).toBe(1);
    });

    test("should get all products with multiple filters", async () => {
        const query = {
            price: "[gte]1500",
            name: "Mango",
        };
        const { products, quantity, totalPages, currentPage } =
            await ProductService.findAllProducts(query);

        for (const product of products) {
            expect(product.price).toBeGreaterThanOrEqual(1500);
            expect(product.name).toBe("Mango");
        }
        expect(quantity).toBe(1);
        expect(totalPages).toBe(1);
        expect(currentPage).toBe(1);
    });

    test("should get all products with multiple filters 2", async () => {
        const query = {
            price: ["[gte]1500", "[lte]3000"],
            name: "Mango",
        };
        const { products, quantity, totalPages, currentPage } =
            await ProductService.findAllProducts(query);

        for (const product of products) {
            expect(product.price).toBeGreaterThanOrEqual(1500);
            expect(product.price).toBeLessThanOrEqual(3000);
            expect(product.name).toBe("Mango");
        }
        expect(quantity).toBe(1);
        expect(totalPages).toBe(1);
        expect(currentPage).toBe(1);
    });

    test("should get all products in order", async () => {
        const query = {
            sort: "price,ASC",
        };
        const { products, quantity, totalPages, currentPage } =
            await ProductService.findAllProducts(query);

        let previousPrice = 0;
        for (const product of products) {
            expect(product.price).toBeGreaterThanOrEqual(previousPrice);
            previousPrice = product.price;
        }
        expect(quantity).toBe(10);
        expect(totalPages).toBe(1);
        expect(currentPage).toBe(1);
    });

    test("should get paginated products", async () => {
        const query = {
            page: 2,
            size: 2,
        };
        const { products, quantity, totalPages, currentPage } =
            await ProductService.findAllProducts(query);

        expect(products[0].name).toBe("Banana");
        expect(products.length).toBe(2);
        expect(quantity).toBe(10);
        expect(totalPages).toBe(5);
        expect(currentPage).toBe(2);
    });

    test("should get paginated products with sorting", async () => {
        const query = {
            page: 3,
            size: 2,
            sort: "price,DESC",
        };
        const { products, quantity, totalPages, currentPage } =
            await ProductService.findAllProducts(query);

        expect(products[0].name).toBe("Mango");
        expect(products[1].name).toBe("Kiwi");
        expect(products.length).toBe(2);
        expect(quantity).toBe(10);
        expect(totalPages).toBe(5);
        expect(currentPage).toBe(3);
    });

    test("should get paginated products with filtering", async () => {
        const query = {
            page: 2,
            size: 3,
            price: "[gte]1600",
        };
        const { products, quantity, totalPages, currentPage } =
            await ProductService.findAllProducts(query);

        for (const product of products) {
            expect(product.price).toBeGreaterThanOrEqual(1600);
        }
        expect(products.length).toBe(3);
        expect(quantity).toBe(6);
        expect(totalPages).toBe(2);
        expect(currentPage).toBe(2);
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
