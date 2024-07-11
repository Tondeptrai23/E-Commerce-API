class CategoryController {
    async getCategories(req, res) {
        res.json({ message: "Get all categories" });
    }

    async getCategory(req, res) {
        res.json({ message: "Get a category" });
    }

    async addCategory(req, res) {
        res.json({ message: "Add a category" });
    }

    async updateCategory(req, res) {
        res.json({ message: "Update a category" });
    }

    async deleteCategory(req, res) {
        res.json({ message: "Delete a category" });
    }
}

export default new CategoryController();
