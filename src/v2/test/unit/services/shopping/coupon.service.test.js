import couponService from "../../../../services/shopping/coupon.service.js";
import seedData from "../../../../seedData.js";
import {
    BadRequestError,
    ResourceNotFoundError,
} from "../../../../utils/error.js";
import Order from "../../../../models/shopping/order.model.js";
import orderService from "../../../../services/shopping/order.service.js";
import Coupon from "../../../../models/shopping/coupon.model.js";

beforeAll(async () => {
    await seedData();
}, 15000);

describe("CouponService", () => {
    describe("getCoupons", () => {
        test("Get all coupons", async () => {
            const { coupons } = await couponService.getCoupons();

            expect(coupons).toBeDefined();
            expect(Array.isArray(coupons)).toBe(true);
            expect(coupons.length).toBeGreaterThan(0);
        });

        //Filtering coupons
        test("Get all coupons with filtering", async () => {
            const { coupons } = await couponService.getCoupons({
                discountType: "percentage",
            });

            expect(coupons).toBeDefined();
            expect(Array.isArray(coupons)).toBe(true);
            expect(coupons.length).toBeGreaterThan(0);
            expect(
                coupons.every((coupon) => coupon.discountType === "percentage")
            ).toBe(true);
        });

        test("Get all coupons with filtering 2", async () => {
            const { coupons } = await couponService.getCoupons({
                discountType: "fixed",
                discountValue: "[gte]10",
            });

            expect(coupons).toBeDefined();
            expect(Array.isArray(coupons)).toBe(true);
            expect(coupons.length).toBeGreaterThan(0);
            expect(
                coupons.every(
                    (coupon) =>
                        coupon.discountType === "fixed" &&
                        coupon.discountValue >= 10
                )
            ).toBe(true);
        });

        test("Get all coupons with filtering 3", async () => {
            const { coupons } = await couponService.getCoupons({
                product: {
                    name: "[like]T-shirt",
                },
            });

            expect(coupons).toBeDefined();
            expect(Array.isArray(coupons)).toBe(true);
            expect(coupons.length).toBeGreaterThan(0);
            for (const coupon of coupons) {
                expect(
                    coupon.products.some((product) =>
                        product.name.toLowerCase().includes("t-shirt")
                    )
                ).toBe(true);
            }
        });

        test("Get all coupons with filtering 4", async () => {
            const { coupons } = await couponService.getCoupons({
                category: ["tops"],
            });

            expect(coupons).toBeDefined();
            expect(Array.isArray(coupons)).toBe(true);
            expect(coupons.length).toBeGreaterThan(0);

            for (const coupon of coupons) {
                const categoryNames = coupon.categories.map(
                    (category) => category.name
                );
                expect(
                    categoryNames.some(
                        (name) =>
                            name === "tops" ||
                            name === "blouse" ||
                            name === "tshirt"
                    )
                ).toBe(true);
            }
        });

        test("Get all coupons with filtering 5", async () => {
            const { coupons } = await couponService.getCoupons({
                product: {
                    productID: ["1", "2"],
                },
                categories: ["shorts"],
            });

            expect(coupons).toBeDefined();
            expect(Array.isArray(coupons)).toBe(true);
            expect(coupons.length).toBeGreaterThan(0);

            for (const coupon of coupons) {
                const productIDs = coupon.products.map(
                    (product) => product.productID
                );

                const categoryNames = coupon.categories.map(
                    (category) => category.name
                );
                expect(
                    categoryNames.some((name) => name === "shorts") ||
                        productIDs.some((id) => id === "1" || id === "2")
                ).toBe(true);
            }
        });

        //Sorting coupons
        test("Get all coupons with sorting", async () => {
            const { coupons } = await couponService.getCoupons({
                sort: ["discountValue"],
            });

            expect(coupons).toBeDefined();
            expect(Array.isArray(coupons)).toBe(true);
            expect(coupons.length).toBeGreaterThan(0);

            const sortedCoupons = [...coupons].sort(
                (a, b) => a.discountValue - b.discountValue
            );
            expect(coupons).toEqual(sortedCoupons);
        });

        test("Get all coupons with sorting 2", async () => {
            const { coupons } = await couponService.getCoupons({
                sort: ["-discountValue", "createdAt"],
            });

            expect(coupons).toBeDefined();
            expect(Array.isArray(coupons)).toBe(true);
            expect(coupons.length).toBeGreaterThan(0);

            const sortedCoupons = [...coupons].sort(
                (a, b) =>
                    b.discountValue - a.discountValue ||
                    a.createdAt - b.createdAt
            );
            expect(coupons).toEqual(sortedCoupons);
        });

        //Filtering and sorting coupons
        test("Get all coupons with filtering and sorting", async () => {
            const { coupons } = await couponService.getCoupons({
                discountType: "percentage",
                sort: ["discountValue"],
            });

            expect(coupons).toBeDefined();
            expect(Array.isArray(coupons)).toBe(true);
            expect(coupons.length).toBeGreaterThan(0);
            expect(
                coupons.every((coupon) => coupon.discountType === "percentage")
            ).toBe(true);

            const sortedCoupons = [...coupons].sort(
                (a, b) => a.discountValue - b.discountValue
            );
            expect(coupons).toEqual(sortedCoupons);
        });

        //Pagination for coupons
        test("Get all coupons with pagination", async () => {
            const { coupons, currentPage, totalPages, totalItems } =
                await couponService.getCoupons({
                    page: 1,
                    size: 5,
                });

            expect(coupons).toBeDefined();
            expect(Array.isArray(coupons)).toBe(true);
            expect(coupons.length).toBeLessThanOrEqual(5);
            expect(currentPage).toBe(1);
            expect(totalPages).toBeGreaterThan(0);
            expect(totalItems).toBeGreaterThan(0);
        });

        test("Get all coupons with pagination 2", async () => {
            const { coupons, currentPage, totalPages, totalItems } =
                await couponService.getCoupons({
                    page: 2,
                    size: 3,
                });

            expect(coupons).toBeDefined();
            expect(Array.isArray(coupons)).toBe(true);
            expect(coupons.length).toBeLessThanOrEqual(5);
            expect(currentPage).toBe(2);
            expect(totalPages).toBeGreaterThan(0);
            expect(totalItems).toBeGreaterThan(0);
        });

        test("Get all coupons with pagination 3", async () => {
            const { coupons, currentPage, totalPages, totalItems } =
                await couponService.getCoupons();

            expect(coupons).toBeDefined();
            expect(Array.isArray(coupons)).toBe(true);
            expect(coupons.length).toBeLessThanOrEqual(5);
            expect(currentPage).toBe(1);
            expect(totalPages).toBeGreaterThan(0);
            expect(totalItems).toBeGreaterThan(0);
        });

        //Combining filtering, sorting, and pagination
        test("Get all coupons with filtering, sorting, and pagination", async () => {
            const { coupons, currentPage, totalPages, totalItems } =
                await couponService.getCoupons({
                    discountType: "percentage",
                    sort: ["discountValue"],
                    page: 1,
                    size: 2,
                });

            expect(coupons).toBeDefined();
            expect(Array.isArray(coupons)).toBe(true);
            expect(coupons.length).toBeLessThanOrEqual(2);
            expect(currentPage).toBe(1);
            expect(totalPages).toBeGreaterThan(0);
            expect(totalItems).toBeGreaterThan(0);
            expect(
                coupons.every((coupon) => coupon.discountType === "percentage")
            ).toBe(true);

            const sortedCoupons = [...coupons].sort(
                (a, b) => a.discountValue - b.discountValue
            );
            expect(coupons).toEqual(sortedCoupons);
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
            expect(createdCoupon.categories).toBeDefined();
            expect(Array.isArray(createdCoupon.categories)).toBe(true);
            expect(createdCoupon.categories.length).toBeGreaterThan(0);
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
            expect(createdCoupon.products).toBeDefined();
            expect(Array.isArray(createdCoupon.products)).toBe(true);
            expect(createdCoupon.products.length).toBeGreaterThan(0);
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
            expect(createdCoupon.categories).toBeUndefined();
            expect(createdCoupon.products).toBeUndefined();
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

        test("Update a coupon throws error if invalid data", async () => {
            const couponID = "1";
            const updatedCouponData = {
                discountType: "percentage",
                minimumOrderAmount: 101,
            };

            await expect(
                couponService.updateCoupon(couponID, updatedCouponData)
            ).rejects.toThrow(BadRequestError);
        });

        test("Update a coupon throws error if invalid data 2", async () => {
            const couponID = "1";
            const updatedCouponData = {
                startDate: new Date("2024/8/1"),
                endDate: new Date("2024/7/12"),
            };

            await expect(
                couponService.updateCoupon(couponID, updatedCouponData)
            ).rejects.toThrow(BadRequestError);
        });
    });

    describe("disableCoupon", () => {
        test("disable a coupon", async () => {
            const couponID = "9";

            await couponService.disableCoupon(couponID);

            const disabledCoupon = await Coupon.findByPk(couponID);
            expect(disabledCoupon).toBeDefined();
            expect(disabledCoupon.maxUsage).toBe(0);
        });

        test("disable a coupon throws error if not found", async () => {
            const couponID = "999";

            await expect(couponService.disableCoupon(couponID)).rejects.toThrow(
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
            const couponCode = "20OFF_SHORTS";
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
            expect(updatedOrder.finalTotal).toBe(52);

            // Verify that the coupon is used
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Add a delay of 1 second

            const updatedCoupon = await Coupon.findOne({
                where: { code: couponCode },
            });
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
