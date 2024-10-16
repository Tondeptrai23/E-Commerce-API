import userService from "../../../../services/users/user.service.js";
import seedData from "../../../../seedData.js";
import User from "../../../../models/user/user.model.js";
import {
    ConflictError,
    ResourceNotFoundError,
} from "../../../../utils/error.js";
import { jest } from "@jest/globals";
import Order from "../../../../models/shopping/order.model.js";
import { db } from "../../../../models/index.model.js";

beforeAll(async () => {
    await seedData();
});

afterAll(async () => {
    await db.close();
});

describe("createNewAccount", () => {
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

        await expect(userService.createNewAccount(userInfo)).rejects.toThrow(
            ConflictError
        );
    });
});

describe("findUserByEmail", () => {
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

describe("isUserExisted", () => {
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

describe("verifyUser", () => {
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

describe("getUser", () => {
    test("should return user if the id exists", async () => {
        const id = "1";
        const user = await userService.getUser(id);

        expect(user).toBeDefined();
        expect(user.userID).toBe(id);
    });

    test("should return user with the includeDeleted option", async () => {
        const id = "100";
        const user = await userService.getUser(id, { includeDeleted: true });

        expect(user).toBeDefined();
        expect(user.userID).toBe(id);
    });

    test("should throw ResourceNotFoundError if the id does not exist", async () => {
        const id = "999";
        await expect(userService.getUser(id)).rejects.toThrow(
            ResourceNotFoundError
        );
    });
});

describe("getAllUsers", () => {
    test("should return all users", async () => {
        const query = {
            page: 1,
            size: 2,
        };
        const { users, totalItems, currentPage, totalPages } =
            await userService.getAllUsers(query);

        expect(users).toBeDefined();
        expect(users[0]).toBeInstanceOf(User);
        expect(users.length).toBeGreaterThan(0);
        expect(totalItems).toBeGreaterThan(0);
        expect(currentPage).toBe(query.page);
        expect(totalPages).toBeGreaterThan(0);

        const {
            users: users2,
            totalItems: totalItems2,
            currentPage: currentPage2,
            totalPages: totalPages2,
        } = await userService.getAllUsers({
            page: 2,
            size: 2,
        });

        expect(users2).toBeDefined();
        expect(users2[0]).toBeInstanceOf(User);
        expect(users2.length).toBeGreaterThan(0);
        expect(totalItems2).toBeGreaterThan(0);
        expect(currentPage2).toBe(2);
        expect(totalPages2).toBeGreaterThan(0);
    });

    test("should return all with includeDeleted options", async () => {
        const { users } = await userService.getAllUsers(
            {
                size: 20,
            },
            {
                includeDeleted: true,
            }
        );

        expect(users).toBeDefined();
        for (const user of users) {
            expect(user).toBeInstanceOf(User);
            expect(user.deletedAt).toBeDefined();
        }
    });

    test("should return all with filtering 1", async () => {
        const query = {
            email: "[like]facebook",
        };

        const { users } = await userService.getAllUsers(query);

        for (const user of users) {
            expect(user.email).toContain("facebook");
        }
    });

    test("should return all with filtering 2", async () => {
        const query = {
            email: ["[like]gmail", "[like]bing"],
            name: "[ne]Admin",
        };

        const { users } = await userService.getAllUsers(query);

        for (const user of users) {
            expect(
                user.email.includes("gmail") || user.email.includes("bing")
            ).toBe(true);
            expect(user.name).not.toBe("Admin");
        }
    });

    test("should return all with filtering 3", async () => {
        const query = {
            size: 20,
            isVerified: true,
        };

        const { users } = await userService.getAllUsers(query);

        for (const user of users) {
            expect(user.isVerified).toBe(true);
        }
    });

    test("should return all with sorting", async () => {
        const query = {
            size: 2,
            sort: ["email"],
        };

        const { users } = await userService.getAllUsers(query);

        for (let i = 0; i < users.length - 1; i++) {
            expect(
                users[i].email.localeCompare(users[i + 1].email)
            ).toBeLessThan(1);
        }

        const query2 = {
            page: 2,
            size: 2,
            sort: ["email"],
        };

        const { users: users2 } = await userService.getAllUsers(query2);

        expect(users2[0].email.localeCompare(users2[1].email)).toBeLessThan(1);
        for (let i = 0; i < users2.length - 1; i++) {
            expect(
                users2[i].email.localeCompare(users2[i + 1].email)
            ).toBeLessThan(1);
        }
    });
});

describe("updateUser", () => {
    test("should reset the password", async () => {
        const user = await User.findByPk("1");

        const oldPassword = user.password;
        const newPassword = "newPassword123";
        await userService.updateUser(user.userID, {
            password: newPassword,
        });

        const updatedUser = await User.findByPk("1");
        expect(updatedUser.password).not.toBe(oldPassword);
    });

    test("should update the user information", async () => {
        const user = await User.findByPk("1");

        const updatedInfo = {
            name: "Updated Name",
            email: "updatedEmail@gmail.com",
        };

        await userService.updateUser(user.userID, updatedInfo);
    });

    test("should throw ConflictError if the email already exists", async () => {
        const user = await User.findByPk("1");

        const updatedInfo = {
            email: "admin@gmail.com",
        };

        await expect(
            userService.updateUser(user.userID, updatedInfo)
        ).rejects.toThrow(ConflictError);
    });

    test("should throw ResourceNotFoundError if the user does not exist", async () => {
        const updatedInfo = {
            name: "Updated Name",
        };

        await expect(
            userService.updateUser("999", updatedInfo)
        ).rejects.toThrow(ResourceNotFoundError);
    });
});

describe("verifyUserAccount", () => {
    test("should verify the user", async () => {
        // Create a new user
        const userInfo = {
            email: "new@gmail.com",
            password: "password123",
            name: "New User",
        };

        const createdUser = await userService.createNewAccount(userInfo);

        // Verify the user
        const user = await userService.verifyUserAccount(createdUser.userID);

        expect(user).toBeDefined();
        expect(user.isVerified).toBe(true);
    });

    test("should throw ResourceNotFoundError if the user does not exist", async () => {
        await expect(userService.verifyUserAccount("999")).rejects.toThrow(
            ResourceNotFoundError
        );
    });
});

describe("deleteUser", () => {
    test("should delete the user", async () => {
        // Delete the user
        const deletedUser = await userService.deleteUser("1");

        expect(deletedUser).toBeDefined();
        expect(deletedUser.userID).toBe("1");

        // Check if the user is deleted
        const user = await User.findByPk("1");
        expect(user).toBeNull();

        // Check if the user is soft deleted
        const softDeletedUser = await User.findByPk("1", {
            paranoid: false,
        });
        expect(softDeletedUser).toBeDefined();

        // Check if cart is deleted
        const cart = await softDeletedUser.getCartItems();
        expect(cart.length).toBe(0);

        // Check if pending orders are deleted
        const pendingOrders = await softDeletedUser.getOrders({
            where: {
                status: "pending",
            },
        });
        expect(pendingOrders.length).toBe(0);

        // Check if other orders are not deleted
        const orders = await softDeletedUser.getOrders();
        expect(orders.length).toBeGreaterThan(0);
    });

    test("should not delete the user if something goes wrong", async () => {
        jest.spyOn(Order, "destroy").mockImplementation(() => {
            throw new Error("Error");
        });

        await expect(userService.deleteUser("2")).rejects.toThrow(Error);

        jest.spyOn(Order, "destroy").mockRestore();

        const user = await User.findByPk("2");
        expect(user).toBeDefined();
    });

    test("should throw ResourceNotFoundError if the user does not exist", async () => {
        await expect(userService.deleteUser("999")).rejects.toThrow(
            ResourceNotFoundError
        );
    });
});

describe("restoreUser", () => {
    test("should restore the user", async () => {
        // Restore the user
        await userService.restoreUser("1");

        // Check if the user is restored
        const user = await User.findByPk("1");
        expect(user).toBeDefined();
    });

    test("should throw ResourceNotFoundError if the user does not exist", async () => {
        await expect(userService.restoreUser("999")).rejects.toThrow(
            ResourceNotFoundError
        );
    });
});
