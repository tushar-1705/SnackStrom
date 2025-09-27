const express = require('express');
const { body, query } = require('express-validator');
const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  toggleLike,
  addComment,
  getUserPosts
} = require('../controllers/postController');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

const createPostValidation = [
  body('type')
    .isIn(['snack', 'drink'])
    .withMessage('Type must be either snack or drink'),
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .trim(),
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .trim()
];

const addCommentValidation = [
  body('text')
    .isLength({ min: 1, max: 200 })
    .withMessage('Comment must be between 1 and 200 characters')
    .trim()
];

router.post('/', authenticateToken, createPost);
router.get('/', optionalAuth, getPosts);
router.get('/:id', optionalAuth, getPostById);
router.put('/:id', authenticateToken, createPostValidation, updatePost);
router.delete('/:id', authenticateToken, deletePost);
router.post('/:id/like', authenticateToken, toggleLike);
router.post('/:id/comment', authenticateToken, addCommentValidation, addComment);
router.get('/user/:userId', optionalAuth, getUserPosts);

module.exports = router;
