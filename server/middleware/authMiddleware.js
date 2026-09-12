const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        console.log("TOKEN RECEIVED:", token);

        if (!token) {
            return res.status(401).json({
                message: "Access denied. No token provided",
            });
        }
        console.log("JWT SECRET LOADED:", !!process.env.JWT_SECRET);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

console.log("DECODED TOKEN:", decoded);

        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
};

module.exports = authMiddleware;