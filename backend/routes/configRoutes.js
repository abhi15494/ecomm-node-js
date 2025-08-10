import express from 'express';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/paypal').get(protect, (req, res) => {
    res.json({
        clientId: process.env.PAYPAL_CLIENT_ID
    });
})

export default router;