import { validationResult } from "express-validator";
import validator from "../../../../../middlewares/validators/index.validator.js";

describe("validateCreateAddress", () => {
    test("should return empty error array if all fields are valid", async () => {
        const req = {
            body: {
                address: "Duong 3/2",
                city: "Ho Chi Minh",
                district: "District 10",
                recipientName: "John Doe",
                phoneNumber: "08123456789",
            },
        };

        for (const validationChain of validator.validateCreateAddress) {
            await validationChain.run(req);
        }

        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(true);
    });

    test("should return error if fields are missing", async () => {
        const req = {
            body: {},
        };

        for (const validationChain of validator.validateCreateAddress) {
            await validationChain.run(req);
        }

        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ msg: "Address is required" }),
                expect.objectContaining({ msg: "City is required" }),
                expect.objectContaining({ msg: "District is required" }),
                expect.objectContaining({ msg: "Recipient Name is required" }),
                expect.objectContaining({ msg: "PhoneNumber is required" }),
            ])
        );
    });

    test("should return error if fields are invalid", async () => {
        const req = {
            body: {
                address: 123,
                city: 123,
                district: 123,
                recipientName: 123,
                phoneNumber: 123,
            },
        };

        for (const validationChain of validator.validateCreateAddress) {
            await validationChain.run(req);
        }

        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ msg: "Address should be a string" }),
                expect.objectContaining({ msg: "City should be a string" }),
                expect.objectContaining({ msg: "District should be a string" }),
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

describe("validatePutAddress", () => {
    test("should return empty error array if all fields are valid", async () => {
        const req = {
            body: {
                address: "Duong 3/2",
                city: "Ho Chi Minh",
                district: "District 10",
                recipientName: "John Doe",
                phoneNumber: "08123456789",
                isDefault: true,
            },
        };

        for (const validationChain of validator.validatePutAddress) {
            await validationChain.run(req);
        }

        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(true);
    });

    test("should return error if fields are missing", async () => {
        const req = {
            body: {},
        };

        for (const validationChain of validator.validatePutAddress) {
            await validationChain.run(req);
        }

        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ msg: "Address is required" }),
                expect.objectContaining({ msg: "City is required" }),
                expect.objectContaining({ msg: "District is required" }),
                expect.objectContaining({
                    msg: "Recipient Name is required",
                }),
                expect.objectContaining({ msg: "PhoneNumber is required" }),
            ])
        );
    });

    test("should return error if fields are invalid", async () => {
        const req = {
            body: {
                address: 123,
                city: 123,
                district: 123,
                recipientName: 123,
                phoneNumber: 123,
                isDefault: "yes",
            },
        };

        for (const validationChain of validator.validatePutAddress) {
            await validationChain.run(req);
        }

        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "Address should be a string",
                }),
                expect.objectContaining({ msg: "City should be a string" }),
                expect.objectContaining({
                    msg: "District should be a string",
                }),
                expect.objectContaining({
                    msg: "RecipientName should be a string",
                }),
                expect.objectContaining({
                    msg: "PhoneNumber should be a string",
                }),
                expect.objectContaining({
                    msg: "IsDefault should be a boolean",
                }),
            ])
        );
    });
});

describe("validateQueryAddressUser", () => {
    test("should return empty error array if query parameters are valid", async () => {
        const req = {
            query: {
                page: "1",
                size: "10",
            },
        };

        for (const validationChain of validator.validateQueryAddressUser) {
            await validationChain.run(req);
        }

        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(true);
    });

    test("should return error if query parameters are invalid", async () => {
        const req = {
            query: {
                page: "one",
                size: "ten",
            },
        };

        for (const validationChain of validator.validateQueryAddressUser) {
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
            ])
        );
    });
});
