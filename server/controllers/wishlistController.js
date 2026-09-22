const Wishlist = require("../models/wishlistModel");
const Product = require("../models/productModel");


// Add Product to Wishlist
const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;

        const userId = req.user.id;

        // Check product
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        // Find user's wishlist
        let wishlist = await Wishlist.findOne({
            user: userId,
        });

        // Create wishlist if it doesn't exist
        if (!wishlist) {
            wishlist = await Wishlist.create({
                user: userId,
                products: [productId],
            });

            await wishlist.populate("products");

            return res.status(201).json({
                message: "Product added to wishlist",
                wishlist,
            });
        }

        // Check duplicate product
        const alreadyExists = wishlist.products.some(
            (id) => id.toString() === productId
        );

        if (alreadyExists) {
            return res.status(400).json({
                message: "Product already exists in wishlist",
            });
        }

        wishlist.products.push(productId);

        await wishlist.save();

        await wishlist.populate("products");

        res.status(200).json({
            message: "Product added to wishlist",
            wishlist,
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};


// Get Wishlist
const getWishlist = async (req, res) => {
    try {
        const userId = req.user.id;

        const wishlist = await Wishlist.findOne({
            user: userId,
        }).populate("products");

        if (!wishlist) {
            return res.status(200).json({
                message: "Wishlist is empty",
                wishlist: {
                    products: [],
                },
            });
        }

        res.status(200).json({
            message: "Wishlist fetched successfully",
            wishlist,
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};


// Remove Product from Wishlist
const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;

        const userId = req.user.id;

        const wishlist = await Wishlist.findOne({
            user: userId,
        });

        if (!wishlist) {
            return res.status(404).json({
                message: "Wishlist not found",
            });
        }

        const productIndex = wishlist.products.findIndex(
            (id) => id.toString() === productId
        );

        if (productIndex === -1) {
            return res.status(404).json({
                message: "Product not found in wishlist",
            });
        }

        wishlist.products.splice(productIndex, 1);

        await wishlist.save();

        await wishlist.populate("products");

        res.status(200).json({
            message: "Product removed from wishlist",
            wishlist,
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};


module.exports = {
    addToWishlist,
    getWishlist,
    removeFromWishlist,
};