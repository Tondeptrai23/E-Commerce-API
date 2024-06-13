class AuthController {
    async signin(req, res) {
        res.json({ message: "Signin" });
    }

    async signup(req, res) {
        res.json({ message: "Signup" });
    }

    async refreshToken(req, res) {
        res.json({ message: "Refressh token" });
    }

    async resetRefreshToken(req, res) {
        res.json({ message: "Reset refresh token" });
    }
}

export default new AuthController();
