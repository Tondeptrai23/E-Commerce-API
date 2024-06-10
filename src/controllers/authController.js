import { UserService } from "../services/userService.js";
import { UserAPIResponseSerializer } from "../utils/apiResponseSerializer.js";
import { BadRequestError } from "../utils/error.js";
import { StatusCodes } from "http-status-codes";
import { TokenService } from "../services/tokenService.js";

class AuthController {
    static signUp = async (req, res) => {
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

    static signIn = async (req, res) => {
        try {
            const isCorrectPassword = await UserService.verifyUser(
                req.body.password,
                req.user.password
            );

            if (!isCorrectPassword) {
                throw new BadRequestError("Wrong email/password");
            }

            const accessToken = await TokenService.signToken({
                id: req.user.id,
            });

            const refreshToken = await TokenService.createRefreshToken(
                req.user.id
            );

            await res.status(StatusCodes.OK).json({
                success: true,
                accessToken: accessToken,
                refreshToken: refreshToken,
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

    static refresh = async (req, res) => {
        try {
            const accessToken = await TokenService.signToken({
                id: req.user.id,
            });

            res.status(StatusCodes.CREATED).json({
                success: true,
                accessToken: accessToken,
            });
        } catch (err) {
            console.log(err);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: "Error in refreshing access token",
            });
        }
    };

    static resetToken = async (req, res) => {
        try {
            const refreshToken = await TokenService.createRefreshToken(
                req.user.id
            );

            const accessToken = await TokenService.signToken({
                id: req.user.id,
            });

            res.status(StatusCodes.OK).json({
                success: true,
                accessToken: accessToken,
                refreshToken: refreshToken,
            });
        } catch (err) {
            console.log(err);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: "Error in reseting refresh token",
            });
        }
    };
}
export { AuthController };
