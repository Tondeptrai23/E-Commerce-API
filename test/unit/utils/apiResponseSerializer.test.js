import {
    UserAPIResponseSerializer,
    ProductAPIResponseSerializer,
    OrderAPIResponseSerializer,
} from "../../../utils/apiResponseSerializer.js";

describe("API Response Serializer", () => {
    describe("UserAPIResponseSerializer", () => {
        it("should serialize a user object correctly", () => {
            const user = {
                id: 1,
                name: "John Doe",
                email: "john.doe@example.com",
                password: "password",
                updatedAt: "2021-01-01T00:00:00Z",
                createdAt: "2021-01-01T00:00:00Z",
            };

            const serializedUser = UserAPIResponseSerializer.serialize(user);

            expect(serializedUser).toEqual({
                userId: 1,
                name: "John Doe",
            });
        });
    });

    describe("ProductAPIResponseSerializer", () => {
        it("should serialize a product object correctly", () => {
            const product = {
                id: 1,
                name: "Product 1",
                price: 9.99,
                description: "This is a product",
                updatedAt: "2021-01-01T00:00:00Z",
                createdAt: "2021-01-01T00:00:00Z",
            };

            const serializedProduct =
                ProductAPIResponseSerializer.serialize(product);

            expect(serializedProduct).toEqual({
                id: 1,
                name: "Product 1",
                price: 9.99,
                description: "This is a product",
            });
        });
    });

    describe("OrderAPIResponseSerializer", () => {
        it("should serialize an order object correctly", () => {
            const order = {
                id: 1,
                products: [
                    {
                        id: 1,
                        name: "Product 1",
                        description: "This is a product",
                        price: 9.99,
                        orderProduct: { quantity: 2 },
                    },
                    {
                        id: 2,
                        name: "Product 2",
                        description: "This is another product",
                        price: 14.99,
                        orderProduct: { quantity: 1 },
                    },
                ],
                updatedAt: "2021-01-01T00:00:00Z",
                createdAt: "2021-01-01T00:00:00Z",
                userId: "1245nicasd",
            };

            const serializedOrder = OrderAPIResponseSerializer.serialize(order);

            expect(serializedOrder).toEqual({
                id: 1,
                products: [
                    {
                        id: 1,
                        name: "Product 1",
                        price: 9.99,
                        description: "This is a product",
                        quantity: 2,
                    },
                    {
                        id: 2,
                        name: "Product 2",
                        price: 14.99,
                        description: "This is another product",
                        quantity: 1,
                    },
                ],
            });
        });
    });
});
