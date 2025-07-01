import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaHome, FaMapMarkerAlt, FaDollarSign, FaBed, FaBath, FaCouch, FaCar, FaTag, FaImage, FaUser, FaRulerCombined, FaCalendarAlt, FaWifi, FaSwimmingPool, FaTree, FaUpload } from 'react-icons/fa';

// Create Listing page for users to add a new listing
function CreateListing() {
  const navigate = useNavigate();
  const fileInputRef = useRef();
  const currentUser = useSelector((state) => state.user.currentUser);
  const user = currentUser?.data?.user || currentUser;
  const userId = user?._id || user?.id;
  // State for all listing fields
  const [form, setForm] = useState({
    name: '',
    description: '',
    regularPrice: '',
    discountedPrice: '',
    address: '',
    location: '',
    type: '',
    bedrooms: '',
    bathrooms: '',
    furnished: false,
    parking: false,
    offer: false,
    imageUrls: [''],
    localImages: [], // For local image previews
    userRef: userId || '', // Set automatically to current user's ID
    size: '', // New field: property size
    yearBuilt: '', // New field: year built
    amenities: {
      wifi: false,
      pool: false,
      garden: false,
    },
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name in form.amenities) {
      setForm((prev) => ({
        ...prev,
        amenities: { ...prev.amenities, [name]: checked },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  // Handle image URLs as a comma-separated string
  const handleImageUrlsChange = (e) => {
    setForm((prev) => ({
      ...prev,
      imageUrls: e.target.value.split(',').map((url) => url.trim()),
    }));
  };

  // Handle local image uploads
  const handleLocalImageChange = (e) => {
    const files = Array.from(e.target.files);
    const readers = files.map(file => {
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = (ev) => resolve(ev.target.result);
        reader.readAsDataURL(file);
      });
    });
    Promise.all(readers).then(images => {
      setForm(prev => ({
        ...prev,
        localImages: [...prev.localImages, ...images],
      }));
    });
  };

  // Remove a local image
  const removeLocalImage = (idx) => {
    setForm(prev => ({
      ...prev,
      localImages: prev.localImages.filter((_, i) => i !== idx),
    }));
  };

  // Remove a URL image
  const removeUrlImage = (idx) => {
    setForm(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== idx),
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      // For now, only send URLs; local images would need to be uploaded to a server or cloud storage
      const response = await fetch('/api/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Send cookies for auth
        body: JSON.stringify({ ...form, imageUrls: [...form.imageUrls, ...form.localImages] }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to create listing');
      setSuccess('Listing created successfully!');
      setTimeout(() => navigate('/profile'), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-200 via-blue-50 to-blue-300 px-2 py-8">
      <div className="w-full max-w-3xl bg-white/95 rounded-3xl shadow-2xl p-0 overflow-hidden border border-blue-100">
        <div className="bg-gradient-to-r from-green-400 to-blue-400 py-8 px-8 text-white text-center rounded-t-3xl shadow-md">
          <h2 className="text-4xl font-extrabold mb-2 drop-shadow-lg flex items-center justify-center gap-3"><FaHome className="inline-block mb-1" /> Create Listing</h2>
          <div className="flex justify-center mb-2">
            <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 font-mono text-xs px-4 py-1 rounded-full shadow-sm border border-blue-200">
              <FaUser className="text-blue-400" />
              User ID: <span className="font-semibold">{userId}</span>
            </span>
          </div>
          <p className="text-lg font-medium opacity-90">Fill out the details below to add a new property listing.</p>
        </div>
        <form onSubmit={handleSubmit} className="p-10 flex flex-col gap-10">
          {error && <div className="text-red-500 text-center font-semibold bg-red-50 border border-red-200 rounded py-2 px-4">{error}</div>}
          {success && <div className="text-green-600 text-center font-semibold bg-green-50 border border-green-200 rounded py-2 px-4">{success}</div>}

          {/* Basic Info */}
          <div>
            <h3 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2"><FaTag /> Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-2"><FaTag /> Name</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required className="input w-full focus:ring-2 focus:ring-blue-300" />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-2"><FaHome /> Type</label>
                <select name="type" value={form.type} onChange={handleChange} required className="input w-full focus:ring-2 focus:ring-blue-300">
                  <option value="">Select type</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="villa">Villa</option>
                  <option value="studio">Studio</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-2"><FaTag /> Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" required className="input w-full focus:ring-2 focus:ring-blue-300" rows={3} />
            </div>
          </div>

          {/* Price Section */}
          <div>
            <h3 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2"><FaDollarSign /> Pricing</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-2"><FaDollarSign /> Regular Price</label>
                <input name="regularPrice" type="number" value={form.regularPrice} onChange={handleChange} placeholder="Regular Price" required className="input w-full focus:ring-2 focus:ring-green-300" />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-2"><FaDollarSign /> Discounted Price</label>
                <input name="discountedPrice" type="number" value={form.discountedPrice} onChange={handleChange} placeholder="Discounted Price" required className="input w-full focus:ring-2 focus:ring-green-300" />
              </div>
            </div>
          </div>

          {/* Address & Location */}
          <div>
            <h3 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2"><FaMapMarkerAlt /> Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-2"><FaMapMarkerAlt /> Address</label>
                <input name="address" value={form.address} onChange={handleChange} placeholder="Address" required className="input w-full focus:ring-2 focus:ring-blue-300" />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-2"><FaMapMarkerAlt /> Location</label>
                <input name="location" value={form.location} onChange={handleChange} placeholder="Location" required className="input w-full focus:ring-2 focus:ring-blue-300" />
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div>
            <h3 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2"><FaBed /> Property Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-2"><FaBed /> Bedrooms</label>
                <input name="bedrooms" type="number" value={form.bedrooms} onChange={handleChange} placeholder="Bedrooms" required className="input w-full focus:ring-2 focus:ring-purple-300" />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-2"><FaBath /> Bathrooms</label>
                <input name="bathrooms" type="number" value={form.bathrooms} onChange={handleChange} placeholder="Bathrooms" required className="input w-full focus:ring-2 focus:ring-purple-300" />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-2"><FaRulerCombined /> Size (sq ft)</label>
                <input name="size" type="number" value={form.size} onChange={handleChange} placeholder="e.g. 1200" className="input w-full focus:ring-2 focus:ring-yellow-300" />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-2"><FaCalendarAlt /> Year Built</label>
                <input name="yearBuilt" type="number" value={form.yearBuilt} onChange={handleChange} placeholder="e.g. 2015" className="input w-full focus:ring-2 focus:ring-yellow-300" />
              </div>
            </div>
            <div className="flex flex-wrap gap-6 mt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input name="furnished" type="checkbox" checked={form.furnished} onChange={handleChange} className="accent-green-500 w-5 h-5 rounded focus:ring-2 focus:ring-green-400" />
                <FaCouch className="text-green-500" /> Furnished
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input name="parking" type="checkbox" checked={form.parking} onChange={handleChange} className="accent-blue-500 w-5 h-5 rounded focus:ring-2 focus:ring-blue-400" />
                <FaCar className="text-blue-500" /> Parking
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input name="offer" type="checkbox" checked={form.offer} onChange={handleChange} className="accent-purple-500 w-5 h-5 rounded focus:ring-2 focus:ring-purple-400" />
                <FaTag className="text-purple-500" /> Offer
              </label>
            </div>
            {/* Amenities */}
            <div className="flex flex-wrap gap-6 mt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input name="wifi" type="checkbox" checked={form.amenities.wifi} onChange={handleChange} className="accent-blue-400 w-5 h-5 rounded focus:ring-2 focus:ring-blue-400" />
                <FaWifi className="text-blue-400" /> WiFi
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input name="pool" type="checkbox" checked={form.amenities.pool} onChange={handleChange} className="accent-cyan-400 w-5 h-5 rounded focus:ring-2 focus:ring-cyan-400" />
                <FaSwimmingPool className="text-cyan-400" /> Pool
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input name="garden" type="checkbox" checked={form.amenities.garden} onChange={handleChange} className="accent-green-400 w-5 h-5 rounded focus:ring-2 focus:ring-green-400" />
                <FaTree className="text-green-400" /> Garden
              </label>
            </div>
          </div>

          {/* Image URLs and Local Uploads */}
          <div>
            <h3 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2"><FaImage /> Images</h3>
            <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-2"><FaImage /> Image URLs (comma separated)</label>
            <input name="imageUrls" value={form.imageUrls.join(', ')} onChange={handleImageUrlsChange} placeholder="e.g. https://... , https://..." className="input w-full focus:ring-2 focus:ring-blue-300" />
            <div className="flex items-center gap-4 mt-4">
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-400 to-green-400 hover:from-blue-500 hover:to-green-500 text-white font-semibold px-4 py-2 rounded shadow transition focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <FaUpload /> Upload from device
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleLocalImageChange}
                className="hidden"
              />
              <span className="text-gray-400 text-sm">(JPG, PNG, GIF, etc.)</span>
            </div>
            <div className="flex gap-2 mt-4 flex-wrap">
              {form.imageUrls.filter(Boolean).map((url, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={url || 'https://via.placeholder.com/80x60?text=Image'}
                    alt={`Preview ${idx + 1}`}
                    className="h-16 w-20 object-cover rounded shadow border border-gray-200 bg-gray-50"
                    onError={e => (e.target.src = 'https://via.placeholder.com/80x60?text=Image')}
                  />
                  <button
                    type="button"
                    onClick={() => removeUrlImage(idx)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs opacity-80 hover:opacity-100 group-hover:scale-110 transition"
                    title="Remove"
                  >
                    ×
                  </button>
                </div>
              ))}
              {form.localImages.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={img}
                    alt={`Local Preview ${idx + 1}`}
                    className="h-16 w-20 object-cover rounded shadow border border-gray-200 bg-gray-50"
                  />
                  <button
                    type="button"
                    onClick={() => removeLocalImage(idx)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs opacity-80 hover:opacity-100 group-hover:scale-110 transition"
                    title="Remove"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="bg-gradient-to-r from-green-400 to-blue-400 hover:from-green-500 hover:to-blue-500 text-white font-bold py-3 rounded-full shadow-lg transition text-lg mt-2 flex items-center justify-center gap-2" disabled={loading}>
            {loading ? 'Creating...' : <><FaHome className="inline-block mb-1" /> Create Listing</>}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateListing; 