import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaHome, FaMapMarkerAlt, FaDollarSign, FaBed, FaBath, FaCouch, FaCar, FaTag, FaImage, FaUser, FaRulerCombined, FaCalendarAlt, FaWifi, FaSwimmingPool, FaTree, FaUpload, FaEdit } from 'react-icons/fa';

const BACKEND = (import.meta.env.Backend && import.meta.env.Backend.startsWith('mongodb'))
  ? import.meta.env.Backend
  : (import.meta.env.Backend || import.meta.env.VITE_MONGO || 'http://localhost:3000');

function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef();
  const currentUser = useSelector((state) => state.user.currentUser);
  const user = currentUser?.data?.user || currentUser;
  const userId = user?._id || user?.id;
  const [form, setForm] = useState(null); // null until loaded
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch listing data on mount
  useEffect(() => {
    async function fetchListing() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/listing/${id}`, { credentials: 'include' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch listing');
        setForm({
          ...data.data.listing,
          localImages: [], // for local image previews
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchListing();
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (form.amenities && name in form.amenities) {
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
        localImages: [...(prev.localImages || []), ...images],
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
      // Use the full backend URL for updating the listing
      const response = await fetch(`${BACKEND}/api/listingUpdate/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...form, imageUrls: [...(form.imageUrls || []), ...(form.localImages || [])] }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update listing');
      setSuccess('Listing updated successfully!');
      setTimeout(() => navigate('/my-listings'), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-64 text-red-500">{error}</div>;
  if (!form) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-200 via-blue-50 to-blue-300 px-2 py-8">
      <div className="w-full max-w-3xl bg-white/95 rounded-3xl shadow-2xl p-0 overflow-hidden border border-blue-100">
        <div className="bg-gradient-to-r from-blue-400 to-green-400 py-8 px-8 text-white text-center rounded-t-3xl shadow-md">
          <h2 className="text-4xl font-extrabold mb-2 drop-shadow-lg flex items-center justify-center gap-3"><FaEdit className="inline-block mb-1" /> Edit Listing</h2>
          <div className="flex justify-center mb-2">
            <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 font-mono text-xs px-4 py-1 rounded-full shadow-sm border border-blue-200">
              <FaUser className="text-blue-400" />
              User ID: <span className="font-semibold">{userId}</span>
            </span>
          </div>
          <p className="text-lg font-medium opacity-90">Update the details below and save your changes.</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-2"><FaBed /> Bedrooms</label>
                <input name="bedrooms" type="number" value={form.bedrooms} onChange={handleChange} placeholder="Bedrooms" required className="input w-full focus:ring-2 focus:ring-blue-300" />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-2"><FaBath /> Bathrooms</label>
                <input name="bathrooms" type="number" value={form.bathrooms} onChange={handleChange} placeholder="Bathrooms" required className="input w-full focus:ring-2 focus:ring-blue-300" />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-2"><FaCouch /> Furnished</label>
                <input name="furnished" type="checkbox" checked={form.furnished} onChange={handleChange} className="ml-2" />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-2"><FaCar /> Parking</label>
                <input name="parking" type="checkbox" checked={form.parking} onChange={handleChange} className="ml-2" />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-2"><FaTag /> Offer</label>
                <input name="offer" type="checkbox" checked={form.offer} onChange={handleChange} className="ml-2" />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-2"><FaRulerCombined /> Size (sqft)</label>
                <input name="size" type="number" value={form.size || ''} onChange={handleChange} placeholder="Size" className="input w-full focus:ring-2 focus:ring-blue-300" />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-2"><FaCalendarAlt /> Year Built</label>
                <input name="yearBuilt" type="number" value={form.yearBuilt || ''} onChange={handleChange} placeholder="Year Built" className="input w-full focus:ring-2 focus:ring-blue-300" />
              </div>
            </div>
            {/* Amenities */}
            <div className="mt-4 flex gap-6">
              <label className="flex items-center gap-2"><FaWifi /> Wifi
                <input name="wifi" type="checkbox" checked={form.amenities?.wifi || false} onChange={handleChange} className="ml-2" />
              </label>
              <label className="flex items-center gap-2"><FaSwimmingPool /> Pool
                <input name="pool" type="checkbox" checked={form.amenities?.pool || false} onChange={handleChange} className="ml-2" />
              </label>
              <label className="flex items-center gap-2"><FaTree /> Garden
                <input name="garden" type="checkbox" checked={form.amenities?.garden || false} onChange={handleChange} className="ml-2" />
              </label>
            </div>
          </div>

          {/* Images */}
          <div>
            <h3 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2"><FaImage /> Images</h3>
            <div className="mb-2">
              <label className="block text-gray-700 font-semibold mb-1">Image URLs (comma separated)</label>
              <input name="imageUrls" value={form.imageUrls?.join(', ') || ''} onChange={handleImageUrlsChange} placeholder="https://..." className="input w-full focus:ring-2 focus:ring-blue-300" />
              <div className="flex flex-wrap gap-2 mt-2">
                {form.imageUrls && form.imageUrls.map((url, idx) => (
                  <div key={idx} className="relative group">
                    <img src={url} alt="listing" className="h-20 w-28 object-cover rounded shadow border border-blue-100" />
                    <button type="button" onClick={() => removeUrlImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs opacity-80 group-hover:opacity-100">&times;</button>
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-2">
              <label className="block text-gray-700 font-semibold mb-1">Upload Local Images</label>
              <input type="file" multiple accept="image/*" ref={fileInputRef} onChange={handleLocalImageChange} className="hidden" />
              <button type="button" onClick={() => fileInputRef.current.click()} className="bg-blue-100 text-blue-700 px-4 py-2 rounded shadow flex items-center gap-2 hover:bg-blue-200"><FaUpload /> Upload Images</button>
              <div className="flex flex-wrap gap-2 mt-2">
                {form.localImages && form.localImages.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img src={img} alt="local" className="h-20 w-28 object-cover rounded shadow border border-green-100" />
                    <button type="button" onClick={() => removeLocalImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs opacity-80 group-hover:opacity-100">&times;</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button type="submit" className="bg-gradient-to-r from-blue-400 to-green-400 hover:from-blue-500 hover:to-green-500 text-white font-bold px-8 py-3 rounded-full shadow-lg border-none transition text-lg focus:outline-none focus:ring-2 focus:ring-blue-200 hover:scale-105 active:scale-100 flex items-center gap-2">
              <FaEdit /> Update Listing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditListing; 