const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

const importData = async () => {
    try {
        await connectDB();

        // Drop existing indexes to avoid conflicts with old schemas
        try {
            await User.collection.dropIndexes();
            console.log('Dropped indexes');
        } catch (err) {
            console.log('No indexes to drop or error dropping indexes');
        }

        // Delete existing admin or all users
        await User.deleteMany({});
        console.log('Data Destroyed...');

        const adminUser = {
            name: 'Admin User',
            email: 'admin@rbnews.com',
            password: 'password123',
            role: 'admin',
        };

        await User.create(adminUser);

        console.log('Admin User Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
