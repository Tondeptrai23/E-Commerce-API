import validator from "../../../../middlewares/validators/index.validator.js";
import { validationResult } from "express-validator";

describe("validateCreateCoupon", () => {
    test("should return empty error array if all fields are valid", async () => {
        const req = {
            body: {
                code: "CODE",
                discountType: "percentage",
                discountValue: 10,
                minimumOrderAmount: 0,
                maxUsage: 20,
                startDate: "2022-01-01",
                endDate: "2022-01-02",
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
                startDate: "2022-01-01",
                endDate: "2022-01-02",
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
            })
        );
    });

    test("should return errors if fields are invalid types", async () => {
        const req = {
            body: {
                code: 1234,
                discountType: 123,
                discountValue: "123",
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
                minimumOrderAmount: 120,
                maxUsage: -1,
                startDate: "2022-02-05",
                endDate: "2022-01-02",
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

describe("validatePutCoupon", () => {
    test("should return empty error array if all fields are valid", async () => {
        const req = {
            body: {
                discountType: "fixed",
                discountValue: 20,
                minimumOrderAmount: 0,
                maxUsage: 10,
                startDate: "2022-01-01",
                endDate: "2022-01-02",
            },
        };

        for (const validationChain of validator.validatePutCoupon) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(true);
    });

    test("should return errors if required fields are missing", async () => {
        const req = {
            body: {
                minimumOrderAmount: 0,
                maxUsage: 10,
            },
        };

        for (const validationChain of validator.validatePutCoupon) {
            await validationChain.run(req);
        }

        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toContainEqual(
            expect.objectContaining({
                msg: "Discount type is required",
            }),
            expect.objectContaining({
                msg: "Discount value is required",
            })
        );
    });
    test("should return errors if fields are invalid types", async () => {
        const req = {
            body: {
                discountType: 123,
                discountValue: "10",
                minimumOrderAmount: "123",
                maxUsage: "123",
                startDate: "2024-13-12",
                endDate: [],
            },
        };

        for (const validationChain of validator.validatePutCoupon) {
            await validationChain.run(req);
        }

        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "Discount type should be valid",
                }),
                expect.objectContaining({
                    msg: "Discount value should be a number",
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
                    msg: "End date should be a string of date",
                }),
            ])
        );
    });

    test("should return errors if fields are invalid values", async () => {
        const req = {
            body: {
                discountType: "percentage",
                discountValue: -1,
                minimumOrderAmount: 120,
                maxUsage: -1,
                startDate: "2022-01-05",
                endDate: "2022-01-02",
            },
        };

        for (const validationChain of validator.validatePutCoupon) {
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
                discountType: "fixed",
                discountValue: 20,
                minimumOrderAmount: 0,
                maxUsage: 10,
                startDate: "2022-01-01",
                endDate: "2022-01-02",
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
                discountType: 123,
                discountValue: "10",
                minimumOrderAmount: "123",
                maxUsage: "123",
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
                    msg: "Discount type should be valid",
                }),
                expect.objectContaining({
                    msg: "Discount value should be a number",
                }),
                expect.objectContaining({
                    msg: "Minimum order amount should be a number",
                }),
                expect.objectContaining({
                    msg: "Max usage should be an integer",
                }),
            ])
        );
    });

    test("should return errors if fields are invalid values", async () => {
        const req = {
            body: {
                discountType: "percentage",
                discountValue: -1,
                minimumOrderAmount: 120,
                maxUsage: -1,
                endDate: "2022-01-02",
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
                    msg: "Discount value should be greater than or equal to 0",
                }),
                expect.objectContaining({
                    msg: "Max usage should be greater than or equal to 0",
                }),
                expect.objectContaining({
                    msg: "Minimum order amount should be less than 100 for percentage discount",
                }),
            ])
        );
    });
});
