import Entity from "./index.serializer.service.js";
import AddressSerializer from "./address.serializer.service.js";

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
                    orderItemID: product.orderItem.orderItemID,
                    productID: product.productID,
                    variantID: product.variantID,
                    name: product.name,
                    price: product.orderItem.priceAtPurchase,
                    discountPrice: product.orderItem.discountPriceAtPurchase,
                    quantity: product.orderItem.quantity,
                    image: product.image ? product.image.url : null,
                    totalPrice:
                        (product.orderItem.discountPriceAtPurchase
                            ? product.orderItem.discountPriceAtPurchase
                            : product.orderItem.priceAtPurchase) *
                        product.orderItem.quantity,
                };
            });
        },
    ],
    couponID: {
        type: "string",
    },
    coupon: [
        {
            type: "string",
        },
        function (obj) {
            return obj.coupon.code;
        },
    ],
    shippingAddress: [
        {
            type: "object",
            default: undefined,
        },
        function (obj, options) {
            if (!obj.shippingAddress) {
                return undefined;
            }

            if (options.includeAddress) {
                const addressOption = {
                    detailAddress: false,
                };
                return AddressSerializer.parse(
                    obj.shippingAddress,
                    addressOption
                );
            } else {
                return undefined;
            }
        },
    ],
    shippingAddressID: [
        {
            type: "string",
        },
        function (obj, options) {
            if (options.isAdmin) {
                return obj.shippingAddressID;
            }
            return undefined;
        },
    ],
    createdAt: [
        {
            type: "date",
            format: "iso",
        },
        function (obj, options) {
            if (options.includeTimestamps || options.isAdmin) {
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
            if (options.includeTimestamps || options.isAdmin) {
                return obj.updatedAt;
            }
            return undefined;
        },
    ],
    deletedAt: [
        {
            type: "date",
            format: "iso",
        },
        function (obj, options) {
            if (options.isAdmin) {
                return obj.deletedAt;
            }
            return undefined;
        },
    ],
});

export default OrderSerializer;
