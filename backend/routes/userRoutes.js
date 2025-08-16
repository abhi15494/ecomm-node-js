import express from 'express';
import {
    authUser,
    registerUser,
    logoutUser,

    getUserProfile,
    updateUserProfile,

    getUsers,
    deleteUserById,
    getUserById,
    updateUserById,
    createUser
} from '../controllers/userController.js';
import { admin, protect } from '../middleware/authMiddleware.js';
const router = express.Router();

router.route('/').get(getUsers).post(registerUser);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.post('/auth', authUser);
router.post('/logout', logoutUser);
router.post('/new', protect, admin, createUser);

router.route('/:id').get(protect, admin, getUserById).put(protect, admin, updateUserById).delete(protect, admin, deleteUserById);

export default router;
