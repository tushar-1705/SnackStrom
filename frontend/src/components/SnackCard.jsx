import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaComment, FaClock, FaThumbsUp, FaUser, FaTimes, FaUtensils, FaTag } from 'react-icons/fa';
import { useSnacks } from '../context/SnackContext';

const SnackCard = ({ snack }) => {
  const { likeSnack, user, addComment } = useSnacks();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [showModal, setShowModal] = useState(false);
  const {
    _id,
    title,
    description,
    image,
    category,
    likes = [],
    comments = [],
    createdAt,
    author,
    user: postUser,
    tags = [],
    ingredients = [],
    preparationTime,
    difficulty,
    weather
  } = snack;

  const likeCount = likes.length;
  const commentCount = comments.length;
  const isLiked = user ? likes.some(like => 
    (typeof like === 'string' ? like : like._id) === user._id
  ) : false;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };


  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (user) {
      await likeSnack(_id);
    } else {
      alert('Please login to like posts');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      alert('Please login to comment');
      return;
    }
    if (newComment.trim()) {
      try {
        await addComment(_id, newComment);
        setNewComment('');
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInSeconds = Math.floor((now - postDate) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return formatDate(date);
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showModal) {
        setShowModal(false);
      }
    };

    if (showModal) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [showModal]);

  return (
    <div 
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer"
      onClick={() => setShowModal(true)}
    >
      <div className="p-3 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {postUser?.username?.charAt(0)?.toUpperCase() || author?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 text-sm truncate">{postUser?.username || author?.name || 'Anonymous'}</h3>
            <p className="text-xs text-gray-500">{formatTimeAgo(createdAt)}</p>
          </div>
          <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {category || 'snack'}
          </div>
        </div>
      </div>

      <div className="relative">
        <img
          src={image || 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&h=300&fit=crop'}
          alt={title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
          {weather || 'rainy'} ☔
        </div>
      </div>

      <div className="p-3">
        <h2 className="text-sm font-bold text-gray-900 mb-1 line-clamp-2">{title}</h2>
        <p className="text-gray-600 text-xs mb-2 line-clamp-2">{description}</p>
        {description && description.length > 50 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowModal(true);
            }}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium mb-2"
          >
            more...
          </button>
        )}
        
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {tags.slice(0, 2).map((tag, index) => (
              <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <div className="flex items-center space-x-2">
            <span className="flex items-center space-x-1">
              <FaClock className="text-xs" />
              <span>{preparationTime || 0}m</span>
            </span>
          </div>
          <span className="bg-gray-100 px-2 py-0.5 rounded-full text-xs">
            {difficulty || 'easy'}
          </span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 px-2 py-1 rounded-lg transition-all duration-200 ${
                isLiked 
                  ? 'text-red-500 bg-red-50' 
                  : 'text-gray-500 hover:text-red-500 hover:bg-red-50'
              }`}
            >
              <FaThumbsUp className="text-xs" />
              <span className="text-xs font-medium">{likeCount || 0}</span>
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowComments(!showComments);
              }}
              className="flex items-center space-x-1 px-2 py-1 rounded-lg text-gray-500 hover:text-blue-500 hover:bg-blue-50 transition-all duration-200"
            >
              <FaComment className="text-xs" />
              <span className="text-xs font-medium">{commentCount || 0}</span>
            </button>
          </div>
        </div>

        {showComments && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="space-y-2 mb-2">
              {comments.slice(0, 2).map((comment, index) => (
                <div key={index} className="flex space-x-2">
                  <div className="w-5 h-5 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                    {comment.user?.username?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-900">{comment.text}</p>
                    <p className="text-xs text-gray-500">{formatTimeAgo(comment.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {user && (
              <div className="flex space-x-2">
                <div className="w-5 h-5 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                  {user.username?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1 flex space-x-1">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add comment..."
                    className="flex-1 text-xs px-2 py-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <button
                    onClick={handleComment}
                    className="px-2 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 transition-colors duration-200"
                  >
                    Post
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[70vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Post Details</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <FaTimes className="text-gray-500 text-sm" />
              </button>
            </div>

            <div className="p-3">

              <div className="relative mb-2">
                <img
                  src={image || 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&h=300&fit=crop'}
                  alt={title}
                  className="w-full h-40 object-cover rounded-lg"
                />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
                  {weather || 'rainy'} ☔
                </div>
              </div>

              <div className="mb-2">
                <h1 className="text-base font-bold text-gray-900 mb-1">{title}</h1>
                <p className="text-gray-600 text-xs leading-relaxed">{description}</p>
              </div>

              {tags && tags.length > 0 && (
                <div className="mb-2">
                  <div className="flex items-center gap-1 mb-1">
                    <FaTag className="text-xs text-gray-500" />
                    <span className="text-xs text-gray-500">Tags:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {tags.map((tag, index) => (
                      <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {ingredients && ingredients.length > 0 && (
                <div className="mb-2">
                  <div className="flex items-center gap-1 mb-1">
                    <FaUtensils className="text-xs text-gray-500" />
                    <span className="text-xs text-gray-500">Ingredients:</span>
                  </div>
                  <div className="text-gray-600 text-xs">
                    {ingredients.map((ingredient, index) => (
                      <span key={index} className="inline-block mr-2 mb-0.5">
                        • {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <div className="flex items-center space-x-2">
                  <span className="flex items-center space-x-1">
                    <FaClock className="text-xs" />
                    <span>{preparationTime || 0}m</span>
                  </span>
                </div>
                <span className="bg-gray-100 px-2 py-0.5 rounded-full text-xs">
                  {difficulty || 'easy'}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleLike}
                    className={`flex items-center space-x-1 px-2 py-1 rounded-lg transition-all duration-200 ${
                      isLiked 
                        ? 'text-red-500 bg-red-50' 
                        : 'text-gray-500 hover:text-red-500 hover:bg-red-50'
                    }`}
                  >
                    <FaThumbsUp className="text-xs" />
                    <span className="text-xs font-medium">{likeCount}</span>
                  </button>
                  
                  <button
                    onClick={() => setShowComments(!showComments)}
                    className="flex items-center space-x-1 px-2 py-1 rounded-lg text-gray-500 hover:text-blue-500 hover:bg-blue-50 transition-all duration-200"
                  >
                    <FaComment className="text-xs" />
                    <span className="text-xs font-medium">{commentCount}</span>
                  </button>
                  
                  <button className="flex items-center space-x-1 px-2 py-1 rounded-lg text-gray-500 hover:text-pink-500 hover:bg-pink-50 transition-all duration-200">
                    <FaHeart className="text-xs" />
                  </button>
                </div>
              </div>

              {showComments && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <h3 className="text-xs font-semibold text-gray-900 mb-2">Comments</h3>
                  
                  <div className="space-y-2 mb-2">
                    {comments.map((comment, index) => (
                      <div key={index} className="flex space-x-2">
                        <div className="w-5 h-5 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                          {comment.user?.username?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1">
                          <div className="bg-gray-50 rounded-lg p-2">
                            <p className="text-gray-900 text-xs">{comment.text}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{formatTimeAgo(comment.createdAt)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {user && (
                    <div className="flex space-x-2">
                      <div className="w-5 h-5 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                        {user.username?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1 flex space-x-1">
                        <input
                          type="text"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Add comment..."
                          className="flex-1 text-xs px-2 py-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <button
                          onClick={handleComment}
                          className="px-2 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 transition-colors duration-200"
                        >
                          Post
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SnackCard;