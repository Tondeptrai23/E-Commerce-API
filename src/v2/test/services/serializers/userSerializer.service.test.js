import UserSerializer from "../../../services/serializers/userSerializer.service.js";

const user = {
    userID: "1",
    email: "random@gmail.com",
    password: "password",
    phoneNumber: "123456789",
    refreshToken: "refreshToken",
    name: "Random User",
    avatar: "http://example.com/avatar.jpg",
    updatedAt: "2024-08-10T00:00:00.000Z",
    createdAt: "2024-08-10T00:00:00.000Z",
};

describe("UserSerializer default", () => {
    let userSerializer;
    beforeAll(() => {
        userSerializer = new UserSerializer();
    });

    test("should return the user object", () => {
        const result = userSerializer.serialize(user);
        expect(result).toEqual({
            userID: "1",
            email: "random@gmail.com",
            avatar: "http://example.com/avatar.jpg",
            name: "Random User",
        });
    });

    test("should return an empty object if no user is provided", () => {
        const result = userSerializer.serialize();
        expect(result).toEqual({});
    });
});

describe("UserSerializer with timestamps", () => {
    let userSerializer;
    beforeAll(() => {
        userSerializer = new UserSerializer({ includeTimestamps: true });
    });

    test("should return the user object with timestamps", () => {
        const result = userSerializer.serialize(user);
        expect(result).toEqual({
            userID: "1",
            email: "random@gmail.com",
            avatar: "http://example.com/avatar.jpg",
            name: "Random User",
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });
    });
});
