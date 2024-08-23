import { validationResult } from "express-validator";
import validator from "../../../../../middlewares/validators/index.validator.js";
import seedData from "../../../../../seedData.js";
import { stringRegex } from "../../../../../middlewares/validators/utils.validator.js";

beforeAll(async () => {
    await seedData();
});

describe("validateCreateProduct", () => {
    test("should return empty error array if all fields are valid", async () => {
        const req = {
            body: {
                name: "example",
                description: "example",
                variants: [
                    {
                        price: 100,
                        stock: 100,
                        sku: "example",
                        imageIndex: 0,
                        discountPrice: 90,
                    },
                ],
            },
        };

        for (const validationChain of validator.validateCreateProduct) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(true);
    });

    test("should return empty error array if all fields are valid 2", async () => {
        const req = {
            body: {
                name: "example",
                description: "example",
                variants: [
                    {
                        price: 100,
                        stock: 100,
                        sku: "example",
                        imageIndex: 0,
                        discountPrice: 90,
                    },
                ],
                images: [
                    {
                        url: "example.com",
                        altText: "example",
                    },
                ],
                categories: ["tops", "male"],
            },
        };

        for (const validationChain of validator.validateCreateProduct) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(true);
    });

    // Test for name
    test("should return an error if name is missing", async () => {
        const req = {
            body: {
                description: "example",
                variants: [
                    {
                        price: 100,
                        stock: 100,
                        sku: "example",
                        imageID: "123",
                        discountPrice: 90,
                    },
                ],
            },
        };

        for (const validationChain of validator.validateCreateProduct) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "Name is required",
                }),
            ])
        );
    });

    test("should return an error if variants, images, or categories are not arrays", async () => {
        const req = {
            body: {
                name: "example",
                description: "example",
                variants: "invalid",
                images: "invalid",
                categories: "invalid",
            },
        };

        for (const validationChain of validator.validateCreateProduct) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "Variants should be an array",
                }),
                expect.objectContaining({
                    msg: "Images should be an array",
                }),
                expect.objectContaining({
                    msg: "Categories should be an array",
                }),
            ])
        );
    });

    test("should return an error if name is not a string", async () => {
        const req = {
            body: {
                name: 123,
                description: "example",
                variants: [
                    {
                        price: 100,
                        stock: 100,
                        sku: "example",
                        imageID: "123",
                        discountPrice: 90,
                    },
                ],
            },
        };

        for (const validationChain of validator.validateCreateProduct) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "Name should be a string",
                }),
            ])
        );
    });

    test("should return an error if description is not a string", async () => {
        const req = {
            body: {
                name: "example",
                description: 123,
                variants: [
                    {
                        price: 100,
                        stock: 100,
                        sku: "example",
                        imageID: "123",
                        discountPrice: 90,
                    },
                ],
            },
        };

        for (const validationChain of validator.validateCreateProduct) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "Description should be a string",
                }),
            ])
        );
    });

    test("should return errors if elements in variants, images and categories are invalid", async () => {
        const req = {
            body: {
                name: "example",
                description: "example",
                variants: [
                    {
                        price: "invalid",
                        stock: [],
                        imageIndex: [],
                        discountPrice: "invalid",
                    },
                ],
                images: [
                    {
                        url: 123,
                        altText: 123,
                    },
                ],
                categories: [123],
            },
        };

        for (const validationChain of validator.validateCreateProduct) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);

        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "Price should be a number",
                }),
                expect.objectContaining({
                    msg: "Stock should be an integer",
                }),
                expect.objectContaining({
                    msg: "SKU is required",
                }),
                expect.objectContaining({
                    msg: "Image index should be an integer",
                }),
                expect.objectContaining({
                    msg: "Discount price should be a number",
                }),
                expect.objectContaining({
                    msg: "URL should be a string",
                }),
                expect.objectContaining({
                    msg: "Alt text should be a string",
                }),
                expect.objectContaining({
                    msg: "Category should be a string",
                }),
            ])
        );
    });

    test("should return an error if there are unexpected fields", async () => {
        const req = {
            body: {
                name: "example",
                description: "example",
                variants: [
                    {
                        price: 100,
                        stock: 100,
                        sku: "example",
                        imageIndex: 0,
                        discountPrice: 90,
                    },
                ],
                unexpectedField: "unexpected",
                unexpectedField2: "unexpected",
            },
        };

        for (const validationChain of validator.validateCreateProduct) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "Unexpected fields: unexpectedField, unexpectedField2",
                }),
            ])
        );
    });
});

describe("validatePatchProduct", () => {
    test("should return empty error array if all fields are valid", async () => {
        const req = {
            body: {
                name: "example",
                description: "example",
            },
        };

        for (const validationChain of validator.validatePatchProduct) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(true);
    });

    test("should return an error if fields are invalid", async () => {
        const req = {
            body: {
                productID: "invalid",
                name: 123,
                description: 123,
            },
        };

        for (const validationChain of validator.validatePatchProduct) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "Unexpected fields: productID",
                }),
                expect.objectContaining({
                    msg: "Name should be a string",
                }),
                expect.objectContaining({
                    msg: "Description should be a string",
                }),
            ])
        );
    });
});

