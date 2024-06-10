import { ProductController } from "../../controllers/productController.js";
import seedData, { productData } from "../setup.js";
import { User } from "../../models/userModel.js";

beforeEach(async () => {
    await seedData();
});

describe("ProductController.getProduct", () => {
    test("should return the product with the specified ID", async () => {
        const productId = "1";
        const expectedProduct = productData[0];

        // Mock the request and response objects
        const req = { params: { productId: productId } };
        1;
        const res = {
            status(code) {
                expect(code).toEqual(200);
                return this;
            },
            json(data) {
                expect(data.success).toEqual(true);
                expect(data.product).toEqual(expectedProduct);
            },
        };

        // Act
        await ProductController.getProduct(req, res);
    });

    test("should return a 404 error if the product is not found", async () => {
        const productId = "987654321";

        // Mock the request and response objects
        const req = { params: { productId: productId } };
        const res = {
            status(code) {
                expect(code).toEqual(404);
                return this;
            },
            json(data) {
                expect(data).toEqual({
                    success: false,
                    error: "Product not found",
                });
            },
        };

        // Act
        await ProductController.getProduct(req, res);
    });
});

describe("ProductController.getAllProducts", () => {
    test("should return all products", async () => {
        // Mock the request and response objects
        const req = {
            query: {},
        };
        const res = {
            status(code) {
                expect(code).toEqual(200);
                return this;
            },
            json(data) {
                expect(data.success).toEqual(true);
                expect(data.products.length).toEqual(10);
                expect(data.totalProducts).toEqual(10);
                expect(data.totalPages).toEqual(1);
                expect(data.currentPage).toEqual(1);
            },
        };

        // Act
        await ProductController.getAllProducts(req, res);
    });
});

describe("ProductController.addProductToCart", () => {
    test("should add the new product to the cart", async () => {
        const productId = "1";
        const userId = "3";

        // Mock the request and response objects
        const req = {
            user: await User.findByPk(userId),
            params: { productId: productId },
        };
        const res = {
            status(code) {
                expect(code).toEqual(200);
                return this;
            },
            json(data) {
                expect(data.success).toEqual(true);
                expect(data.product.id).toEqual(productId);
                expect(data.product.quantity).toEqual(1);
            },
        };

        // Act
        await ProductController.addProductToCart(req, res);
    });

    test("should return a 404 error if the product is not found", async () => {
        const productId = "987654321";
        const userId = "3";

        // Mock the request and response objects
        const req = {
            user: await User.findByPk(userId),
            params: { productId: productId },
        };
        const res = {
            status(code) {
                expect(code).toEqual(404);
                return this;
            },
            json(data) {
                expect(data).toEqual({
                    success: false,
                    error: "Product not found",
                });
            },
        };

        // Act
        await ProductController.addProductToCart(req, res);
    });

    test("should increment the quantity of the product in the cart by 1", async () => {
        const productId = "1";
        const userId = "1";

        // Mock the request and response objects
        const req = {
            user: await User.findByPk(userId),
            params: { productId: productId },
        };
        const res = {
            status(code) {
                expect(code).toEqual(200);
                return this;
            },
            json(data) {
                expect(data.success).toEqual(true);
                expect(data.product.id).toEqual(productId);
                expect(data.product.quantity).toEqual(3); // Assuming the initial quantity is 1
            },
        };

        // Act
        await ProductController.addProductToCart(req, res);
    });
});

describe("ProductController.createNewProduct", () => {
    test("should create a new product", async () => {
        const newProduct = {
            name: "New Product",
            price: 1999,
            description: "This is a new product",
        };

        // Mock the request and response objects
        const req = {
            body: newProduct,
        };
        const res = {
            status(code) {
                expect(code).toEqual(201);
                return this;
            },
            json(data) {
                expect(data.success).toEqual(true);
                expect(data.product.name).toEqual(newProduct.name);
                expect(data.product.price).toEqual(newProduct.price);
                expect(data.product.description).toEqual(
                    newProduct.description
                );
            },
        };

        // Act
        await ProductController.createNewProduct(req, res);
    });
});

describe("ProductController.updateProduct", () => {
    test("should update the product with the specified ID", async () => {
        const productId = "1";
        const updatedProduct = {
            name: "Updated Product",
            price: 2499,
            description: "This product has been updated",
        };

        // Mock the request and response objects
        const req = {
            params: { productId: productId },
            body: updatedProduct,
        };
        const res = {
            status(code) {
                expect(code).toEqual(200);
                return this;
            },
            json(data) {
                expect(data.success).toEqual(true);
                expect(data.product.name).toEqual(updatedProduct.name);
                expect(data.product.price).toEqual(updatedProduct.price);
                expect(data.product.description).toEqual(
                    updatedProduct.description
                );
            },
        };

        // Act
        await ProductController.updateProduct(req, res);
    });

    test("should return a 404 error if the product is not found", async () => {
        const productId = "987654321";
        const updatedProduct = {
            name: "Updated Product",
            price: 2499,
            description: "This product has been updated",
        };

        // Mock the request and response objects
        const req = {
            params: { productId: productId },
            body: updatedProduct,
        };
        const res = {
            status(code) {
                expect(code).toEqual(404);
                return this;
            },
            json(data) {
                expect(data).toEqual({
                    success: false,
                    error: "Product not found",
                });
            },
        };

        // Act
        await ProductController.updateProduct(req, res);
    });
});

describe("ProductController.deleteProduct", () => {
    test("should delete the product with the specified ID", async () => {
        const productId = "1";

        // Mock the request and response objects
        const req = {
            params: { productId: productId },
        };
        const res = {
            status(code) {
                expect(code).toEqual(200);
                return this;
            },
            json(data) {
                expect(data.success).toEqual(true);
            },
        };

        // Act
        await ProductController.deleteProduct(req, res);
    });

    test("should return a 404 error if the product is not found", async () => {
        const productId = "987654321";

        // Mock the request and response objects
        const req = {
            params: { productId: productId },
        };
        const res = {
            status(code) {
                expect(code).toEqual(404);
                return this;
            },
            json(data) {
                expect(data).toEqual({
                    success: false,
                    error: "Product not found",
                });
            },
        };

        // Act
        await ProductController.deleteProduct(req, res);
    });
});
