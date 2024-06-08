import { UserService } from "../services/userService.js";
import { jwt } from "../config/authConfig.js";
import { UserAPIResponseSerializer } from "../utils/apiResponseSerializer.js";
import { BadRequestError } from "../utils/error.js";
import { StatusCodes } from "http-status-codes";

class AuthController {
    static signUp = async (req, res, next) => {
        try {
            const userInfo = {
                email: req.body.email,
                password: req.body.password,
                role: req.body.role,
            };

            await UserService.createNewAccount(userInfo);
            res.status(StatusCodes.CREATED).json({
                success: true,
            });
        } catch (err) {
            console.log(err);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: "Error in signing up",
            });
        }
    };

    static signIn = async (req, res, next) => {
        try {
            const isCorrectPassword = await UserService.verifyUser(
                req.body.password,
                req.user.password
            );

            if (!isCorrectPassword) {
                throw new BadRequestError("Wrong email/password");
            }

            const EXPIRED_TIME = 120000;
            const token = await jwt.sign({ id: req.user.id }, jwt.secretKey, {
                algorithm: jwt.algorithm,
                allowInsecureKeySizes: true,
                expiresIn: EXPIRED_TIME,
            });

            await res.status(StatusCodes.OK).json({
                success: true,
                accessToken: token,
                user: UserAPIResponseSerializer.serialize(req.user),
            });
        } catch (err) {
            console.log(err);
            if (err instanceof BadRequestError) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    error: err.message,
                });
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    error: "Error in signing in",
                });
            }
        }
    };
}
export { AuthController };
