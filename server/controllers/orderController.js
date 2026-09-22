const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

// =========================================
// CREATE ORDER FROM CART
// =========================================

const createOrder = async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await Cart.findOne({
            user: userId,
        }).populate("items.product");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                message: "Cart is empty",
            });
        }

        let totalPrice = 0;
        const orderItems = [];

        for (const item of cart.items) {
            const product = item.product;

            if (!product) {
                return res.status(404).json({
                    message: "Product not found",
                });
            }

            if (item.quantity > product.stock) {
                return res.status(400).json({
                    message: `Not enough stock for ${product.name}`,
                });
            }

            const itemTotal = product.price * item.quantity;

            totalPrice += itemTotal;

            orderItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
            });
        }

        const order = await Order.create({
            user: userId,
            items: orderItems,
            totalPrice,
            status: "Pending",
        });

        for (const item of cart.items) {
            await Product.findByIdAndUpdate(
                item.product._id,
                {
                    $inc: {
                        stock: -item.quantity,
                    },
                }
            );
        }

        cart.items = [];
        await cart.save();

        // Socket.IO - notify admin about new order
        const io = req.app.get("io");

        if (io) {
            io.emit("newOrder", {
                message: "New order placed",
                order,
            });
        }

        res.status(201).json({
            message: "Order created successfully",
            order,
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};


// =========================================
// GET LOGGED-IN USER'S ORDERS
// =========================================

const getMyOrders = async (req, res) => {
    try {
        const userId = req.user.id;

        const orders = await Order.find({
            user: userId,
        })
            .populate("items.product")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Orders fetched successfully",
            orders,
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};


// =========================================
// GET SINGLE ORDER
// =========================================

const getOrderById = async (req, res) => {
    try {
        const userId = req.user.id;

        const order = await Order.findOne({
            _id: req.params.id,
            user: userId,
        }).populate("items.product");

        if (!order) {
            return res.status(404).json({
                message: "Order not found",
            });
        }

        res.status(200).json({
            message: "Order fetched successfully",
            order,
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};


// =========================================
// CANCEL ORDER
// =========================================

const cancelOrder = async (req, res) => {
    try {
        const userId = req.user.id;

        const order = await Order.findOne({
            _id: req.params.id,
            user: userId,
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

        order.status = "Cancelled";

        await order.save();

        // Socket.IO - notify admin
        const io = req.app.get("io");

        if (io) {
            io.emit("orderStatusUpdated", {
                orderId: order._id,
                status: order.status,
                userId: order.user,
            });
        }

        res.status(200).json({
            message: "Order cancelled successfully",
            order,
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
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

        res.status(200).json({
            message: "All orders fetched successfully",
            orders,
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
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

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            {
                status,
            },
            {
                new: true,
            }
        )
            .populate("user", "name email")
            .populate("items.product");

        if (!order) {
            return res.status(404).json({
                message: "Order not found",
            });
        }

        // =========================================
        // SOCKET.IO
        // Notify connected users about status change
        // =========================================

        const io = req.app.get("io");

        if (io) {
            io.emit("orderStatusUpdated", {
                orderId: order._id,
                status: order.status,
                userId: order.user?._id,
            });
        }

        res.status(200).json({
            message: "Order status updated successfully",
            order,
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
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