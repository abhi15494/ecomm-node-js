import express from 'express';
import { 
    addOrderItems, 
    getMyOrders, 
    getOrderById, 
    updateOrderToPaid, 
    updateOrderToDelivered, 
    getOrders 
} from '../controllers/orderController.js';
import { admin, protect } from '../middleware/authMiddleware.js';

// Create a new router instance
const router = express.Router();

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/mine').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/deliver').get(protect, admin, updateOrderToDelivered);
router.route('/:id/paid').put(protect, updateOrderToPaid);

export default router;
