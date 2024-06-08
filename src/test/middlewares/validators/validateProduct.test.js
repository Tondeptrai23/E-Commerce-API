import {
    validateCreateProduct,
    validateUpdateProduct,
} from "../../../middlewares/validator.js";
import { validationResult } from "express-validator";

/**
 *
 *
 *
 *
 */
describe("validateCreateProduct", () => {
    test("should return empty error array if all fields are valid", async () => {
        const req = {
            body: {
                name: "Product 1",
                price: 10000,
                imageURL: "https://example.com/image.jpg",
            },
        };

        for (const validationChain of validateCreateProduct) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(true);
    });

    // Test for name
    test("should return error if name is missing", async () => {
        const req = {
            body: {
                price: 10000,
                imageURL: "https://example.com/image.jpg",
            },
        };

        for (const validationChain of validateCreateProduct) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()[0].msg).toBe("Name is required");
        expect(errors.array()[1].msg).toBe("Name should be a string");
    });

    test("should return error if name is not a string", async () => {
        const req = {
            body: {
                name: 123,
                price: 10000,
                imageURL: "https://example.com/image.jpg",
            },
        };

        for (const validationChain of validateCreateProduct) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()[0].msg).toBe("Name should be a string");
    });

    // Test for imageURL
    test("should return error if imageURL is missing", async () => {
        const req = {
            body: {
                name: "Product 1",
                price: 10000,
            },
        };

        for (const validationChain of validateCreateProduct) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()[0].msg).toBe("ImageURL is required");
        expect(errors.array()[1].msg).toBe("ImageURL should be an image URL");
    });

    test("should return error if imageURL is not a valid URL", async () => {
        const req = {
            body: {
                name: "Product 1",
                price: 10000,
                imageURL: "not-a-url",
            },
        };

        for (const validationChain of validateCreateProduct) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()[0].msg).toBe("ImageURL should be an image URL");
    });

    // Test for price
    test("should return error if price is missing", async () => {
        const req = {
            body: {
                name: "Product 1",
                imageURL: "https://example.com/image.jpg",
            },
        };

        for (const validationChain of validateCreateProduct) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()[0].msg).toBe("Price is required");
        expect(errors.array()[1].msg).toBe("Price should be an integer");
    });

    test("should return error if price is smaller than 1000", async () => {
        const req = {
            body: {
                name: "Product 1",
                price: 500,
                imageURL: "https://example.com/image.jpg",
            },
        };

        for (const validationChain of validateCreateProduct) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()[0].msg).toBe(
            "Price should be between 1000 and 100000000"
        );
    });

    test("should return error if price is bigger than 100000000", async () => {
        const req = {
            body: {
                name: "Product 1",
                price: 155550000,
                imageURL: "https://example.com/image.jpg",
            },
        };

        for (const validationChain of validateCreateProduct) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()[0].msg).toBe(
            "Price should be between 1000 and 100000000"
        );
    });

    // Test for all fields
    test("should return error if name, price, and imageURL are invalid", async () => {
        const req = {
            body: {
                name: 123,
                price: 12500,
                imageURL: "not-a-url",
            },
        };

        for (const validationChain of validateCreateProduct) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()[0].msg).toBe("Name should be a string");
        expect(errors.array()[1].msg).toBe("ImageURL should be an image URL");
        expect(errors.array()[2].msg).toBe("Price should be divisible by 1000");
    });
});

/**
 *
 *
 *
 *
 */
describe("validateUpdateProduct", () => {
    test("should return empty error array if all fields are valid", async () => {
        const req = {
            body: {
                name: "Product 1",
                price: 10000,
                imageURL: "https://example.com/image.jpg",
            },
        };

        for (const validationChain of validateUpdateProduct) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(true);
    });

    // Test for id

    test("should return error if id is included", async () => {
        const req = {
            body: {
                id: "12345",
                name: "Product 1",
                price: 10000,
                imageURL: "https://example.com/image.jpg",
            },
        };

        for (const validationChain of validateUpdateProduct) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()[0].msg).toBe("Id should not be provided");
    });

    // Test for name

    test("should return error if name is not a string", async () => {
        const req = {
            body: {
                name: 123,
                price: 10000,
                imageURL: "https://example.com/image.jpg",
            },
        };

        for (const validationChain of validateUpdateProduct) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()[0].msg).toBe("Name should be a string");
    });

    // Test for price

    test("should return error if price is smaller than 1000", async () => {
        const req = {
            body: {
                name: "Product 1",
                price: 500,
                imageURL: "https://example.com/image.jpg",
            },
        };

        for (const validationChain of validateUpdateProduct) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()[0].msg).toBe(
            "Price should be between 1000 and 100000000"
        );
    });

    test("should return error if price is bigger than 100000000", async () => {
        const req = {
            body: {
                name: "Product 1",
                price: 155550000,
                imageURL: "https://example.com/image.jpg",
            },
        };

        for (const validationChain of validateUpdateProduct) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()[0].msg).toBe(
            "Price should be between 1000 and 100000000"
        );
    });

    //Test for imageURL

    test("should return error if imageURL is not a valid URL", async () => {
        const req = {
            body: {
                name: "Product 1",
                price: 10000,
                imageURL: "not-a-url",
            },
        };

        for (const validationChain of validateUpdateProduct) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()[0].msg).toBe("ImageURL should be an image URL");
    });

    // Test for all fields

    test("should return error if name, price, and imageURL are invalid", async () => {
        const req = {
            body: {
                name: 123,
                price: 12500,
                imageURL: "not-a-url",
            },
        };

        for (const validationChain of validateUpdateProduct) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()[0].msg).toBe("Name should be a string");
        expect(errors.array()[1].msg).toBe("ImageURL should be an image URL");
        expect(errors.array()[2].msg).toBe("Price should be divisible by 1000");
    });
});
