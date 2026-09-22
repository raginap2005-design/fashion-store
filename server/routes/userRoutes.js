const express = require("express");

const {
    getAllUsers,
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// Admin - Get all users
router.get(
    "/all",
    authMiddleware,
    roleMiddleware(["admin"]),
    getAllUsers
);

module.exports = router;