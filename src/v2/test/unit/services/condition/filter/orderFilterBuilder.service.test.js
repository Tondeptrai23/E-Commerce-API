import OrderFilterBuilder from "../../../../../services/condition/filter/orderFilterBuilder.service.js";
import { Op } from "sequelize";

describe("CouponFilterBuilder", () => {
    test("should return an empty array if the query is empty", () => {
        const query = {};
        const filterBuilder = new OrderFilterBuilder(query);
        const result = filterBuilder.build();
        expect(result).toEqual([]);
    });

    test("should return an array of equal fields", () => {
        const query = {
            orderID: "1",
            userID: "1",
            couponID: "1",
            shippingAddressID: "1",
            status: "pending",
            paymentMethod: "cash",
            subTotal: "1",
            finalTotal: "1",
            createdAt: "2024-01-01",
            updatedAt: "2024-01-01",
            deletedAt: "2024-01-01",
            extraFields: "extra",
        };
        const filterBuilder = new OrderFilterBuilder(query);
        const result = filterBuilder.build();
        expect(result).toEqual([
            { orderID: ["1"] },
            { userID: ["1"] },
            { couponID: ["1"] },
            { shippingAddressID: ["1"] },
            { status: ["pending"] },
            { paymentMethod: ["cash"] },
            { subTotal: ["1"] },
            { finalTotal: ["1"] },
            { createdAt: ["2024-01-01"] },
            { updatedAt: ["2024-01-01"] },
            { deletedAt: ["2024-01-01"] },
        ]);
    });

    test("should return an array of fields with comparison operators", () => {
        const query = {
            orderID: "[gte]1",
            userID: "[like]1",
            couponID: "[ne]1",
            shippingAddressID: "[gte]1",
            subTotal: "[gte]1",
            finalTotal: "[gte]1",
            createdAt: "[lte]2024-01-01",
            updatedAt: "[lt]2024-01-01",
            deletedAt: "[ne]2024-01-01",
            extraFields: "extra",
        };
        const filterBuilder = new OrderFilterBuilder(query);
        const result = filterBuilder.build();
        expect(result).toEqual([
            { orderID: { [Op.gte]: "1" } },
            { userID: { [Op.like]: "%1%" } },
            { couponID: { [Op.ne]: "1" } },
            { shippingAddressID: { [Op.gte]: "1" } },
            { subTotal: { [Op.gte]: "1" } },
            { finalTotal: { [Op.gte]: "1" } },
            { createdAt: { [Op.lte]: "2024-01-01" } },
            { updatedAt: { [Op.lt]: "2024-01-01" } },
            { deletedAt: { [Op.ne]: "2024-01-01" } },
        ]);
    });

    test("should return an array of fields with multiple comparison operators", () => {
        const query = {
            orderID: "[like]1",
            userID: "[ne]1",
            couponID: ["[gte]1", "[lte]2"],
            shippingAddressID: "[like]1",
            status: ["pending", "processing"],
            paymentMethod: ["cash", "credit"],
            subTotal: "[gte]1",
            finalTotal: ["[between]2,5"],
            createdAt: ["[gte]2024-01-01", "[lte]2024-12-31"],
            updatedAt: ["2024-01-01", "[lte]2024-12-31", "2024-01-02"],
            deletedAt: "2024-01-01",
            extraFields: "extra",
        };
        const filterBuilder = new OrderFilterBuilder(query);
        const result = filterBuilder.build();
        expect(result).toEqual([
            { orderID: { [Op.like]: "%1%" } },
            { userID: { [Op.ne]: "1" } },
            { couponID: { [Op.gte]: "1" } },
            { couponID: { [Op.lte]: "2" } },
            { shippingAddressID: { [Op.like]: "%1%" } },
            { status: ["pending", "processing"] },
            { paymentMethod: ["cash", "credit"] },
            { subTotal: { [Op.gte]: "1" } },
            { finalTotal: { [Op.between]: ["2", "5"] } },
            { createdAt: { [Op.gte]: "2024-01-01" } },
            { createdAt: { [Op.lte]: "2024-12-31" } },
            { updatedAt: { [Op.lte]: "2024-12-31" } },
            { updatedAt: ["2024-01-01", "2024-01-02"] },
            { deletedAt: ["2024-01-01"] },
        ]);
    });
});
