import express from 'express';
import { 
    createProduct, 
    createProductReview, 
    deleteProductById, 
    getProductById, 
    getProducts, 
    getTopProducts, 
    updateProduct 
} from '../controllers/productController.js';
import { 
    admin, 
    protect 
} from '../middleware/authMiddleware.js';
const router = express.Router();

router.route('/')
    .get(getProducts)
    .post(protect, admin, createProduct);

router.get('/top', getTopProducts);

router.route('/:id')
    .get(getProductById)
    .put(protect, admin, updateProduct)
    .delete(protect, admin, deleteProductById);

router.route('/:id/reviews').post(protect, createProductReview);

// We can write it like that one but above one can handle other methods cleanly
// router.get('/', getProducts);
// router.get('/:id', getProductById);

export default router;