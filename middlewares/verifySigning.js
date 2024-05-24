import { UserService } from "../services/userService.js";

const checkEmailExistsForSignIn = async (req, res, next) => {
    const { user, isExisted } = await UserService.isUserExisted(req.body.email);

    if (!isExisted) {
        res.status(400).json({
            success: false,
            error: "Email does not exist",
        });
    } else {
        req.user = user;
        next();
    }
};

const checkEmailNotExistsForSignUp = async (req, res, next) => {
    const { user, isExisted } = await UserService.isUserExisted(req.body.email);

    if (isExisted) {
        res.status(400).json({
            success: false,
            error: "Email exists! Cannot create account.",
        });
    } else next();
};

export { checkEmailExistsForSignIn, checkEmailNotExistsForSignUp };
