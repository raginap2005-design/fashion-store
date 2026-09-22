const express = require("express");

const {
    createPayment,
    verifyPayment,
} = require("../controllers/paymentController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create Razorpay payment order
router.post(
    "/create",
    authMiddleware,
    createPayment
);

// Verify Razorpay payment
router.post(
    "/verify",
    authMiddleware,
    verifyPayment
);

module.exports = router;