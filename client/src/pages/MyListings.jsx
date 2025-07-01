import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaChevronLeft, FaChevronRight, FaMapMarkerAlt, FaBed, FaBath, FaCouch, FaCar, FaTrash, FaEye, FaEyeSlash, FaEdit } from 'react-icons/fa';

function MyListings() {
  const currentUser = useSelector((state) => state.user.currentUser);
  const user = currentUser?.data?.user || currentUser;
  const userId = user?._id || user?.id;
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedListing, setExpandedListing] = useState(null);
  const [expandedSlideIndex, setExpandedSlideIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      setError('User not found. Please sign in.');
      setLoading(false);
      return;
    }
    fetch(`/api/listedItem/${userId}`, {
      credentials: 'include',
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || 'Failed to fetch listings');
        }
        return res.json();
      })
      .then((data) => {
        setListings(data.data.listings || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [userId]);

  const handleShowComplete = (listing) => {
    if (expandedListing && expandedListing._id === listing._id && showModal) {
      setShowModal(false);
      setExpandedListing(null);
      setExpandedSlideIndex(0);
    } else {
      setExpandedListing(listing);
      setExpandedSlideIndex(0);
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setExpandedListing(null);
    setExpandedSlideIndex(0);
  };

  const handlePrevExpandedSlide = () => {
    if (!expandedListing) return;
    setExpandedSlideIndex((prev) =>
      prev > 0 ? prev - 1 : (expandedListing.imageUrls?.length || 1) - 1
    );
  };

  const handleNextExpandedSlide = () => {
    if (!expandedListing) return;
    setExpandedSlideIndex((prev) =>
      prev < (expandedListing.imageUrls?.length || 1) - 1 ? prev + 1 : 0
    );
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  // Handler for deleting a listing
  const handleDeleteListing = async (listingId) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      const response = await fetch(`/api/listingDelete/${listingId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to delete listing');
      setListings((prev) => prev.filter((l) => l._id !== listingId));
      alert('Listing deleted successfully!');
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-64 text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-extrabold mb-2 text-center text-blue-800 drop-shadow">My Listings</h2>
      <div className="text-center text-blue-700 text-sm mb-8 font-mono">
        <span className="inline-flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-full border border-blue-200 shadow-sm">
          <FaUser className="text-blue-400" />
          User ID: <span className="font-semibold">{userId}</span>
        </span>
      </div>
      {listings.length === 0 ? (
        <div className="text-center text-gray-400">No listings found.</div>
      ) : (
        <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {listings.map((listing) => {
            const images = listing.imageUrls && listing.imageUrls.length > 0 ? listing.imageUrls : ["https://via.placeholder.com/300x200"];
            return (
              <div
                key={listing._id}
                className={`bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 p-0 flex flex-col overflow-hidden border border-blue-100 group`}
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={images[0]}
                    alt={listing.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {listing.offer && (
                    <span className="absolute top-3 left-3 bg-green-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow">Offer</span>
                  )}
                </div>
                <div className="p-6 flex flex-col gap-2 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg font-bold text-blue-800 truncate">{listing.name}</span>
                    <span className="ml-auto bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full border border-blue-200">{listing.type}</span>
                  </div>
                  <div className="text-gray-600 text-sm truncate">{listing.address}</div>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-green-600 font-bold text-lg">₹{listing.regularPrice}</span>
                    {listing.discountedPrice < listing.regularPrice && (
                      <span className="text-red-500 line-through text-sm">₹{listing.discountedPrice}</span>
                    )}
                  </div>
                  <div className="flex gap-4 mt-2 text-gray-500 text-xs">
                    <span>{listing.bedrooms} Bed</span>
                    <span>{listing.bathrooms} Bath</span>
                    <span>{listing.furnished ? 'Furnished' : 'Unfurnished'}</span>
                    <span>{listing.parking ? 'Parking' : 'No Parking'}</span>
                  </div>
                  <div className="flex justify-end mt-4">
                    <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 font-mono text-xs px-3 py-1 rounded-full border border-blue-200">
                      <FaUser className="text-blue-400" />
                      User Reference: <span className="font-semibold">{listing.userRef}</span>
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 justify-center mt-4 bg-white/70 rounded-xl p-2 shadow-inner">
                    <button
                      className="flex items-center gap-2 px-5 py-2 rounded-full font-semibold text-red-700 bg-gradient-to-r from-red-100 to-red-300 border border-red-200 shadow hover:scale-105 hover:brightness-110 hover:from-red-200 hover:to-red-400 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-red-300"
                      onClick={() => handleDeleteListing(listing._id)}
                      aria-label="Delete Listing"
                    >
                      <FaTrash className="w-5 h-5" /> Delete
                    </button>
                    <button
                      className="flex items-center gap-2 px-5 py-2 rounded-full font-semibold text-blue-700 bg-gradient-to-r from-blue-100 to-blue-300 border border-blue-200 shadow hover:scale-105 hover:brightness-110 hover:from-blue-200 hover:to-blue-400 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300"
                      onClick={() => navigate(`/edit-listing/${listing._id}`)}
                      aria-label="Edit Listing"
                    >
                      <FaEdit className="w-5 h-5" /> Edit
                    </button>
                    <button
                      className={`flex items-center gap-2 px-5 py-2 rounded-full font-semibold text-green-700 bg-gradient-to-r from-green-100 to-green-300 border border-green-200 shadow hover:scale-105 hover:brightness-110 hover:from-green-200 hover:to-green-400 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-green-300`}
                      onClick={() => handleShowComplete(listing)}
                      type="button"
                      aria-label={expandedListing && expandedListing._id === listing._id && showModal ? 'Hide Details' : 'Show Complete'}
                    >
                      {expandedListing && expandedListing._id === listing._id && showModal ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                      {expandedListing && expandedListing._id === listing._id && showModal ? 'Hide' : 'Show Complete'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {showModal && expandedListing && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm animate-fade-in"
            onClick={handleOverlayClick}
          >
            <div
              className="relative bg-white rounded-2xl shadow-2xl border border-blue-100 max-w-4xl w-full mx-4 flex flex-col overflow-hidden"
              style={{ maxHeight: '90vh' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-8 pt-8 pb-4 border-b border-blue-100">
                <span className="text-2xl md:text-3xl font-extrabold text-blue-900 tracking-tight font-sans">{expandedListing.name}</span>
                <button
                  className="text-gray-400 hover:text-red-500 text-2xl font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-red-200 bg-white rounded-full shadow p-1 z-10"
                  onClick={handleCloseModal}
                  aria-label="Close"
                  type="button"
                >
                  &times;
                </button>
              </div>
              {/* Content */}
              <div className="flex flex-col md:flex-row gap-8 items-start px-8 py-8 w-full overflow-y-auto">
                {/* Left: Image and thumbnails */}
                <div className="flex flex-col items-center w-full md:w-[380px]">
                  <div className="relative w-full h-[260px] flex items-center justify-center bg-gray-50 rounded-xl border border-blue-100 shadow-lg mb-4">
                    <img
                      src={expandedListing.imageUrls?.[expandedSlideIndex] || 'https://via.placeholder.com/380x260'}
                      alt={expandedListing.name}
                      className="w-full h-full object-cover object-center rounded-xl"
                      style={{ maxWidth: '380px', maxHeight: '260px' }}
                    />
                    {expandedListing.imageUrls && expandedListing.imageUrls.length > 1 && (
                      <>
                        <button
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1.5 shadow hover:bg-blue-100 text-lg transition"
                          onClick={handlePrevExpandedSlide}
                          type="button"
                        >
                          <FaChevronLeft />
                        </button>
                        <button
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1.5 shadow hover:bg-blue-100 text-lg transition"
                          onClick={handleNextExpandedSlide}
                          type="button"
                        >
                          <FaChevronRight />
                        </button>
                      </>
                    )}
                  </div>
                  {/* Thumbnails */}
                  {expandedListing.imageUrls && expandedListing.imageUrls.length > 1 && (
                    <div className="flex gap-2 mt-2">
                      {expandedListing.imageUrls.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`thumb-${idx}`}
                          className={`w-12 h-12 object-cover rounded border-2 cursor-pointer ${expandedSlideIndex === idx ? 'border-blue-500' : 'border-gray-200'}`}
                          onClick={() => setExpandedSlideIndex(idx)}
                        />
                      ))}
                    </div>
                  )}
                </div>
                {/* Right: Info */}
                <div className="flex-1 flex flex-col gap-4 w-full font-sans min-w-0">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full border border-blue-200 font-semibold shadow">{expandedListing.type}</span>
                    <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 font-mono text-xs px-2 py-1 rounded-full border border-blue-200 shadow">
                      <FaUser className="text-blue-400" />
                      <span className="font-semibold whitespace-nowrap">{expandedListing.userRef}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-6 mb-2">
                    <span className="text-green-600 font-bold text-2xl">₹{expandedListing.regularPrice}</span>
                    {expandedListing.discountedPrice < expandedListing.regularPrice && (
                      <span className="text-red-500 line-through text-lg">₹{expandedListing.discountedPrice}</span>
                    )}
                  </div>
                  <div className="flex gap-4 text-gray-700 text-base mb-2">
                    <span className="flex items-center gap-1"><FaBed className="text-blue-400" />{expandedListing.bedrooms} Bed</span>
                    <span className="flex items-center gap-1"><FaBath className="text-blue-400" />{expandedListing.bathrooms} Bath</span>
                    <span className="flex items-center gap-1"><FaCouch className="text-blue-400" />{expandedListing.furnished ? 'Furnished' : 'Unfurnished'}</span>
                    <span className="flex items-center gap-1"><FaCar className="text-blue-400" />{expandedListing.parking ? 'Parking' : 'No Parking'}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <FaMapMarkerAlt className="text-blue-400" />
                    <span className="text-gray-700 text-base">{expandedListing.address}</span>
                  </div>
                  <div className="bg-blue-50/80 rounded-xl p-3 shadow-inner flex flex-col gap-1 text-base text-gray-700 mb-2">
                    <span className="font-semibold text-blue-700">Description:</span> {expandedListing.description}
                  </div>
                  <div className="bg-blue-50/80 rounded-xl p-3 shadow-inner flex flex-col gap-1 text-base text-gray-700 mb-2">
                    <span className="font-semibold text-blue-700">Location:</span> {expandedListing.location}
                  </div>
                  <div className="flex gap-4 text-gray-700 text-base mb-2">
                    <span className="font-semibold text-blue-700">Offer:</span> {expandedListing.offer ? 'Yes' : 'No'}
                    <span className="font-semibold text-blue-700">Listing ID:</span> {expandedListing._id}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        </>
      )}
    </div>
  );
}

export default MyListings; 