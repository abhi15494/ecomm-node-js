import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';

import productsForMongo from './data/productsForMongo.js';
import usersForMongo from './data/usersForMongo.js';

import { Order } from './models/orderModel.js';
import { Product } from './models/productModel.js';
import { User } from './models/userModel.js';

import { connectDB } from './config/db.js';

dotenv.config();

const importData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        const createdUser = await User.insertMany(usersForMongo);
        
        const adminUser = createdUser[0]._id;
        const sampleProducts = productsForMongo.map(p => ({...p, user: adminUser}));
        await Product.insertMany(sampleProducts);

        console.log('SUCCESS! Data imported.'.green.inverse);
        process.exit();
    } catch(e) {
        console.log(`ERROR! ${e}`.red.inverse)
        process.exit(1);
    }
};


const destroyData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        console.log('SUCCESS! Data destroyed.'.red.inverse);
        process.exit();
    } catch(e) {
        console.log(`ERROR! ${e}`.red.inverse)
        process.exit(1);
    }
};

connectDB();
if(process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}