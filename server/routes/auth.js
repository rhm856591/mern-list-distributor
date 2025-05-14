// server/routes/auth.js
const express = require('express');
const { login, getMe, register } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/register', register); // For demo purpose
router.get('/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Test route'
  });
});

module.exports = router;