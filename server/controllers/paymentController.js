
const Razorpay = require("razorpay");
const crypto = require("crypto");

const Order = require("../models/orderModel");
const Payment = require("../models/paymentModel");
const Cart = require("../models/cartModel");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// =========================================
// CREATE RAZORPAY PAYMENT ORDER
// =========================================

const createPayment = async (req, res) => {
    try {
        const { orderId } = req.body;

        if (!orderId) {
            return res.status(400).json({
                message: "Order ID is required",
            });
        }

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

        if (
            order.status === "Cancelled" ||
            order.status === "Completed"
        ) {
            return res.status(400).json({
                message: "This order cannot be paid",
            });
        }

        if (
            order.paymentStatus === "Paid"
        ) {
            return res.status(400).json({
                message: "This order is already paid",
            });
        }

        if (
            order.paymentMethod &&
            order.paymentMethod !== "Razorpay"
        ) {
            return res.status(400).json({
                message: "This order is not a Razorpay order",
            });
        }

        const options = {
            amount: Math.round(order.totalPrice * 100),
            currency: "INR",
            receipt: order._id.toString(),
        };

        const razorpayOrder = await razorpay.orders.create(
            options
        );

        const payment = await Payment.create({
            user: req.user.id,
            order: order._id,
            razorpayOrderId: razorpayOrder.id,
            amount: order.totalPrice,
            status: "Created",
        });

        return res.status(201).json({
            message: "Payment order created successfully",
            razorpayOrder,
            payment,
        });
    } catch (error) {
        console.error("CREATE PAYMENT ERROR:", error);

        return res.status(500).json({
            message: "Payment order creation failed",
            error: error.message,
        });
    }
};

// =========================================
// VERIFY RAZORPAY PAYMENT
// =========================================

const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;

        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {
            return res.status(400).json({
                message: "Payment details are missing",
            });
        }

        const payment = await Payment.findOne({
            razorpayOrderId: razorpay_order_id,
            user: req.user.id,
        });

        if (!payment) {
            return res.status(404).json({
                message: "Payment record not found",
            });
        }

        const order = await Order.findById(payment.order);

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

        // Prevent duplicate processing
        if (
            payment.status === "Paid" &&
            order.paymentStatus === "Paid"
        ) {
            return res.status(200).json({
                message: "Payment already verified",
                payment,
                order,
            });
        }

        // Razorpay SHA-256 signature verification
        const generatedSignature = crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(
                `${razorpay_order_id}|${razorpay_payment_id}`
            )
            .digest("hex");

        // SHA-256 hex signature must contain 64 characters
        if (
            !/^[a-fA-F0-9]{64}$/.test(
                razorpay_signature
            )
        ) {
            return res.status(400).json({
                message: "Invalid payment signature",
            });
        }

        const generatedBuffer = Buffer.from(
            generatedSignature,
            "hex"
        );

        const receivedBuffer = Buffer.from(
            razorpay_signature,
            "hex"
        );

        if (
            generatedBuffer.length !== receivedBuffer.length ||
            !crypto.timingSafeEqual(
                generatedBuffer,
                receivedBuffer
            )
        ) {
            return res.status(400).json({
                message: "Payment verification failed",
            });
        }

        // Mark payment as paid
        payment.razorpayPaymentId =
            razorpay_payment_id;

        payment.razorpaySignature =
            razorpay_signature;

        payment.status = "Paid";
        await payment.save();

        // Update order status
        order.paymentStatus = "Paid";
        order.status = "Pending";
        await order.save();

        // Clear cart only after successful verification
        const cart = await Cart.findOne({
            user: req.user.id,
        });

        if (cart) {
            const orderedProductIds = order.items.map(
                (item) => item.product.toString()
            );

            cart.items = cart.items.filter((cartItem) => {
                const productId =
                    cartItem.product.toString();

                return !orderedProductIds.includes(
                    productId
                );
            });

            await cart.save();
        }

        // Notify connected clients
        const io = req.app.get("io");

        if (io) {
            io.emit("orderStatusUpdated", {
                orderId: order._id,
                status: order.status,
                userId: order.user.toString(),
            });
        }

        return res.status(200).json({
            message: "Payment verified successfully",
            payment,
            order,
        });
    } catch (error) {
        console.error("VERIFY PAYMENT ERROR:", error);

        return res.status(500).json({
            message: "Payment verification failed",
            error: error.message,
        });
    }
};

// =========================================
// EXPORTS
// =========================================

module.exports = {
    createPayment,
    verifyPayment,
};
