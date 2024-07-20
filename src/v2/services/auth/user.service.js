import User from "../../models/user/user.model.js";

import bcrypt from "bcryptjs";

class UserService {
    async createNewAccount(userInfo) {
        let { user, isExisted } = await this.isUserExisted(userInfo.email);
        if (isExisted === true) {
            return null;
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

    async findUserByEmail(email) {
        const user = await User.findOne({
            where: { email: email },
            attributes: {
                exclude: ["updatedAt", "createdAt"],
            },
        });
        return user;
    }

    async isUserExisted(email) {
        const user = await this.findUserByEmail(email);

        return { user: user, isExisted: user === null ? false : true };
    }

    async verifyUser(signedPassword, userPassword) {
        const isCorrectPassword = await bcrypt.compare(
            signedPassword,
            userPassword
        );
        return isCorrectPassword;
    }

    async getUser(id) {
        const user = await User.findByPk(id, {
            attributes: {
                exclude: ["updatedAt", "createdAt"],
            },
        });

        return user;
    }

    async getAllUsers() {
        const { rows, count } = await User.findAndCountAll({
            attributes: {
                exclude: ["updatedAt", "createdAt"],
            },
        });

        const users = rows;
        const quantity = count;
        return { users, quantity };
    }
}

export default new UserService();
