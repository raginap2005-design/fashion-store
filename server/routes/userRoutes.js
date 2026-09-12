const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get("/profile", authMiddleware, (req, res) => {
    res.status(200).json({
        message: "Profile accessed successfully",
        user: req.user,
    });
});

router.get(
    "/admin",
    authMiddleware,
    roleMiddleware(["admin"]),
    (req, res) => {
        res.status(200).json({
            message: "Welcome Admin",
            user: req.user,
        });
    }
);


module.exports = router;