describe("validateQueryGetProductUser", () => {
    test("should return empty error array if all query parameters are valid", async () => {
        const req = {
            query: {
                page: "1",
                size: "10",
                sort: ["price", "name", "stock", "discountPrice"],
                name: ["[like]example", "test"],
                variant: {
                    price: "100",
                    discountPrice: "[lte]90",
                    stock: "[gte]100",
                    sku: "example",

                    // Ignore unexpected fields
                    variantID: "1",
                    createdAt: "2024-01-01T00:00:00.000Z",
                },
                category: ["tops", "male"],
                attributes: {
                    color: "red",
                    size: "medium",
                },
                // Ignore unexpected fields
                productID: "1",
                createdAt: "2024-01-01T00:00:00.000Z",
                updatedAt: "2024-01-01T00:00:00.000Z",
                deletedAt: "2024-01-01T00:00:00.000Z",
            },
        };

        for (const validationChain of validator.validateQueryGetProductUser) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(true);
    });

    test("should return an error if fields are invalid", async () => {
        const req = {
            query: {
                productID: "[keli]invalid",
                name: "[keli]test",
                page: "invalid",
                size: "invalid",
                sort: "price,-createdAt",
            },
        };

        for (const validationChain of validator.validateQueryGetProductUser) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "Page should be a positive integer",
                }),
                expect.objectContaining({
                    msg: "Size should be a positive integer",
                }),
                expect.objectContaining({
                    msg: "Name should have valid string format",
                }),
                expect.objectContaining({
                    msg: "Invalid sort field: createdAt",
                }),
            ])
        );
    });

    test("should return an error if variant fields have invalid format", async () => {
        const req = {
            query: {
                variant: {
                    price: "invalid",
                    stock: ["[gte]30", "[lte]"],
                    discountPrice: "invalid",
                    sku: { invalid: "invalid" },
                },
            },
        };

        for (const validationChain of validator.validateQueryGetProductUser) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "Variant price should have valid number format",
                }),
                expect.objectContaining({
                    msg: "Variant stock array should contain valid number formats",
                }),
                expect.objectContaining({
                    msg: "Variant discount price should have valid number format",
                }),
                expect.objectContaining({
                    msg: "Variant SKU should be a string or an array of string",
                }),
            ])
        );
    });

    test("should return an error if attribute, variant and category is invalid", async () => {
        const req = {
            query: {
                category: {},
                variant: "invalid",
                attributes: "invalid",
            },
        };

        for (const validationChain of validator.validateQueryGetProductUser) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "Attributes should be an object",
                }),
                expect.objectContaining({
                    msg: "Variant should be an object",
                }),
                expect.objectContaining({
                    msg: "Category should be a string or an array",
                }),
            ])
        );
    });
});

describe("validateQueryGetProduct", () => {
    test("should return empty error array if all query parameters are valid", async () => {
        const req = {
            query: {
                page: "1",
                size: "10",
                sort: [
                    "productID",
                    "price",
                    "name",
                    "stock",
                    "discountPrice",
                    "createdAt",
                    "updatedAt",
                    "deletedAt",
                ],
                productID: "1",
                name: "example",
                variant: {
                    price: "100",
                    discountPrice: "[lte]90",
                    stock: "[gte]100",
                    sku: "example",

                    // Ignore unexpected fields
                    variantID: "1",
                    createdAt: "2024-01-01T00:00:00.000Z",
                },
                category: ["tops", "male"],
                attributes: {
                    color: "red",
                    size: "medium",
                },
                createdAt: "2024-01-01",
                updatedAt: "2024-01-01",
                deletedAt: "2024-01-01",

                // Ignore unexpected fields
                unexpectedField: "unexpected",
                unexpectedField2: "unexpected",
            },
        };

        for (const validationChain of validator.validateQueryGetProduct) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(true);
    });

    test("should return an error if fields are invalid", async () => {
        const req = {
            query: {
                productID: "[keli]invalid",
                name: ["[keli]test"],
                createdAt: "invalid",
                updatedAt: ["invalid"],
                deletedAt: "invalid",
                sort: "invalid",
            },
        };

        for (const validationChain of validator.validateQueryGetProduct) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "ProductID should have valid string format",
                }),
                expect.objectContaining({
                    msg: "Name array should contain valid string formats",
                }),
                expect.objectContaining({
                    msg: "CreatedAt should have valid date format ([operator]YYYY-MM-DD)",
                }),
                expect.objectContaining({
                    msg: "UpdatedAt array should contain valid date formats ([operator]YYYY-MM-DD)",
                }),
                expect.objectContaining({
                    msg: "DeletedAt should have valid date format ([operator]YYYY-MM-DD)",
                }),
                expect.objectContaining({
                    msg: "Invalid sort field: invalid",
                }),
            ])
        );
    });

    test("should return an error if variant fields have invalid format", async () => {
        const req = {
            query: {
                variant: {
                    price: "invalid",
                    stock: ["[gte]30", "[lte]"],
                    discountPrice: "invalid",
                    sku: { invalid: "invalid" },
                },
            },
        };

        for (const validationChain of validator.validateQueryGetProduct) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "Variant price should have valid number format",
                }),
                expect.objectContaining({
                    msg: "Variant stock array should contain valid number formats",
                }),
                expect.objectContaining({
                    msg: "Variant discount price should have valid number format",
                }),
                expect.objectContaining({
                    msg: "Variant SKU should be a string or an array of string",
                }),
            ])
        );
    });

    test("should return an error if attribute, variant and category is invalid", async () => {
        const req = {
            query: {
                category: {},
                variant: "invalid",
                attributes: "invalid",
            },
        };

        for (const validationChain of validator.validateQueryGetProduct) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "Attributes should be an object",
                }),
                expect.objectContaining({
                    msg: "Variant should be an object",
                }),
                expect.objectContaining({
                    msg: "Category should be a string or an array",
                }),
            ])
        );
    });
});
