import validator from "../../../../middlewares/validators/index.validator.js";
import { validationResult } from "express-validator";

describe("validateCreateVariants", () => {
    test("should return empty error array if all fields are valid", async () => {
        const req = {
            body: {
                variants: [
                    {
                        price: 100,
                        stock: 100,
                        sku: "example",
                        imageOrder: 1,
                        discountPrice: 90,
                    },
                    {
                        price: 100,
                        stock: 100,
                        sku: "example2",
                        imageOrder: 2,
                        discountPrice: 80,
                    },
                ],
            },
        };

        for (const validationChain of validator.validateCreateVariants) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(true);
    });

    test("should return errors if variants is empty array", async () => {
        const req = {
            body: {
                variants: [],
            },
        };

        for (const validationChain of validator.validateCreateVariants) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toContainEqual(
            expect.objectContaining({
                msg: "Variants should have at least one item",
            })
        );
    });

    test("should return errors if required fields are missing", async () => {
        const req = {
            body: {
                variants: [
                    {
                        stock: 100,
                        sku: "example",
                        imageOrder: 1,
                        discountPrice: 90,
                    },
                    {
                        price: 100,
                        sku: "example",
                        imageOrder: 1,
                        discountPrice: 90,
                    },
                    {
                        price: 100,
                        stock: 100,
                        imageOrder: 1,
                        discountPrice: 90,
                    },
                ],
            },
        };

        for (const validationChain of validator.validateCreateVariants) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "Price is required",
                }),
                expect.objectContaining({
                    msg: "Stock is required",
                }),
                expect.objectContaining({
                    msg: "SKU is required",
                }),
            ])
        );
    });

    test("should return errors if fields are invalid", async () => {
        const req = {
            body: {
                variants: [
                    {
                        price: "invalid",
                        stock: -10,
                        sku: 12345,
                        imageOrder: "invalid",
                        discountPrice: "invalid",
                    },
                ],
            },
        };

        for (const validationChain of validator.validateCreateVariants) {
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
                    msg: "SKU should be a string",
                }),
                expect.objectContaining({
                    msg: "Image order should be an integer greater than or equal to 1",
                }),
                expect.objectContaining({
                    msg: "Discount price should be a number",
                }),
            ])
        );
    });

    test("should return error if discount price is bigger than price", async () => {
        const req = {
            body: {
                variants: [
                    {
                        price: 100,
                        stock: 100,
                        sku: "example",
                        imageOrder: 1,
                        discountPrice: 120,
                    },
                ],
            },
        };

        for (const validationChain of validator.validateCreateVariants) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "Discount price should be less than or equal to price",
                }),
            ])
        );
    });
});

describe("validatePutVariant", () => {
    test("should return empty error array if all fields are valid", async () => {
        const req = {
            body: {
                stock: 100,
                price: 100,
                sku: "example",
                imageOrder: 1,
                discountPrice: 90,
            },
        };

        for (const validationChain of validator.validatePutVariant) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(true);
    });

    test("should return errors if required fields are missing", async () => {
        const req = {
            body: {
                imageOrder: 1,
                discountPrice: 90,
            },
        };

        for (const validationChain of validator.validatePutVariant) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "SKU is required",
                }),
                expect.objectContaining({
                    msg: "Price is required",
                }),
                expect.objectContaining({
                    msg: "Stock is required",
                }),
            ])
        );
    });

    test("should return errors if fields are invalid", async () => {
        const req = {
            body: {
                stock: -10,
                price: "invalid",
                sku: 12345,
                imageOrder: "invalid",
                discountPrice: "invalid",
            },
        };

        for (const validationChain of validator.validatePutVariant) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "Stock should be an integer greater than or equal to 0",
                }),
                expect.objectContaining({
                    msg: "Price should be a number",
                }),
                expect.objectContaining({
                    msg: "SKU should be a string",
                }),
                expect.objectContaining({
                    msg: "Image order should be an integer greater than or equal to 1",
                }),
                expect.objectContaining({
                    msg: "Discount price should be a number",
                }),
            ])
        );
    });
});

describe("validatePatchVariant", () => {
    test("should return empty error array if all fields are valid", async () => {
        const req = {
            body: {
                name: "example",
                price: 100,
                stock: 100,
                sku: "example",
                imageOrder: 1,
                discountPrice: 90,
            },
        };

        for (const validationChain of validator.validatePatchVariant) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(true);
    });

    test("should return errors if fields are invalid", async () => {
        const req = {
            body: {
                name: 12345,
                price: "invalid",
                stock: -10,
                sku: 12345,
                imageOrder: "invalid",
                discountPrice: "invalid",
            },
        };

        for (const validationChain of validator.validatePatchVariant) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "Name should be a string",
                }),
                expect.objectContaining({
                    msg: "Price should be a number",
                }),
                expect.objectContaining({
                    msg: "Stock should be an integer greater than or equal to 0",
                }),
                expect.objectContaining({
                    msg: "SKU should be a string",
                }),
                expect.objectContaining({
                    msg: "Image order should be an integer greater than or equal to 1",
                }),
                expect.objectContaining({
                    msg: "Discount price should be a number",
                }),
            ])
        );
    });
});
