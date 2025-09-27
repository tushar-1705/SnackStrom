const User = require('../models/User');
const Post = require('../models/Post');
const bcrypt = require('bcryptjs');
const { verifyToken, extractTokenFromHeader } = require('../utils/generateToken');
const { validationResult } = require('express-validator');

const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .select('-password')
      .populate('followers', 'username fullName profilePic')
      .populate('following', 'username fullName profilePic');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const postCount = await Post.countDocuments({ user: userId, isPublic: true });

    res.status(200).json({
      success: true,
      user: {
        ...user.toObject(),
        postCount
      }
    });

  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching user profile'
    });
  }
};

const updateProfile = async (req, res) => {
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

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      fullName,
      bio,
      favoriteSnack,
      favoriteDrink,
      location,
      profilePic
    } = req.body;


    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (bio !== undefined) updateData.bio = bio;
    if (favoriteSnack !== undefined) updateData.favoriteSnack = favoriteSnack;
    if (favoriteDrink !== undefined) updateData.favoriteDrink = favoriteDrink;
    if (location !== undefined) updateData.location = location;
    if (profilePic) updateData.profilePic = profilePic;


    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');


    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while updating profile'
    });
  }
};

const changePassword = async (req, res) => {
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
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while changing password'
    });
  }
};

const toggleFollow = async (req, res) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
    }

    const decoded = verifyToken(token);
    const currentUserId = decoded.id;
    const { userId } = req.params;

    if (currentUserId === userId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot follow yourself'
      });
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(userId);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const isFollowing = currentUser.following.includes(userId);

    if (isFollowing) {
      currentUser.following.pull(userId);
      targetUser.followers.pull(currentUserId);
    } else {
      currentUser.following.push(userId);
      targetUser.followers.push(currentUserId);
    }

    await currentUser.save();
    await targetUser.save();

    res.status(200).json({
      success: true,
      message: isFollowing ? 'User unfollowed' : 'User followed',
      isFollowing: !isFollowing,
      followersCount: targetUser.followers.length,
      followingCount: currentUser.following.length
    });

  } catch (error) {
    console.error('Toggle follow error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while toggling follow'
    });
  }
};

const getFollowers = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const user = await User.findById(userId)
      .populate({
        path: 'followers',
        select: 'username fullName profilePic bio',
        options: {
          limit: limit * 1,
          skip: (page - 1) * limit
        }
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const totalFollowers = user.followers.length;

    res.status(200).json({
      success: true,
      followers: user.followers,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalFollowers / limit),
        totalFollowers,
        hasNext: page < Math.ceil(totalFollowers / limit),
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get followers error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching followers'
    });
  }
};

const getFollowing = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const user = await User.findById(userId)
      .populate({
        path: 'following',
        select: 'username fullName profilePic bio',
        options: {
          limit: limit * 1,
          skip: (page - 1) * limit
        }
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const totalFollowing = user.following.length;

    res.status(200).json({
      success: true,
      following: user.following,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalFollowing / limit),
        totalFollowing,
        hasNext: page < Math.ceil(totalFollowing / limit),
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get following error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching following'
    });
  }
};

const searchUsers = async (req, res) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const searchQuery = {
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { fullName: { $regex: q, $options: 'i' } }
      ]
    };

    const users = await User.find(searchQuery)
      .select('username fullName profilePic bio')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await User.countDocuments(searchQuery);

    res.status(200).json({
      success: true,
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while searching users'
    });
  }
};

const getUserFeed = async (req, res) => {
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
    const { page = 1, limit = 10 } = req.query;

    const user = await User.findById(userId);
    const followingIds = user.following;

    followingIds.push(userId);

    const posts = await Post.find({ 
      user: { $in: followingIds }, 
      isPublic: true 
    })
      .populate('user', 'username fullName profilePic')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Post.countDocuments({ 
      user: { $in: followingIds }, 
      isPublic: true 
    });

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
    console.error('Get user feed error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching feed'
    });
  }
};

module.exports = {
  getUserProfile,
  updateProfile,
  changePassword,
  toggleFollow,
  getFollowers,
  getFollowing,
  searchUsers,
  getUserFeed
};
