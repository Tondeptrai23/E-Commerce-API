import seedData from "../setup.js";
import { UserService } from "../../services/userService.js";
import { db } from "../../models/index.js";

beforeEach(async () => {
    await seedData();
});

afterAll(async () => {
    await db.close();
});

describe("UserService.createNewAccount", () => {
    test("should create a new account", async () => {
        const userInfo = {
            email: "test@example.com",
            password: "password123",
            name: "John Doe",
        };

        const createdUser = await UserService.createNewAccount(userInfo);

        expect(createdUser).toBeDefined();
        expect(createdUser.email).toBe(userInfo.email);
        expect(createdUser.name).toBe(userInfo.name);
    });

    test("should return null if the email is existed", async () => {
        const userInfo = {
            email: "example@gmail.com",
            password: "password123",
            name: "Existing User",
        };

        const createdUser = await UserService.createNewAccount(userInfo);

        expect(createdUser).toBeNull();
    });
});

describe("UserService.findUserByEmail", () => {
    test("should return user if the email exists", async () => {
        const email = "example@gmail.com";
        const user = await UserService.findUserByEmail(email);

        expect(user).toBeDefined();
        expect(user.email).toBe(email);
    });

    test("should return null if the email does not exist", async () => {
        const email = "nonexistent@example.com";
        const user = await UserService.findUserByEmail(email);

        expect(user).toBeNull();
    });
});

describe("UserService.isUserExisted", () => {
    test("should return true if the user exists", async () => {
        const email = "example@gmail.com";
        const { user, isExisted } = await UserService.isUserExisted(email);

        expect(user.email).toBe(email);
        expect(isExisted).toBe(true);
    });

    test("should return false if the user does not exist", async () => {
        const email = "nonexistent@example.com";
        const { user, isExisted } = await UserService.isUserExisted(email);

        expect(user).toBeNull();
        expect(isExisted).toBe(false);
    });
});

describe("UserService.verifyUser", () => {
    test("should return true if the signed password matches the user password", async () => {
        const userInfo = {
            email: "test@example.com",
            password: "correctPassword",
            name: "John Doe",
        };
        const createdUser = await UserService.createNewAccount(userInfo);

        const signedPassword = "correctPassword";
        const userPassword = createdUser.password;
        const isCorrectPassword = await UserService.verifyUser(
            signedPassword,
            userPassword
        );

        expect(isCorrectPassword).toBe(true);
    });

    test("should return false if the signed password does not match the user password", async () => {
        const userInfo = {
            email: "test@example.com",
            password: "correctPassword",
            name: "John Doe",
        };
        const createdUser = await UserService.createNewAccount(userInfo);

        const signedPassword = "incorrectPassword";
        const userPassword = createdUser.password;
        const isCorrectPassword = await UserService.verifyUser(
            signedPassword,
            userPassword
        );

        expect(isCorrectPassword).toBe(false);
    });
});

describe("UserService.findUserById", () => {
    test("should return user if the id exists", async () => {
        const id = "1";
        const user = await UserService.findUserById(id);

        expect(user).toBeDefined();
        expect(user.id).toBe(id);
    });

    test("should return null if the id does not exist", async () => {
        const id = "999";
        const user = await UserService.findUserById(id);

        expect(user).toBeNull();
    });
});

describe("UserService.findAllUsers", () => {
    test("should return all users", async () => {
        const query = {};
        const { users, quantity } = await UserService.findAllUsers(query);

        expect(users).toBeDefined();
        expect(users).toHaveLength(3);
        expect(quantity).toBe(3);
    });

    test("should return users based on the query", async () => {
        const query = {
            name: "John Doe",
        };
        const { users, quantity } = await UserService.findAllUsers(query);

        expect(users).toBeDefined();
        expect(users).toHaveLength(1);
        expect(quantity).toBe(1);
        expect(users[0].name).toBe("John Doe");
    });

    test("should return an empty array if no user matches the query", async () => {
        const query = {
            name: "Nonexistent User",
        };
        const { users, quantity } = await UserService.findAllUsers(query);

        expect(users).toBeDefined();
        expect(users).toHaveLength(0);
        expect(quantity).toBe(0);
    });

    test("should return all users with the ROLE_ADMIN role", async () => {
        const query = {
            role: "ROLE_ADMIN",
        };
        const { users, quantity } = await UserService.findAllUsers(query);

        expect(users).toBeDefined();
        expect(users).toHaveLength(1);
        expect(quantity).toBe(1);
        expect(users[0].role).toBe("ROLE_ADMIN");
    });

    test("should return all users in order", async () => {
        const query = {
            sort: "name,ASC",
        };
        const { users, quantity } = await UserService.findAllUsers(query);

        expect(users).toBeDefined();
        expect(users).toHaveLength(3);
        expect(quantity).toBe(3);
        console.log(users);
        expect(users[0].name).toBe("James Doe");
        expect(users[1].name).toBe("Jane Doe");
        expect(users[2].name).toBe("John Doe");
    });
});
