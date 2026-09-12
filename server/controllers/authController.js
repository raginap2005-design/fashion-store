const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const transporter = require("../config/email");


const register = async (req, res) => {
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

    res.status(201).json({
        message: "User registered successfully",
        user,
    });
};



const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;

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

    console.log("OTP:", otp);

    await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset OTP",
    text: `Your OTP is ${otp}`,
    });



    res.status(200).json({
        message: "OTP generated successfully",
    });


    
};




const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password",
        });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

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

    res.status(200).json({
        message: "Login successful",
        token,
        user,
    });
};

    const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
     
    if (!user) {
    return res.status(404).json({
        message: "User not found",
    });
}
    if (user.resetOTP !== otp) {
    return res.status(400).json({
        message: "Invalid OTP",
    });
}
    if (user.resetOTPExpire < new Date()) {
    return res.status(400).json({
        message: "OTP expired",
    });
} 
    return res.status(200).json({
    message: "OTP verified successfully",
});

    };

    const resetPassword = async (req, res) =>{
        const { email, newPassword } = req.body;
        const user = await  User.findOne({ email });
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

    }

module.exports = { register, login, forgotPassword, verifyOTP, resetPassword };