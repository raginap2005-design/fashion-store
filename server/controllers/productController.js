const Product = require("../models/productModel");

// =====================================================
// CREATE PRODUCT
// ADMIN ONLY
// =====================================================

const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            stock,
            category,
        } = req.body;

        const product = await Product.create({
            name,
            description,
            price: Number(price),
            stock: Number(stock),
            category,
            image: req.file ? req.file.path : null,
        });

        res.status(201).json({
            message: "Product created successfully",
            product,
        });

    } catch (error) {
        console.log("CREATE PRODUCT ERROR:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};


// =====================================================
// GET ALL PRODUCTS
// SEARCH + PRICE FILTER + CATEGORY FILTER + PAGINATION
// =====================================================

const getProducts = async (req, res) => {
    try {

        const {
            search,
            minPrice,
            maxPrice,
            category,
            page = 1,
            limit = 8,
        } = req.query;

        let filter = {};

        // ---------------------------------------------
        // SEARCH
        // ---------------------------------------------

        if (search && search.trim() !== "") {
            filter.name = {
                $regex: search.trim(),
                $options: "i",
            };
        }

        // ---------------------------------------------
        // PRICE FILTER
        // ---------------------------------------------

        if (minPrice || maxPrice) {

            filter.price = {};

            if (minPrice) {
                filter.price.$gte = Number(minPrice);
            }

            if (maxPrice) {
                filter.price.$lte = Number(maxPrice);
            }
        }

        // ---------------------------------------------
        // CATEGORY FILTER
        // ---------------------------------------------

        if (category) {
            filter.category = category;
        }

        // ---------------------------------------------
        // PAGINATION
        // ---------------------------------------------

        const currentPage = Math.max(
            Number(page) || 1,
            1
        );

        const productsPerPage = Math.max(
            Number(limit) || 8,
            1
        );

        const skip =
            (currentPage - 1) * productsPerPage;

        // ---------------------------------------------
        // TOTAL PRODUCTS
        // ---------------------------------------------

        const totalProducts =
            await Product.countDocuments(filter);

        // ---------------------------------------------
        // GET PRODUCTS
        // ---------------------------------------------

        const products = await Product.find(filter)
            .populate("category")
            .skip(skip)
            .limit(productsPerPage)
            .sort({ createdAt: -1 });

        // ---------------------------------------------
        // TOTAL PAGES
        // ---------------------------------------------

        const totalPages = Math.ceil(
            totalProducts / productsPerPage
        );

        // ---------------------------------------------
        // RESPONSE
        // ---------------------------------------------

        res.status(200).json({

            message: "Products fetched successfully",

            currentPage,

            productsPerPage,

            totalProducts,

            totalPages,

            products,

        });

    } catch (error) {

        console.log("GET PRODUCTS ERROR:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};


// =====================================================
// GET SINGLE PRODUCT
// =====================================================

const getProductById = async (req, res) => {

    try {

        const product =
            await Product.findById(req.params.id)
                .populate("category");

        if (!product) {

            return res.status(404).json({
                message: "Product not found",
            });
        }

        res.status(200).json({

            message: "Product fetched successfully",

            product,

        });

    } catch (error) {

        console.log("GET PRODUCT ERROR:", error);

        res.status(500).json({

            message: "Server error",

            error: error.message,

        });
    }
};


// =====================================================
// UPDATE PRODUCT
// ADMIN ONLY
// =====================================================

const updateProduct = async (req, res) => {

    try {

        const {
            name,
            description,
            price,
            stock,
            category,
        } = req.body;

        const updateData = {
            name,
            description,
            price: Number(price),
            stock: Number(stock),
            category,
        };

        // If a new image is uploaded,
        // update the image also.
        if (req.file) {
            updateData.image = req.file.path;
        }

        const product =
            await Product.findByIdAndUpdate(
                req.params.id,
                updateData,
                {
                    new: true,
                    runValidators: true,
                }
            ).populate("category");

        if (!product) {

            return res.status(404).json({
                message: "Product not found",
            });
        }

        res.status(200).json({

            message: "Product updated successfully",

            product,

        });

    } catch (error) {

        console.log("UPDATE PRODUCT ERROR:", error);

        res.status(500).json({

            message: "Server error",

            error: error.message,

        });
    }
};


// =====================================================
// DELETE PRODUCT
// ADMIN ONLY
// =====================================================

const deleteProduct = async (req, res) => {

    try {

        const product =
            await Product.findByIdAndDelete(
                req.params.id
            );

        if (!product) {

            return res.status(404).json({
                message: "Product not found",
            });
        }

        res.status(200).json({

            message: "Product deleted successfully",

        });

    } catch (error) {

        console.log("DELETE PRODUCT ERROR:", error);

        res.status(500).json({

            message: "Server error",

            error: error.message,

        });
    }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {

    createProduct,

    getProducts,

    getProductById,

    updateProduct,

    deleteProduct,

};