const User = require("../models/userModel");

// Get all users - Admin
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select("-password -resetOTP -resetOTPExpire")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Users fetched successfully",
            users,
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

module.exports = {
    getAllUsers,
};