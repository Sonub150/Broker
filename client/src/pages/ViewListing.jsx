import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper/modules';

export default function ViewListing() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchListing() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`http://localhost:3000/api/listing/${id}`, {
          credentials: 'include'
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch listing');
        setListing(data.data.listing);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchListing();
  }, [id]);

  if (loading) return <div className="flex justify-center items-center h-64 text-xl font-bold">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-64 text-red-500 font-bold">{error}</div>;
  if (!listing) return null;

  return (
    <div className="min-h-screen bg-gray-100 py-0 px-0 flex flex-col items-center">
      {/* Image Slider */}
      <div className="w-full" style={{height: '50vh', minHeight: '220px', maxHeight: '600px'}}>
        <Swiper
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          modules={[Pagination, Autoplay]}
          className="h-full w-full rounded-b-3xl"
        >
          {(listing.imageUrls?.length ? listing.imageUrls : ['https://via.placeholder.com/1200x600']).map((url, idx) => (
            <SwiperSlide key={idx}>
              <img
                src={url}
                alt={listing.name}
                className="w-full h-full object-cover object-center"
                style={{borderBottomLeftRadius: '2rem', borderBottomRightRadius: '2rem'}}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      {/* Info Card */}
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 mt-[-60px] z-10 flex flex-col gap-6 relative">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{listing.name}</h1>
        <div className="text-gray-500 text-lg mb-2">{listing.location || listing.address}</div>
        <div className="flex items-center gap-6 mb-4">
          <span className="text-2xl font-bold text-blue-700">₹{listing.regularPrice}</span>
          {listing.discountedPrice && (
            <span className="text-gray-400 line-through text-lg">₹{listing.discountedPrice}</span>
          )}
        </div>
        <div className="flex gap-6 text-gray-600 mb-4 flex-wrap">
          <span>🛏 {listing.bedrooms} Bed</span>
          <span>🛁 {listing.bathrooms} Bath</span>
          <span>📏 {listing.size} sqft</span>
          {listing.yearBuilt && <span>🏗️ Built in {listing.yearBuilt}</span>}
          <span>{listing.furnished ? 'Furnished' : 'Unfurnished'}</span>
          <span>{listing.parking ? 'Parking' : 'No Parking'}</span>
          <span className="capitalize">{listing.type}</span>
        </div>
        <div className="text-gray-700 mb-4 whitespace-pre-line">{listing.description}</div>
        <div className="flex flex-wrap gap-2 mb-4">
          {listing.amenities?.wifi && <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">WiFi</span>}
          {listing.amenities?.pool && <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">Pool</span>}
          {listing.amenities?.garden && <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">Garden</span>}
        </div>
        {/* Contact Agent Button */}
        <button
          className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold py-3 rounded-full shadow hover:from-blue-600 hover:to-green-600 transition text-lg mt-2"
          onClick={() => {
            const email = listing.email || '';
            if (!email) return alert('No contact email available for this property.');
            const subject = encodeURIComponent(`Inquiry about ${listing.name}`);
            const body =
              'Hello,%0A%0A' +
              `I am interested in the property "${listing.name}" located at ${listing.location || listing.address}.%0A%0A` +
              'Property Details:%0A' +
              `- Price: ₹${listing.regularPrice}${listing.discountedPrice && listing.discountedPrice < listing.regularPrice ? ` (Discounted: ₹${listing.discountedPrice})` : ''}%0A` +
              `- Bedrooms: ${listing.bedrooms}%0A` +
              `- Bathrooms: ${listing.bathrooms}%0A` +
              `- Type: ${listing.type}%0A%0A` +
              'Please provide more information. Thank you!';
            window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
          }}
        >
          Contact Agent
        </button>
      </div>
    </div>
  );
} 