
const express = require("express");
const router = express.Router();

const {
  createReview,
  getProductReviews,
} = require("../controllers/reviewController");

const authMiddleware = require("../middleware/authMiddleware");

// Add a review (login required)
router.post("/", authMiddleware, createReview);

// Get reviews for a product
router.get("/:productId", getProductReviews);

module.exports = router;
