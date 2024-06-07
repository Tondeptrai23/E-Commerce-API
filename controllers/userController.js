import { StatusCodes } from "http-status-codes";
import { UserService } from "../services/userService.js";
import { UserAPIResponseSerializer } from "../utils/apiResponseSerializer.js";

class UserController {
    static getAllUsers = async (req, res) => {
        try {
            let { users, quantity } = await UserService.findAllUsers(req.query);

            users = users.map((user) => {
                return UserAPIResponseSerializer.serialize(user);
            });

            res.status(StatusCodes.OK).json({
                success: true,
                quantity: quantity,
                users: users,
            });
        } catch (err) {
            console.log(err);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
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

            res.status(StatusCodes.OK).json({
                success: true,
                user: user,
            });
        } catch (err) {
            console.log(err);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: "Error in getting user.",
            });
        }
    };
}

export { UserController };
