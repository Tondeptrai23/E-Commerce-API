import userService from "../../../../services/auth/user.service.js";
import seedData from "../../../../seedData.js";
import User from "../../../../models/user/user.model.js";
import { ConflictError } from "../../../../utils/error.js";

beforeAll(async () => {
    await seedData();
}, 15000);

describe("User Service", () => {
    describe("userService.createNewAccount", () => {
        test("should create a new account", async () => {
            const userInfo = {
                email: "test@example.com",
                password: "password123",
                name: "John Doe",
            };

            const createdUser = await userService.createNewAccount(userInfo);

            expect(createdUser).toBeDefined();
            expect(createdUser.email).toBe(userInfo.email);
            expect(createdUser.name).toBe(userInfo.name);
        });

        test("should throw ConflictError if the email is existed", async () => {
            const userInfo = {
                email: "user1@gmail.com",
                password: "password123",
                name: "Existing User",
            };

            await expect(
                userService.createNewAccount(userInfo)
            ).rejects.toThrow(ConflictError);
        });

        test("should throw ConflictError if the name is taken", async () => {
            const userInfo = {
                email: "admin123456@gmail.com",
                password: "password123",
                name: "Admin",
            };

            await expect(
                userService.createNewAccount(userInfo)
            ).rejects.toThrow(ConflictError);
        });
    });

    describe("userService.findUserByEmail", () => {
        test("should return user if the email exists", async () => {
            const email = "user1@gmail.com";
            const user = await userService.findUserByEmail(email);

            expect(user).toBeDefined();
            expect(user.email).toBe(email);
        });

        test("should return null if the email does not exist", async () => {
            const email = "nonexistent@example.com";
            const user = await userService.findUserByEmail(email);

            expect(user).toBeNull();
        });
    });

    describe("userService.isUserExisted", () => {
        test("should return true if the user exists", async () => {
            const email = "user1@gmail.com";
            const { user, isExisted } = await userService.isUserExisted(email);

            expect(user.email).toBe(email);
            expect(isExisted).toBe(true);
        });

        test("should return false if the user does not exist", async () => {
            const email = "nonexistent@example.com";
            const { user, isExisted } = await userService.isUserExisted(email);

            expect(user).toBeNull();
            expect(isExisted).toBe(false);
        });
    });

    describe("userService.isUsernameTaken", () => {
        test("should return true if the name is taken", async () => {
            const name = "Admin";
            const isTaken = await userService.isUsernameTaken(name);

            expect(isTaken).toBe(true);
        });

        test("should return false if the name is not taken", async () => {
            const name = "Nonexistent User";
            const isTaken = await userService.isUsernameTaken(name);

            expect(isTaken).toBe(false);
        });
    });

    describe("userService.verifyUser", () => {
        test("should return true if the signed password matches the user password", async () => {
            const userInfo = {
                email: "user1@gmail.com",
                password: "password1",
                name: "John Doe",
            };
            const user = await User.findOne({
                where: {
                    email: userInfo.email,
                },
            });

            const signedPassword = "password1";
            const userPassword = user.password;
            const isCorrectPassword = await userService.verifyUser(
                signedPassword,
                userPassword
            );

            expect(isCorrectPassword).toBe(true);
        });

        test("should return false if the signed password does not match the user password", async () => {
            const userInfo = {
                email: "user1@gmail.com",
                password: "password1",
                name: "John Doe",
            };
            const user = await User.findOne({
                where: {
                    email: userInfo.email,
                },
            });

            const signedPassword = "incorrectPassword";
            const userPassword = user.password;
            const isCorrectPassword = await userService.verifyUser(
                signedPassword,
                userPassword
            );

            expect(isCorrectPassword).toBe(false);
        });
    });

    describe("userService.getUser", () => {
        test("should return user if the id exists", async () => {
            const id = "1";
            const user = await userService.getUser(id);

            expect(user).toBeDefined();
            expect(user.userID).toBe(id);
        });

        test("should return null if the id does not exist", async () => {
            const id = "999";
            const user = await userService.getUser(id);

            expect(user).toBeNull();
        });
    });

    describe("userService.getAllUsers", () => {
        test("should return all users", async () => {
            const query = {};
            const { users, quantity } = await userService.getAllUsers(query);

            expect(users).toBeDefined();
            expect(users).toBeInstanceOf(Array);
            expect(users[0]).toBeInstanceOf(User);
            expect(users.length).toBeGreaterThan(0);
            expect(quantity).toBeGreaterThan(0);
        });

        // test("should return users sed on the query", async () => {
        //     const query = {
        //         name: "John Doe",
        //     };
        //     const { users, quantity } = await userService.getAllUsers(query);

        //     expect(users).toBeDefined();
        //     expect(users).toHaveLength(1);
        //     expect(quantity).toBe(1);
        //     expect(users[0].name).toBe("John Doe");
        // });

        // test("should return an empty array if no user matches the query", async () => {
        //     const query = {
        //         name: "Nonexistent User",
        //     };
        //     const { users, quantity } = await userService.getAllUsers(query);

        //     expect(users).toBeDefined();
        //     expect(users).toHaveLength(0);
        //     expect(quantity).toBe(0);
        // });

        // test("should return all users with the ROLE_ADMIN role", async () => {
        //     const query = {
        //         role: "admin",
        //     };
        //     const { users, quantity } = await userService.getAllUsers(query);

        //     expect(users).toBeDefined();
        //     expect(users).toHaveLength(1);
        //     expect(quantity).toBe(1);
        //     expect(users[0].role).toBe("ROLE_ADMIN");
        // });

        // test("should return all users in order", async () => {
        //     const query = {
        //         sort: "name,ASC",
        //     };
        //     const { users, quantity } = await userService.getAllUsers(query);

        //     expect(users).toBeDefined();
        //     expect(users).toHaveLength(3);
        //     expect(quantity).toBe(3);

        //     expect(users[0].name).toBe("James Doe");
        //     expect(users[1].name).toBe("Jane Doe");
        //     expect(users[2].name).toBe("John Doe");
        // });
    });
});
