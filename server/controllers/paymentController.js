const Razorpay = require("razorpay");
const crypto = require("crypto");

const Order = require("../models/orderModel");
const Payment = require("../models/paymentModel");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay Order
const createPayment = async (req, res) => {
    try {
        const { orderId } = req.body;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                message: "Order not found",
            });
        }

        if (order.user.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Access denied",
            });
        }

        if (order.status === "Cancelled") {
            return res.status(400).json({
                message: "Cancelled order cannot be paid",
            });
        }

        const options = {
            amount: order.totalPrice * 100,
            currency: "INR",
            receipt: order._id.toString(),
        };

        const razorpayOrder = await razorpay.orders.create(options);

        const payment = await Payment.create({
            user: req.user.id,
            order: order._id,
            razorpayOrderId: razorpayOrder.id,
            amount: order.totalPrice,
            status: "Created",
        });

        res.status(201).json({
            message: "Payment order created successfully",
            razorpayOrder,
            payment,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Payment order creation failed",
            error: error.message,
        });
    }
};


// Verify Razorpay Payment
const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;

        const payment = await Payment.findOne({
            razorpayOrderId: razorpay_order_id,
            user: req.user.id,
        });

        if (!payment) {
            return res.status(404).json({
                message: "Payment record not found",
            });
        }

        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(
                razorpay_order_id + "|" + razorpay_payment_id
            )
            .digest("hex");

        if (generatedSignature !== razorpay_signature) {
            payment.status = "Failed";
            await payment.save();

            return res.status(400).json({
                message: "Payment verification failed",
            });
        }

        payment.razorpayPaymentId = razorpay_payment_id;
        payment.razorpaySignature = razorpay_signature;
        payment.status = "Paid";

        await payment.save();

        const order = await Order.findById(payment.order);

        if (order) {
            order.status = "Completed";
            await order.save();
        }

        res.status(200).json({
            message: "Payment verified successfully",
            payment,
            order,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Payment verification failed",
            error: error.message,
        });
    }
};


module.exports = {
    createPayment,
    verifyPayment,
};