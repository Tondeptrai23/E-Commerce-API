class ProductController {
    async getProducts(req, res) {
        res.json({ message: "Get all products" });
    }

    async getProduct(req, res) {
        res.json({ message: "Get a product" });
    }

    async addProduct(req, res) {
        res.json({ message: "Add a product" });
    }

    async updateProduct(req, res) {
        res.json({ message: "Update a product" });
    }

    async deleteProduct(req, res) {
        res.json({ message: "Delete a product" });
    }
}

export default new ProductController();
