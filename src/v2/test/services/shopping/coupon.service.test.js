import couponService from "../../../services/shopping/coupon.service.js";
import seedData from "../../../seedData.js";
import { ResourceNotFoundError } from "../../../utils/error.js";
import Order from "../../../models/shopping/order.model.js";
import orderService from "../../../services/shopping/order.service.js";
import Coupon from "../../../models/shopping/coupon.model.js";

beforeAll(async () => {
    await seedData();
}, 15000);

describe("CouponService", () => {
    describe("createCoupon", () => {
        test("Create a new coupon", async () => {
            const couponData = {
                code: "SUMMER20",
                discountType: "percentage",
                discountValue: 10,
                minimumOrderAmount: 20,
                timesUsed: 0,
                maxUsage: 10,
                target: "all",
                startDate: new Date("2024/8/1"),
                endDate: new Date("2024/7/12"),
            };

            const createdCoupon = await couponService.createCoupon(couponData);

            expect(createdCoupon).toBeDefined();
            expect(createdCoupon.code).toBe(couponData.code);
            expect(createdCoupon.discountType).toBe(couponData.discountType);
            expect(createdCoupon.discountValue).toBe(couponData.discountValue);
            expect(createdCoupon.minimumOrderAmount).toBe(
                couponData.minimumOrderAmount
            );
            expect(createdCoupon.timesUsed).toBe(couponData.timesUsed);
            expect(createdCoupon.maxUsage).toBe(couponData.maxUsage);
        });

        test("Create a new coupon with categories", async () => {
            const couponData = {
                code: "SUMMER21",
                discountType: "percentage",
                discountValue: 10,
                minimumOrderAmount: 20,
                timesUsed: 0,
                maxUsage: 10,
                target: "all",
                startDate: new Date("2024/8/1"),
                endDate: new Date("2024/7/12"),
                categories: ["tops", "male"],
            };

            const createdCoupon = await couponService.createCoupon(couponData);

            expect(createdCoupon).toBeDefined();
            expect(createdCoupon.code).toBe(couponData.code);
            expect(createdCoupon.discountType).toBe(couponData.discountType);
            expect(createdCoupon.discountValue).toBe(couponData.discountValue);
            expect(createdCoupon.minimumOrderAmount).toBe(
                couponData.minimumOrderAmount
            );
            expect(createdCoupon.timesUsed).toBe(couponData.timesUsed);
            expect(createdCoupon.maxUsage).toBe(couponData.maxUsage);
            expect(createdCoupon.dataValues.categories).toBeDefined();
            expect(Array.isArray(createdCoupon.dataValues.categories)).toBe(
                true
            );
            expect(createdCoupon.dataValues.categories.length).toBeGreaterThan(
                0
            );
        });

        test("Create a new coupon with products", async () => {
            const couponData = {
                code: "SUMMER22",
                discountType: "percentage",
                discountValue: 10,
                minimumOrderAmount: 20,
                timesUsed: 0,
                maxUsage: 10,
                target: "all",
                startDate: new Date("2024/8/1"),
                endDate: new Date("2024/7/12"),
                products: ["1", "2"],
            };

            const createdCoupon = await couponService.createCoupon(couponData);

            expect(createdCoupon).toBeDefined();
            expect(createdCoupon.code).toBe(couponData.code);
            expect(createdCoupon.discountType).toBe(couponData.discountType);
            expect(createdCoupon.discountValue).toBe(couponData.discountValue);
            expect(createdCoupon.minimumOrderAmount).toBe(
                couponData.minimumOrderAmount
            );
            expect(createdCoupon.timesUsed).toBe(couponData.timesUsed);
            expect(createdCoupon.maxUsage).toBe(couponData.maxUsage);
            expect(createdCoupon.dataValues.products).toBeDefined();
            expect(Array.isArray(createdCoupon.dataValues.products)).toBe(true);
            expect(createdCoupon.dataValues.products.length).toBeGreaterThan(0);
        });

        test("Create a new coupon with null fields", async () => {
            const couponData = {
                code: "SUMMER23",
                discountType: "percentage",
                discountValue: 10,
                minimumOrderAmount: 20,
                timesUsed: 0,
                maxUsage: 10,
                target: "all",
                startDate: new Date("2024/8/1"),
                endDate: new Date("2024/7/12"),
                categories: null,
                products: null,
            };

            const createdCoupon = await couponService.createCoupon(couponData);

            expect(createdCoupon).toBeDefined();
            expect(createdCoupon.code).toBe(couponData.code);
            expect(createdCoupon.discountType).toBe(couponData.discountType);
            expect(createdCoupon.discountValue).toBe(couponData.discountValue);
            expect(createdCoupon.minimumOrderAmount).toBe(
                couponData.minimumOrderAmount
            );
            expect(createdCoupon.timesUsed).toBe(couponData.timesUsed);
            expect(createdCoupon.maxUsage).toBe(couponData.maxUsage);
            expect(createdCoupon.dataValues.categories).toBeUndefined();
            expect(createdCoupon.dataValues.products).toBeUndefined();
        });
    });

    describe("getCoupons", () => {
        test("Get all coupons", async () => {
            const coupons = await couponService.getCoupons();

            expect(coupons).toBeDefined();
            expect(Array.isArray(coupons)).toBe(true);
            expect(coupons.length).toBeGreaterThan(0);
        });

        test("Get all coupons with associated models", async () => {
            const coupons = await couponService.getCoupons({
                includeAssociated: true,
            });

            expect(coupons).toBeDefined();
            expect(Array.isArray(coupons)).toBe(true);
            expect(coupons.length).toBeGreaterThan(0);

            const coupon = coupons[0];
            expect(coupon.categories).toBeDefined();
            expect(Array.isArray(coupon.categories)).toBe(true);
            expect(coupon.products).toBeDefined();
            expect(Array.isArray(coupon.products)).toBe(true);
        });
    });

    describe("getCoupon", () => {
        test("Get a specific coupon by ID", async () => {
            const couponID = "1";

            const coupon = await couponService.getCoupon(couponID);

            expect(coupon).toBeDefined();
            expect(coupon.couponID).toBe(couponID);
        });

        test("Get a specific coupon by ID with associated models", async () => {
            const couponID = "1";

            const coupon = await couponService.getCoupon(couponID, {
                includeAssociated: true,
            });

            expect(coupon).toBeDefined();
            expect(coupon.couponID).toBe(couponID);
            expect(coupon.categories).toBeDefined();
            expect(Array.isArray(coupon.categories)).toBe(true);
            expect(coupon.products).toBeDefined();
            expect(Array.isArray(coupon.products)).toBe(true);
        });

        test("Get a specific coupon by ID throws error if not found", async () => {
            const couponID = "999";

            await expect(couponService.getCoupon(couponID)).rejects.toThrow(
                ResourceNotFoundError
            );
        });
    });

    describe("updateCoupon", () => {
        test("Update a coupon", async () => {
            const couponID = "1";
            const updatedCouponData = {
                code: "SUMMER20",
                discountType: "percentage",
                discountValue: 10,
                minimumOrderAmount: 20,
            };

            const updatedCoupon = await couponService.updateCoupon(
                couponID,
                updatedCouponData
            );

            expect(updatedCoupon).toBeDefined();
            expect(updatedCoupon.couponID).toBe(couponID);
            expect(updatedCoupon.code).toBe(updatedCouponData.code);
            expect(updatedCoupon.discountType).toBe(
                updatedCouponData.discountType
            );
            expect(updatedCoupon.discountValue).toBe(
                updatedCouponData.discountValue
            );
            expect(updatedCoupon.minimumOrderAmount).toBe(
                updatedCouponData.minimumOrderAmount
            );
        });

        test("Update a coupon throws error if not found", async () => {
            const couponID = "999";
            const updatedCouponData = {
                code: "SUMMER20",
                discountType: "percentage",
                discountValue: 10,
                minimumOrderAmount: 20,
            };

            await expect(
                couponService.updateCoupon(couponID, updatedCouponData)
            ).rejects.toThrow(ResourceNotFoundError);
        });
    });

    describe("deleteCoupon", () => {
        test("Delete a coupon", async () => {
            const couponID = "2";

            await couponService.deleteCoupon(couponID);

            // Verify that the coupon is deleted
            await expect(couponService.getCoupon(couponID)).rejects.toThrow(
                ResourceNotFoundError
            );
        });

        test("Delete a coupon throws error if not found", async () => {
            const couponID = "999";

            await expect(couponService.deleteCoupon(couponID)).rejects.toThrow(
                ResourceNotFoundError
            );
        });
    });

    describe("calcFinalTotal", () => {
        test("Calculate final total based on all-target, percentage-typed coupon", async () => {
            const order = {
                subTotal: 50,
                products: [
                    {
                        variantID: "101",
                        price: 10,
                        productID: "1",
                        orderItem: {
                            quantity: 1,
                        },
                    },
                    {
                        variantID: "201",
                        price: 20,
                        productID: "2",
                        orderItem: {
                            quantity: 2,
                        },
                    },
                ],
            };

            const coupon = {
                discountType: "percentage",
                discountValue: 10,
                target: "all",
            };

            const finalTotal = await couponService.calcFinalTotal(
                order,
                coupon
            );

            expect(finalTotal).toBeDefined();
            expect(finalTotal).toEqual(45);
        });

        test("Calculate final total based on single-target, percentage-typed coupon", async () => {
            const order = {
                subTotal: 50,
                products: [
                    {
                        variantID: "101",
                        price: 10,
                        productID: "1",
                        orderItem: {
                            quantity: 1,
                        },
                    },
                    {
                        variantID: "201",
                        price: 20,
                        productID: "2",
                        orderItem: {
                            quantity: 2,
                        },
                    },
                ],
            };

            const coupon = {
                discountType: "percentage",
                discountValue: 10,
                target: "single",
                categories: [
                    {
                        name: "shorts",
                    },
                ],
            };

            const finalTotal = await couponService.calcFinalTotal(
                order,
                coupon
            );

            expect(finalTotal).toBeDefined();
            expect(finalTotal).toEqual(46);
        });

        test("Calculate final total based on all-target, fixed-typed coupon", async () => {
            const order = {
                subTotal: 50,
                products: [
                    {
                        variantID: "101",
                        price: 10,
                        productID: "1",
                        orderItem: {
                            quantity: 1,
                        },
                    },
                    {
                        variantID: "201",
                        price: 20,
                        productID: "2",
                        orderItem: {
                            quantity: 2,
                        },
                    },
                ],
            };

            const coupon = {
                discountType: "fixed",
                discountValue: 10,
                target: "all",
            };

            const finalTotal = await couponService.calcFinalTotal(
                order,
                coupon
            );

            expect(finalTotal).toBeDefined();
            expect(finalTotal).toEqual(40);
        });

        test("Calculate final total based on single-target, fixed-typed coupon", async () => {
            const order = {
                subTotal: 50,
                products: [
                    {
                        variantID: "101",
                        price: 10,
                        productID: "1",
                        orderItem: {
                            quantity: 1,
                        },
                    },
                    {
                        variantID: "201",
                        price: 20,
                        productID: "2",
                        orderItem: {
                            quantity: 2,
                        },
                    },
                ],
            };

            const coupon = {
                discountType: "fixed",
                discountValue: 3,
                target: "single",
                categories: [
                    {
                        name: "shorts",
                    },
                ],
            };

            const finalTotal = await couponService.calcFinalTotal(
                order,
                coupon
            );

            expect(finalTotal).toBeDefined();
            expect(finalTotal).toEqual(44);
        });
    });

    describe("applyCoupon", () => {
        test("Apply a coupon to the order", async () => {
            const couponCode = "SUMMER20";
            const coupon = await Coupon.findOne({
                where: { code: couponCode },
            });
            const order = await orderService.getOrder({ userID: "1" }, "1");

            const updatedOrder = await couponService.applyCoupon(
                order,
                couponCode
            );

            expect(updatedOrder).toBeDefined();
            expect(updatedOrder).toBeInstanceOf(Order);
            expect(updatedOrder.orderID).toBe(order.orderID);
            expect(updatedOrder.finalTotal).toBe(54);

            // Verify that the coupon is used
            const updatedCoupon = await Coupon.findOne({
                where: { code: couponCode },
            });

            await new Promise((resolve) => setTimeout(resolve, 1000)); // Add a delay of 1 second
            expect(updatedCoupon.timesUsed).toBe(coupon.timesUsed + 1);
        });

        test("Apply a coupon to the order throws error if coupon or order is not found", async () => {
            const couponCode = "INVALID_COUPON";
            const order = {};
            await expect(
                couponService.applyCoupon(order, couponCode)
            ).rejects.toThrow(ResourceNotFoundError);
        });
    });

    describe("getRecommendedCoupons", () => {
        test("Get recommended coupons for the order", async () => {
            const order = {
                subTotal: 110,
                products: [
                    {
                        variantID: "101",
                        price: 10,
                        productID: "1",
                        orderItem: {
                            quantity: 1,
                        },
                    },
                    {
                        variantID: "201",
                        price: 20,
                        productID: "2",
                        orderItem: {
                            quantity: 2,
                        },
                    },
                ],
            };

            const recommendedCoupons =
                await couponService.getRecommendedCoupons(order);

            expect(recommendedCoupons).toBeDefined();
            expect(Array.isArray(recommendedCoupons)).toBe(true);
            expect(recommendedCoupons[0].finalTotal).toBeLessThan(
                order.subTotal
            );
            expect(recommendedCoupons[0].coupon).toBeInstanceOf(Coupon);
        });
    });
});
