import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

let isConnected: boolean = false;

export const connectToDatabase = async () => { 
    mongoose.set('strictQuery', true);
    if(!process.env.MONGODB_URI) {
        throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
    }

    if(isConnected) {
        console.log('MongoDB is already connected');
        return;
    }

    try {
        // Corrected the dbName to 'test' as you specified.
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: 'test',
        });

        isConnected = true;
        console.log('MongoDB connected successfully to the retailer database.');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        isConnected = false;
    }
};
