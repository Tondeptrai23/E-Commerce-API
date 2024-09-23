import User from "../../models/user/user.model.js";

import bcrypt from "bcryptjs";
import {
    BadRequestError,
    ConflictError,
    ResourceNotFoundError,
} from "../../utils/error.js";

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

        if (await this.isUsernameTaken(userInfo.name)) {
            throw new ConflictError("Name is already taken");
        }

        const newUser = User.build(userInfo);

        bcrypt.genSalt(10).then((salt) => {
            bcrypt.hash(newUser.password, salt).then(async (hash) => {
                newUser.password = hash;
                await newUser.save();
            });
        });

        return newUser;
    }

    /**
     * Check if name is taken
     *
     * @param {String} name the user's name
     * @returns {Promise<Boolean>} whether the username is taken
     */
    async isUsernameTaken(name) {
        if (!name) {
            return false;
        }

        const user = await User.findOne({
            where: {
                name: name,
            },
        });

        return user ? true : false;
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
}

export default new UserService();
