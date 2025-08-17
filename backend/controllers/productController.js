import { Product } from '../models/productModel.js';
import asyncHandler from '../middleware/asyncMiddleware.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find();
    res.json(products)
});

// @desc    Create a products
// @route   product /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
    const product = new Product({
        name: 'Sample name',
        price: 0,
        user: req.user._id,
        image: '/images/sample.jpg',
        brand: 'Sample brand',
        category: 'Sample Category',
        countInStock: 0,
        numReviews: 0,
        description: 'Sample description'
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
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

// @desc    Delete a single products via id
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProductById = asyncHandler(async (req, res) => {
    const product = await Product.findOne({ _id: req.params.id });
    if(product) {
        await Product.deleteOne({_id: product._id });
        res.status(200);
        res.send({
            message: 'Product deleted'
        })
    } else {
        res.status(404);
        throw new Error("Product not found");
    }
})

// @desc    Update single product
// @route   Put /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
    const {
        name, price, description, image, brand, category, countInStock
    } = req.body;
    const product = await Product.findOne({ _id: req.params.id });

    if(product) {
        product.name = name;
        product.price = price;
        product.description = description;
        product.image = image;
        product.brand = brand;
        product.category = category;
        product.countInStock = countInStock;

        const updatedProduct = await product.save();
        res.status(200).json(updatedProduct);
    } else {
        res.status(404);
        throw new Error("Product not found");
    }
})

// @desc    Create a new Review
// @route   POST /api/products/:id/review
// @access  Private
export const createProductReview = asyncHandler(async (req, res) => {
    const {
        rating, comment
    } = req.body;
    const product = await Product.findOne({ _id: req.params.id });
    if(product) {
        // Check if product is already reviewed
        const alreadyReviewed = product.reviews.find((r) => r.user.toString() === req.user._id.toString());
        if(alreadyReviewed) {
            res.status(400);
            throw new Error('Product already reviewed');
        }

        // Check if product is not reviewed yet
        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id
        };

        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating = product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length;

        await product.save();
        
        res.status(201);
        res.send({
            message: 'Product reviewed successfully'
        })
    } else {
        res.status(404);
        throw new Error("Product not found");
    }
})
