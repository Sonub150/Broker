import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FaMapMarkerAlt, FaBed, FaBath, FaCouch, FaCar, FaRupeeSign } from 'react-icons/fa';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function SearchResults() {
  const query = useQuery();
  const q = query.get('q') || '';
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchResults() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`https://broker-5m9x.onrender.com/api/get?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch search results');
        const allListings = data.data?.listings || data.listings || data.listing || [];
        setListings(Array.isArray(allListings) ? allListings : [allListings]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (q) fetchResults();
  }, [q]);

  if (loading) return <div className="flex justify-center items-center h-64 text-xl font-bold">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-64 text-red-500 font-bold">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-10">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-extrabold mb-6">Search Results for "{q}"</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {listings.length === 0 ? (
            <div className="col-span-full text-center text-gray-400 text-lg">No listings found.</div>
          ) : listings.map((listing, idx) => {
            const images = listing.imageUrls && listing.imageUrls.length > 0 ? listing.imageUrls : ["https://via.placeholder.com/400x250"];
            return (
              <div key={listing._id || listing.name} className="relative bg-white/60 backdrop-blur-lg rounded-3xl shadow-2xl border border-blue-100 overflow-hidden flex flex-col group hover:shadow-blue-300 hover:scale-[1.04] transition-all duration-300 animate-fade-in">
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-blue-100/30 via-white/10 to-green-100/20 opacity-80 z-0" />
                <div className="relative h-56 w-full bg-gray-100 flex items-center justify-center z-10">
                  <img
                    src={images[0]}
                    alt={listing.name}
                    className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105 rounded-t-3xl"
                    draggable="false"
                  />
                </div>
                <div className="p-6 flex flex-col gap-2 flex-1 z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl font-bold text-blue-800 truncate drop-shadow-sm">{listing.name}</span>
                    <span className="ml-auto bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full border border-blue-200 shadow-sm">{listing.type}</span>
                  </div>
                  <div className="text-gray-600 text-sm truncate flex items-center gap-2"><FaMapMarkerAlt className="text-blue-400" />{listing.location || listing.address}</div>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-green-600 font-bold text-lg flex items-center"><FaRupeeSign />{listing.regularPrice}</span>
                    {listing.discountedPrice < listing.regularPrice && (
                      <span className="text-red-500 line-through text-sm flex items-center"><FaRupeeSign />{listing.discountedPrice}</span>
                    )}
                  </div>
                  <div className="flex gap-2 mt-1 text-gray-500 text-xs flex-wrap">
                    <span><FaBed className="inline mr-1" />{listing.bedrooms} Bed</span>
                    <span><FaBath className="inline mr-1" />{listing.bathrooms} Bath</span>
                    <span><FaCouch className="inline mr-1" />{listing.furnished ? 'Furnished' : 'Unfurnished'}</span>
                    <span><FaCar className="inline mr-1" />{listing.parking ? 'Parking' : 'No Parking'}</span>
                  </div>
                  <div className="mt-2 text-gray-700 text-xs line-clamp-2">{listing.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 