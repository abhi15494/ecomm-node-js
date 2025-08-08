import { Product } from '../models/productModel.js';
import asyncHandler from '../middleware/asyncMiddleware.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find();
    res.json(products)
});

// @desc    Fetch single products via id
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findOne({ _id: req.params.id });
    if(product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error("Product not found");
    }
})