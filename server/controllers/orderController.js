
const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

// =========================================
// CREATE ORDER FROM CART
// =========================================

const createOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            paymentMethod = "Razorpay",
        } = req.body;

        if (!["COD", "Razorpay"].includes(paymentMethod)) {
            return res.status(400).json({
                message: "Invalid payment method",
            });
        }

        const cart = await Cart.findOne({
            user: userId,
        }).populate("items.product");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                message: "Your cart is empty",
            });
        }

        let totalPrice = 0;
        const orderItems = [];

        // Validate products and stock
        for (const item of cart.items) {
            const product = item.product;

            if (!product) {
                return res.status(404).json({
                    message: "Product not found",
                });
            }

            if (
                !Number.isInteger(item.quantity) ||
                item.quantity < 1
            ) {
                return res.status(400).json({
                    message: `Invalid quantity for ${product.name}`,
                });
            }

            if (item.quantity > product.stock) {
                return res.status(400).json({
                    message: `Not enough stock for ${product.name}`,
                });
            }

            totalPrice += product.price * item.quantity;

            orderItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
            });
        }

        // Reduce stock only if enough stock remains
        const reservedItems = [];

        for (const item of orderItems) {
            const updatedProduct =
                await Product.findOneAndUpdate(
                    {
                        _id: item.product,
                        stock: { $gte: item.quantity },
                    },
                    {
                        $inc: {
                            stock: -item.quantity,
                        },
                    },
                    {
                        new: true,
                    }
                );

            if (!updatedProduct) {
                // Restore stock reserved earlier in this request
                for (const reserved of reservedItems) {
                    await Product.findByIdAndUpdate(
                        reserved.product,
                        {
                            $inc: {
                                stock: reserved.quantity,
                            },
                        }
                    );
                }

                return res.status(400).json({
                    message:
                        `Insufficient stock for ${item.name}. Please try again.`,
                });
            }

            reservedItems.push({
                product: item.product,
                quantity: item.quantity,
            });
        }

        let order;

        try {
            order = await Order.create({
                user: userId,
                items: orderItems,
                totalPrice,
                paymentMethod,
                paymentStatus: "Pending",
                status: "Pending",
            });
        } catch (error) {
            // Restore stock if order creation fails
            for (const reserved of reservedItems) {
                await Product.findByIdAndUpdate(
                    reserved.product,
                    {
                        $inc: {
                            stock: reserved.quantity,
                        },
                    }
                );
            }

            throw error;
        }

        // COD: order placed, clear cart now
        // Razorpay: retain cart until payment verification
        if (paymentMethod === "COD") {
            cart.items = [];
            await cart.save();
        }

        const io = req.app.get("io");

        if (io) {
            io.emit("newOrder", {
                message: "New order placed",
                order,
            });
        }

        return res.status(201).json({
            message:
                paymentMethod === "COD"
                    ? "COD order placed successfully"
                    : "Order created. Complete payment to confirm.",
            order,
        });
    } catch (error) {
        console.error("CREATE ORDER ERROR:", error);

        return res.status(500).json({
            message: "Unable to create order",
            error: error.message,
        });
    }
};

// =========================================
// GET LOGGED-IN USER'S ORDERS
// =========================================

const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            user: req.user.id,
        })
            .populate("items.product")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Orders fetched successfully",
            orders,
        });
    } catch (error) {
        console.error("GET MY ORDERS ERROR:", error);

        return res.status(500).json({
            message: "Unable to fetch orders",
            error: error.message,
        });
    }
};

// =========================================
// GET SINGLE ORDER
// =========================================

const getOrderById = async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user.id,
        }).populate("items.product");

        if (!order) {
            return res.status(404).json({
                message: "Order not found",
            });
        }

        return res.status(200).json({
            message: "Order fetched successfully",
            order,
        });
    } catch (error) {
        console.error("GET ORDER ERROR:", error);

        return res.status(500).json({
            message: "Unable to fetch order",
            error: error.message,
        });
    }
};

// =========================================
// CANCEL ORDER
// =========================================

const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user.id,
        });

        if (!order) {
            return res.status(404).json({
                message: "Order not found",
            });
        }

        if (order.status !== "Pending") {
            return res.status(400).json({
                message: "Only pending orders can be cancelled",
            });
        }

        if (order.paymentStatus === "Paid") {
            return res.status(400).json({
                message:
                    "Paid orders require a refund process",
            });
        }

        order.status = "Cancelled";
        await order.save();

        // Restore reserved stock once when order is cancelled
        for (const item of order.items) {
            await Product.findByIdAndUpdate(
                item.product,
                {
                    $inc: {
                        stock: item.quantity,
                    },
                }
            );
        }

        const io = req.app.get("io");

        if (io) {
            io.emit("orderStatusUpdated", {
                orderId: order._id,
                status: order.status,
                userId: order.user.toString(),
            });
        }

        return res.status(200).json({
            message: "Order cancelled successfully",
            order,
        });
    } catch (error) {
        console.error("CANCEL ORDER ERROR:", error);

        return res.status(500).json({
            message: "Unable to cancel order",
            error: error.message,
        });
    }
};

// =========================================
// GET ALL ORDERS - ADMIN
// =========================================

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "name email")
            .populate("items.product")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "All orders fetched successfully",
            orders,
        });
    } catch (error) {
        console.error("GET ALL ORDERS ERROR:", error);

        return res.status(500).json({
            message: "Unable to fetch orders",
            error: error.message,
        });
    }
};

// =========================================
// UPDATE ORDER STATUS - ADMIN
// =========================================

const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const allowedStatuses = [
            "Pending",
            "Completed",
            "Cancelled",
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid order status",
            });
        }

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                message: "Order not found",
            });
        }

        if (
            status === "Cancelled" &&
            order.paymentStatus === "Paid"
        ) {
            return res.status(400).json({
                message:
                    "Paid orders require a refund process",
            });
        }

        // Do not complete an unpaid Razorpay order
        if (
            status === "Completed" &&
            order.paymentMethod === "Razorpay" &&
            order.paymentStatus !== "Paid"
        ) {
            return res.status(400).json({
                message:
                    "Verify payment before completing this order",
            });
        }

        const previousStatus = order.status;

        order.status = status;
        await order.save();

        // Restore stock only on the first cancellation
        if (
            status === "Cancelled" &&
            previousStatus !== "Cancelled"
        ) {
            for (const item of order.items) {
                await Product.findByIdAndUpdate(
                    item.product,
                    {
                        $inc: {
                            stock: item.quantity,
                        },
                    }
                );
            }
        }

        const updatedOrder = await Order.findById(
            order._id
        )
            .populate("user", "name email")
            .populate("items.product");

        const io = req.app.get("io");

        if (io) {
            io.emit("orderStatusUpdated", {
                orderId: updatedOrder._id,
                status: updatedOrder.status,
                userId: updatedOrder.user?._id,
            });
        }

        return res.status(200).json({
            message: "Order status updated successfully",
            order: updatedOrder,
        });
    } catch (error) {
        console.error("UPDATE ORDER STATUS ERROR:", error);

        return res.status(500).json({
            message: "Unable to update order status",
            error: error.message,
        });
    }
};

// =========================================
// EXPORTS
// =========================================

module.exports = {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrder,
    getAllOrders,
    updateOrderStatus,
};
