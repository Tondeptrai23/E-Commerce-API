import productService from "../../../services/products/product.service.js";
import seedData from "../../../seedData.js";
import { ResourceNotFoundError } from "../../../utils/error.js";

beforeAll(async () => {
    await seedData();
}, 15000);

describe("ProductService.createProduct", () => {
    describe("ProductService.getProducts", () => {
        test("should return all products without associated", async () => {
            const products = await productService.getProducts({});
            expect(products).toHaveLength(6);

            expect(products[0]).toEqual(
                expect.objectContaining({
                    productID: expect.any(String),
                    name: expect.any(String),
                    description: expect.any(String),
                    defaultVariantID: expect.any(String),
                })
            );

            expect(products[0].defaultVariant).toEqual(
                expect.objectContaining({
                    variantID: expect.any(String),
                    price: expect.any(Number),
                    stock: expect.any(Number),
                })
            );

            expect(products[0].images).toBeUndefined();
            expect(products[0].variants).toBeUndefined();
            expect(products[0].categories).toBeUndefined();
        });

        test("should return all products with associated fields", async () => {
            const products = await productService.getProducts({
                includeAssociated: true,
            });
            expect(products).toHaveLength(6);

            expect(products[0]).toEqual(
                expect.objectContaining({
                    productID: expect.any(String),
                    name: expect.any(String),
                    description: expect.any(String),
                    defaultVariantID: expect.any(String),
                })
            );

            expect(products[0].defaultVariant).toBeUndefined();

            expect(products[0].images).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        imageID: expect.any(String),
                        url: expect.any(String),
                    }),
                ])
            );

            expect(products[0].variants).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        variantID: expect.any(String),
                        price: expect.any(Number),
                        stock: expect.any(Number),
                    }),
                ])
            );

            expect(products[0].categories).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        categoryID: expect.any(String),
                    }),
                ])
            );
        });
    });

    describe("ProductService.getProduct", () => {
        test("should return a product with the given productID without associated", async () => {
            const productID = "1";
            const product = await productService.getProduct(productID, {});

            expect(product).toEqual(
                expect.objectContaining({
                    productID: "1",
                    name: expect.any(String),
                    description: expect.any(String),
                    defaultVariantID: expect.any(String),
                })
            );

            expect(product.defaultVariant).toEqual(
                expect.objectContaining({
                    variantID: expect.any(String),
                    price: expect.any(Number),
                    stock: expect.any(Number),
                })
            );

            expect(product.iamges).toBeUndefined();
            expect(product.variants).toBeUndefined();
            expect(product.categories).toBeUndefined();
        });

        test("should return a product with the given productID with associated fields", async () => {
            const productID = "1";
            const product = await productService.getProduct(productID, {
                includeAssociated: true,
            });

            expect(product).toEqual(
                expect.objectContaining({
                    productID: "1",
                    name: expect.any(String),
                    description: expect.any(String),
                    defaultVariantID: expect.any(String),
                })
            );

            expect(product.defaultVariant).toBeUndefined();

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
                defaultVariantID: "102",
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
            expect(updatedProduct.dataValues.defaultVariant.variantID).toEqual(
                "102"
            );
        });

        test("should throw ResourceNotFoundError when the product is not found", async () => {
            const productID = "999";
            const updatedProductInfo = {
                name: "Updated Product",
                description: "Updated description",
                defaultVariantID: "102",
            };

            await expect(
                productService.updateProduct(productID, updatedProductInfo)
            ).rejects.toThrow(ResourceNotFoundError);
        });

        test("should throw ResourceNotFoundError when the default variant is not found", async () => {
            const productID = "1";
            const updatedProductInfo = {
                name: "Updated Product",
                description: "Updated description",
                defaultVariantID: "999",
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
