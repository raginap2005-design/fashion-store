const Cart = require("../models/cartModel");
const Product = require("../models/productModel");


// Add Product to Cart
const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        const userId = req.user.id;

        // Check product
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        const requestedQuantity = Number(quantity);

        // Validate quantity
        if (!requestedQuantity || requestedQuantity < 1) {
            return res.status(400).json({
                message: "Quantity must be at least 1",
            });
        }

        // Check stock
        if (requestedQuantity > product.stock) {
            return res.status(400).json({
                message: "Requested quantity is greater than available stock",
            });
        }

        // Find user's cart
        let cart = await Cart.findOne({ user: userId });

        // If cart doesn't exist
        if (!cart) {
            cart = await Cart.create({
                user: userId,
                items: [
                    {
                        product: productId,
                        quantity: requestedQuantity,
                    },
                ],
            });

            await cart.populate("items.product");

            return res.status(201).json({
                message: "Product added to cart",
                cart,
            });
        }

        // Check whether product already exists
        const existingItem = cart.items.find(
            (item) => item.product.toString() === productId
        );

        if (existingItem) {
            const newQuantity =
                existingItem.quantity + requestedQuantity;

            // Check total quantity with stock
            if (newQuantity > product.stock) {
                return res.status(400).json({
                    message: "Requested quantity is greater than available stock",
                });
            }

            existingItem.quantity = newQuantity;
        } else {
            cart.items.push({
                product: productId,
                quantity: requestedQuantity,
            });
        }

        await cart.save();

        await cart.populate("items.product");

        res.status(200).json({
            message: "Product added to cart",
            cart,
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};


// Get Cart
const getCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await Cart.findOne({ user: userId })
            .populate("items.product");

        if (!cart) {
            return res.status(200).json({
                message: "Cart is empty",
                cart: {
                    items: [],
                },
            });
        }

        let totalPrice = 0;

        cart.items.forEach((item) => {
            if (item.product) {
                totalPrice +=
                    item.product.price * item.quantity;
            }
        });

        res.status(200).json({
            message: "Cart fetched successfully",
            cart,
            totalPrice,
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};


// Update Cart Item Quantity
const updateCartItem = async (req, res) => {
    try {
        const { quantity } = req.body;
        const { productId } = req.params;

        const userId = req.user.id;

        const requestedQuantity = Number(quantity);

        if (!requestedQuantity || requestedQuantity < 1) {
            return res.status(400).json({
                message: "Quantity must be at least 1",
            });
        }

        // Find product
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        // Check stock
        if (requestedQuantity > product.stock) {
            return res.status(400).json({
                message: "Requested quantity is greater than available stock",
            });
        }

        // Find cart
        const cart = await Cart.findOne({
            user: userId,
        });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found",
            });
        }

        const item = cart.items.find(
            (item) => item.product.toString() === productId
        );

        if (!item) {
            return res.status(404).json({
                message: "Product not found in cart",
            });
        }

        item.quantity = requestedQuantity;

        await cart.save();

        await cart.populate("items.product");

        res.status(200).json({
            message: "Cart quantity updated successfully",
            cart,
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};


// Remove Product from Cart
const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;

        const userId = req.user.id;

        const cart = await Cart.findOne({
            user: userId,
        });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found",
            });
        }

        const itemIndex = cart.items.findIndex(
            (item) => item.product.toString() === productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                message: "Product not found in cart",
            });
        }

        cart.items.splice(itemIndex, 1);

        await cart.save();

        await cart.populate("items.product");

        res.status(200).json({
            message: "Product removed from cart",
            cart,
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};


module.exports = {
    addToCart,
    getCart,
    updateCartItem,
    removeFromCart,
};