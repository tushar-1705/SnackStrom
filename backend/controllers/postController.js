const Post = require('../models/Post');
const User = require('../models/User');
const { verifyToken, extractTokenFromHeader } = require('../utils/generateToken');
const { validationResult } = require('express-validator');

const createPost = async (req, res) => {
  try {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const token = extractTokenFromHeader(req.headers.authorization);
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
    }

    const decoded = verifyToken(token);
    const userId = decoded.id;

    const {
      type,
      title,
      description,
      image,
      tags,
      ingredients,
      preparationTime,
      difficulty,
      servings,
      weather
    } = req.body;

    const newPost = new Post({
      user: userId,
      type,
      title,
      description,
      image,
      tags: tags || [],
      ingredients: ingredients || [],
      preparationTime: preparationTime || 0,
      difficulty: difficulty || 'easy',
      servings: servings || 1,
      weather: weather || 'rainy'
    });

    await newPost.save();
    await newPost.populate('user', 'username fullName profilePic');

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      post: newPost
    });

  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during post creation'
    });
  }
};

const getPosts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      type,
      weather,
      tags,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = { isPublic: true };

    if (type) query.type = type;
    if (weather) query.weather = weather;
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim().toLowerCase());
      query.tags = { $in: tagArray };
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const posts = await Post.find(query)
      .populate('user', 'username fullName profilePic')
      .populate('likes', 'username')
      .populate('comments.user', 'username fullName profilePic')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Post.countDocuments(query);

    res.status(200).json({
      success: true,
      posts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalPosts: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching posts'
    });
  }
};

const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id)
      .populate('user', 'username fullName profilePic')
      .populate('comments.user', 'username fullName profilePic');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    res.status(200).json({
      success: true,
      post
    });

  } catch (error) {
    console.error('Get post by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching post'
    });
  }
};

const updatePost = async (req, res) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
    }

    const decoded = verifyToken(token);
    const userId = decoded.id;
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    if (post.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own posts'
      });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true, runValidators: true }
    ).populate('user', 'username fullName profilePic');

    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      post: updatedPost
    });

  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while updating post'
    });
  }
};

const deletePost = async (req, res) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
    }

    const decoded = verifyToken(token);
    const userId = decoded.id;
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    if (post.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own posts'
      });
    }

    await Post.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully'
    });

  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while deleting post'
    });
  }
};

const toggleLike = async (req, res) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
    }

    const decoded = verifyToken(token);
    const userId = decoded.id;
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    res.status(200).json({
      success: true,
      message: isLiked ? 'Post unliked' : 'Post liked',
      isLiked: !isLiked,
      likesCount: post.likes.length
    });

  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while toggling like'
    });
  }
};

const addComment = async (req, res) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
    }

    const decoded = verifyToken(token);
    const userId = decoded.id;
    const { id } = req.params;
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Comment text is required'
      });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const comment = {
      user: userId,
      text: text.trim()
    };

    post.comments.push(comment);
    await post.save();

    const updatedPost = await Post.findById(id)
      .populate('comments.user', 'username fullName profilePic');

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      comment: updatedPost.comments[updatedPost.comments.length - 1]
    });

  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while adding comment'
    });
  }
};

const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const posts = await Post.find({ user: userId, isPublic: true })
      .populate('user', 'username fullName profilePic')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Post.countDocuments({ user: userId, isPublic: true });

    res.status(200).json({
      success: true,
      posts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalPosts: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching user posts'
    });
  }
};

module.exports = {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  toggleLike,
  addComment,
  getUserPosts
};
