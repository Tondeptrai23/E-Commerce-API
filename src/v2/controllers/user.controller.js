class UserController {
    async getUsers(req, res) {
        res.json({ message: "Get users" });
    }

    async getUser(req, res) {
        res.json({ message: "Get a user" });
    }
}

export default new UserController();
