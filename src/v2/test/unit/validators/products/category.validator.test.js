import validator from "../../../../validators/index.validator.js";
import { validationResult } from "express-validator";
import seedData from "../../../../seedData.js";
import { db } from "../../../../models/index.model.js";

beforeAll(async () => {
    await seedData();
});

afterAll(async () => {
    await db.close();
});

describe("validateAddCategoriesForProduct", () => {
    test("should return empty error array if all fields are valid", async () => {
        const req = {
            body: {
                categories: ["tops", "male"],
            },
        };

        for (const validationChain of validator.validateAddCategoriesForProduct) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(true);
    });

    test("should return errors if categories field is missing", async () => {
        const req = {
            body: {},
        };

        for (const validationChain of validator.validateAddCategoriesForProduct) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "Categories are required",
                }),
            ])
        );
    });

    test("should return errors if categories field is not an array", async () => {
        const req = {
            body: {
                categories: "example",
            },
        };

        for (const validationChain of validator.validateAddCategoriesForProduct) {
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

        for (const validationChain of validator.validateAddCategoriesForProduct) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "Categories should have at least one item",
                }),
            ])
        );
    });

    test("should return errors if categories field is not an array of strings", async () => {
        const req = {
            body: {
                categories: [1, 2],
            },
        };

        for (const validationChain of validator.validateAddCategoriesForProduct) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "Category should be a string",
                }),
            ])
        );
    });
});

describe("validatePutCategoriesForProduct", () => {
    test("should return empty error array if all fields are valid", async () => {
        const req = {
            body: {
                categories: ["tops", "male"],
            },
        };

        for (const validationChain of validator.validatePutCategoriesForProduct) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(true);
    });

    test("should return errors if categories field is missing", async () => {
        const req = {
            body: {},
        };

        for (const validationChain of validator.validatePutCategoriesForProduct) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "Categories are required",
                }),
            ])
        );
    });

    test("should return errors if categories field is not an array", async () => {
        const req = {
            body: {
                categories: "example",
            },
        };

        for (const validationChain of validator.validatePutCategoriesForProduct) {
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

    test("should return errors if categories field is not an array of strings", async () => {
        const req = {
            body: {
                categories: [1, 2],
            },
        };

        for (const validationChain of validator.validatePutCategoriesForProduct) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "Category should be a string",
                }),
            ])
        );
    });
});

describe("validateAddCategory", () => {
    test("should return empty error array if all fields are valid", async () => {
        const req = {
            body: {
                name: "jeans",
                description: "blue jeans",
                parent: "bottoms",
            },
        };

        for (const validationChain of validator.validateAddCategory) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(true);
    });

    test("should return errors if name field is missing", async () => {
        const req = {
            body: {
                description: "blue jeans",
                parent: "bottoms",
            },
        };

        for (const validationChain of validator.validateAddCategory) {
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

    test("should return errors if fields are invalid", async () => {
        const req = {
            body: {
                name: 1,
                description: 2,
                parent: [],
            },
        };

        for (const validationChain of validator.validateAddCategory) {
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
                    msg: "Description should be a string",
                }),
                expect.objectContaining({
                    msg: "Parent should be a string",
                }),
            ])
        );
    });
});

describe("validatePutCategory", () => {
    test("should return empty error array if all fields are valid", async () => {
        const req = {
            body: {
                name: "jeans",
                description: "blue jeans",
                parent: "bottoms",
            },
        };

        for (const validationChain of validator.validatePutCategory) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(true);
    });

    test("should return error if name field is missing", async () => {
        const req = {
            body: {
                description: "blue jeans",
                parent: "bottoms",
            },
        };

        for (const validationChain of validator.validatePutCategory) {
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

    test("should return errors if fields are invalid", async () => {
        const req = {
            body: {
                name: 1,
                description: 2,
                parent: [],
            },
        };

        for (const validationChain of validator.validatePutCategory) {
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
                    msg: "Description should be a string",
                }),
                expect.objectContaining({
                    msg: "Parent should be a string",
                }),
            ])
        );
    });
});

describe("validateQueryGetCategory", () => {
    test("should return empty error array if all fields are valid", async () => {
        const req = {
            query: {
                page: "1",
                size: "2",
                sort: [
                    "categoryID",
                    "-parentID",
                    "name",
                    "-createdAt",
                    "-updatedAt",
                ],
                categoryID: "1",
                name: "[ne]tops",
                parentID: ["1", "2"],
                parentName: ["[like]clothing", "bottoms"],
                createdAt: "[lte]2024-01-01",
                updatedAt: "[gt]2024-01-01",
            },
        };

        for (const validationChain of validator.validateQueryGetCategory) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(true);
    });

    test("should return empty error array if all fields are missing", async () => {
        const req = {
            query: {},
        };

        for (const validationChain of validator.validateQueryGetCategory) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(true);
    });

    test("should return errors if fields are invalid", async () => {
        const req = {
            query: {
                page: "a",
                size: "b",
                sort: [
                    "categoryID",
                    "parentID",
                    "name",
                    "createdAt",
                    "updatedAt",
                    "invalid",
                ],
                categoryID: "[kile]a",
                name: ["[kile]tops"],
                parentID: "[kile]1",
                parentName: ["valid", "[kile]clothing"],
                createdAt: "01-01-2024",
                updatedAt: ["2024-01-01", "[gte]01-01-2024"],
            },
        };

        for (const validationChain of validator.validateQueryGetCategory) {
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
                    msg: "CategoryID should have valid string format",
                }),
                expect.objectContaining({
                    msg: "ParentID should have valid string format",
                }),
                expect.objectContaining({
                    msg: "ParentName array should contain valid string formats",
                }),
                expect.objectContaining({
                    msg: "Name array should contain valid string formats",
                }),
                expect.objectContaining({
                    msg: "CreatedAt should have valid date format ([operator]YYYY-MM-DD)",
                }),
                expect.objectContaining({
                    msg: "UpdatedAt array should contain valid date formats ([operator]YYYY-MM-DD)",
                }),
            ])
        );
    });
});
