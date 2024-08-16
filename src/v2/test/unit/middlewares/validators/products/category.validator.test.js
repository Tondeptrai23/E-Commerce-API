import validator from "../../../../../middlewares/validators/index.validator.js";
import { validationResult } from "express-validator";
import seedData from "../../../../../seedData.js";

beforeAll(async () => {
    await seedData();
}, 15000);

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
                    msg: "Categories should be an array",
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

    test("should return errors if category does not exist", async () => {
        const req = {
            body: {
                categories: ["category"],
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
                    msg: "Category does not exist",
                }),
            ])
        );
    });
});
