import { User } from "../models/userModel.js";
import { convertQueryToSequelizeCondition } from "../utils/utils.js";

import { Op } from "sequelize";
import bcrypt from "bcryptjs";

class UserService {
    static createNewAccount = async (userInfo) => {
        if (this.isUserExisted(userInfo.email) === true) {
            return null;
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(userInfo.password, salt);

        userInfo.password = hashPassword;
        const user = await User.create(userInfo);
        return user;
    };

    static findUserByEmail = async (email) => {
        const user = await User.findOne({
            where: { email: email },
            attributes: {
                exclude: ["updatedAt", "createdAt"],
            },
        });
        return user;
    };

    static isUserExisted = async (email) => {
        const user = await this.findUserByEmail(email);

        return { user: user, isExisted: user === null ? false : true };
    };

    static verifyUser = async (signedPassword, userPassword) => {
        const isCorrectPassword = await bcrypt.compare(
            signedPassword,
            userPassword
        );
        return isCorrectPassword;
    };

    static findUserById = async (id) => {
        const user = await User.findByPk(id);
        return user;
    };

    static findAllUsers = async (query) => {
        const conditions = convertQueryToSequelizeCondition(query, User);
        const { rows, count } = await User.findAndCountAll({
            where: {
                [Op.and]: conditions,
            },
            attributes: {
                exclude: ["updatedAt", "createdAt"],
            },
        });

        const users = rows;
        const quantity = count;
        return { users, quantity };
    };
}

export { UserService };
