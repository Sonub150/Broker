import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { FaUserCircle, FaEnvelope, FaIdBadge, FaEdit, FaCheck, FaTimes, FaEye, FaEyeSlash } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { signInSuccess, signInFailure } from '../redux/user/userSlice'

const BACKEND = (import.meta.env.Backend && import.meta.env.Backend.startsWith('mongodb'))
  ? import.meta.env.Backend
  : (import.meta.env.Backend || import.meta.env.VITE_MONGO || 'http://localhost:3000');

function Profile() {
  // Get current user from Redux
  const currentUser = useSelector((state) => state.user.currentUser)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  console.log('Profile currentUser:', currentUser);

  useEffect(() => {
    if (!currentUser) {
      navigate('/sign-in');
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null; // Or a loading spinner
  }

  // Support both direct user object and nested user object (backend response)
  const user = currentUser.data?.user || currentUser;
  const [modalOpen, setModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [editValues, setEditValues] = useState({
    name: user.displayName || user.username || '',
    email: user.email || '',
    password: user.password || '',
  });
  const [avatarPreview, setAvatarPreview] = useState(user.photoURL || '');

  const handleChange = (e) => setEditValues({ ...editValues, [e.target.name]: e.target.value });
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSave = async (e) => {
    e.preventDefault();

    // Prepare the data to send to the backend
    const updatedUserData = {
      username: editValues.name,
      email: editValues.email,
      password: editValues.password,
      avatar: avatarPreview || user.avatar,
    };

    try {
      // Send a POST request to the backend to update the user
      // The backend expects the user's id in the URL
      const response = await fetch(
        `/api/update/${user._id || user.id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Important: send cookies (for JWT auth)
          body: JSON.stringify(updatedUserData),
        }
      );

      let data;
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        // If the response is not ok, throw an error to be caught below
        throw new Error(data.message || 'Failed to update user');
      }

      // Update Redux state with the new user data
      dispatch(signInSuccess(data.data.user));
      setModalOpen(false);
      // Optionally, show a success message here
    } catch (error) {
      // Handle errors (show error message to user, etc.)
      dispatch(signInFailure(error.message));
      alert(error.message);
    }
  };
  const handleOpenModal = () => {
    setEditValues({
      name: user.displayName || user.username || '',
      email: user.email || '',
      password: user.password || '',
    });
    setAvatarPreview(user.photoURL || '');
    setModalOpen(true);
  };
  const handleCloseModal = () => setModalOpen(false);
  const handleSignOut = async () => {
    try {
      const res = await fetch(`${BACKEND}/api/signout`, { method: 'POST', credentials: 'include' });
      if (!res.ok) throw new Error('Signout failed');
      dispatch(signInSuccess(null)); // Clear user from Redux
      navigate('/sign-in');
    } catch (err) {
      alert('Signout failed. Please try again.');
    }
  };

  // Handler for Create Listing button
  const handleCreateListing = () => {
    navigate('/create-listing');
  };

  // Handler for Show Listing button
  const handleShowListing = () => {
    navigate('/my-listings');
  };

  const name = user.displayName || user.username || 'User';
  const email = user.email || '';
  const uid = user.uid || user._id || '';
  const password = user.password || '';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-100 px-2 relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-gradient-to-br from-green-200 to-blue-200 rounded-full opacity-30 blur-2xl z-0"></div>
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-gradient-to-tr from-blue-200 to-green-100 rounded-full opacity-20 blur-2xl z-0"></div>
      <div className="relative z-10 w-full max-w-xl">
        <div className="bg-white bg-opacity-95 p-0 rounded-2xl shadow-xl flex flex-col gap-0 border border-gray-200">
          {/* Card Header: Avatar, Name, Email, Edit button */}
          <div className="flex items-center gap-6 px-8 py-8 border-b border-gray-100">
            {/* Avatar */}
            {avatarPreview ? (
              <img src={avatarPreview} alt="avatar" className="h-20 w-20 rounded-full shadow border-2 border-green-200 object-cover" />
            ) : (
              <FaUserCircle className="h-20 w-20 text-green-200 rounded-full shadow border-2 border-green-100" />
            )}
            {/* Name & Email */}
            <div className="flex-1 min-w-0">
              <div className="text-2xl font-bold text-gray-800 truncate">{user.displayName || user.username || 'User'}</div>
              <div className="text-gray-500 text-base truncate">{user.email}</div>
            </div>
            {/* Edit Button */}
            <button
              onClick={handleOpenModal}
              className="ml-4 bg-gradient-to-r from-blue-400 to-green-400 hover:from-blue-500 hover:to-green-500 text-white font-bold px-6 py-2 rounded-full shadow-lg border-none transition flex items-center gap-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-200 hover:scale-105 active:scale-100"
            >
              <FaEdit className="w-5 h-5" /> Edit Profile
            </button>
          </div>
          {/* Add Create Listing Button below Edit Button */}
          <div className="flex justify-end px-8 pb-4 gap-4">
            <button
              onClick={handleCreateListing}
              className="bg-gradient-to-r from-green-400 to-blue-400 hover:from-green-500 hover:to-blue-500 text-white font-bold px-6 py-2 rounded-full shadow-lg border-none transition flex items-center gap-2 text-base focus:outline-none focus:ring-2 focus:ring-green-200 hover:scale-105 active:scale-100"
            >
              <FaEdit className="w-5 h-5 rotate-45" /> Create Listing
            </button>
            <button
              onClick={handleShowListing}
              className="bg-gradient-to-r from-blue-400 to-green-400 hover:from-blue-500 hover:to-green-500 text-white font-bold px-6 py-2 rounded-full shadow-lg border-none transition flex items-center gap-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-200 hover:scale-105 active:scale-100"
            >
              <FaEye className="w-5 h-5" /> ShowListing
            </button>
          </div>
          {/* Card Body: Details */}
          <div className="px-8 py-6 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">User ID</span>
              <span className="text-sm font-mono text-gray-700 bg-gray-50 rounded px-2 py-1 w-fit">{user.uid || user._id}</span>
            </div>
            {user.providerData && user.providerData.length > 0 && (
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Provider</span>
                <span className="text-sm text-pink-700 bg-pink-50 rounded px-2 py-1 w-fit capitalize">{user.providerData[0].providerId.replace('.com','')}</span>
              </div>
            )}
          </div>
          {/* Card Footer: Sign Out */}
          <div className="px-8 py-4 border-t border-gray-100 flex justify-end">
            <button onClick={handleSignOut} className="bg-gradient-to-r from-green-400 to-blue-400 hover:from-green-500 hover:to-blue-500 text-white font-bold px-8 py-2 rounded-full shadow transition text-base tracking-wide hover:scale-105 active:scale-100 focus:outline-none focus:ring-2 focus:ring-green-200">Sign Out</button>
          </div>
        </div>
        {/* Edit Profile Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-30">
            <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-2xl p-0 w-full max-w-2xl flex flex-row gap-0 relative animate-fade-in overflow-hidden">
              {/* Left: Avatar Upload */}
              <div className="flex flex-col items-center justify-center bg-gray-50 px-8 py-10 border-r border-gray-100 min-w-[220px]">
                <label htmlFor="avatar-upload" className="cursor-pointer group flex flex-col items-center gap-2">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="avatar preview" className="h-24 w-24 rounded-full shadow border-2 border-green-200 object-cover group-hover:opacity-80 transition" />
                  ) : (
                    <FaUserCircle className="text-6xl text-green-200 group-hover:opacity-80 transition" />
                  )}
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  <span className="text-xs text-gray-500 group-hover:text-green-600 transition">Change Photo</span>
                </label>
              </div>
              {/* Right: Fields */}
              <div className="flex-1 flex flex-col gap-6 px-10 py-10">
                <button type="button" onClick={handleCloseModal} className="absolute top-4 right-6 text-gray-400 hover:text-red-500 text-2xl font-bold">&times;</button>
                <h2 className="text-2xl font-bold text-green-700 mb-2">Edit Profile</h2>
                <div className="flex flex-col gap-2">
                  <label className="block text-gray-700 font-semibold mb-1" htmlFor="name">Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={editValues.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 bg-green-50 shadow-sm text-base"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="block text-gray-700 font-semibold mb-1" htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={editValues.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-blue-50 shadow-sm text-base"
                    required
                  />
                </div>
                {/* Password field only for backend users */}
                {user.password !== undefined && (
                  <div className="flex flex-col gap-2">
                    <label className="block text-gray-700 font-semibold mb-1" htmlFor="password">Password</label>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={editValues.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 bg-purple-50 shadow-sm text-base pr-10"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-700"
                        onClick={() => setShowPassword((v) => !v)}
                        tabIndex={-1}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                )}
                <div className="flex gap-3 mt-4">
                  <button type="submit" className="flex-1 bg-gradient-to-r from-green-400 to-blue-400 hover:from-green-500 hover:to-blue-500 text-white font-bold py-2 rounded-full shadow transition text-lg">Save</button>
                  <button type="button" onClick={handleCloseModal} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 rounded-full shadow transition text-lg">Cancel</button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
