const express = require("express");

const {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrder,
    getAllOrders,
    updateOrderStatus,
} = require("../controllers/orderController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// User - Create Order
router.post(
    "/",
    authMiddleware,
    createOrder
);

// User - My Orders
router.get(
    "/my-orders",
    authMiddleware,
    getMyOrders
);

// User - Single Order
router.get(
    "/:id",
    authMiddleware,
    getOrderById
);

// User - Cancel Order
router.put(
    "/:id/cancel",
    authMiddleware,
    cancelOrder
);

// ==========================================
// ADMIN ROUTES
// ==========================================

// Admin - Get All Orders
router.get(
    "/admin/all",
    authMiddleware,
    roleMiddleware(["admin"]),
    getAllOrders
);

// Admin - Update Order Status
router.put(
    "/admin/:id/status",
    authMiddleware,
    roleMiddleware(["admin"]),
    updateOrderStatus
);

module.exports = router;