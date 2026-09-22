const express = require("express");

const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
} = require("../controllers/productController");

const upload = require("../middleware/uploadMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// Create Product - Admin only
router.post(
    "/",
    authMiddleware,
    roleMiddleware(["admin"]),
    upload.single("image"),
    createProduct
);

// Get All Products
router.get("/", getProducts);

// Get Single Product
router.get("/:id", getProductById);

// Update Product - Admin only
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware(["admin"]),
    upload.single("image"),
    updateProduct
);

// Delete Product - Admin only
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware(["admin"]),
    deleteProduct
);

module.exports = router;