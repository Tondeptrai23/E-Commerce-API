import validator from "../../../../../middlewares/validators/index.validator.js";
import { validationResult } from "express-validator";

describe("validateCreateCoupon", () => {
    test("should return empty error array if all fields are valid", async () => {
        const req = {
            body: {
                code: "CODE",
                discountType: "percentage",
                discountValue: 10,
                target: "all",
                minimumOrderAmount: 0,
                maxUsage: 20,
                startDate: "2024-01-01",
                endDate: "2024-01-02",
            },
        };

        for (const validationChain of validator.validateCreateCoupon) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(true);
    });
    test("should return errors if required fields are missing", async () => {
        const req = {
            body: {
                minimumOrderAmount: 0,
                maxUsage: 20,
                startDate: "2024-01-01",
                endDate: "2024-01-02",
            },
        };

        for (const validationChain of validator.validateCreateCoupon) {
            await validationChain.run(req);
        }

        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toContainEqual(
            expect.objectContaining({
                msg: "Code is required",
            }),
            expect.objectContaining({
                msg: "Discount type is required",
            }),
            expect.objectContaining({
                msg: "Discount value is required",
            }),
            expect.objectContaining({
                msg: "Target is required",
            })
        );
    });

    test("should return errors if fields are invalid types", async () => {
        const req = {
            body: {
                code: 1234,
                discountType: 123,
                discountValue: "123",
                target: 123,
                minimumOrderAmount: [],
                maxUsage: [],
                startDate: "abc",
                endDate: "def",
            },
        };

        for (const validationChain of validator.validateCreateCoupon) {
            await validationChain.run(req);
        }

        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "Code should be a string",
                }),
                expect.objectContaining({
                    msg: "Discount type should be valid",
                }),
                expect.objectContaining({
                    msg: "Discount value should be a number",
                }),
                expect.objectContaining({
                    msg: "Target should be valid",
                }),
                expect.objectContaining({
                    msg: "Minimum order amount should be a number",
                }),
                expect.objectContaining({
                    msg: "Max usage should be an integer",
                }),
                expect.objectContaining({
                    msg: "Start date should be a valid date (ISO8601)",
                }),
                expect.objectContaining({
                    msg: "End date should be a valid date (ISO8601)",
                }),
            ])
        );
    });

    test("should return errors if fields are invalid values", async () => {
        const req = {
            body: {
                code: "CODE",
                discountType: "percentage",
                discountValue: -1,
                target: "single",
                minimumOrderAmount: 120,
                maxUsage: -1,
                startDate: "2024-02-05",
                endDate: "2024-01-02",
            },
        };

        for (const validationChain of validator.validateCreateCoupon) {
            await validationChain.run(req);
        }

        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "Discount value should be greater than or equal to 0",
                }),
                expect.objectContaining({
                    msg: "Max usage should be greater than or equal to 0",
                }),
                expect.objectContaining({
                    msg: "Minimum order amount should be less than 100 for percentage discount",
                }),
                expect.objectContaining({
                    msg: "Start date should be before end date",
                }),
            ])
        );
    });
});

describe("validatePatchCoupon", () => {
    test("should return empty error array if all fields are valid", async () => {
        const req = {
            body: {
                description: "DESCRIPTION",
                minimumOrderAmount: 0,
                maxUsage: 10,
                startDate: "2024-01-01",
                endDate: "2024-01-02",
            },
        };

        for (const validationChain of validator.validatePatchCoupon) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(true);
    });

    test("should return errors if fields are invalid types", async () => {
        const req = {
            body: {
                description: 123,
                minimumOrderAmount: "123",
                maxUsage: "123",
                startDate: 123,
                endDate: 123,
            },
        };

        for (const validationChain of validator.validatePatchCoupon) {
            await validationChain.run(req);
        }

        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "Description should be a string",
                }),
                expect.objectContaining({
                    msg: "Minimum order amount should be a number",
                }),
                expect.objectContaining({
                    msg: "Max usage should be an integer",
                }),
                expect.objectContaining({
                    msg: "Start date should be a valid date (ISO8601)",
                }),
                expect.objectContaining({
                    msg: "End date should be a valid date (ISO8601)",
                }),
            ])
        );
    });

    test("should return errors if fields are invalid values", async () => {
        const req = {
            body: {
                minimumOrderAmount: -1,
                maxUsage: -1,
                startDate: "invalid",
                endDate: "invalid",
            },
        };

        for (const validationChain of validator.validatePatchCoupon) {
            await validationChain.run(req);
        }

        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "Max usage should be greater than or equal to 0",
                }),
                expect.objectContaining({
                    msg: "Minimum order amount should be greater than or equal to 0",
                }),
                expect.objectContaining({
                    msg: "Start date should be a valid date (ISO8601)",
                }),
                expect.objectContaining({
                    msg: "End date should be a valid date (ISO8601)",
                }),
            ])
        );
    });
});

