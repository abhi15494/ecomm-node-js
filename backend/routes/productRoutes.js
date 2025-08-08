import express from 'express';
import { getProductById, getProducts } from '../controllers/productController.js';

const router = express.Router();

router.route('/').get(getProducts);
router.route('/:id').get(getProductById);

// We can write it like that one but above one can handle other methods cleanly
// router.get('/', getProducts);
// router.get('/:id', getProductById);

export default router;