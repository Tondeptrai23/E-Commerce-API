import CouponSerializer from "../../../../services/serializers/coupon.serializer.service.js";

describe("Coupon Serializer", () => {
    const date = "2024-01-01T00:00:00.000Z";

    test("should serialize coupon", () => {
        const coupon = {
            couponID: "couponID",
            code: "CODE",
            discountType: "percentage",
            discountValue: 10,
            target: "all",
            minimumOrderAmount: 100,
            timesUsed: 5,
            maxUsage: 10,
            startDate: new Date(date),
            endDate: new Date(date),
            createdAt: new Date(date),
            updatedAt: new Date(date),
            extraField: "extraField",
            products: [
                {
                    productID: "productID",
                    name: "name",
                    extraField: "extraField",
                },
            ],
            categories: [
                {
                    categoryID: "categoryID",
                    name: "category1",
                    extraField: "extraField",
                },
                {
                    categoryID: "categoryID",
                    name: "category2",
                    extraField: "extraField",
                },
            ],
        };

        const serializedCoupon = CouponSerializer.parse(coupon);

        expect(serializedCoupon).toEqual({
            couponID: "couponID",
            code: "CODE",
            discountType: "percentage",
            discountValue: 10,
            target: "all",
            minimumOrderAmount: 100,
            timesUsed: 5,
            maxUsage: 10,
            startDate: new Date(date).toISOString(),
            endDate: new Date(date).toISOString(),
            createdAt: new Date(date).toISOString(),
            updatedAt: new Date(date).toISOString(),
            products: [
                {
                    productID: "productID",
                    name: "name",
                },
            ],
            categories: ["category1", "category2"],
        });
    });

    test("should serialize coupon without optional fields", () => {
        const coupon = {
            couponID: "couponID",
            code: "CODE",
            discountType: "percentage",
            discountValue: 10,
            target: "all",
        };

        const serializedCoupon = CouponSerializer.parse(coupon);

        expect(serializedCoupon).toEqual({
            couponID: "couponID",
            code: "CODE",
            discountType: "percentage",
            discountValue: 10,
            target: "all",
            minimumOrderAmount: null,
            timesUsed: null,
            maxUsage: null,
            startDate: null,
            endDate: null,
            createdAt: null,
            updatedAt: null,
        });
    });
});
