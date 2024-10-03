// tests/api.test.js
const request = require('supertest');
const app = require('../server'); // Assuming server.js exports the Express app

describe('API Endpoint Testing', () => {
  it('should return 200 and scan results for valid repo', async () => {
    const res = await request(app)
      .post('/check-repo')
      .send({
        owner: 'sampleOwner',
        repo: 'sampleRepo',
        token: 'sampleToken'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('packages');
    expect(res.body).toHaveProperty('malicious');
  });

  it('should return 500 error for invalid input', async () => {
    const res = await request(app)
      .post('/check-repo')
      .send({
        owner: '',
        repo: '',
        token: ''
      });

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('message', 'Error scanning repository');
  });
});
