import React, { useState, useEffect } from 'react';
import { useSnacks } from '../context/SnackContext';
import SnackCard from '../components/SnackCard';
import { FaSearch, FaPlus, FaHome, FaUser, FaHeart, FaComment, FaShare } from 'react-icons/fa';

const Home = () => {
  const { snacks, loading, error, loadSnacks, user } = useSnacks();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSnacks, setFilteredSnacks] = useState([]);

  useEffect(() => {
    loadSnacks();
  }, [loadSnacks]);

  useEffect(() => {
    const snacksArray = Array.isArray(snacks) ? snacks : [];
    let filtered = snacksArray;

    if (searchQuery.trim()) {
      filtered = filtered.filter(snack =>
        snack.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        snack.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        snack.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        snack.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredSnacks(filtered);
  }, [snacks, searchQuery]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">😔</div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => loadSnacks()}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Creative Heading */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            🌧️ Cozy Comforts & Rainy Day Delights
          </h2>
          <p className="text-gray-600 text-lg">
            Discover the perfect snacks and drinks for those peaceful rainy moments
          </p>
        </div>

        {/* Posts Feed - 4 cards per row */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredSnacks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🍪</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery 
                ? 'Try adjusting your search criteria'
                : 'Be the first to share a snack!'
              }
            </p>
            {user && (
              <button
                onClick={() => window.location.href = '/add-snack'}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200"
              >
                Create First Post
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredSnacks.map(snack => (
              <SnackCard key={snack._id} snack={snack} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;