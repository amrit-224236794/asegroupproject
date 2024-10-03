import React, { useState } from 'react';

const PackageScanner = () => {
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleScan = async () => {
    try {
      const response = await fetch(`http://localhost:5001/check-repo/${owner}/${repo}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setResult(data);
      setError('');
    } catch (err) {
      setError('Repository not found or error occurred');
      setResult(null);
    }
  };

  return (
    <div>
      <h1>NPM Malicious Package Scanner</h1>
      <input
        type="text"
        placeholder="GitHub Owner"
        value={owner}
        onChange={(e) => setOwner(e.target.value)}
      />
      <input
        type="text"
        placeholder="Repository Name"
        value={repo}
        onChange={(e) => setRepo(e.target.value)}
      />
      <button onClick={handleScan}>Scan Repository</button>
      {error && <p>{error}</p>}
      {result && (
        <div>
          <h2>Scan Results:</h2>
          <p>Owner: {result.owner}</p>
          <p>Repo: {result.repo}</p>
          <p>Packages: {result.packages.join(', ')}</p>
          <p>Is Malicious: {result.isMalicious ? 'Yes' : 'No'}</p>
        </div>
      )}
    </div>
  );
};

export default PackageScanner;
