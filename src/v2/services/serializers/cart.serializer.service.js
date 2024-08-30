import Entity from "./index.serializer.service.js";

const CartSerializer = new Entity({
    cartItemID: [
        {
            type: "string",
            required: true,
        },
        function (obj) {
            return obj.cartItem.cartItemID;
        },
    ],
    variantID: {
        type: "string",
        required: true,
    },
    productID: {
        type: "string",
        required: true,
    },
    name: {
        type: "string",
    },
    price: {
        type: "number",
        required: true,
    },
    discountPrice: {
        type: "number",
    },
    image: [
        {
            type: "string",
            default: null,
        },
        function (obj) {
            return obj.image.url;
        },
    ],
    quantity: [
        {
            type: "number",
        },
        function (obj) {
            return obj.cartItem.quantity;
        },
    ],
    totalPrice: [
        {
            type: "number",
        },
        function (obj) {
            return (obj.discountPrice ?? obj.price) * obj.cartItem.quantity;
        },
    ],
});

export default CartSerializer;
