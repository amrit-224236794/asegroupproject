// controllers/scanController.js

const simpleGit = require('simple-git');
const ScanResult = require('../models/ScanResult');
const npmApi = require('api-for-npm'); // Example library for checking npm packages

exports.scanRepository = async (req, res) => {
    const { owner, repo, token } = req.body;

    // Example logic for scanning a GitHub repository
    const repoUrl = `https://github.com/${owner}/${repo}`;
    const git = simpleGit();

    try {
        await git.clone(repoUrl, './temp');
        
        // Fetch packages (this is a simplified example)
        const packages = ['express', 'mongoose', 'dotenv'];  // Normally parsed from package.json

        // Simulate checking if packages are malicious
        const malicious = packages.some(pkg => npmApi.isMalicious(pkg));

        // Save result to MongoDB
        const scanResult = new ScanResult({
            repoName: repo,
            owner: owner,
            packages: packages,
            malicious: malicious,
        });
        await scanResult.save();

        res.json({
            success: true,
            repo: repo,
            packages: packages,
            malicious: malicious
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error scanning repository'
        });
    }
};
