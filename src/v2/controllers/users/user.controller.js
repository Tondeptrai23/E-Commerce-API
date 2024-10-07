class UserController {
    async getUsers(req, res, next) {
        res.json({ message: "Get users" });
    }

    async getUser(req, res, next) {
        res.json({ message: "Get a user" });
    }
}

export default new UserController();
