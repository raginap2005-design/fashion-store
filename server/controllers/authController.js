
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const resend = require("../config/email");

// REGISTER
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("REGISTER ERROR:", error.message);
        return res.status(500).json({
            message: "Registration failed",
        });
    }
};

// GENERATE OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// FORGOT PASSWORD - SEND OTP
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email is required",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const otp = generateOTP();

        user.resetOTP = otp;
        user.resetOTPExpire = new Date(Date.now() + 5 * 60 * 1000);

        await user.save();

       const { data, error } = await resend.emails.send({
    from: "StyleHub <onboarding@resend.dev>",
    to: [email],
    subject: "StyleHub Password Reset OTP",
    text: `Your StyleHub password reset OTP is ${otp}. It is valid for 5 minutes.`,
});

if (error) {
    console.error("RESEND EMAIL ERROR:", error);
    throw new Error("Failed to send OTP email");
}

console.log("OTP email sent successfully:", data);

        console.log("OTP email sent successfully");

        return res.status(200).json({
            message: "OTP sent successfully. Please check your email.",
        });
    } catch (error) {
        console.error("FORGOT PASSWORD ERROR:", error);

        return res.status(500).json({
            message: "Failed to send OTP. Please check the backend logs.",
        });
    }
};

// LOGIN
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password",
            });
        }

        const isPasswordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Invalid email or password",
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("LOGIN ERROR:", error.message);

        return res.status(500).json({
            message: "Login failed",
        });
    }
};

// VERIFY OTP
const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        if (
            !user.resetOTP ||
            user.resetOTP !== String(otp)
        ) {
            return res.status(400).json({
                message: "Invalid OTP",
            });
        }

        if (
            !user.resetOTPExpire ||
            user.resetOTPExpire < new Date()
        ) {
            return res.status(400).json({
                message: "OTP expired. Please request a new OTP.",
            });
        }

        return res.status(200).json({
            message: "OTP verified successfully",
        });
    } catch (error) {
        console.error("VERIFY OTP ERROR:", error.message);

        return res.status(500).json({
            message: "OTP verification failed",
        });
    }
};

// RESET PASSWORD
const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res.status(400).json({
                message: "Email and new password are required",
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                message: "Password must contain at least 6 characters",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetOTP = undefined;
        user.resetOTPExpire = undefined;

        await user.save();

        return res.status(200).json({
            message: "Password reset successfully",
        });
    } catch (error) {
        console.error("RESET PASSWORD ERROR:", error.message);

        return res.status(500).json({
            message: "Password reset failed",
        });
    }
};

module.exports = {
    register,
    login,
    forgotPassword,
    verifyOTP,
    resetPassword,
};
