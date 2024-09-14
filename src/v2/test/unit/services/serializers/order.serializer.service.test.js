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
                name: "Product 1",
                price: 11.0,
                image: {
                    url: "http://image.com",
                    extraField: "extra",
                },
                discountPrice: 10.0,
                extraField: "extra",
                orderItem: {
                    orderItemID: "123456",
                    quantity: 1,
                    orderID: "123456",
                    priceAtPurchase: 10.0,
                    discountPriceAtPurchase: 9.0,
                    extraField: "extra",
                },
            },
            {
                productID: "1",
                variantID: "123456",
                name: "Product 1",
                price: 10.0,
                discountPrice: 9.0,
                extraField: "extra",
                orderItem: {
                    orderItemID: "1234567",
                    quantity: 1,
                    priceAtPurchase: 10.0,
                    discountPriceAtPurchase: 9.0,
                    orderID: "123456",
                    extraField: "extra",
                },
            },
        ],
        couponID: "123456",
        coupon: { code: "DISCOUNT10", discount: 10.0 },
        shippingAddress: {
            phoneNumber: "1234567890",
            recipientName: "John Doe",
            address: "123 Main St",
            city: "New York",
            district: "Manhattan",
            updatedAt: new Date(date),
            createdAt: new Date(date),
        },
        shippingAddressID: "789012",
        updatedAt: new Date(date),
        createdAt: new Date(date),
        deletedAt: new Date(date),
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
                        orderItemID: "123456",
                        name: "Product 1",
                        productID: "1",
                        variantID: "123456",
                        price: 10.0,
                        discountPrice: 9.0,
                        quantity: 1,
                        image: "http://image.com",
                        totalPrice: 9.0,
                    }),
                    expect.objectContaining({
                        orderItemID: "1234567",
                        name: "Product 1",
                        productID: "1",
                        variantID: "123456",
                        price: 10.0,
                        discountPrice: 9.0,
                        quantity: 1,
                        image: null,
                        totalPrice: 9.0,
                    }),
                ],
                couponID: "123456",
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
                        orderItemID: "123456",
                        name: "Product 1",
                        productID: "1",
                        variantID: "123456",
                        price: 10.0,
                        discountPrice: 9.0,
                        quantity: 1,
                        image: "http://image.com",
                        totalPrice: 9.0,
                    }),
                    expect.objectContaining({
                        orderItemID: "1234567",
                        name: "Product 1",
                        productID: "1",
                        variantID: "123456",
                        price: 10.0,
                        discountPrice: 9.0,
                        quantity: 1,
                        image: null,
                        totalPrice: 9.0,
                    }),
                ],
                couponID: "123456",
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
                        orderItemID: "123456",
                        name: "Product 1",
                        productID: "1",
                        variantID: "123456",
                        price: 10.0,
                        discountPrice: 9.0,
                        quantity: 1,
                        image: "http://image.com",
                        totalPrice: 9.0,
                    }),
                    expect.objectContaining({
                        orderItemID: "1234567",
                        name: "Product 1",
                        productID: "1",
                        variantID: "123456",
                        price: 10.0,
                        discountPrice: 9.0,
                        quantity: 1,
                        image: null,
                        totalPrice: 9.0,
                    }),
                ],
                couponID: "123456",
                coupon: "DISCOUNT10",
                shippingAddress: expect.objectContaining({
                    phoneNumber: "1234567890",
                    recipientName: "John Doe",
                    address: "123 Main St",
                    city: "New York",
                    district: "Manhattan",
                }),
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
                        orderItemID: "123456",
                        name: "Product 1",
                        productID: "1",
                        variantID: "123456",
                        price: 10.0,
                        discountPrice: 9.0,
                        quantity: 1,
                        image: "http://image.com",
                        totalPrice: 9.0,
                    }),
                    expect.objectContaining({
                        orderItemID: "1234567",
                        name: "Product 1",
                        productID: "1",
                        variantID: "123456",
                        price: 10.0,
                        discountPrice: 9.0,
                        quantity: 1,
                        image: null,
                        totalPrice: 9.0,
                    }),
                ],
                couponID: "123456",
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
                        orderItemID: "123456",
                        name: "Product 1",
                        productID: "1",
                        variantID: "123456",
                        price: 10.0,
                        discountPrice: 9.0,
                        quantity: 1,
                        image: "http://image.com",
                        totalPrice: 9.0,
                    }),
                    expect.objectContaining({
                        orderItemID: "1234567",
                        name: "Product 1",
                        productID: "1",
                        variantID: "123456",
                        price: 10.0,
                        discountPrice: 9.0,
                        quantity: 1,
                        image: null,
                        totalPrice: 9.0,
                    }),
                ],
                couponID: "123456",
                coupon: "DISCOUNT10",
                shippingAddressID: "789012",
            }),
        ]);
    });

    test("should serialize order correctly with includeTimestamps flag", () => {
        const orders = [orderData];

        const serializedOrders = OrderSerializer.parse(orders, {
            includeTimestamps: true,
        });

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
                        orderItemID: "123456",
                        name: "Product 1",
                        productID: "1",
                        variantID: "123456",
                        price: 10.0,
                        discountPrice: 9.0,
                        quantity: 1,
                        image: "http://image.com",
                        totalPrice: 9.0,
                    }),
                    expect.objectContaining({
                        orderItemID: "1234567",
                        name: "Product 1",
                        productID: "1",
                        variantID: "123456",
                        price: 10.0,
                        discountPrice: 9.0,
                        quantity: 1,
                        image: null,
                        totalPrice: 9.0,
                    }),
                ],
                couponID: "123456",
                coupon: "DISCOUNT10",
                shippingAddressID: "789012",
                createdAt: new Date(date).toISOString(),
                updatedAt: new Date(date).toISOString(),
            }),
        ]);
    });

    test("should serialize order correctly with isAdmin flag", () => {
        const orders = [orderData];

        const serializedOrders = OrderSerializer.parse(orders, {
            isAdmin: true,
        });

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
                        orderItemID: "123456",
                        name: "Product 1",
                        productID: "1",
                        variantID: "123456",
                        price: 10.0,
                        discountPrice: 9.0,
                        quantity: 1,
                        image: "http://image.com",
                        totalPrice: 9.0,
                    }),
                    expect.objectContaining({
                        orderItemID: "1234567",
                        name: "Product 1",
                        productID: "1",
                        variantID: "123456",
                        price: 10.0,
                        discountPrice: 9.0,
                        quantity: 1,
                        image: null,
                        totalPrice: 9.0,
                    }),
                ],
                couponID: "123456",
                coupon: "DISCOUNT10",
                shippingAddressID: "789012",
                updatedAt: new Date(date).toISOString(),
                createdAt: new Date(date).toISOString(),
                deletedAt: new Date(date).toISOString(),
            }),
        ]);
    });
});
