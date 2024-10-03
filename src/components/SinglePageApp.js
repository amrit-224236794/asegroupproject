// src/SinglePageApp.js

import React, { useState } from 'react';
import axios from 'axios';

const SinglePageApp = () => {
    const [repoLink, setRepoLink] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [personalAccessToken, setPersonalAccessToken] = useState('');
    const [scanResult, setScanResult] = useState(null);
    const [loading, setLoading] = useState(false); // State to manage loading

    const handleScan = async () => {
        const regex = /github\.com\/([^\/]+)\/([^\/]+)/;
        const match = repoLink.match(regex);
        
        if (!match) {
            alert("Please enter a valid GitHub repository link.");
            return;
        }

        const owner = match[1];
        const repo = match[2];
        const token = isPrivate ? personalAccessToken : undefined;

        setLoading(true); // Set loading to true before the request

        try {
            const response = await axios.post('http://localhost:5001/check-repo', {
                owner,
                repo,
                token,
            });

            if (response.data.success) {
                setScanResult(response.data);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error("Error during scanning:", error);
        } finally {
            setLoading(false); // Set loading to false after the request is done
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <header className="bg-blue-600 text-white">
                <nav className="container mx-auto flex justify-between items-center p-4">
                    <h1 className="text-lg font-bold">NPM Malicious Package Scanner</h1>
                    <div>
                        <a href="#" className="text-white hover:text-blue-200 mx-2">Home</a>
                        <a href="#" className="text-white hover:text-blue-200 mx-2">About</a>
                        <a href="#" className="text-white hover:text-blue-200 mx-2">Contact</a>
                    </div>
                </nav>
            </header>

            <main className="flex-grow flex justify-center items-center p-4">
                <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-lg">
                    <h2 className="text-xl font-semibold mb-4">Scan GitHub Repository</h2>

                    <div className="mb-4">
                        <label className="block mb-2">Repository Link:</label>
                        <input
                            type="text"
                            value={repoLink}
                            onChange={(e) => setRepoLink(e.target.value)}
                            className="border border-gray-300 p-2 w-full rounded"
                            placeholder="e.g., https://github.com/user/repo"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2">Repository Type:</label>
                        <label className="inline-flex items-center mr-4">
                            <input
                                type="radio"
                                value="public"
                                checked={!isPrivate}
                                onChange={() => setIsPrivate(false)}
                                className="mr-2"
                            />
                            Public
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                value="private"
                                checked={isPrivate}
                                onChange={() => setIsPrivate(true)}
                                className="mr-2"
                            />
                            Private
                        </label>
                    </div>

                    {isPrivate && (
                        <div className="mb-4">
                            <label className="block mb-2">Personal Access Token:</label>
                            <input
                                type="text"
                                value={personalAccessToken}
                                onChange={(e) => setPersonalAccessToken(e.target.value)}
                                className="border border-gray-300 p-2 w-full rounded"
                                placeholder="Enter your GitHub PAT"
                            />
                        </div>
                    )}

                    <button
                        onClick={handleScan}
                        className="bg-blue-500 text-white py-2 px-4 rounded w-full"
                    >
                        Scan Repository
                    </button>

                    {/* Loading spinner */}
                    {loading && (
                        <div className="flex justify-center items-center mt-4">
                            <div className="animate-spin border-4 border-blue-500 border-t-transparent rounded-full w-8 h-8"></div>
                        </div>
                    )}

                    {scanResult && !loading && (
                        <div className="mt-4">
                            <h3 className="text-lg "><b> Scan Results for</b> {scanResult.repo}:</h3>
                            
                            <p> <b> Packages:</b> {scanResult.packages.join(', ')}</p>
                            <p> <b>Malicious:</b> {scanResult.malicious ? 'Yes' : 'No'}</p>
                        </div>
                    )}
                </div>
            </main>

            <footer className="bg-blue-600 text-white text-center p-4">
                <p>&copy; 2024 NPM Malicious Package Scanner. All Rights Reserved.</p>
            </footer>
        </div>
    );
};

export default SinglePageApp;
