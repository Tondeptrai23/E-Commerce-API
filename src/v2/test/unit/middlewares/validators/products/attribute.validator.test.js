import validator from "../../../../../middlewares/validators/index.validator.js";
import { validationResult } from "express-validator";

describe("validatePostAttribute", () => {
    test("should return empty error array if all fields are valid", async () => {
        const req = {
            body: {
                name: "color",
                values: ["red", "green", "blue"],
            },
        };

        for (const validationChain of validator.validatePostAttribute) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(true);
    });

    test("should return error array if name is missing", async () => {
        const req = {
            body: {
                values: ["red", "green", "blue"],
            },
        };

        for (const validationChain of validator.validatePostAttribute) {
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

    test("should return error array if fields are invalid", async () => {
        const req = {
            body: {
                name: 123,
                values: 123,
            },
        };

        for (const validationChain of validator.validatePostAttribute) {
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
                    msg: "Values should be an array",
                }),
            ])
        );
    });

    test("should return error array if values is empty", async () => {
        const req = {
            body: {
                name: "color",
                values: [],
            },
        };

        for (const validationChain of validator.validatePostAttribute) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "Values should have at least one value",
                }),
            ])
        );
    });

    test("should return error array if values element is not a string", async () => {
        const req = {
            body: {
                name: "color",
                values: [123, 123, 123],
            },
        };

        for (const validationChain of validator.validatePostAttribute) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "Value should be a string",
                }),
            ])
        );
    });
});

describe("validatePatchAttribute", () => {
    test("should return empty error array if all fields are valid", async () => {
        const req = {
            body: {
                name: "color",
            },
        };

        for (const validationChain of validator.validatePatchAttribute) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(true);
    });

    test("should return error array if name is missing", async () => {
        const req = {
            body: {},
        };

        for (const validationChain of validator.validatePatchAttribute) {
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

    test("should return error array if fields are invalid", async () => {
        const req = {
            body: {
                name: 123,
            },
        };

        for (const validationChain of validator.validatePatchAttribute) {
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
});

describe("validateQueryGetAttribute", () => {
    test("should return empty error array if all fields are valid", async () => {
        const req = {
            query: {
                sort: "name",
                page: 1,
                size: 10,
                attributeID: "123",
                name: "color",
                values: "blue",
                updatedAt: "2021-08-01",
            },
        };

        for (const validationChain of validator.validateQueryGetAttribute) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(true);
    });

    test("should return error array if fields are invalid", async () => {
        const req = {
            query: {
                page: "invalid",
                size: "invalid",
                sort: "attributeID,invalid,name,updatedAt,createdAt",
                attributeID: "[invalid]123",
                name: "[invalid]123",
                values: ["[invalid]123", "valid"],
                updatedAt: "2024-31-31",
                createdAt: ["01-01-2024", "2024-31-31"],
            },
        };

        for (const validationChain of validator.validateQueryGetAttribute) {
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
                    msg: "AttributeID should have valid string format",
                }),
                expect.objectContaining({
                    msg: "Name should have valid string format",
                }),
                expect.objectContaining({
                    msg: "Values array should contain valid string formats",
                }),
                expect.objectContaining({
                    msg: "UpdatedAt should have valid date format ([operator]YYYY-MM-DD)",
                }),
                expect.objectContaining({
                    msg: "CreatedAt array should contain valid date formats ([operator]YYYY-MM-DD)",
                }),
            ])
        );
    });
});

describe("validatePostAttributeValue", () => {
    test("should return empty error array if all fields are valid", async () => {
        const req = {
            body: {
                value: "red",
            },
        };

        for (const validationChain of validator.validatePostAttributeValue) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(true);
    });

    test("should return error array if value is missing", async () => {
        const req = {
            body: {},
        };

        for (const validationChain of validator.validatePostAttributeValue) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "Value is required",
                }),
            ])
        );
    });

    test("should return error array if value is invalid", async () => {
        const req = {
            body: {
                value: 123,
            },
        };

        for (const validationChain of validator.validatePostAttributeValue) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "Value should be a string",
                }),
            ])
        );
    });
});

describe("validatePatchAttributeValue", () => {
    test("should return empty error array if all fields are valid", async () => {
        const req = {
            body: {
                value: "red",
            },
        };

        for (const validationChain of validator.validatePatchAttributeValue) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(true);
    });

    test("should return error array if value is invalid", async () => {
        const req = {
            body: {
                value: 123,
            },
        };

        for (const validationChain of validator.validatePatchAttributeValue) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "Value should be a string",
                }),
            ])
        );
    });
});

describe("validateQueryGetAttributeValue", () => {
    test("should return empty error array if all fields are valid", async () => {
        const req = {
            query: {
                sort: "value",
                page: 1,
                size: 10,
                valueID: ["123", "234"],
                attributeID: "123",
                attributeName: "color",
                value: "blue",
                updatedAt: "2024-08-01",
                createdAt: "[gte]2024-08-01",
            },
        };

        for (const validationChain of validator.validateQueryGetAttributeValue) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(true);
    });

    test("should return error array if fields are invalid", async () => {
        const req = {
            query: {
                page: "invalid",
                size: "invalid",
                sort: "attributeID,invalid,valueID,value,updatedAt,createdAt",
                valueID: ["invalid", "[eq]123"],
                attributeID: "[invalid]123",
                attributeName: "[invalid]123",
                value: ["[invalid]123", "valid"],
                updatedAt: "2024-31-31",
                createdAt: ["01-01-2024", "2024-31-31"],
            },
        };

        for (const validationChain of validator.validateQueryGetAttributeValue) {
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
                    msg: "ValueID array should contain valid string formats",
                }),
                expect.objectContaining({
                    msg: "AttributeID should have valid string format",
                }),
                expect.objectContaining({
                    msg: "AttributeName should have valid string format",
                }),
                expect.objectContaining({
                    msg: "Value array should contain valid string formats",
                }),
                expect.objectContaining({
                    msg: "UpdatedAt should have valid date format ([operator]YYYY-MM-DD)",
                }),
                expect.objectContaining({
                    msg: "CreatedAt array should contain valid date formats ([operator]YYYY-MM-DD)",
                }),
            ])
        );
    });
});
