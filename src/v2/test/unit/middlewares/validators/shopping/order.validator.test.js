import validator from "../../../../../middlewares/validators/index.validator.js";
import { validationResult } from "express-validator";

describe("validatePostOrder", () => {
    // Will be implemented in the future
});

describe("validatePatchOrder", () => {
    test("should return empty error array if all fields are valid", async () => {
        const req = {
            body: {
                message: "Message",
                addressID: "AddressID",
            },
        };

        for (const validationChain of validator.validatePatchOrder) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(true);
    });

    test("should return error if message is not a string", async () => {
        const req = {
            body: {
                message: 123,
                addressID: "AddressID",
            },
        };

        for (const validationChain of validator.validatePatchOrder) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "Message should be a string",
                }),
            ])
        );
    });

    test("should return error if addressID is not a string", async () => {
        const req = {
            body: {
                message: "Message",
                addressID: 123,
            },
        };

        for (const validationChain of validator.validatePatchOrder) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "Address ID should be a string",
                }),
            ])
        );
    });
});

describe("validateApplyCoupon", () => {
    test("should return empty error array if all fields are valid", async () => {
        const req = {
            body: {
                couponCode: "CouponCode",
            },
        };

        for (const validationChain of validator.validateApplyCoupon) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(true);
    });

    test("should return error if couponCode is missing", async () => {
        const req = {
            body: {},
        };

        for (const validationChain of validator.validateApplyCoupon) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "Coupon code is required",
                }),
            ])
        );
    });

    test("should return error if couponCode is not a string", async () => {
        const req = {
            body: {
                couponCode: 123,
            },
        };

        for (const validationChain of validator.validateApplyCoupon) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "Coupon code should be a string",
                }),
            ])
        );
    });
});
