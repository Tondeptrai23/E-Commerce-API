import seedData from "../setup.js";
import * as verifySigning from "../../../middlewares/verifySigning.js";
import { User } from "../../../models/userModel.js";
import { db } from "../../../models/index.js";
import { jest } from "@jest/globals";

beforeAll(async () => {
    await seedData();
});

afterAll(async () => {
    await db.close();
});

describe("verifySigning.checkEmailExistsForSignIn", () => {
    test("should call next() if email exists", async () => {
        const req = { body: { email: "example@gmail.com" } };
        const res = {};
        const next = jest.fn();

        await verifySigning.checkEmailExistsForSignIn(req, res, next);

        expect(next).toHaveBeenCalled();
    });

    test("should return 400 if email does not exist", async () => {
        const req = { body: { email: "nonexistent@example.com" } };
        const res = {
            status(responseStatus) {
                expect(responseStatus).toEqual(400);
                return this;
            },

            json({ success, error }) {
                expect(success).toEqual(false);
                expect(error).toEqual("Email does not exist");
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

    test("should return 400 if email already exists", async () => {
        const req = { body: { email: "example@gmail.com" } };
        const res = {
            status(responseStatus) {
                expect(responseStatus).toEqual(400);
                return this;
            },

            json({ success, error }) {
                expect(success).toEqual(false);
                expect(error).toEqual("Email exists! Cannot create account.");
            },
        };
        const next = jest.fn();

        await verifySigning.checkEmailNotExistsForSignUp(req, res, next);

        expect(next).not.toHaveBeenCalled();
    });
});
