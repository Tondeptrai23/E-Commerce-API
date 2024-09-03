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
                code: "Code",
            },
        };

        for (const validationChain of validator.validateApplyCoupon) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(true);
    });

    test("should return error if Code is missing", async () => {
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
                    msg: "Code is required",
                }),
            ])
        );
    });

    test("should return error if Code is not a string", async () => {
        const req = {
            body: {
                code: 123,
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
                    msg: "Code should be a string",
                }),
            ])
        );
    });
});

describe("validateQueryGetOrderUser", () => {
    test("should return empty error array if all fields are valid", async () => {
        const req = {
            query: {
                page: "1",
                size: "10",
                sort: "status,-paymentMethod,subTotal,-finalTotal,createdAt,-updatedAt",
                orderID: "[ne]OrderID",
                status: ["[like]Status", "Status2"],
                paymentMethod: "[ne]PaymentMethod",
                subTotal: "[gt]10",
                finalTotal: ["[lt]100", "[gte]100"],
                createdAt: "[gte]2024-01-01",
                updatedAt: "[lte]2024-01-01",
            },
        };

        for (const validationChain of validator.validateQueryGetOrderUser) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(true);
    });

    test("should return errors array if fields are invalid", async () => {
        const req = {
            query: {
                page: "invalid",
                size: "invalid",
                sort: "invalid",
                orderID: "[notvalid]invalid",
                status: ["invalid", "[invalid]Status"],
                paymentMethod: "[]invalid",
                subTotal: ["[ltt]30", "[gte]30"],
                finalTotal: "[lt]number",
                createdAt: "[gte]invalid",
                updatedAt: "01-01-2024",
            },
        };

        for (const validationChain of validator.validateQueryGetOrderUser) {
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
                    msg: "Invalid sort field: invalid",
                }),
                expect.objectContaining({
                    msg: "OrderID should have valid string format",
                }),
                expect.objectContaining({
                    msg: "Status array should contain valid string formats",
                }),
                expect.objectContaining({
                    msg: "PaymentMethod should have valid string format",
                }),
                expect.objectContaining({
                    msg: "SubTotal array should contain valid number formats",
                }),
                expect.objectContaining({
                    msg: "FinalTotal should have valid number format",
                }),
                expect.objectContaining({
                    msg: "CreatedAt should have valid date format ([operator]YYYY-MM-DD)",
                }),
                expect.objectContaining({
                    msg: "UpdatedAt should have valid date format ([operator]YYYY-MM-DD)",
                }),
            ])
        );
    });
});

describe("validateQueryGetOrderAdmin", () => {
    test("should return empty error array if all fields are valid", async () => {
        const req = {
            query: {
                page: "1",
                size: "10",
                sort: "orderID,-status,subTotal,-finalTotal,paymentMethod,-userID,couponID,-shippingAddressID,createdAt,-updatedAt",
                orderID: "[ne]OrderID",
                status: ["[like]Status", "Status2"],
                subTotal: "[gt]10",
                finalTotal: ["[lt]100", "[gte]100"],
                paymentMethod: "[ne]PaymentMethod",
                userID: "[ne]UserID",
                couponID: "[ne]CouponID",
                couponCode: "[like]CouponCode",
                shippingAddressID: "[ne]ShippingAddressID",
                shippingAddress: {
                    address: "[ne]Address",
                    city: "[like]City",
                    district: ["[ne]District", "District2"],
                },
                variant: {
                    variantID: "[ne]VariantID",
                    productID: "[like]ProductID",
                    name: ["[like]Name", "name"],
                    price: "[lt]100",
                    discountPrice: ["[lt]100", "[gte]100"],
                    stock: "[gt]10",
                    sku: "[ne]SKU",
                },
                createdAt: "[gte]2024-01-01",
                updatedAt: "[lte]2024-01-01",
                deletedAt: "2024-01-01",
            },
        };

        for (const validationChain of validator.validateQueryGetOrderAdmin) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(true);
    });

    test("should return errors array if fields are invalid", async () => {
        const req = {
            query: {
                page: "invalid",
                size: "invalid",
                sort: "invalid",
                orderID: "[notvalid]invalid",
                status: ["invalid", "[invalid]Status"],
                subTotal: ["[ltt]30", "[gte]30"],
                finalTotal: "[lt]number",
                paymentMethod: "[]invalid",
                userID: "[]invalid",
                couponID: "[notvalid]invalid",
                couponCode: "[abc]invalid",
                shippingAddressID: "[]invalid",
                shippingAddress: {
                    address: "[]invalid",
                    city: "[]invalid",
                    district: ["invalid", "[invalid]District"],
                },
                variant: {
                    variantID: "[notvalid]invalid",
                    productID: "[]invalid",
                    name: ["invalid", "[invalid]Name"],
                    price: "[lt]number",
                    discountPrice: ["[lt]number", "[gte]number"],
                    stock: "[gt]number",
                    sku: "[]invalid",
                },
                createdAt: "[gte]invalid",
                updatedAt: "01-01-2024",
                deletedAt: ["01-01-2024", "2024-01-01"],
            },
        };

        for (const validationChain of validator.validateQueryGetOrderAdmin) {
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
                    msg: "Invalid sort field: invalid",
                }),
                expect.objectContaining({
                    msg: "OrderID should have valid string format",
                }),
                expect.objectContaining({
                    msg: "Status array should contain valid string formats",
                }),
                expect.objectContaining({
                    msg: "SubTotal array should contain valid number formats",
                }),
                expect.objectContaining({
                    msg: "FinalTotal should have valid number format",
                }),
                expect.objectContaining({
                    msg: "PaymentMethod should have valid string format",
                }),
                expect.objectContaining({
                    msg: "UserID should have valid string format",
                }),
                expect.objectContaining({
                    msg: "CouponID should have valid string format",
                }),
                expect.objectContaining({
                    msg: "CouponCode should have valid string format",
                }),
                expect.objectContaining({
                    msg: "ShippingAddressID should have valid string format",
                }),
                expect.objectContaining({
                    msg: "Address should have valid string format",
                }),
                expect.objectContaining({
                    msg: "City should have valid string format",
                }),
                expect.objectContaining({
                    msg: "District array should contain valid string formats",
                }),
                expect.objectContaining({
                    msg: "VariantID should have valid string format",
                }),
                expect.objectContaining({
                    msg: "ProductID should have valid string format",
                }),
                expect.objectContaining({
                    msg: "Name array should contain valid string formats",
                }),
                expect.objectContaining({
                    msg: "Price should have valid number format",
                }),
                expect.objectContaining({
                    msg: "DiscountPrice array should contain valid number formats",
                }),
                expect.objectContaining({
                    msg: "Stock should have valid number format",
                }),
                expect.objectContaining({
                    msg: "SKU should have valid string format",
                }),
                expect.objectContaining({
                    msg: "CreatedAt should have valid date format ([operator]YYYY-MM-DD)",
                }),
                expect.objectContaining({
                    msg: "UpdatedAt should have valid date format ([operator]YYYY-MM-DD)",
                }),
                expect.objectContaining({
                    msg: "DeletedAt array should contain valid date formats ([operator]YYYY-MM-DD)",
                }),
            ])
        );
    });
});
