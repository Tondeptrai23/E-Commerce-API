import UserSerializer from "../../services/serializers/user.serializer.service.js";
import userService from "../../services/users/user.service.js";
import { ResourceNotFoundError } from "../../utils/error.js";
import { StatusCodes } from "http-status-codes";

class UserController {
    async getUsers(req, res, next) {
        try {
            const { users, totalPages, totalItems, currentPage } =
                await userService.getAllUsers(req.query, {
                    includeDeleted: true,
                });

            // Serialize data
            const serializedUsers = UserSerializer.parse(users, {
                includeTimestamps: true,
            });

            res.status(StatusCodes.OK).json({
                success: true,
                currentPage: currentPage,
                totalPages: totalPages,
                totalItems: totalItems,
                users: serializedUsers,
            });
        } catch (err) {
            next(err);
        }
    }

    async getUser(req, res, next) {
        try {
            // Get params
            const { userID } = req.params;

            // Call services
            const user = await userService.getUser(userID, {
                includeDeleted: true,
            });

            // Serialize data
            const serializedUser = UserSerializer.parse(user, {
                includeTimestamps: true,
            });

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
                user: serializedUser,
            });
        } catch (err) {
            next(err);
        }
    }

    async createUser(req, res, next) {
        try {
            // Get request body
            const { name, role, email, password } = req.body;

            // Call services
            const user = await userService.createNewAccount({
                name,
                role,
                email,
                password,
                isVerified: true,
            });

            // Serialize data
            const serializedUser = UserSerializer.parse(user, {
                includeTimestamps: true,
            });

            // Response
            res.status(StatusCodes.CREATED).json({
                success: true,
                user: serializedUser,
            });
        } catch (err) {
            next(err);
        }
    }

    async updateUser(req, res, next) {
        try {
            // Get request body
            const { userID } = req.params;
            const { name, role } = req.body;

            // Call services
            const user = await userService.updateUser(userID, {
                name,
                role,
            });

            // Serialize data
            const serializedUser = UserSerializer.parse(user, {
                includeTimestamps: true,
            });

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
                user: serializedUser,
            });
        } catch (err) {
            next(err);
        }
    }

    async verifyUser(req, res, next) {
        try {
            // Get params
            const { userID } = req.params;

            // Call services
            const user = await userService.verifyUserAccount(userID);

            // Serialize data
            const serializedUser = UserSerializer.parse(user, {
                includeTimestamps: true,
            });

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
                user: serializedUser,
            });
        } catch (err) {
            next(err);
        }
    }

    async deleteUser(req, res, next) {
        try {
            // Get request body
            const { userID } = req.params;

            // Call services
            await userService.deleteUser(userID);

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
            });
        } catch (err) {
            next(err);
        }
    }
}

export default new UserController();
