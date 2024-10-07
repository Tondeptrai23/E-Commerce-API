import User from "../../models/user/user.model.js";

import bcrypt from "bcryptjs";
import { ConflictError, ResourceNotFoundError } from "../../utils/error.js";

class UserService {
    /**
     * Create new user account
     *
     * @param {Object} userInfo the user information
     * @returns {Promise<User>} the new user
     */
    async createNewAccount(userInfo) {
        let { user, isExisted } = await this.isUserExisted(userInfo.email);
        if (isExisted === true) {
            throw new ConflictError("Email already exists");
        }

        const newUser = User.build(userInfo);

        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(newUser.password, salt);
        await newUser.save();

        return newUser;
    }

    /**
     * Find user by email
     *
     * @param {String} email The email of the user
     * @returns {Promise<User>} The user
     */
    async findUserByEmail(email) {
        const user = await User.findOne({
            where: { email: email },
            attributes: {
                exclude: ["updatedAt", "createdAt"],
            },
        });
        return user;
    }

    /**
     * Check if the user is existed
     *
     * @param {String} email The email of the user
     * @returns {Promise<{user: User, isExisted: Boolean}>} The user and whether the user is existed
     */
    async isUserExisted(email) {
        const user = await this.findUserByEmail(email);

        return { user: user, isExisted: user === null ? false : true };
    }

    /**
     * Check if the password is correct
     *
     * @param {String} signedPassword The signed password (the input)
     * @param {String} userPassword The user's password (the stored password)
     * @returns {Promise<Boolean>} Whether the password is correct
     */
    async verifyUser(signedPassword, userPassword) {
        const isCorrectPassword = await bcrypt.compare(
            signedPassword,
            userPassword
        );
        return isCorrectPassword;
    }

    /**
     * Get user by ID
     *
     * @param {String} userID The ID of the user
     * @returns {Promise<User>} The user
     * @throws {ResourceNotFoundError} If the user is not found
     */
    async getUser(userID) {
        const user = await User.findByPk(userID);

        if (!user) {
            throw new ResourceNotFoundError("User not found");
        }

        return user;
    }

    /**
     * Get all users
     */
    async getAllUsers() {
        const { rows, count } = await User.findAndCountAll();

        const users = rows;
        const quantity = count;
        return { users, quantity };
    }

    /**
     * Reset password
     *
     * @param {User} user The user
     * @param {String} newPassword The new password
     * @returns {Promise<User>} The updated user
     */
    async resetPassword(user, newPassword) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user = await user.save();

        return user;
    }
}

export default new UserService();
