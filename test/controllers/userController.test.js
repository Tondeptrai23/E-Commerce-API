import { UserController } from "../../controllers/userController.js";
import seedData from "../setup.js";
import { User } from "../../models/userModel.js";
import { db } from "../../models/index.js";

beforeEach(async () => {
    await seedData();
});

afterAll(async () => {
    await db.close();
});

describe("UserController.getAllUsers", () => {
    test("should return all users", async () => {
        const req = {};
        const res = {
            status(responseStatus) {
                expect(responseStatus).toEqual(200);
                return this;
            },
            json({ success, quantity, users }) {
                expect(success).toEqual(true);
                expect(quantity).toEqual(3);
                expect(users).toHaveLength(3);
            },
        };

        await UserController.getAllUsers(req, res);
    });

    describe("UserController.getAllUsersByName", () => {
        test("should return all users with a specific name", async () => {
            const req = {
                query: {
                    name: "John Doe",
                },
            };
            const res = {
                status(responseStatus) {
                    expect(responseStatus).toEqual(200);
                    return this;
                },
                json({ success, quantity, users }) {
                    expect(success).toEqual(true);
                    expect(quantity).toEqual(1);
                    expect(users[0].name).toEqual("John Doe");
                },
            };

            await UserController.getAllUsers(req, res);
        });
    });
});

describe("UserController.getUser", () => {
    test("should return a user", async () => {
        const req = {
            params: {
                userId: "1",
            },
        };
        const res = {
            status(responseStatus) {
                expect(responseStatus).toEqual(200);
                return this;
            },
            json({ success, user }) {
                expect(success).toEqual(true);
                expect(user.name).toEqual("John Doe");
            },
        };

        await UserController.getUser(req, res);
    });

    test("should return 404 if user is not found", async () => {
        const req = {
            params: {
                userId: "400",
            },
        };
        const res = {
            status(responseStatus) {
                expect(responseStatus).toEqual(404);
                return this;
            },
            json({ success, error }) {
                expect(success).toEqual(false);
                expect(error).toEqual("User not found");
            },
        };

        await UserController.getUser(req, res);
    });
});
