import { jwt } from "../config/authConfig.js";
import { User } from "../models/userModel.js";

const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers["x-access-token"];
        if (!token) {
            res.status(401).json({
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
        res.status(500).json({
            success: false,
            error: "Error in verifying token.",
        });
    }
};

const isAdmin = async (req, res, next) => {
    try {
        if (req.user.role === "ROLE_ADMIN") {
            next();
            return;
        }

        res.status(400).json({
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