describe("validateAddCategoriesCoupon", () => {
    test("should return empty error array if all fields are valid", async () => {
        const req = {
            body: {
                categories: ["category1", "category2"],
            },
        };

        for (const validationChain of validator.validateAddCategoriesCoupon) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(true);
    });

    test("should return errors if categories field is missing", async () => {
        const req = {
            body: {},
        };

        for (const validationChain of validator.validateAddCategoriesCoupon) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toContainEqual(
            expect.objectContaining({
                msg: "Categories are required",
            })
        );
    });

    test("should return errors if fields are invalid types", async () => {
        const req = {
            body: {
                categories: "category1",
            },
        };

        for (const validationChain of validator.validateAddCategoriesCoupon) {
            await validationChain.run(req);
        }

        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "Categories should be an array",
                }),
            ])
        );
    });

    test("should return errors if categories field is empty", async () => {
        const req = {
            body: {
                categories: [],
            },
        };

        for (const validationChain of validator.validateAddCategoriesCoupon) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toContainEqual(
            expect.objectContaining({
                msg: "Categories should have at least one item",
            })
        );
    });

    test("should return errors if category field is invalid type", async () => {
        const req = {
            body: {
                categories: [123],
            },
        };

        for (const validationChain of validator.validateAddCategoriesCoupon) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toContainEqual(
            expect.objectContaining({
                msg: "Category should be a string",
            })
        );
    });
});

describe("validateAddProductsCoupon", () => {
    test("should return empty error array if all fields are valid", async () => {
        const req = {
            body: {
                productIDs: ["product1", "product2"],
            },
        };

        for (const validationChain of validator.validateAddProductsCoupon) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(true);
    });

    test("should return errors if productIDs field is missing", async () => {
        const req = {
            body: {},
        };

        for (const validationChain of validator.validateAddProductsCoupon) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toContainEqual(
            expect.objectContaining({
                msg: "ProductIDs are required",
            })
        );
    });

    test("should return errors if fields are invalid types", async () => {
        const req = {
            body: {
                productIDs: "product1",
            },
        };

        for (const validationChain of validator.validateAddProductsCoupon) {
            await validationChain.run(req);
        }

        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "ProductIDs should be an array",
                }),
            ])
        );
    });

    test("should return errors if productIDs field is empty", async () => {
        const req = {
            body: {
                productIDs: [],
            },
        };

        for (const validationChain of validator.validateAddProductsCoupon) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toContainEqual(
            expect.objectContaining({
                msg: "ProductIDs should have at least one item",
            })
        );
    });

    test("should return errors if productIDs field is not an array of strings", async () => {
        const req = {
            body: {
                productIDs: [1, 2],
            },
        };

        for (const validationChain of validator.validateAddProductsCoupon) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toContainEqual(
            expect.objectContaining({
                msg: "ProductID should be a string",
            })
        );
    });
});

describe("validateQueryGetCoupon", () => {
    test("should return empty error array if all fields are valid", async () => {
        const req = {
            query: {
                page: "1",
                size: "10",
                sort: [
                    "couponID",
                    "code",
                    "discountType",
                    "discountValue",
                    "target",
                    "minimumOrderAmount",
                    "maxUsage",
                    "startDate",
                    "endDate",
                    "createdAt",
                    "updatedAt",
                ],
                discountType: "percentage",
                discountValue: "[gte]10",
                target: "all",
                description: "[like]description",
                minimumOrderAmount: "[lte]100",
                maxUsage: "[between]0,10",
                startDate: "[gte]2024-01-01",
                endDate: "[between]2024-01-01,2024-01-02",
                product: {
                    name: "product",
                    productID: "[like]productID",
                    createdAt: "[gte]2024-01-01",

                    // Ignore unexpected fields
                    unexpectedField: "unexpected",
                },
                categories: ["category1", "category2"],
                createdAt: "[between]2024-01-01,2024-01-02",
                updatedAt: ["2024-01-01", "2024-01-02"],

                // Ignore unexpected fields
                unexpectedField: "unexpected",
            },
        };

        for (const validationChain of validator.validateQueryGetCoupon) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(true);
    });

    test("should return errors if fields are invalid types", async () => {
        const req = {
            query: {
                page: "abc",
                size: "abc",
                sort: "123",
                discountType: "123",
                discountValue: "[etg]abc",
                target: "123",
                description: "[keli]123",
                minimumOrderAmount: ["123", "[lte]aaa"],
                maxUsage: "[etg]123",
                startDate: "abc",
                endDate: "abc",
                product: {
                    name: ["[keli]product"],
                    productID: "[lie]productID",
                    createdAt: "01-01-2024",
                },
                category: {},
                createdAt: "[lte]01-01-2024",
                updatedAt: "2024-01-01-01",
            },
        };

        for (const validationChain of validator.validateQueryGetCoupon) {
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
                    msg: "Invalid sort field: 123",
                }),
                expect.objectContaining({
                    msg: "Discount type should be valid",
                }),
                expect.objectContaining({
                    msg: "Discount value should have valid number format",
                }),
                expect.objectContaining({
                    msg: "Target should be valid",
                }),
                expect.objectContaining({
                    msg: "Description should have valid string format",
                }),
                expect.objectContaining({
                    msg: "Minimum order amount array should contain valid number formats",
                }),
                expect.objectContaining({
                    msg: "Max usage should have valid number format",
                }),
                expect.objectContaining({
                    msg: "Start date should have valid date format ([operator]YYYY-MM-DD)",
                }),
                expect.objectContaining({
                    msg: "End date should have valid date format ([operator]YYYY-MM-DD)",
                }),
                expect.objectContaining({
                    msg: "Product name array should contain valid string formats",
                }),
                expect.objectContaining({
                    msg: "Product ID should have valid string format",
                }),
                expect.objectContaining({
                    msg: "Product created at should have valid date format ([operator]YYYY-MM-DD)",
                }),
                expect.objectContaining({
                    msg: "Category should be an array or a string",
                }),
                expect.objectContaining({
                    msg: "Created at should have valid date format ([operator]YYYY-MM-DD)",
                }),
                expect.objectContaining({
                    msg: "Updated at should have valid date format ([operator]YYYY-MM-DD)",
                }),
            ])
        );
    });
});
