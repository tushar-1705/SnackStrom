import React, { useState, useEffect } from 'react';
import { useSnacks } from '../context/SnackContext';
import { FaUser, FaHeart, FaComment, FaEdit, FaTrash, FaPlus, FaUpload, FaCamera, FaSave, FaTimes } from 'react-icons/fa';
import SnackCard from '../components/SnackCard';
import toast from 'react-hot-toast';

const Profile = () => {
  const { snacks, user, logout, updateUser, updateSnack, deleteSnack } = useSnacks();
  const [activeTab, setActiveTab] = useState('my-snacks');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: '',
    bio: '',
    favoriteSnack: '',
    favoriteDrink: '',
    profilePic: ''
  });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [editingSnack, setEditingSnack] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    image: '',
    tags: [],
    ingredients: [],
    preparationTime: 0,
    difficulty: 'easy',
    servings: 1,
    weather: 'rainy'
  });

  const snacksArray = Array.isArray(snacks) ? snacks : [];
  const userSnacks = snacksArray.filter(snack => snack.user?._id === user?._id);
  const likedSnacks = snacksArray.filter(snack => snack.isLiked);

  const stats = {
    totalSnacks: userSnacks.length,
    totalLikes: userSnacks.reduce((sum, snack) => sum + (snack.likeCount || 0), 0),
    totalComments: userSnacks.reduce((sum, snack) => sum + (snack.commentCount || 0), 0)
  };

  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.fullName || '',
        bio: user.bio || '',
        favoriteSnack: user.favoriteSnack || '',
        favoriteDrink: user.favoriteDrink || '',
        profilePic: user.profilePic || ''
      });
      setImagePreview(user.profilePic || '');
    }
  }, [user]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = async (e) => {
        setImagePreview(e.target.result);
        
        try {
          setIsUploadingImage(true);
          const { authAPI } = await import('../services/api');
          
          const updateData = {
            profilePic: e.target.result
          };
          
          console.log('Auto-saving profile picture only...');
          const response = await authAPI.updateProfile(updateData);
          console.log('Profile picture update response:', response.data);
          
          toast.success('Profile picture updated successfully!');
          updateUser(response.data.user);
          setIsUploadingImage(false);
        } catch (error) {
          console.error('Profile picture update error:', error);
          toast.error(`Failed to update profile picture: ${error.response?.data?.message || error.message}`);
          setIsUploadingImage(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditFormData(prev => ({
          ...prev,
          image: e.target.result
        }));
        toast.success('Image updated! Click Update Snack to save changes.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setIsUpdating(true);
      const { authAPI } = await import('../services/api');
      
      const updateData = {
        fullName: profileData.fullName,
        bio: profileData.bio,
        favoriteSnack: profileData.favoriteSnack,
        favoriteDrink: profileData.favoriteDrink,
        profilePic: profileData.profilePic
      };


      if (profileImage) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          updateData.profilePic = e.target.result;
          try {
            const response = await authAPI.updateProfile(updateData);
            toast.success('Profile updated successfully!');
            setIsEditing(false);
            setIsUpdating(false);
            updateUser(response.data.user);
          } catch (error) {
            console.error('Profile update error:', error);
            toast.error(`Failed to update profile: ${error.response?.data?.message || error.message}`);
            setIsUpdating(false);
          }
        };
        reader.readAsDataURL(profileImage);
      } else {
        const response = await authAPI.updateProfile(updateData);
        toast.success('Profile updated successfully!');
        setIsEditing(false);
        setIsUpdating(false);
        updateUser(response.data.user);
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(`Failed to update profile: ${error.response?.data?.message || error.message}`);
      setIsUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    if (user) {
      setProfileData({
        fullName: user.fullName || '',
        bio: user.bio || '',
        favoriteSnack: user.favoriteSnack || '',
        favoriteDrink: user.favoriteDrink || '',
        profilePic: user.profilePic || ''
      });
      setImagePreview(user.profilePic || '');
      setProfileImage(null);
    }
    setIsEditing(false);
  };

  const handleEditSnack = (snackId) => {
    const snack = userSnacks.find(s => s._id === snackId);
    if (snack) {
      setEditingSnack(snack);
      setEditFormData({
        title: snack.title || '',
        description: snack.description || '',
        image: snack.image || '',
        tags: snack.tags || [],
        ingredients: snack.ingredients || [],
        preparationTime: snack.preparationTime || 0,
        difficulty: snack.difficulty || 'easy',
        servings: snack.servings || 1,
        weather: snack.weather || 'rainy'
      });
    }
  };

  const handleDeleteSnack = async (snackId) => {
    if (window.confirm('Are you sure you want to delete this snack? This action cannot be undone.')) {
      try {
        await deleteSnack(snackId);
        toast.success('Snack deleted successfully!');
      } catch (error) {
        console.error('Error deleting snack:', error);
        toast.error('Failed to delete snack');
      }
    }
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!editFormData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    
    if (!editFormData.description.trim()) {
      toast.error('Please enter a description');
      return;
    }

    try {
      setIsUpdating(true);
      const snackData = {
        title: editFormData.title.trim(),
        description: editFormData.description.trim(),
        image: editFormData.image || 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&h=300&fit=crop',
        tags: Array.isArray(editFormData.tags) ? editFormData.tags : [],
        ingredients: Array.isArray(editFormData.ingredients) ? editFormData.ingredients : [],
        preparationTime: parseInt(editFormData.preparationTime) || 0,
        difficulty: editFormData.difficulty,
        servings: parseInt(editFormData.servings) || 1,
        weather: editFormData.weather
      };
      
      await updateSnack(editingSnack._id, snackData);
      setEditingSnack(null);
      toast.success('Snack updated successfully!');
    } catch (error) {
      console.error('Error updating snack:', error);
      toast.error('Failed to update snack');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCloseEditModal = () => {
    setEditingSnack(null);
    setEditFormData({
      title: '',
      description: '',
      image: '',
      tags: [],
      ingredients: [],
      preparationTime: 0,
      difficulty: 'easy',
      servings: 1,
      weather: 'rainy'
    });
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && editingSnack) {
        handleCloseEditModal();
      }
    };

    if (editingSnack) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [editingSnack]);

  const tabs = [
    { id: 'my-snacks', label: 'My Snacks', count: userSnacks.length },
    { id: 'liked-snacks', label: 'Liked Snacks', count: likedSnacks.length },
    { id: 'settings', label: 'Settings', count: null }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'my-snacks':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">My Shared Snacks</h3>
              <button 
                onClick={() => window.location.href = '/add-snack'}
                className="btn-primary flex items-center space-x-2"
              >
                <FaPlus />
                <span>Add New Snack</span>
              </button>
            </div>
            
            {userSnacks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {userSnacks.map(snack => (
                  <div key={snack._id} className="relative group">
                    <SnackCard snack={snack} />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex space-x-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditSnack(snack._id);
                          }}
                          className="p-2 bg-white/90 rounded-full shadow-md hover:bg-primary-500 hover:text-white transition-colors duration-300"
                        >
                          <FaEdit className="text-sm" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSnack(snack._id);
                          }}
                          className="p-2 bg-white/90 rounded-full shadow-md hover:bg-red-500 hover:text-white transition-colors duration-300"
                        >
                          <FaTrash className="text-sm" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🍪</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No snacks shared yet</h3>
                <p className="text-gray-600 mb-6">Start sharing your favorite rainy day snacks!</p>
                <button 
                  onClick={() => window.location.href = '/add-snack'}
                  className="btn-primary"
                >
                  Share Your First Snack
                </button>
              </div>
            )}
          </div>
        );

      case 'liked-snacks':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Snacks I Liked</h3>
            
            {likedSnacks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {likedSnacks.map(snack => (
                  <SnackCard key={snack._id} snack={snack} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">❤️</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No liked snacks yet</h3>
                <p className="text-gray-600">Start exploring and liking snacks!</p>
              </div>
            )}
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">Profile Settings</h3>
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <FaEdit />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button 
                    onClick={handleSaveProfile}
                    disabled={isUpdating}
                    className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaSave />
                    <span>{isUpdating ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                  <button 
                    onClick={handleCancelEdit}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <FaTimes />
                    <span>Cancel</span>
                  </button>
                </div>
              )}
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Profile Information</h4>
              <div className="space-y-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Picture
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={imagePreview || user.profilePic || '/api/placeholder/avatar'}
                        alt="Profile"
                        className={`w-12 h-12 rounded-full object-cover border-2 border-gray-200 ${isUploadingImage ? 'opacity-50' : ''}`}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div 
                        className={`w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-xs border-2 border-gray-200 ${isUploadingImage ? 'opacity-50' : ''}`}
                        style={{ display: 'none' }}
                      >
                        {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      
                      {isUploadingImage && (
                        <div className="absolute inset-0 w-12 h-12 rounded-full bg-black bg-opacity-50 flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        </div>
                      )}
                      
                      <label className={`absolute -bottom-1 -right-1 p-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors duration-300 cursor-pointer ${isUploadingImage ? 'opacity-50 pointer-events-none' : ''}`}>
                        <FaCamera className="text-xs" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={isUploadingImage}
                        />
                      </label>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Click the camera icon to upload a new photo</p>
                      <p className="text-xs text-gray-500">JPG, PNG up to 5MB</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={profileData.fullName}
                    onChange={handleProfileChange}
                    className="input"
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    About Yourself
                  </label>
                  <textarea
                    name="bio"
                    value={profileData.bio}
                    onChange={handleProfileChange}
                    className="textarea"
                    rows={3}
                    placeholder="Tell us about yourself..."
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Favorite Snack
                  </label>
                  <input
                    type="text"
                    name="favoriteSnack"
                    value={profileData.favoriteSnack}
                    onChange={handleProfileChange}
                    className="input"
                    placeholder="e.g., Chocolate Chip Cookies"
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Favorite Drink
                  </label>
                  <input
                    type="text"
                    name="favoriteDrink"
                    value={profileData.favoriteDrink}
                    onChange={handleProfileChange}
                    className="input"
                    placeholder="e.g., Hot Chocolate"
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Account Actions</h4>
              <div className="space-y-4">
                <button 
                  onClick={logout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">Please login to view your profile.</p>
          <button
            onClick={() => window.location.href = '/'}
            className="btn-primary"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
      <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col">
        <div className="bg-white rounded-xl shadow-lg p-3 mb-3 flex-shrink-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={imagePreview || user.profilePic || '/api/placeholder/avatar'}
                alt={user.fullName || user.username}
                className={`w-12 h-12 rounded-full object-cover border-2 border-white shadow-lg ${isUploadingImage ? 'opacity-50' : ''}`}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div 
                className={`w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm border-2 border-white shadow-lg ${isUploadingImage ? 'opacity-50' : ''}`}
                style={{ display: 'none' }}
              >
                {user?.username?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              
              {isUploadingImage && (
                <div className="absolute inset-0 w-12 h-12 rounded-full bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                </div>
              )}
              
              <label className={`absolute -bottom-1 -right-1 p-1 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors duration-300 cursor-pointer ${isUploadingImage ? 'opacity-50 pointer-events-none' : ''}`}>
                <FaCamera className="text-xs" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={isUploadingImage}
                />
              </label>
            </div>
            
            <div className="flex-1">
              <h1 className="text-lg font-bold text-gray-900 mb-1">
                {profileData.fullName || user.username || 'Anonymous'}
              </h1>
              <p className="text-xs text-gray-600 mb-1 line-clamp-2">
                {profileData.bio || 'No bio yet. Tell us about yourself!'}
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                {profileData.favoriteSnack && (
                  <span>🍪 {profileData.favoriteSnack}</span>
                )}
                {profileData.favoriteDrink && (
                  <span>☕ {profileData.favoriteDrink}</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="text-base font-bold text-gray-900">{stats.totalSnacks}</div>
                <div className="text-xs text-gray-600">Snacks</div>
              </div>
              <div>
                <div className="text-base font-bold text-gray-900">{stats.totalLikes}</div>
                <div className="text-xs text-gray-600">Likes</div>
              </div>
              <div>
                <div className="text-base font-bold text-gray-900">{stats.totalComments}</div>
                <div className="text-xs text-gray-600">Comments</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg flex-1 flex flex-col overflow-hidden">
          <div className="border-b border-gray-200 flex-shrink-0">
            <nav className="flex space-x-4 px-3">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-300 ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  {tab.count !== null && (
                    <span className="ml-2 bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex-1 overflow-auto p-3">
            {renderTabContent()}
          </div>
        </div>
      </div>

      {editingSnack && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleCloseEditModal}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Edit Snack</h2>
              <button
                onClick={handleCloseEditModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <FaTimes className="text-gray-500" />
              </button>
            </div>

            <form id="edit-form" onSubmit={handleEditFormSubmit} className="flex-1 p-4 space-y-3">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={editFormData.title}
                    onChange={handleEditFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter snack title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={editFormData.description}
                    onChange={handleEditFormChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe your snack"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                  <div className="flex items-center space-x-4">
                    <div className="relative group">
                      <img
                        src={editFormData.image || 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&h=300&fit=crop'}
                        alt="Snack preview"
                        className="w-20 h-20 object-cover rounded-lg border border-gray-200 cursor-pointer"
                        onClick={() => document.getElementById('edit-image-upload').click()}
                      />
                      <input
                        id="edit-image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleEditImageUpload}
                        className="hidden"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg flex items-center justify-center transition-all duration-200 pointer-events-none">
                        <FaCamera className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Click on image to change</p>
                      <p className="text-xs text-gray-500">Supports JPG, PNG, GIF (max 5MB)</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prep Time (min)</label>
                  <input
                    type="number"
                    name="preparationTime"
                    value={editFormData.preparationTime}
                    onChange={handleEditFormChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Servings</label>
                  <input
                    type="number"
                    name="servings"
                    value={editFormData.servings}
                    onChange={handleEditFormChange}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                  <select
                    name="difficulty"
                    value={editFormData.difficulty}
                    onChange={handleEditFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weather</label>
                  <select
                    name="weather"
                    value={editFormData.weather}
                    onChange={handleEditFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="rainy">Rainy</option>
                    <option value="sunny">Sunny</option>
                    <option value="cloudy">Cloudy</option>
                    <option value="snowy">Snowy</option>
                  </select>
                </div>
              </div>

            </form>

            <div className="flex space-x-3 p-4 border-t border-gray-200 bg-white">
              <button
                type="button"
                onClick={handleCloseEditModal}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="edit-form"
                disabled={isUpdating}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? 'Updating...' : 'Update Snack'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;