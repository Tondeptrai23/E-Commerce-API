import Entity from "./index.serializer.service.js";

const CartSerializer = new Entity({
    variantID: {
        type: "string",
    },
    productID: {
        type: "string",
    },
    price: {
        type: "number",
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
