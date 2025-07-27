const express = require('express');
const { runCode, submitCode } = require('../controllers/codeController');

const router = express.Router();

router.post('/api/run', runCode);
router.post('/api/submit', submitCode);

module.exports = router;