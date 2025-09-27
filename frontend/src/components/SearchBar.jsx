import React, { useState } from 'react';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';

const SearchBar = ({ onSearch, onFilterChange, currentFilter, searchQuery, setSearchQuery }) => {
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    'All',
    'Hot Drinks',
    'Cold Drinks',
    'Sweet Snacks',
    'Savory Snacks',
    'Healthy Options',
    'Comfort Food',
    'Traditional',
    'International'
  ];

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  const handleFilterClick = (category) => {
    onFilterChange(category);
  };

  const clearSearch = () => {
    setSearchQuery('');
    onSearch('');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for snacks, drinks, or ingredients..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 bg-gray-50 focus:bg-white"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-300"
                aria-label="Clear search"
              >
                <FaTimes />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              showFilters
                ? 'bg-primary-500 text-white'
                : 'bg-gray-50 text-gray-700 border-2 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <FaFilter />
            <span>Filters</span>
          </button>
        </div>

        {showFilters && (
          <div className="animate-fadeIn">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleFilterClick(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    currentFilter === category
                      ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                      : 'bg-white text-gray-600 border-2 border-gray-200 hover:bg-gray-50 hover:border-primary-500 hover:text-primary-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
