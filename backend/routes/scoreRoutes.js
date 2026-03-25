const express = require('express');
const router = express.Router();
const { addScore, getScores } = require('../controllers/scoreController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, addScore)
  .get(protect, getScores);

module.exports = router;
