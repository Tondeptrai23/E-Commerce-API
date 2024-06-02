import { UserService } from "../services/userService.js";
import { jwt } from "../config/authConfig.js";
import { UserAPIResponseSerializer } from "../utils/apiResponseSerializer.js";

class AuthController {
    static signUp = async (req, res, next) => {
        try {
            const userInfo = {
                email: req.body.email,
                password: req.body.password,
                role: req.body.role,
            };

            // Validate
            if (userInfo.role !== "ROLE_ADMIN") {
                userInfo.role = "ROLE_USER";
            }

            await UserService.createNewAccount(userInfo);
            res.status(201).json({
                success: true,
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                success: false,
                error: "Error in signing up.",
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
                res.status(400).json({
                    success: false,
                    error: "Wrong email/password.",
                });
                return;
            }

            const EXPIRED_TIME = 120000;
            const token = await jwt.sign({ id: req.user.id }, jwt.secretKey, {
                algorithm: jwt.algorithm,
                allowInsecureKeySizes: true,
                expiresIn: EXPIRED_TIME,
            });

            await res.status(200).json({
                success: true,
                accessToken: token,
                user: UserAPIResponseSerializer.serialize(req.user),
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                success: false,
                error: "Error in signing in.",
            });
        }
    };
}
export { AuthController };
