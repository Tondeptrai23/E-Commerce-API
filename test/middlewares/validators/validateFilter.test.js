import { validateProductFilter } from "../../../middlewares/validator.js";
import { validationResult } from "express-validator";

describe("validateProductFilter", () => {
    test("should return empty error array if all fields are valid", async () => {
        const req = {
            query: {
                name: "product",
                price: "[lte]100000",
            },
        };

        for (const validationChain of validateProductFilter) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(true);
    });

    test("should return error if unexpected query parameter is present", async () => {
        const req = {
            query: {
                name: "product",
                price: "[lte]100000",
                invalid: "invalid",
            },
        };
        for (const validationChain of validateProductFilter) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()[0].msg).toEqual(
            "Unexpected query parameters: invalid"
        );
    });

    // Test for name
    test("should return error if name is not a string", async () => {
        const req = {
            query: {
                name: 1,
            },
        };
        for (const validationChain of validateProductFilter) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()[0].msg).toEqual("Name should be a string");
    });

    // Test for price
    test("should return error if price is not a string or array of strings", async () => {
        const req = {
            query: {
                price: 1,
            },
        };
        for (const validationChain of validateProductFilter) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()[0].msg).toEqual(
            "Price should be a string or array of strings"
        );
    });

    test("should return error if price has invalid format", async () => {
        const req = {
            query: {
                price: "[invalid]100000",
            },
        };
        for (const validationChain of validateProductFilter) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()[0].msg).toEqual("Price has invalid format");
    });

    test("should return error if price array contains invalid strings", async () => {
        const req = {
            query: {
                price: ["[lte]300000", "[invalid]100000"],
            },
        };
        for (const validationChain of validateProductFilter) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()[0].msg).toEqual(
            "Price array should contain only valid strings"
        );
    });

    test("should return error if price array contains non-strings", async () => {
        const req = {
            query: {
                price: ["[lte]300000", 100000],
            },
        };
        for (const validationChain of validateProductFilter) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()[0].msg).toEqual(
            "Price array should contain only strings"
        );
    });
});
