import productService from "../../../services/products/product.service.js";
import seedData from "../../../seedData.js";
import { ResourceNotFoundError } from "../../../utils/error.js";

beforeAll(async () => {
    await seedData();
}, 15000);

describe("ProductService", () => {
    describe("ProductService.getProducts", () => {
        test("should return all products", async () => {
            const products = await productService.getProducts({});
            expect(products).toHaveLength(6);

            expect(products[0]).toEqual(
                expect.objectContaining({
                    productID: expect.any(String),
                    name: expect.any(String),
                    description: expect.any(String),
                })
            );
        });
    });

    describe("ProductService.getProduct", () => {
        test("should return a product with the given productID", async () => {
            const productID = "1";
            const product = await productService.getProduct(productID);

            expect(product).toEqual(
                expect.objectContaining({
                    productID: "1",
                    name: expect.any(String),
                    description: expect.any(String),
                })
            );

            expect(product.images).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        imageID: expect.any(String),
                        url: expect.any(String),
                    }),
                ])
            );

            expect(product.variants).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        variantID: expect.any(String),
                        price: expect.any(Number),
                        stock: expect.any(Number),
                    }),
                ])
            );

            expect(product.categories).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        categoryID: expect.any(String),
                    }),
                ])
            );
        });

        test("should return null when the product is not found", async () => {
            const productID = "999";
            const product = await productService.getProduct(productID, {});

            expect(product).toBeNull();
        });
    });

    describe("ProductService.updateProduct", () => {
        test("should update a product with the given productID", async () => {
            const productID = "1";
            const updatedProductInfo = {
                name: "Updated Product",
                description: "Updated description",
            };

            const updatedProduct = await productService.updateProduct(
                productID,
                updatedProductInfo
            );

            expect(updatedProduct).toEqual(
                expect.objectContaining({
                    productID: "1",
                    name: "Updated Product",
                    description: "Updated description",
                })
            );
        });

        test("should throw ResourceNotFoundError when the product is not found", async () => {
            const productID = "999";
            const updatedProductInfo = {
                name: "Updated Product",
                description: "Updated description",
            };

            await expect(
                productService.updateProduct(productID, updatedProductInfo)
            ).rejects.toThrow(ResourceNotFoundError);
        });
    });

    describe("ProductService.deleteProduct", () => {
        test("should delete a product with the given productID", async () => {
            const productID = "1";
            await productService.deleteProduct(productID);

            const product = await productService.getProduct(productID, {});
            expect(product).toBeNull();
        });

        test("should throw ResourceNotFoundError when the product is not found", async () => {
            const productID = "999";
            await expect(
                productService.deleteProduct(productID)
            ).rejects.toThrow(ResourceNotFoundError);
        });
    });
});
