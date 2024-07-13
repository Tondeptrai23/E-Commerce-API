import couponService from "../../../services/shopping/coupon.service.js";
import seedData from "../../../seedData.js";
import { ResourceNotFoundError } from "../../../utils/error.js";

beforeAll(async () => {
    await seedData();
});

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
});
