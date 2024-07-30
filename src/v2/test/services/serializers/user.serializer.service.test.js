import UserSerializer from "../../../services/serializers/user.serializer.service.js";

const date = "2024-01-01T00:00:00.000Z";

const user = {
    userID: "1",
    email: "random@gmail.com",
    password: "password",
    refreshToken: "refreshToken",
    name: "Random User",
    avatar: "http://example.com/avatar.jpg",
    role: "user",
    extraField: "Extra Field",
    updatedAt: new Date(date),
    createdAt: new Date(date),
};

describe("UserSerializer", () => {
    test("should serialize user data correctly", () => {
        const serializedData = UserSerializer.parse(user);

        expect(serializedData).toEqual({
            userID: "1",
            email: "random@gmail.com",
            name: "Random User",
            avatar: "http://example.com/avatar.jpg",
            role: "user",
        });

        expect(serializedData.createdAt).toBeUndefined();
        expect(serializedData.updatedAt).toBeUndefined();
    });

    test("should serialize user data with timestamps", () => {
        const serializedData = UserSerializer.parse(user, {
            includeTimestamps: true,
        });

        expect(serializedData).toEqual({
            userID: "1",
            email: "random@gmail.com",
            name: "Random User",
            avatar: "http://example.com/avatar.jpg",
            role: "user",
            createdAt: new Date(date).toISOString(),
            updatedAt: new Date(date).toISOString(),
        });
    });

    test("should return null fields by default", () => {
        const user = {
            userID: "1",
            email: "random@gmail.com",
            password: "password",
        };

        const serializedData = UserSerializer.parse(user);

        expect(serializedData).toEqual({
            userID: "1",
            email: "random@gmail.com",
            name: null,
            avatar: null,
            role: null,
        });
    });
});
