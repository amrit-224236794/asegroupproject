// tests/scanController.test.js
const scanController = require('../controllers/scanController');

describe('scanRepository function', () => {
  it('should return scan results successfully', async () => {
    // Mock request and response
    const req = {
      body: {
        owner: 'sampleOwner',
        repo: 'sampleRepo',
        token: 'testToken'
      }
    };
    
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    await scanController.scanRepository(req, res);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      repo: expect.any(String),
      packages: expect.any(Array),
      malicious: expect.any(Boolean)
    });
  });

  it('should return error on failure', async () => {
    const req = { body: { owner: '', repo: '', token: '' } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    await scanController.scanRepository(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Error scanning repository'
    });
  });
});
