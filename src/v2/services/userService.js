import { User } from "../models/userModel.js";

import { Op } from "sequelize";
import bcrypt from "bcryptjs";
import SequelizeQueryBuilder from "./sequelizeQueryBuilder.js";

class UserService {
    static createNewAccount = async (userInfo) => {
        let { user, isExisted } = await this.isUserExisted(userInfo.email);
        if (isExisted === true) {
            return null;
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(userInfo.password, salt);

        userInfo.password = hashPassword;
        return await User.create(userInfo);
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
        const queryBuilder = new SequelizeQueryBuilder();
        const filterConditions = queryBuilder.convertFilterCondition(query);
        const orderConditions = queryBuilder.convertSortCondition(query);

        const { rows, count } = await User.findAndCountAll({
            where: {
                [Op.and]: filterConditions,
            },
            attributes: {
                exclude: ["updatedAt", "createdAt"],
            },
            order: orderConditions,
        });

        const users = rows;
        const quantity = count;
        return { users, quantity };
    };
}

export { UserService };
