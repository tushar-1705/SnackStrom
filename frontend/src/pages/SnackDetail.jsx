import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSnacks } from '../context/SnackContext';
import { FaStar, FaHeart, FaComment, FaClock, FaUser, FaArrowLeft, FaShare } from 'react-icons/fa';
import toast from 'react-hot-toast';

const SnackDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { snacks, likeSnack, unlikeSnack, addComment } = useSnacks();
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);

  const snack = snacks.find(s => s._id === id);

  if (!snack) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Snack not found</h2>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar
        key={index}
        className={`text-lg ${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const handleLike = async () => {
    if (isLiked) {
      await unlikeSnack(snack._id);
      setIsLiked(false);
      toast.success('Removed from favorites');
    } else {
      await likeSnack(snack._id);
      setIsLiked(true);
      toast.success('Added to favorites');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await addComment(snack._id, newComment);
      setNewComment('');
      toast.success('Comment added!');
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: snack.title,
          text: snack.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors duration-300 mb-6"
        >
          <FaArrowLeft />
          <span>Back</span>
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Image */}
          <div className="relative h-64 md:h-80">
            <img
              src={snack.image || 'https://via.placeholder.com/800x400/667eea/ffffff?text=No+Image'}
              alt={snack.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-primary-500/90 text-white px-3 py-1 rounded-full text-sm font-medium">
              {snack.category}
            </div>
            <div className="absolute top-4 left-4 flex space-x-2">
              <button
                onClick={handleLike}
                className={`p-2 rounded-full transition-colors duration-300 ${
                  isLiked
                    ? 'bg-red-500 text-white'
                    : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
                }`}
              >
                <FaHeart />
              </button>
              <button
                onClick={handleShare}
                className="p-2 rounded-full bg-white/80 text-gray-600 hover:bg-primary-500 hover:text-white transition-colors duration-300"
              >
                <FaShare />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {snack.title}
              </h1>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-2">
                  {renderStars(snack.rating)}
                  <span className="text-lg font-medium text-gray-600">
                    ({snack.rating}/5)
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-gray-500">
                  <FaHeart className="text-red-400" />
                  <span>{snack.likes || 0}</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-500">
                  <FaComment className="text-blue-400" />
                  <span>{snack.comments?.length || 0}</span>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <FaUser className="text-primary-500" />
                  <span>by {snack.author?.name || 'Anonymous'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaClock />
                  <span>{formatDate(snack.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
              <p className="text-gray-600 leading-relaxed">
                {snack.description}
              </p>
            </div>

            {/* Ingredients */}
            {snack.ingredients && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Ingredients</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-line">
                    {snack.ingredients}
                  </p>
                </div>
              </div>
            )}

            {/* Instructions */}
            {snack.instructions && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Instructions</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-line">
                    {snack.instructions}
                  </p>
                </div>
              </div>
            )}

            {/* Comments Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Comments ({snack.comments?.length || 0})
              </h2>

              {/* Add Comment Form */}
              <form onSubmit={handleCommentSubmit} className="mb-6">
                <div className="flex space-x-4">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 input"
                  />
                  <button
                    type="submit"
                    className="btn-primary px-6"
                  >
                    Comment
                  </button>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-4">
                {snack.comments?.length > 0 ? (
                  snack.comments.map((comment, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <FaUser className="text-primary-500" />
                        <span className="font-medium text-gray-900">
                          {comment.author?.name || 'Anonymous'}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-700">{comment.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No comments yet. Be the first to comment!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SnackDetail;
