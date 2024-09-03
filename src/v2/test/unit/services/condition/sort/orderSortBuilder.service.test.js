import OrderSortBuilder from "../../../../../services/condition/sort/orderSortBuilder.service.js";

describe("CouponSortBuilder", () => {
    test("should return an array with default sorting if the query is empty", () => {
        const query = {};
        const sortBuilder = new OrderSortBuilder(query);
        const result = sortBuilder.build();
        expect(result).toEqual([["createdAt", "DESC"]]);
    });

    test("should return an array with default sorting if the sort field is not array", () => {
        const query = { sort: "subTotal" };
        const sortBuilder = new OrderSortBuilder(query);
        const result = sortBuilder.build();
        expect(result).toEqual([["createdAt", "DESC"]]);
    });

    test("should return an array of order conditions compatible for Sequelize sorting", () => {
        const query = { sort: ["subTotal"] };
        const sortBuilder = new OrderSortBuilder(query);
        const result = sortBuilder.build();
        expect(result).toEqual([
            ["subTotal", "ASC"],
            ["createdAt", "DESC"],
        ]);
    });

    test("should return an array of order conditions compatible for Sequelize sorting with multiple fields", () => {
        const query = {
            sort: ["-subTotal"],
        };
        const sortBuilder = new OrderSortBuilder(query);
        const result = sortBuilder.build();
        expect(result).toEqual([
            ["subTotal", "DESC"],
            ["createdAt", "DESC"],
        ]);
    });

    test("should return an array of order conditions compatible for Sequelize sorting with multiple fields and directions", () => {
        const query = {
            sort: [
                "orderID",
                "-subTotal",
                "finalTotal",
                "status",
                "-paymentMethod",
                "userID",
                "-couponID",
                "shippingAddressID",
                "-createdAt",
                "updatedAt",
                "-deletedAt",
            ],
        };
        const sortBuilder = new OrderSortBuilder(query);
        const result = sortBuilder.build();
        expect(result).toEqual([
            ["orderID", "ASC"],
            ["subTotal", "DESC"],
            ["finalTotal", "ASC"],
            ["status", "ASC"],
            ["paymentMethod", "DESC"],
            ["userID", "ASC"],
            ["couponID", "DESC"],
            ["shippingAddressID", "ASC"],
            ["createdAt", "DESC"],
            ["updatedAt", "ASC"],
            ["deletedAt", "DESC"],
            ["createdAt", "DESC"],
        ]);
    });
});
