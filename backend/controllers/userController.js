import { User } from '../models/userModel.js';
import asyncHandler from '../middleware/asyncMiddleware.js';
import { generateToken } from '../utils/generateToken.js';

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async(req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    // matchPassword is a custom password logic with userSchema.methods
    if(user && (await user.matchPassword(password))) {
        generateToken(res, user._id);
        res.status(200).json({ 
           _id: user._id,
           name: user.name,
           email: user.email,
           isAdmin: user.isAdmin,
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc    Register user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async(req, res) => {
    const { name, email, password } = req.body;

    const userExist = await User.findOne({ email });

    if(userExist) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({
        name, email, password
    });

    if(user) {
        generateToken(res, user._id);
        res.status(201).json({
           _id: user._id,
           name: user.name,
           email: user.email,
           isAdmin: user.isAdmin,
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }

});

// @desc    Logout user & clear cookie
// @route   POST /api/users/logout
// @access  Private
const logoutUser = asyncHandler(async(req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    });

    res.status(200).json({
        message: 'Logout successfully.'
    })
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user._id);
    if(user) {
        res.status(200).json({ 
           _id: user._id,
           name: user.name,
           email: user.email,
           isAdmin: user.isAdmin,
        });
    } else {
        res.status(404);
        throw new Error('User not found.');
    }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user._id);
    if(user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if(req.body.password) {
            user.password = req.body.password || user.password;
        }
        const updatedUser = await user.save();
        
        res.status(200).json({ 
           _id: updatedUser._id,
           name: updatedUser.name,
           email: updatedUser.email,
           isAdmin: updatedUser.isAdmin,
        });
    } else {
        res.status(404);
        throw new Error('User not found.');
    }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async(req, res) => {
    const users = await User.find({});
    res.stats(200).json(users);
});

// @desc    Delete users
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUserById = asyncHandler(async(req, res) => {
    const user = await User.findById(req.params.id);
    if(user) {
        if(user.isAdmin) {
            res.stats(400);
            throw new Error('Can\'t delete a Admin.');
        }
        await User.deleteOne(user._id);
        res.status(200).send({
            message: 'User deleted Successfully.'
        })
    } else {
        res.stats(404);
        throw new Error('User not found.');
    }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async(req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId).select('-password');
    if(user) {
        res.status(200).json(user);
    } else {
        res.stats(404);
        throw new Error('User not found.');
    }
});

// @desc    Update user by ID
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUserById = asyncHandler(async(req, res) => {
    const user = await User.findById(req.params.id);
    if(user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if(req.body.password) {
            user.password = req.body.password || user.password;
        }
        const updatedUser = await user.save();
        res.status(200).send({
            _id: updatedUser._id,
            name: updatedUser.name,
            emaild: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        });
    } else {
        res.stats(404);
        throw new Error('User not found.');
    }
});

export {
    authUser,
    registerUser,
    logoutUser,

    getUserProfile,
    updateUserProfile,

    getUsers,
    deleteUserById,
    getUserById,
    updateUserById
};