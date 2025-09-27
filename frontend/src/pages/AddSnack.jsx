import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnacks } from '../context/SnackContext';
import toast from 'react-hot-toast';
import { FaUpload, FaTimes, FaSignInAlt } from 'react-icons/fa';

const AddSnack = () => {
  const navigate = useNavigate();
  const { addSnack, user } = useSnacks();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'snack',
    title: '',
    description: '',
    image: '',
    tags: [],
    ingredients: [],
    preparationTime: '',
    difficulty: 'easy',
    servings: '',
    weather: 'rainy'
  });

  const difficulties = ['easy', 'medium', 'hard'];
  const weatherTypes = ['rainy', 'cloudy', 'stormy', 'any'];
  const tagOptions = [
    'comfort food', 'healthy', 'sweet', 'savory', 'hot', 'cold', 
    'traditional', 'international', 'quick', 'homemade', 'vegetarian', 'vegan'
  ];

  useEffect(() => {
    if (!user) {
      toast.error('Please login to add snacks');
      navigate('/');
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">
            You need to be logged in to add snacks to our community.
          </p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary w-full flex items-center justify-center space-x-2"
          >
            <FaSignInAlt />
            <span>Go to Login</span>
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagToggle = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleIngredientsChange = (e) => {
    const ingredients = e.target.value.split('\n').filter(ingredient => ingredient.trim());
    setFormData(prev => ({
      ...prev,
      ingredients
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    
    if (!formData.description.trim()) {
      toast.error('Please enter a description');
      return;
    }

    setLoading(true);
    try {
      const snackData = {
        type: formData.type,
        title: formData.title.trim(),
        description: formData.description.trim(),
        image: formData.image || 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&h=300&fit=crop',
        tags: Array.isArray(formData.tags) ? formData.tags : [],
        ingredients: Array.isArray(formData.ingredients) ? formData.ingredients : [],
        preparationTime: parseInt(formData.preparationTime) || 0,
        difficulty: formData.difficulty,
        servings: parseInt(formData.servings) || 1,
        weather: formData.weather
      };
      
      
      const result = await addSnack(snackData);
      
      toast.success('Snack added successfully!');
      navigate('/');
    } catch (error) {
      console.error('Add snack error:', error);
      
      if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors.map(err => err.msg).join(', ');
        toast.error(`Validation errors: ${errorMessages}`);
      } else {
        toast.error(`Failed to add snack: ${error.response?.data?.message || error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          image: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: ''
    }));
  };

  return (
    <div className="h-screen flex items-start justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden pt-8">
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="text-center mb-2">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Share Your Rainy Day Snack
          </h1>
          <p className="text-sm text-gray-600">
            Tell us about your favorite comfort food or drink for those cozy rainy days
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-1">
            {/* Row 1: Type and Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="type" className="block text-xs font-medium text-gray-700 mb-0.5">
                  Type *
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="input"
                  required
                >
                  <option value="snack">Snack</option>
                  <option value="drink">Drink</option>
                </select>
              </div>

              <div>
                <label htmlFor="title" className="block text-xs font-medium text-gray-700 mb-0.5">
                  Name *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g., Chocolate Chip Cookies"
                  required
                />
              </div>
            </div>

            {/* Row 2: Description and Image */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label htmlFor="description" className="block text-xs font-medium text-gray-700 mb-0.5">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="textarea"
                  rows={1}
                  placeholder="Describe your snack or drink..."
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-0.5">
                  Image
                </label>
                {formData.image ? (
                  <div className="relative">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-12 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors duration-300"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 text-center hover:border-indigo-500 transition-colors duration-300">
                    <FaUpload className="mx-auto h-4 w-4 text-gray-400 mb-1" />
                    <div className="space-y-0.5">
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <span className="text-indigo-600 font-medium text-xs">Click to upload</span>
                      </label>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <p className="text-xs text-gray-500">PNG, JPG, GIF</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Row 3: Tags and Ingredients */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-0.5">
                  Tags (Optional)
                </label>
                <div className="flex flex-wrap gap-2">
                  {tagOptions.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagToggle(tag)}
                      className={`px-2 py-1 rounded-full text-xs transition-colors duration-200 ${
                        formData.tags.includes(tag)
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="ingredients" className="block text-xs font-medium text-gray-700 mb-0.5">
                  Ingredients (Optional)
                </label>
                <textarea
                  id="ingredients"
                  name="ingredients"
                  value={formData.ingredients.join('\n')}
                  onChange={handleIngredientsChange}
                  className="textarea"
                  rows={1}
                  placeholder="List ingredients, one per line..."
                />
              </div>
            </div>

            {/* Row 4: Additional Fields */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label htmlFor="preparationTime" className="block text-xs font-medium text-gray-700 mb-0.5">
                  Prep Time (minutes)
                </label>
                <input
                  type="number"
                  id="preparationTime"
                  name="preparationTime"
                  value={formData.preparationTime}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g., 15"
                  min="0"
                />
              </div>
              <div>
                <label htmlFor="difficulty" className="block text-xs font-medium text-gray-700 mb-0.5">
                  Difficulty
                </label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="input"
                >
                  {difficulties.map(difficulty => (
                    <option key={difficulty} value={difficulty}>
                      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="servings" className="block text-xs font-medium text-gray-700 mb-0.5">
                  Servings
                </label>
                <input
                  type="number"
                  id="servings"
                  name="servings"
                  value={formData.servings}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g., 4"
                  min="1"
                />
              </div>
              <div>
                <label htmlFor="weather" className="block text-xs font-medium text-gray-700 mb-0.5">
                  Perfect for Weather
                </label>
                <select
                  id="weather"
                  name="weather"
                  value={formData.weather}
                  onChange={handleChange}
                  className="input"
                >
                  {weatherTypes.map(weather => (
                    <option key={weather} value={weather}>
                      {weather.charAt(0).toUpperCase() + weather.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>


            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium py-2 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex-1 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Adding Snack...</span>
                  </>
                ) : (
                  <span>Share Your Snack</span>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-6 rounded-lg border border-gray-300 hover:border-gray-400 transition-all duration-200 flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSnack;
