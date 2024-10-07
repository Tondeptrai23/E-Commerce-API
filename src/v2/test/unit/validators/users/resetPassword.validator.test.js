import { validationResult } from "express-validator";
import validator from "../../../../validators/index.validator.js";

describe("validateSendResetPassword", () => {
    test("should return empty error array if all fields are valid", async () => {
        const req = {
            body: {
                email: "example@gmail.com",
            },
        };

        for (const validationChain of validator.validateSendResetPassword) {
            await validationChain.run(req);
        }

        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(true);
    });

    test("should return error if email is missing", async () => {
        const req = {
            body: {},
        };

        for (const validationChain of validator.validateSendResetPassword) {
            await validationChain.run(req);
        }

        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()[0].msg).toEqual("Email is required");
    });

    test("should return error if email is invalid", async () => {
        const req = {
            body: {
                email: "example",
            },
        };

        for (const validationChain of validator.validateSendResetPassword) {
            await validationChain.run(req);
        }

        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()[0].msg).toEqual("Email is not valid");
    });
});

describe("validateResetPassword", () => {
    test("should return empty error array if all fields are valid", async () => {
        const req = {
            body: {
                email: "example@gmail.com",
                password: "password",
                sessionToken: "sessionToken",
            },
        };

        for (const validationChain of validator.validateResetPassword) {
            await validationChain.run(req);
        }

        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(true);
    });

    test("should return error if fields are missing", async () => {
        const req = {
            body: {},
        };

        for (const validationChain of validator.validateResetPassword) {
            await validationChain.run(req);
        }

        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ msg: "Email is required" }),
                expect.objectContaining({ msg: "Password is required" }),
                expect.objectContaining({ msg: "SessionToken is required" }),
            ])
        );
    });

    test("should return error if fields are invalid", async () => {
        const req = {
            body: {
                email: "example",
                password: 123,
                sessionToken: 123,
            },
        };

        for (const validationChain of validator.validateResetPassword) {
            await validationChain.run(req);
        }

        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ msg: "Email is not valid" }),
                expect.objectContaining({ msg: "Password should be a string" }),
                expect.objectContaining({
                    msg: "SessionToken should be a string",
                }),
            ])
        );
    });
});

describe("validateVerifyResetPasswordCode", () => {
    test("should return empty error array if all fields are valid", async () => {
        const req = {
            body: {
                email: "example@gmail.com",
                code: "123456",
            },
        };

        for (const validationChain of validator.validateVerifyResetPasswordCode) {
            await validationChain.run(req);
        }

        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(true);
    });

    test("should return error if fields are missing", async () => {
        const req = {
            body: {},
        };

        for (const validationChain of validator.validateVerifyResetPasswordCode) {
            await validationChain.run(req);
        }

        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ msg: "Email is required" }),
                expect.objectContaining({ msg: "Code is required" }),
            ])
        );
    });

    test("should return error if fields are invalid", async () => {
        const req = {
            body: {
                email: "example",
                code: 123,
            },
        };

        for (const validationChain of validator.validateVerifyResetPasswordCode) {
            await validationChain.run(req);
        }

        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ msg: "Email is not valid" }),
                expect.objectContaining({ msg: "Code should be a string" }),
            ])
        );
    });
});
