const express = require('express');
const { body } = require('express-validator');
const {
  register,
  login,
  refreshToken,
  getProfile,
  logout
} = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

const registerValidation = [
  body('username')
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must be between 3 and 20 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  body('fullName')
    .isLength({ min: 2, max: 50 })
    .withMessage('Full name must be between 2 and 50 characters')
    .trim(),
  body('profilePic')
    .optional()
    .isURL()
    .withMessage('Please provide a valid profile picture URL'),
  body('birthdate')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid birthdate in YYYY-MM-DD format')
    .custom((value) => {
      if (value) {
        const birthDate = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age < 13) {
          throw new Error('You must be at least 13 years old to register');
        }
        if (age > 120) {
          throw new Error('Please provide a valid birthdate');
        }
      }
      return true;
    })
];

const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const refreshTokenValidation = [
  body('refreshToken')
    .notEmpty()
    .withMessage('Refresh token is required')
];

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/refresh-token', refreshTokenValidation, refreshToken);
router.get('/profile', authenticateToken, getProfile);
router.post('/logout', logout);

module.exports = router;