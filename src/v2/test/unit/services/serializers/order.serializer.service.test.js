import OrderSerializer from "../../../../services/serializers/order.serializer.service.js";

describe("OrderSerializer", () => {
    const date = "2024-01-01T00:00:00.000Z";

    const orderData = {
        orderID: "123456",
        orderDate: new Date(date),
        status: "pending",
        message: "Please process the order",
        subTotal: 100.0,
        finalTotal: 90.0,
        paymentMethod: "credit card",
        userID: "987654",
        extraField: "extra",
        products: [
            {
                productID: "1",
                variantID: "123456",
                price: 10.0,
                image: {
                    url: "http://image.com",
                    extraField: "extra",
                },
                discountPrice: 9.0,
                extraField: "extra",
                orderItem: {
                    quantity: 1,
                    orderID: "123456",
                    extraField: "extra",
                },
            },
            {
                productID: "1",
                variantID: "123456",
                price: 10.0,
                discountPrice: 9.0,
                extraField: "extra",
                orderItem: {
                    quantity: 1,
                    orderID: "123456",
                    extraField: "extra",
                },
            },
        ],
        coupon: { code: "DISCOUNT10", discount: 10.0 },
        shippingAddress: {
            street: "123 Main St",
            city: "New York",
            country: "USA",
            updatedAt: new Date(date),
            createdAt: new Date(date),
        },
        shippingAddressID: "789012",
        updatedAt: new Date(date),
        createdAt: new Date(date),
    };

    test("should serialize order data correctly", () => {
        const serializedOrder = OrderSerializer.parse(orderData);

        expect(serializedOrder).toEqual(
            expect.objectContaining({
                orderID: "123456",
                orderDate: new Date(date).toISOString(),
                status: "pending",
                message: "Please process the order",
                subTotal: 100.0,
                finalTotal: 90.0,
                paymentMethod: "credit card",
                userID: "987654",
                orderItems: [
                    expect.objectContaining({
                        productID: "1",
                        variantID: "123456",
                        price: 10.0,
                        discountPrice: 9.0,
                        quantity: 1,
                        image: "http://image.com",
                        totalPrice: 9.0,
                    }),
                    expect.objectContaining({
                        productID: "1",
                        variantID: "123456",
                        price: 10.0,
                        discountPrice: 9.0,
                        quantity: 1,
                        image: null,
                        totalPrice: 9.0,
                    }),
                ],
                coupon: "DISCOUNT10",
                shippingAddressID: "789012",
            })
        );
    });

    test("should serialize order data correctly with includeTimestamps flag", () => {
        const serializedOrder = OrderSerializer.parse(orderData, {
            includeTimestamps: true,
        });

        expect(serializedOrder).toEqual(
            expect.objectContaining({
                orderID: "123456",
                orderDate: new Date(date).toISOString(),
                status: "pending",
                message: "Please process the order",
                subTotal: 100.0,
                finalTotal: 90.0,
                paymentMethod: "credit card",
                userID: "987654",
                orderItems: [
                    expect.objectContaining({
                        productID: "1",
                        variantID: "123456",
                        price: 10.0,
                        discountPrice: 9.0,
                        quantity: 1,
                        image: "http://image.com",
                        totalPrice: 9.0,
                    }),
                    expect.objectContaining({
                        productID: "1",
                        variantID: "123456",
                        price: 10.0,
                        discountPrice: 9.0,
                        quantity: 1,
                        image: null,
                        totalPrice: 9.0,
                    }),
                ],
                coupon: "DISCOUNT10",
                shippingAddressID: "789012",
                createdAt: new Date(date).toISOString(),
                updatedAt: new Date(date).toISOString(),
            })
        );
    });

    test("should serialize order data correctly with detailAddress flag", () => {
        const serializedOrder = OrderSerializer.parse(orderData, {
            detailAddress: true,
        });

        expect(serializedOrder).toEqual(
            expect.objectContaining({
                orderID: "123456",
                orderDate: new Date(date).toISOString(),
                status: "pending",
                message: "Please process the order",
                subTotal: 100.0,
                finalTotal: 90.0,
                paymentMethod: "credit card",
                userID: "987654",
                orderItems: [
                    expect.objectContaining({
                        productID: "1",
                        variantID: "123456",
                        price: 10.0,
                        discountPrice: 9.0,
                        quantity: 1,
                        image: "http://image.com",
                        totalPrice: 9.0,
                    }),
                    expect.objectContaining({
                        productID: "1",
                        variantID: "123456",
                        price: 10.0,
                        discountPrice: 9.0,
                        quantity: 1,
                        image: null,
                        totalPrice: 9.0,
                    }),
                ],
                coupon: "DISCOUNT10",
                shippingAddress: {
                    street: "123 Main St",
                    city: "New York",
                    country: "USA",
                },
                shippingAddressID: "789012",
            })
        );
    });

    test("should serializer order array correctly", () => {
        const orders = [orderData, orderData];

        const serializedOrders = OrderSerializer.parse(orders);

        expect(serializedOrders).toEqual([
            expect.objectContaining({
                orderID: "123456",
                orderDate: new Date(date).toISOString(),
                status: "pending",
                message: "Please process the order",
                subTotal: 100.0,
                finalTotal: 90.0,
                paymentMethod: "credit card",
                userID: "987654",
                orderItems: [
                    expect.objectContaining({
                        productID: "1",
                        variantID: "123456",
                        price: 10.0,
                        discountPrice: 9.0,
                        quantity: 1,
                        image: "http://image.com",
                        totalPrice: 9.0,
                    }),
                    expect.objectContaining({
                        productID: "1",
                        variantID: "123456",
                        price: 10.0,
                        discountPrice: 9.0,
                        quantity: 1,
                        image: null,
                        totalPrice: 9.0,
                    }),
                ],
                coupon: "DISCOUNT10",
                shippingAddressID: "789012",
            }),
            expect.objectContaining({
                orderID: "123456",
                orderDate: new Date(date).toISOString(),
                status: "pending",
                message: "Please process the order",
                subTotal: 100.0,
                finalTotal: 90.0,
                paymentMethod: "credit card",
                userID: "987654",
                orderItems: [
                    expect.objectContaining({
                        productID: "1",
                        variantID: "123456",
                        price: 10.0,
                        discountPrice: 9.0,
                        quantity: 1,
                        image: "http://image.com",
                        totalPrice: 9.0,
                    }),
                    expect.objectContaining({
                        productID: "1",
                        variantID: "123456",
                        price: 10.0,
                        discountPrice: 9.0,
                        quantity: 1,
                        image: null,
                        totalPrice: 9.0,
                    }),
                ],
                coupon: "DISCOUNT10",
                shippingAddressID: "789012",
            }),
        ]);
    });
});
