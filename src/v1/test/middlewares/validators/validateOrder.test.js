import { validateOrder } from "../../../middlewares/validator.js";
import { validationResult } from "express-validator";

describe("validateOrder", () => {
    test("should return empty error array if all fields are valid", async () => {
        const req = {
            body: {
                payment: "COD",
                description: "description",
            },
        };

        for (const validationChain of validateOrder) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(true);
    });

    test("should return error if payment is missing", async () => {
        const req = {
            body: {
                description: "description",
            },
        };
        for (const validationChain of validateOrder) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()[0].msg).toEqual("Payment is required");
    });

    test("should return error if payment is invalid", async () => {
        const req = {
            body: {
                payment: "invalid",
                description: "description",
            },
        };
        for (const validationChain of validateOrder) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()[0].msg).toEqual("Payment is invalid");
    });
});
