import validator from "../../../../validators/index.validator.js";
import { validationResult } from "express-validator";

describe("validatePostOrder", () => {
    test("should return empty error array if all fields are valid 1", async () => {
        const req = {
            body: {
                payment: "COD",
            },
        };

        for (const validationChain of validator.validatePostOrder) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(true);
    });

    test("should return empty error array if all fields are valid 2", async () => {
        const req = {
            body: {
                payment: "Momo",
            },
        };

        for (const validationChain of validator.validatePostOrder) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(true);
    });

    test("should return empty error array if all fields are valid 3", async () => {
        const req = {
            body: {
                payment: "CrEdIt_CarD",
            },
        };

        for (const validationChain of validator.validatePostOrder) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(true);
    });

    test("should return error if payment is missing", async () => {
        const req = {
            body: {},
        };

        for (const validationChain of validator.validatePostOrder) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "Payment is required",
                }),
            ])
        );
    });

    test("should return error if payment is not a string", async () => {
        const req = {
            body: {
                payment: 123,
            },
        };

        for (const validationChain of validator.validatePostOrder) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "Payment should be a string",
                }),
            ])
        );
    });

    test("should return error if payment is not a valid payment method", async () => {
        const req = {
            body: {
                payment: "InvalidPayment",
            },
        };

        for (const validationChain of validator.validatePostOrder) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "Invalid payment method",
                }),
            ])
        );
    });
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

    test("should return error if address is not an object", async () => {
        const req = {
            body: {
                message: "Message",
                address: "Address",
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
                    msg: "Address should be an object",
                }),
            ])
        );
    });

    test("should return error if address is missing required fields", async () => {
        const req = {
            body: {
                message: "Message",
                address: {},
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
                    msg: "Address is required",
                }),
                expect.objectContaining({
                    msg: "City is required",
                }),
                expect.objectContaining({
                    msg: "District is required",
                }),
                expect.objectContaining({
                    msg: "RecipientName is required",
                }),
                expect.objectContaining({
                    msg: "PhoneNumber is required",
                }),
            ])
        );
    });

    test("should return error if address fields are not strings", async () => {
        const req = {
            body: {
                message: "Message",
                address: {
                    city: 123,
                    district: 123,
                    address: 123,
                    recipientName: 123,
                    phoneNumber: 123,
                },
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
                    msg: "City should be a string",
                }),
                expect.objectContaining({
                    msg: "District should be a string",
                }),
                expect.objectContaining({
                    msg: "Address should be a string",
                }),
                expect.objectContaining({
                    msg: "RecipientName should be a string",
                }),
                expect.objectContaining({
                    msg: "PhoneNumber should be a string",
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

describe("validateUpdateOrderStatus", () => {
    test("should return empty error array if all fields are valid", async () => {
        const req = {
            body: {
                status: "processing",
            },
        };

        for (const validationChain of validator.validateUpdateOrderStatus) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(true);
    });

    test("should return error if status is missing", async () => {
        const req = {
            body: {},
        };

        for (const validationChain of validator.validateUpdateOrderStatus) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "Status is required",
                }),
            ])
        );
    });

    test("should return error if status is invalid", async () => {
        const req = {
            body: {
                status: "InvalidStatus",
            },
        };

        for (const validationChain of validator.validateUpdateOrderStatus) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "Invalid status",
                }),
            ])
        );
    });
});

describe("validateCreateOrderAdmin", () => {
    test("should return empty error array if all fields are valid", async () => {
        const req = {
            body: {
                variants: [
                    {
                        variantID: "VariantID",
                        quantity: 10,
                    },
                    {
                        variantID: "VariantID2",
                        quantity: 20,
                    },
                ],
                couponCode: "CouponCode",
            },
        };

        for (const validationChain of validator.validateCreateOrderAdmin) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(true);
    });

    test("should return error if variants is missing", async () => {
        const req = {
            body: {},
        };

        for (const validationChain of validator.validateCreateOrderAdmin) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "Variants is required",
                }),
            ])
        );
    });

    test("should return error if variants is not an array", async () => {
        const req = {
            body: {
                variants: {},
            },
        };

        for (const validationChain of validator.validateCreateOrderAdmin) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "Variants should be an array",
                }),
            ])
        );
    });

    test("should return error if variants is empty", async () => {
        const req = {
            body: {
                variants: [],
            },
        };

        for (const validationChain of validator.validateCreateOrderAdmin) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "Variants should not be empty",
                }),
            ])
        );
    });

    test("should return error if variantID is missing", async () => {
        const req = {
            body: {
                variants: [
                    {
                        quantity: 10,
                    },
                ],
            },
        };

        for (const validationChain of validator.validateCreateOrderAdmin) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "VariantID is required",
                }),
            ])
        );
    });
});
