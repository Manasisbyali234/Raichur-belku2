const mongoose = require('mongoose');

const blacklistSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 30 * 24 * 60 * 60 // Automatically delete after 30 days
    }
});

module.exports = mongoose.model('Blacklist', blacklistSchema);
