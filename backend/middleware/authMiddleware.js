import jwt from 'jsonwebtoken';
import asyncHandler from './asyncMiddleware.js';
import { User } from '../models/userModel.js';

// Protect users
export const protect = asyncHandler(async(req, res, next) => {
    // READ the jwt from cookie
    let token = req?.cookies?.jwt;

    if(token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.userId).select('-password');
            next();
        } catch(e) {
            res.status(401);
            throw new Error('Not authorized! token failed.');
        }
    } else {
        res.status(401);
        throw new Error('Not authorized! no token.');
    }
});

export const admin = (req, res, next) => {
    if(req.user && req.user.admin) {
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized as Admin.');
    }
}