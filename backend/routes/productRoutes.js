import express from 'express';
import { createProduct, getProductById, getProducts, updateProduct } from '../controllers/productController.js';
import { admin, protect } from '../middleware/authMiddleware.js';
const router = express.Router();

router.route('/')
    .get(getProducts)
    .post(protect, admin, createProduct)
    .put(protect, admin, updateProduct);

router.route('/:id').get(getProductById);

// We can write it like that one but above one can handle other methods cleanly
// router.get('/', getProducts);
// router.get('/:id', getProductById);

export default router;