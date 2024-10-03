// models/ScanResult.js

const mongoose = require('mongoose');

const scanResultSchema = new mongoose.Schema({
    repoName: String,
    owner: String,
    packages: [String],
    malicious: Boolean,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ScanResult', scanResultSchema);
