
const Review = require("../models/reviewModel");
const Product = require("../models/productModel");

// Create a product review
const createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
   

    
const userId = req.user.id;

// Prevent admin from submitting product reviews
if (req.user.role === "admin") {
  return res.status(403).json({
    message: "Admins cannot submit product reviews",
  });
}


    if (!productId || !rating || !comment?.trim()) {
      return res.status(400).json({
        message: "Product, rating and comment are required",
      });
    }

    const numericRating = Number(rating);

    if (
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    if (comment.trim().length < 3 || comment.trim().length > 1000) {
      return res.status(400).json({
        message: "Review must be between 3 and 1000 characters",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const existingReview = await Review.findOne({
      product: productId,
      user: userId,
    });

    if (existingReview) {
      return res.status(409).json({
        message: "You have already reviewed this product",
      });
    }

    const review = await Review.create({
      product: productId,
      user: userId,
      rating: numericRating,
      comment: comment.trim(),
    });

    return res.status(201).json({
      message: "Review submitted successfully",
      review,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "You have already reviewed this product",
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    console.error("CREATE REVIEW ERROR:", error);

    return res.status(500).json({
      message: "Failed to submit review",
    });
  }
};

// Get reviews for a product
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!/^[a-fA-F0-9]{24}$/.test(productId)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const reviews = await Review.find({ product: productId })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    const totalReviews = reviews.length;

    const averageRating =
      totalReviews > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) /
          totalReviews
        : 0;

    return res.status(200).json({
      totalReviews,
      averageRating: Number(averageRating.toFixed(1)),
      reviews,
    });
  } catch (error) {
    console.error("GET PRODUCT REVIEWS ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch reviews",
    });
  }
};

module.exports = {
  createReview,
  getProductReviews,
};
