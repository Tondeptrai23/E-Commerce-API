import validator from "../../../../middlewares/validators/index.validator.js";
import { validationResult } from "express-validator";

describe("validateCreateImages", () => {
    test("should return empty error array if all fields are valid", async () => {
        const req = {
            body: {
                images: [
                    {
                        url: "https://example.com",
                        altText: "https://example.com",
                    },
                    {
                        url: "https://example2.com",
                        altText: "https://example2.com",
                    },
                ],
            },
        };

        for (const validationChain of validator.validateCreateImages) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(true);
    });

    test("should return errors if images field is missing", async () => {
        const req = {
            body: {},
        };

        for (const validationChain of validator.validateCreateImages) {
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

    test("should return errors if images field is not an array", async () => {
        const req = {
            body: {
                images: "example",
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
                    msg: "Images should be an array",
                }),
            ])
        );
    });

    test("should return errors if images field is empty", async () => {
        const req = {
            body: {
                images: [],
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
                    msg: "Images should have at least one item",
                }),
            ])
        );
    });

    test("should return errors if required fields are missing", async () => {
        const req = {
            body: {
                images: [
                    {
                        altText: "https://example.com",
                    },
                    {
                        url: "https://example2.com",
                    },
                ],
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
                    msg: "URL is required",
                }),
            ])
        );
    });

    test("should return errors if fields are invalid", async () => {
        const req = {
            body: {
                images: [
                    {
                        url: 1,
                        altText: 2,
                    },
                ],
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
                    msg: "URL should be a string",
                }),
                expect.objectContaining({
                    msg: "Alt text should be a string",
                }),
            ])
        );
    });
});

describe("validatePatchImage", () => {
    test("should return errors if imageID field is provided in validatePatchImage", async () => {
        const req = {
            body: {
                imageID: "12345",
            },
        };

        for (const validationChain of validator.validatePatchImage) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "ID should not be provided",
                }),
            ])
        );
    });

    test("should return errors if displayOrder field is provided in validatePatchImage", async () => {
        const req = {
            body: {
                displayOrder: 1,
            },
        };

        for (const validationChain of validator.validatePatchImage) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "Display order should not be provided. Use POST /images/reorder instead",
                }),
            ])
        );
    });
});

describe("validateReorderImages", () => {
    test("should return errors if imageID field is missing in validateReorderImages", async () => {
        const req = {
            body: {
                images: [{}],
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
                    msg: "Image ID is required",
                }),
            ])
        );
    });

    test("should return errors if displayOrder field is missing in validateReorderImages", async () => {
        const req = {
            body: {
                images: [
                    {
                        imageID: "12345",
                    },
                ],
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
                    msg: "Display order is required",
                }),
            ])
        );
    });

    test("should return errors if displayOrder field is invalid in validateReorderImages", async () => {
        const req = {
            body: {
                images: [
                    {
                        imageID: "12345",
                        displayOrder: "invalid",
                    },
                ],
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
                    msg: "Display order should be an integer",
                }),
            ])
        );
    });

    test("should return errors if displayOrder field is less than 1 in validateReorderImages", async () => {
        const req = {
            body: {
                images: [
                    {
                        imageID: "12345",
                        displayOrder: 0,
                    },
                ],
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
                    msg: "Display order should be greater than or equal to 1",
                }),
            ])
        );
    });
});
