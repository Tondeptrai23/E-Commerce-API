import Entity from "./index.serializer.service.js";

const CouponSerializer = new Entity({
    couponID: {
        type: "string",
        required: true,
    },
    code: {
        type: "string",
        required: true,
    },
    discountType: {
        type: "string",
        required: true,
    },
    discountValue: {
        type: "number",
        required: true,
    },
    target: {
        type: "string",
        required: true,
    },
    minimumOrderAmount: {
        type: "number",
    },
    timesUsed: {
        type: "number",
    },
    maxUsage: {
        type: "number",
    },
    startDate: {
        type: "date",
        format: "iso",
    },
    endDate: {
        type: "date",
        format: "iso",
    },
    createdAt: {
        type: "date",
        format: "iso",
    },
    updatedAt: {
        type: "date",
        format: "iso",
    },
    products: [
        {
            type: "object",
        },
        function (obj) {
            return obj.products.map((product) => {
                return {
                    productID: product.productID,
                    name: product.name,
                };
            });
        },
    ],
    categories: [
        {
            type: "object",
        },
        function (obj) {
            return obj.categories.map((category) => {
                return category.name;
            });
        },
    ],
});

export default CouponSerializer;
