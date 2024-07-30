import validator from "../../../../middlewares/validators/index.validator.js";
import { validationResult } from "express-validator";

describe("validateAddToCart", () => {
    test("should return empty error array if all fields are valid", async () => {
        const req = {
            body: {
                quantity: 1,
            },
        };

        for (const validationChain of validator.validateAddToCart) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(true);
    });

    test("should return error if quantity is missing", async () => {
        const req = {
            body: {},
        };

        for (const validationChain of validator.validateAddToCart) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "Quantity is required",
                }),
            ])
        );
    });

    test("should return error if quantity is not an integer", async () => {
        const req = {
            body: {
                quantity: 1.25,
            },
        };

        for (const validationChain of validator.validateAddToCart) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "Quantity should be an integer",
                }),
            ])
        );
    });

    test("should return error if quantity is less than 1", async () => {
        const req = {
            body: {
                quantity: 0,
            },
        };

        for (const validationChain of validator.validateAddToCart) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "Quantity should be greater than or equal to 1",
                }),
            ])
        );
    });
});

describe("validateUpdateCart", () => {
    test("should return empty error array if all fields are valid", async () => {
        const req = {
            body: {
                quantity: 1,
            },
        };

        for (const validationChain of validator.validateUpdateCart) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(true);
    });

    test("should return error if quantity is missing", async () => {
        const req = {
            body: {},
        };

        for (const validationChain of validator.validateUpdateCart) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "Quantity is required",
                }),
            ])
        );
    });

    test("should return error if quantity is not an integer", async () => {
        const req = {
            body: {
                quantity: 1.25,
            },
        };

        for (const validationChain of validator.validateUpdateCart) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "Quantity should be an integer",
                }),
            ])
        );
    });

    test("should return error if quantity is less than 1", async () => {
        const req = {
            body: {
                quantity: 0,
            },
        };

        for (const validationChain of validator.validateUpdateCart) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "Quantity should be greater than or equal to 1",
                }),
            ])
        );
    });
});

describe("validateFetchCart", () => {
    test("should return empty error array if all fields are valid", async () => {
        const req = {
            body: {
                variantIDs: ["VariantID"],
            },
        };

        for (const validationChain of validator.validateFetchCart) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(true);
    });

    test("should return error if variantIDs is not an array", async () => {
        const req = {
            body: {
                variantIDs: "VariantID",
            },
        };

        for (const validationChain of validator.validateFetchCart) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "Variant IDs should be an array",
                }),
            ])
        );
    });

    test("should return error if variantIDs is an empty array", async () => {
        const req = {
            body: {
                variantIDs: [],
            },
        };

        for (const validationChain of validator.validateFetchCart) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "Variant IDs should not be empty",
                }),
            ])
        );
    });

    test("should return error if variantIDs is not an array of strings", async () => {
        const req = {
            body: {
                variantIDs: [123],
            },
        };

        for (const validationChain of validator.validateFetchCart) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "Variant IDs should be an array of strings",
                }),
            ])
        );
    });
});
