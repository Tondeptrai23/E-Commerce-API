import seedData from "../../../../seedData.js";
import * as verifySigning from "../../../../middlewares/auth/verifySigning.middlewares.js";
import { jest } from "@jest/globals";

beforeAll(async () => {
    await seedData();
}, 15000);

describe("verifySigning.checkEmailExistsForSignIn", () => {
    test("should call next() if email exists", async () => {
        const req = { body: { email: "user1@gmail.com" } };
        const res = {};
        const next = jest.fn();

        await verifySigning.checkEmailExistsForSignIn(req, res, next);

        expect(next).toHaveBeenCalled();
    });

    test("should return 404 if email does not exist", async () => {
        const req = { body: { email: "nonexistent@example.com" } };
        const res = {
            status(responseStatus) {
                expect(responseStatus).toEqual(404);
                return this;
            },

            json({ success, errors }) {
                expect(success).toEqual(false);
                expect(errors).toHaveLength(1);
                expect(errors[0].error).toEqual("NotFound");
                expect(errors[0].message).toEqual("Email not found");
            },
        };
        const next = jest.fn();

        await verifySigning.checkEmailExistsForSignIn(req, res, next);

        expect(next).not.toHaveBeenCalled();
    });
});

describe("verifySigning.checkEmailNotExistsForSignUp", () => {
    test("should call next() if email does not exist", async () => {
        const req = { body: { email: "nonexistent@example.com" } };
        const res = {};
        const next = jest.fn();

        await verifySigning.checkEmailNotExistsForSignUp(req, res, next);

        expect(next).toHaveBeenCalled();
    });

    test("should return 409 if email already exists", async () => {
        const req = { body: { email: "user1@gmail.com" } };
        const res = {
            status(responseStatus) {
                expect(responseStatus).toEqual(409);
                return this;
            },

            json({ success, errors }) {
                expect(success).toEqual(false);
                expect(errors).toHaveLength(1);
                expect(errors[0].error).toEqual("Conflict");
                expect(errors[0].message).toEqual(
                    "Email already exists! Cannot create account"
                );
            },
        };
        const next = jest.fn();

        await verifySigning.checkEmailNotExistsForSignUp(req, res, next);

        expect(next).not.toHaveBeenCalled();
    });
});
