import User from "../../models/user/user.model.js";
import PaginationBuilder from "../condition/paginationBuilder.service.js";
import UserFilterBuilder from "../condition/filter/userFilterBuilder.service.js";
import UserSortBuilder from "../condition/sort/userSortBuilder.service.js";

import bcrypt from "bcryptjs";
import { ConflictError, ResourceNotFoundError } from "../../utils/error.js";
import CartItem from "../../models/shopping/cartItem.model.js";
import Order from "../../models/shopping/order.model.js";
import { db } from "../../models/index.model.js";

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
     * Check if the user is existed (even if the user is deleted)
     *
     * @param {String} email The email of the user
     * @returns {Promise<{user: User, isExisted: Boolean}>} The user and whether the user is existed
     */
    async isUserExisted(email) {
        const user = await User.findOne({
            where: {
                email: email,
            },
            paranoid: false,
        });

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
     * @param {Object} options The options for getting the user
     * @returns {Promise<User>} The user
     * @throws {ResourceNotFoundError} If the user is not found
     */
    async getUser(userID, options = { includeDeleted: false }) {
        const user = await User.findByPk(userID, {
            paranoid: !options.includeDeleted,
        });

        if (!user) {
            throw new ResourceNotFoundError("User not found");
        }

        return user;
    }

    /**
     *
     */
    async getAllUsers(query, options = { includeDeleted: false }) {
        const conditions = this.#buildConditions(query);

        const { count, rows: users } = await User.findAndCountAll({
            where: conditions.userFilter,
            order: conditions.sortingCondition,
            ...conditions.paginationConditions,
            paranoid: !options.includeDeleted,
        });

        return {
            currentPage:
                conditions.paginationConditions.offset /
                    conditions.paginationConditions.limit +
                1,
            totalPages: Math.ceil(
                count / conditions.paginationConditions.limit
            ),
            totalItems: count,
            users: users,
        };
    }

    /**
     * Update user information
     *
     * @param {String} userID The ID of the user
     * @param {Object} updatedInfo The updated information
     * @returns {Promise<User>} The updated user
     * @throws {ConflictError} If the email already exists
     */
    async updateUser(userID, updatedInfo) {
        if (updatedInfo.email) {
            const { isExisted } = await this.isUserExisted(updatedInfo.email);
            if (isExisted) {
                throw new ConflictError("Email already exists");
            }
        }

        if (updatedInfo.password) {
            const salt = await bcrypt.genSalt(10);
            updatedInfo.password = await bcrypt.hash(
                updatedInfo.password,
                salt
            );
        }

        let user = await this.getUser(userID);

        user = await user.update(updatedInfo);

        return user;
    }

    /**
     * Verify user
     *
     * @param {String} userID The ID of the user
     * @returns {Promise<User>} The verified user
     */
    async verifyUserAccount(userID) {
        let user = await this.getUser(userID);

        user.isVerified = true;
        user = await user.save();

        return user;
    }

    /**
     * Delete user
     *
     * @param {String} userID The ID of the user
     * @returns {Promise<User>} The deleted user
     */
    async deleteUser(userID) {
        return await db
            .transaction(async (t) => {
                let user = await this.getUser(userID);

                await CartItem.destroy({
                    where: { userID: userID },
                });

                await Order.destroy({
                    where: { userID: userID, status: "pending" },
                });

                user = await user.destroy();

                return user;
            })
            .catch((error) => {
                throw error;
            });
    }

    /*
     *
     *
     *
     */

    /**
     * Build conditions for getting all users
     *
     * @param {Object} query The query object
     * @returns {Object} The conditions
     */
    #buildConditions(query) {
        const paginationConditions = new PaginationBuilder(query).build();
        const userFilter = new UserFilterBuilder(query).build();
        const sortingCondition = new UserSortBuilder(query).build();

        if (query.isVerified !== null && query.isVerified !== undefined) {
            userFilter.push({ isVerified: query.isVerified });
        }

        return {
            userFilter,
            sortingCondition,
            paginationConditions,
        };
    }
}

export default new UserService();
