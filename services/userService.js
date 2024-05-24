import { User } from "../models/userModel.js";
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

    static findUser = async (email) => {
        const user = await User.findOne({
            where: { email: email },
            attributes: {
                exclude: ["updatedAt", "createdAt"],
            },
        });
        return user;
    };

    static isUserExisted = async (email) => {
        const user = await this.findUser(email);

        return { user: user, isExisted: user === null ? false : true };
    };

    static verifyUser = async (signedPassword, userPassword) => {
        const isCorrectPassword = await bcrypt.compare(
            signedPassword,
            userPassword
        );
        return isCorrectPassword;
    };
}

export { UserService };
