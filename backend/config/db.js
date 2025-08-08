import mongoose from 'mongoose';

export const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`DB CONNECTED: ${conn?.connection?.host} ${process.env.MONGO_URI}`);
    } catch(error) {
        console.log(`DB ERROR: ${error.message}`);
        process.exit(1);
    }
}