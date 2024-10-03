// routes/scanRoutes.js

const express = require('express');
const router = express.Router();
const scanController = require('../controllers/scanController');

router.post('/check-repo', scanController.scanRepository);

module.exports = router;
