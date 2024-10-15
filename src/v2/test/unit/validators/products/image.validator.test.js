import validator from "../../../../validators/index.validator.js";
import { validationResult } from "express-validator";

describe("validateCreateImages", () => {
    test("should return errors if Content-Type is missing", async () => {
        const req = {
            headers: {},
        };

        for (const validationChain of validator.validateCreateImages) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "Content-Type should be multipart/form-data",
                }),
            ])
        );
    });

    test("should return errors if Content-Type is not multipart/form-data", async () => {
        const req = {
            headers: {
                "content-type": "application/json",
            },
        };

        for (const validationChain of validator.validateCreateImages) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "Content-Type should be multipart/form-data",
                }),
            ])
        );
    });

    test("should return empty errors if Content-Type is multipart/form-data ", async () => {
        const req = {
            headers: {
                "content-type": "multipart/form-data",
            },
        };

        for (const validationChain of validator.validateCreateImages) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(true);
    });
});

describe("validateReorderImages", () => {
    test("should return errors if images is missing", async () => {
        const req = {
            body: {},
        };

        for (const validationChain of validator.validateReorderImages) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "Images is required",
                }),
            ])
        );
    });

    test("should return errors if images is not an array", async () => {
        const req = {
            body: {
                images: "not-an-array",
            },
        };

        for (const validationChain of validator.validateReorderImages) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "Images should be an array",
                }),
            ])
        );
    });

    test("should return errors if images array is empty", async () => {
        const req = {
            body: {
                images: [],
            },
        };

        for (const validationChain of validator.validateReorderImages) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "Images should have at least one item",
                }),
            ])
        );
    });

    test("should return errors if images array contains non-string items", async () => {
        const req = {
            body: {
                images: [123, "valid-string"],
            },
        };

        for (const validationChain of validator.validateReorderImages) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "Image should be a string",
                }),
            ])
        );
    });

    test("should return empty errors if images array is valid", async () => {
        const req = {
            body: {
                images: ["image1", "image2"],
            },
        };

        for (const validationChain of validator.validateReorderImages) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(true);
    });
});
