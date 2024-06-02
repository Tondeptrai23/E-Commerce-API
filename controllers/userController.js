import { UserService } from "../services/userService.js";
import { UserAPIResponseSerializer } from "../utils/apiResponseSerializer.js";

class UserController {
    static getAllUsers = async (req, res) => {
        try {
            let { users, quantity } = await UserService.findAllUsers(req.query);

            users = users.map((user) => {
                return UserAPIResponseSerializer.serialize(user);
            });

            res.status(200).json({
                success: true,
                quantity: quantity,
                users: users,
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                success: false,
                error: "Error in getting all users.",
            });
        }
    };

    static getUser = async (req, res) => {
        try {
            const userId = req.params.userId;
            let user = await UserService.findUserById(userId);

            user = UserAPIResponseSerializer.serialize(user);

            res.status(200).json({
                success: true,
                user: user,
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                success: false,
                error: "Error in getting user.",
            });
        }
    };
}

export { UserController };
