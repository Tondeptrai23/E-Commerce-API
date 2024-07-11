class CouponController {
    async getCoupons(req, res) {
        res.json({ message: "Get all coupons" });
    }

    async getCoupon(req, res) {
        res.json({ message: "Get a coupon" });
    }

    async addCoupon(req, res) {
        res.json({ message: "Add a coupon" });
    }

    async updateCoupon(req, res) {
        res.json({ message: "Update a coupon" });
    }

    async deleteCoupon(req, res) {
        res.json({ message: "Delete a coupon" });
    }
}

export default new CouponController();
