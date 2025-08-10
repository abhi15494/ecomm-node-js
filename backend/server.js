import express from 'express';
import dotenv from 'dotenv';
import cookerParser from 'cookie-parser';
import { connectDB } from './config/db.js';

import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orterRoutes from './routes/orderRoutes.js';
import configRoutes from './routes/configRoutes.js';

import { errorHandler, notFound } from './middleware/errorMiddleware.js';

dotenv.config();
connectDB();

const port = process.env.PORT || 8000;

const app = express();
// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie read and parser
app.use(cookerParser());

// ROUTES WHICH USED MIDDLEWARE FOR THE APPLICATION
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orterRoutes);
app.use('/api/config', configRoutes);
// ROUTES WHICH USED MIDDLEWARE FOR THE APPLICATION

// ERROR HANDLER FOR THE APPLICATION
app.use(notFound);
app.use(errorHandler);
// ERROR HANDLER FOR THE APPLICATION

app.listen(port, () => {
    console.log('SERVER IS RUNNING ON PORT: ', port);
})