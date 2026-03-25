const express = require('express');
const router = express.Router();
const { runDraw, getDrawHistory } = require('../controllers/drawController');
const { protect } = require('../middleware/authMiddleware');

router.post('/run', protect, runDraw);
router.get('/', getDrawHistory);

module.exports = router;
