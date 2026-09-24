import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// @route   GET /api/products
// @desc    Fetch all products from database
// @access  Public
router.get("/", async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json({
            success: true,
            count: products.length,
            data: products,
        });
    } catch (error) {
        console.error(`Error fetching products: ${error.message}`);
        res.status(500).json({
            success: false,
            message: "Server Error: Unable to fetch products",
            error: error.message,
        });
    }
});

export default router;
