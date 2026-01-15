const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', protect, logoutUser);
router.get('/profile', protect, getUserProfile);
router.get('/check', (req, res) => {
    const token = req.cookies.jwt || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    res.json({ authenticated: !!token });
});

module.exports = router;
