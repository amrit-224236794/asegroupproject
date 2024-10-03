// server/index.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5001;

// MongoDB connection
mongoose.connect('mongodb+srv://kuchvnidsna2190:yJ4Yj1IeExEO7Tph@cluster1.wrsus.mongodb.net/').then(() => {
    console.log("MongoDB connected");
}).catch(err => console.log(err));

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Schema for scan results
const scanResultSchema = new mongoose.Schema({
    owner: String,
    repo: String,
    packages: [String],
    malicious: Boolean,
    createdAt: { type: Date, default: Date.now }
});

const ScanResult = mongoose.model('ScanResult', scanResultSchema);

// Route to check the repository
app.post('/check-repo', async (req, res) => {
    const { owner, repo, token } = req.body;

    console.log("Received data:", { owner, repo, token }); // Debug log

    if (!owner || !repo) {
        return res.status(400).json({ success: false, message: 'Owner and repository name are required.' });
    }

    try {
        // Fetch the package.json file from the GitHub repository
        const response = await axios.get(`https://raw.githubusercontent.com/${owner}/${repo}/main/package.json`, {
            headers: {
                Authorization: token ? `token ${token}` : undefined,
            },
        });

        const packages = Object.keys(response.data.dependencies || {});
        
        // Simulating a check for malicious packages
        const maliciousPackages = packages.filter(pkg => pkg.includes('malicious'));
        const result = {
            owner,
            repo,
            packages,
            malicious: maliciousPackages.length > 0,
        };

        // Save the scan result to MongoDB
        await ScanResult.create(result);
        
        res.json({ success: true, ...result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching repository data or processing the scan.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
