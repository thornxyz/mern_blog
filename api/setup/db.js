const mongoose = require('mongoose');

function setupDatabaseConnection() {
    mongoose.connect(process.env.MONGO_URI);

    mongoose.connection.on('connected', () => {
        console.log('Connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
    });
}

module.exports = setupDatabaseConnection;
