import jwt from 'jsonwebtoken';

export const generateToken = (res, userId) => {
     const token = jwt.sign(
        { userId: userId }, 
        process.env.JWT_SECRET, 
        { expiresIn: '30d' }
    );

    // SET JST as HTTP-ONLY cookie
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });
}