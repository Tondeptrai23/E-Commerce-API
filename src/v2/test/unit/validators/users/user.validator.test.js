import { validationResult } from "express-validator";
import validator from "../../../../validators/index.validator.js";

describe("validateRegisterUser", () => {
    test("should return empty error array if all fields are valid", async () => {
        const req = {
            body: {
                email: "example@gmail.com",
                password: "password",
                name: "example",
            },
        };

        for (const validationChain of validator.validateRegisterUser) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(true);
    });

    // Test for name

    test("should return error if name is missing", async () => {
        const req = {
            body: {
                email: "example@gmail.com",
                password: "password",
            },
        };
        for (const validationChain of validator.validateRegisterUser) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()[0].msg).toEqual("Name is required");
    });

    // Test for email

    test("should return error if email is missing", async () => {
        const req = {
            body: {
                password: "password",
                name: "example",
            },
        };
        for (const validationChain of validator.validateRegisterUser) {
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
                password: "password",
                name: "example",
            },
        };
        for (const validationChain of validator.validateRegisterUser) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()[0].msg).toEqual("Email should be a valid email");
    });

    // Test for password

    test("should return error if password is missing", async () => {
        const req = {
            body: {
                email: "example@gmail.com",
                name: "example",
            },
        };
        for (const validationChain of validator.validateRegisterUser) {
            await validationChain.run(req);
        }

        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()[0].msg).toEqual("Password is required");
    });

    test("should return error if password is less than 6 characters", async () => {
        const req = {
            body: {
                email: "example@gmail.com",
                password: "pass",
                name: "example",
            },
        };
        for (const validationChain of validator.validateRegisterUser) {
            await validationChain.run(req);
        }

        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()[0].msg).toEqual(
            "Password should be longer than 6 characters"
        );
    });
});

/**
 *
 *
 *
 */
describe("validateSignInUser", () => {
    test("should return empty error array if all fields are valid for sign-in", async () => {
        const req = {
            body: {
                email: "example@gmail.com",
                password: "password",
            },
        };
        for (const validationChain of validator.validateSignInUser) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(true);
    });

    // Test for email

    test("should return error if email is missing for sign-in", async () => {
        const req = {
            body: {
                password: "password",
            },
        };
        for (const validationChain of validator.validateSignInUser) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()[0].msg).toEqual("Email is required");
    });

    test("should return error if email is invalid for sign-in", async () => {
        const req = {
            body: {
                email: "example",
                password: "password",
            },
        };
        for (const validationChain of validator.validateSignInUser) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()[0].msg).toEqual("Email should be a valid email");
    });

    // Test for password

    test("should return error if password is missing for sign-in", async () => {
        const req = {
            body: {
                email: "example@gmail.com",
            },
        };
        for (const validationChain of validator.validateSignInUser) {
            await validationChain.run(req);
        }

        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()[0].msg).toEqual("Password is required");
    });

    test("should return error if password is less than 6 characters for sign-in", async () => {
        const req = {
            body: {
                email: "example@gmail.com",
                password: "pass",
            },
        };
        for (const validationChain of validator.validateSignInUser) {
            await validationChain.run(req);
        }

        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()[0].msg).toEqual(
            "Password should be longer than 6 characters"
        );
    });
});

describe("validateCreateUser", () => {
    test("should return empty error array if all fields are valid", async () => {
        const req = {
            body: {
                email: "example@gmail.com",
                password: "password",
                name: "example",
                role: "user",
            },
        };

        for (const validationChain of validator.validateCreateUser) {
            await validationChain.run(req);
        }

        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(true);
    });

    test("should return errors if required fields are missing", async () => {
        const req = {
            body: {},
        };

        for (const validationChain of validator.validateCreateUser) {
            await validationChain.run(req);
        }

        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ msg: "Email is required" }),
                expect.objectContaining({ msg: "Password is required" }),
                expect.objectContaining({ msg: "Name is required" }),
                expect.objectContaining({ msg: "Role is required" }),
            ])
        );
    });

    test("should return errors if fields are invalid", async () => {
        const req = {
            body: {
                email: "example",
                password: "pass",
                name: "example 123",
                role: "abcd",
            },
        };

        for (const validationChain of validator.validateCreateUser) {
            await validationChain.run(req);
        }

        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "Email should be a valid email",
                }),
                expect.objectContaining({
                    msg: "Password should be longer than 6 characters",
                }),
                expect.objectContaining({
                    msg: "Name should be an alphanumeric string",
                }),
                expect.objectContaining({
                    msg: "Role should be either admin or user",
                }),
            ])
        );
    });
});

describe("validateUpdateUser", () => {
    test("should return empty error array if all fields are valid", async () => {
        const req = {
            body: {
                name: "example",
                role: "user",
            },
        };

        for (const validationChain of validator.validateUpdateUser) {
            await validationChain.run(req);
        }

        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(true);
    });

    test("should return errors if fields are invalid", async () => {
        const req = {
            body: {
                name: "example 123",
                role: "abcd",
            },
        };

        for (const validationChain of validator.validateUpdateUser) {
            await validationChain.run(req);
        }

        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "Name should be an alphanumeric string",
                }),
                expect.objectContaining({
                    msg: "Role should be either admin or user",
                }),
            ])
        );
    });

    test("should return empty error array if no fields are provided", async () => {
        const req = {
            body: {},
        };

        for (const validationChain of validator.validateUpdateUser) {
            await validationChain.run(req);
        }

        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(true);
    });
});

describe("validateQueryGetUser", () => {
    test("should return empty error array if all query parameters are valid", async () => {
        const req = {
            query: {
                page: "1",
                size: "10",
                sort: "name",
                name: "example",
                role: "user",
                email: "example@gmail.com",
                isVerified: "true",
                createdAt: "2023-01-01",
                updatedAt: "2023-01-02",
                deletedAt: "2023-01-03",
            },
        };

        for (const validationChain of validator.validateQueryGetUser) {
            await validationChain.run(req);
        }

        const errors = validationResult(req);

        console.log(errors.array());

        expect(errors.isEmpty()).toBe(true);
    });

    test("should return errors if query parameters are invalid", async () => {
        const req = {
            query: {
                page: "abc",
                size: "-10",
                sort: "invalidField",
                name: "[invalid]name",
                role: "invalidRole",
                email: "[invalid]invalidEmail",
                isVerified: "invalidBoolean",
                createdAt: "invalidDate",
                updatedAt: "invalidDate",
                deletedAt: "invalidDate",
            },
        };

        for (const validationChain of validator.validateQueryGetUser) {
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
                    msg: "Invalid sort field: invalidField",
                }),
                expect.objectContaining({
                    msg: "Name should have valid string format",
                }),
                expect.objectContaining({
                    msg: "Role should be either admin or user",
                }),
                expect.objectContaining({
                    msg: "Email should have valid string format",
                }),
                expect.objectContaining({
                    msg: "CreatedAt should have valid date format ([operator]YYYY-MM-DD)",
                }),
                expect.objectContaining({
                    msg: "UpdatedAt should have valid date format ([operator]YYYY-MM-DD)",
                }),
                expect.objectContaining({
                    msg: "DeletedAt should have valid date format ([operator]YYYY-MM-DD)",
                }),
            ])
        );
    });

    test("should return empty error array if no query parameters are provided", async () => {
        const req = {
            query: {},
        };

        for (const validationChain of validator.validateQueryGetUser) {
            await validationChain.run(req);
        }

        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(true);
    });
});
