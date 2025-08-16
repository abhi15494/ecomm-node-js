import path from 'path';
import express from 'express';
import multer from 'multer';
import asyncHandler from '../middleware/asyncMiddleware.js';

const router = express.Router();

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

function checkFileType(file, cb) {
    const fileTypes = /jpg|png|jpeg/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());

    const mimetype = fileTypes.test(file.mimetype);
    if(extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Images only!');
    }
}

const upload = multer({
    storage
});

router.post('/', upload.single('image'), asyncHandler((req, res, next) => {
    res.json({
        message: 'Image uploaded',
        image: req.file.path
    })
}));

export default router;