const express = require('express');
const { body } = require('express-validator');
const {
  getUserProfile,
  updateProfile,
  changePassword,
  toggleFollow,
  getFollowers,
  getFollowing,
  searchUsers,
  getUserFeed
} = require('../controllers/userController');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

const updateProfileValidation = [
  body('fullName')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Full name must be between 2 and 50 characters')
    .trim(),
  body('bio')
    .optional()
    .isLength({ max: 150 })
    .withMessage('Bio must be less than 150 characters')
    .trim(),
  body('favoriteSnack')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Favorite snack must be less than 50 characters')
    .trim(),
  body('favoriteDrink')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Favorite drink must be less than 50 characters')
    .trim(),
  body('location')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Location must be less than 100 characters')
    .trim(),
  body('profilePic')
    .optional()
    .custom((value) => {
      if (!value || value === '' || value.startsWith('data:') || value.startsWith('http')) {
        return true;
      }
      throw new Error('Please provide a valid profile picture URL or base64 data');
    })
];

const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number')
];

router.get('/profile/:userId', optionalAuth, getUserProfile);
router.put('/profile', authenticateToken, updateProfileValidation, updateProfile);
router.put('/change-password', authenticateToken, changePasswordValidation, changePassword);
router.post('/:userId/follow', authenticateToken, toggleFollow);
router.get('/:userId/followers', optionalAuth, getFollowers);
router.get('/:userId/following', optionalAuth, getFollowing);
router.get('/search', optionalAuth, searchUsers);
router.get('/feed', authenticateToken, getUserFeed);

module.exports = router;
