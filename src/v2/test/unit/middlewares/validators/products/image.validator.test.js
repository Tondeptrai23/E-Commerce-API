import validator from "../../../../../middlewares/validators/index.validator.js";
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
