import { jwt } from "../config/authConfig.js";
import { User } from "../models/userModel.js";

const verifyToken = async (req, res, next) => {
    try {
        let token = req.header("Authorization").replace("Bearer ", "");
        if (!token) {
            res.status(403).json({
                success: false,
                error: "Not authenticated",
            });
            return;
        }
        const decoded = await jwt.verify(token, jwt.secretKey, {
            algorithms: jwt.algorithm,
        });

        req.user = await User.findByPk(decoded.id);

        next();
    } catch (err) {
        console.log(err);
        if (err instanceof jwt.JsonWebTokenError) {
            res.status(403).json({
                success: false,
                error: "Token invalid.",
            });
        } else {
            res.status(500).json({
                success: false,
                error: "Error in verifying token.",
            });
        }
    }
};

const isAdmin = async (req, res, next) => {
    try {
        if (req.user.role === "ROLE_ADMIN") {
            req.admin = req.user;
            if (req.params.userId !== undefined) {
                req.user = await User.findByPk(req.params.userId);
            }

            next();
            return;
        }

        res.status(403).json({
            success: false,
            error: "Cannot retrieve administrative data.",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            error: "Error in verifying role.",
        });
    }
};

export { verifyToken, isAdmin };
