class OrderController {
    async getOrders(req, res) {
        res.json({ message: "Get all orders" });
    }

    async getOrder(req, res) {
        res.json({ message: "Get an order" });
    }

    async postOrder(req, res) {
        res.json({ message: "Post an order" });
    }

    async updateOrder(req, res) {
        res.json({ message: "Update an order" });
    }

    async moveToCart(req, res) {
        res.json({ message: "Move to cart" });
    }

    async deleteOrder(req, res) {
        res.json({ message: "Delete an order" });
    }

    async deleteAllOrders(req, res) {
        res.json({ message: "Delete all orders" });
    }
}
export default new OrderController();
