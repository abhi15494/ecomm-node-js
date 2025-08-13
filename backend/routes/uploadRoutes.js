import path from 'path';
import express from 'express';
import multer from 'multer';
import asyncHandler from '../middleware/asyncMiddleware.js';

const router = express.Router();

const storage = multer.diskStorage({
    destination(req, file, callback) {
        const uploadsDir = path.join(path.resolve(), '/uploads');
        callback(null, uploadsDir);
    },
    filename(req, file, callback) {
        callback(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

function checkFileType(file, callback) {
    const fileTypes = /jpg|png|jpeg/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());

    const mimetype = fileTypes.test(file.mimetype);
    if(extname && mimetype) {
        return callback(null, true);
    } else {
        callback('Images only!');
    }
}

const upload = multer({
    storage
});

router.post('/', upload.single('image'), asyncHandler((req, res, next) => {
    res.send({
        message: 'Image uploaded',
        image: req.file.path
    })
}));

export default router;