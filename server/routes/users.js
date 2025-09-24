const express = require('express');
const router = express.Router();

// @route   GET /api/users
// @desc    Get all users
// @access  Private
router.get('/', (req, res) => {
  res.json({ 
    message: 'Get users route - ready for implementation',
    status: 'success'
  });
});

// @route   GET /api/users/test
// @desc    Test users route
// @access  Public
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Users routes are working!',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
