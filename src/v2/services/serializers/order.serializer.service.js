import Entity from "./index.serializer.service.js";

const OrderSerializer = new Entity({
    orderID: {
        type: "string",
        required: true,
    },
    orderDate: {
        type: "date",
        format: "iso",
    },
    status: {
        type: "string",
    },
    message: {
        type: "string",
    },
    subTotal: {
        type: "number",
    },
    finalTotal: {
        type: "number",
    },
    paymentMethod: {
        type: "string",
    },
    userID: {
        type: "string",
    },
    orderItems: [
        {
            type: "object",
        },
        function (obj) {
            return obj.products.map((product) => {
                return {
                    productID: product.productID,
                    variantID: product.variantID,
                    price: product.price,
                    discountPrice: product.discountPrice,
                    quantity: product.orderItem.quantity,
                    image: product.image ? product.image.url : null,
                    totalPrice:
                        (product.discountPrice ?? product.price) *
                        product.orderItem.quantity,
                };
            });
        },
    ],
    coupon: [
        {
            type: "object",
        },
        function (obj) {
            return obj.coupon.code;
        },
    ],
    shippingAddress: [
        {
            type: "object",
        },
        function (obj, options) {
            if (options.detailAddress) {
                const { updatedAt, createdAt, ...address } = JSON.parse(
                    JSON.stringify(obj.shippingAddress)
                );
                return address;
            }
            return undefined;
        },
    ],
    shippingAddressID: {
        type: "string",
    },
    createdAt: [
        {
            type: "date",
            format: "iso",
        },
        function (obj, options) {
            if (options.includeTimestamps) {
                return obj.createdAt;
            }
            return undefined;
        },
    ],
    updatedAt: [
        {
            type: "date",
            format: "iso",
        },
        function (obj, options) {
            if (options.includeTimestamps) {
                return obj.updatedAt;
            }
            return undefined;
        },
    ],
});

export default OrderSerializer;
