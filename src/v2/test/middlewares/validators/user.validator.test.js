import { validationResult } from "express-validator";
import {
    validateRegisterUser,
    validateSignInUser,
} from "../../../middlewares/validators/validator.js";

describe("validateRegisterUser", () => {
    test("should return empty error array if all fields are valid", async () => {
        const req = {
            body: {
                email: "example@gmail.com",
                password: "password",
                name: "example",
                role: "user",
            },
        };

        for (const validationChain of validateRegisterUser) {
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
                role: "admin",
            },
        };
        for (const validationChain of validateRegisterUser) {
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
                role: "user",
            },
        };
        for (const validationChain of validateRegisterUser) {
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
                role: "user",
            },
        };
        for (const validationChain of validateRegisterUser) {
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
                role: "user",
            },
        };
        for (const validationChain of validateRegisterUser) {
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
                role: "user",
            },
        };
        for (const validationChain of validateRegisterUser) {
            await validationChain.run(req);
        }

        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()[0].msg).toEqual(
            "Password should be longer than 6 characters"
        );
    });

    // Test for role

    test("should return error if role is missing", async () => {
        const req = {
            body: {
                email: "example@gmail.com",
                password: "password",
                name: "example",
            },
        };
        for (const validationChain of validateRegisterUser) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()[0].msg).toEqual("Role is required");
    });

    test("should return error if the role is not valid", async () => {
        const req = {
            body: {
                email: "example@gmail.com",
                password: "password",
                name: "example",
                role: "moderator",
            },
        };
        for (const validationChain of validateRegisterUser) {
            await validationChain.run(req);
        }
        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()[0].msg).toEqual("Role should be valid");
    });

    // Test for phoneNumber
    test("should return error if phone number is invalid", async () => {
        const req = {
            body: {
                email: "example@gmail.com",
                password: "password",
                name: "example",
                role: "user",
                phoneNumber: "123",
            },
        };

        for (const validationChain of validateRegisterUser) {
            await validationChain.run(req);
        }

        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()[0].msg).toEqual(
            "Phone number should be a valid phone number"
        );
    });

    // Test for avatar
    test("should return error if avatar is invalid", async () => {
        const req = {
            body: {
                email: "example@gmail.com",
                password: "password",
                name: "example",
                role: "user",
                avatar: "example",
            },
        };

        for (const validationChain of validateRegisterUser) {
            await validationChain.run(req);
        }

        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()[0].msg).toEqual("Avatar should be a valid URL");
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
        for (const validationChain of validateSignInUser) {
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
        for (const validationChain of validateSignInUser) {
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
        for (const validationChain of validateSignInUser) {
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
        for (const validationChain of validateSignInUser) {
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
        for (const validationChain of validateSignInUser) {
            await validationChain.run(req);
        }

        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()[0].msg).toEqual(
            "Password should be longer than 6 characters"
        );
    });
});
