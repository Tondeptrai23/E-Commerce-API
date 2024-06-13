class CartController {
    async getCart(req, res) {
        res.json({ message: "Get cart" });
    }
    async fetchCartToOrder(req, res) {
        res.json({ message: "Fetch cart to order" });
    }

    async updateCart(req, res) {
        res.json({ message: "Update cart" });
    }

    async deleteItem(req, res) {
        res.json({ message: "Delete item" });
    }

    async deleteCart(req, res) {
        res.json({ message: "Delete cart" });
    }
}

export default new CartController();
