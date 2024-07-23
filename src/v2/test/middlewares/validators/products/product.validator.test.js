import { validationResult } from "express-validator";
import validator from "../../../../middlewares/validators/index.validator.js";

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
                        imageOrder: 1,
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
                        imageOrder: 1,
                        discountPrice: 90,
                    },
                ],
                images: [
                    {
                        url: "example.com",
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
                        imageOrder: 1,
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
        expect(errors.array()).toContainEqual(
            expect.objectContaining({
                msg: "Name is required",
            })
        );
    });

    test("should return an error if variants is not an array", async () => {
        const req = {
            body: {
                name: "example",
                description: "example",
                variants: "invalid",
            },
        };

        for (const validationChain of validator.validateCreateProduct) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toContainEqual(
            expect.objectContaining({
                msg: "Variants should be an array",
            })
        );
    });

    test("should return an error if images is not an array", async () => {
        const req = {
            body: {
                name: "example",
                description: "example",
                variants: [
                    {
                        price: 100,
                        stock: 100,
                        sku: "example",
                        imageOrder: 1,
                        discountPrice: 90,
                    },
                ],
                images: "invalid",
            },
        };

        for (const validationChain of validator.validateCreateProduct) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toContainEqual(
            expect.objectContaining({
                msg: "Images should be an array",
            })
        );
    });

    test("should return an error if categories is not an array", async () => {
        const req = {
            body: {
                name: "example",
                description: "example",
                variants: [
                    {
                        price: 100,
                        stock: 100,
                        sku: "example",
                        imageOrder: 1,
                        discountPrice: 90,
                    },
                ],
                categories: "invalid",
            },
        };

        for (const validationChain of validator.validateCreateProduct) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toContainEqual(
            expect.objectContaining({
                msg: "Categories should be an array",
            })
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
                        imageOrder: 1,
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
        expect(errors.array()).toContainEqual(
            expect.objectContaining({
                msg: "Name should be a string",
            })
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
                        imageOrder: 1,
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
        expect(errors.array()).toContainEqual(
            expect.objectContaining({
                msg: "Description should be a string",
            })
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
                        stock: "invalid",
                        imageOrder: "invalid",
                        discountPrice: "invalid",
                    },
                ],
                images: [
                    {
                        url: 123,
                    },
                ],
                categories: ["invalid"],
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
                    msg: "Stock should be an integer greater than or equal to 0",
                }),
                expect.objectContaining({
                    msg: "SKU is required",
                }),
                expect.objectContaining({
                    msg: "Image order should be an integer greater than or equal to 1",
                }),
                expect.objectContaining({
                    msg: "Discount price should be a number",
                }),
                expect.objectContaining({
                    msg: "URL should be a string",
                }),
                expect.objectContaining({
                    msg: "Category does not exist",
                }),
            ])
        );
    });
});
