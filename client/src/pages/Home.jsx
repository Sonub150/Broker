import React, { useEffect, useState, useRef } from 'react';
import { FaMapMarkerAlt, FaBed, FaBath, FaCouch, FaCar, FaRupeeSign, FaChevronLeft, FaChevronRight, FaSearch, FaUserCircle } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';

// Helper to pick a color for a city/state badge
const badgeColors = [
  'bg-gradient-to-r from-pink-400 to-pink-600 text-white',
  'bg-gradient-to-r from-blue-400 to-blue-600 text-white',
  'bg-gradient-to-r from-green-400 to-green-600 text-white',
  'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white',
  'bg-gradient-to-r from-purple-400 to-purple-600 text-white',
  'bg-gradient-to-r from-orange-400 to-orange-600 text-white',
  'bg-gradient-to-r from-cyan-400 to-cyan-600 text-white',
  'bg-gradient-to-r from-red-400 to-red-600 text-white',
];
function getBadgeColor(city) {
  // Simple hash for color variety
  let sum = 0;
  for (let i = 0; i < city.length; i++) sum += city.charCodeAt(i);
  return badgeColors[sum % badgeColors.length];
}

function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sliderIndexes, setSliderIndexes] = useState({}); // {listingId: index}
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  // Helper to get flash offers and deal of the day
  const flashOffers = listings.filter(l => l.offer);
  // Deal of the day: best discount (lowest discountedPrice/regularPrice)
  const dealOfTheDay = listings.reduce((best, curr) => {
    if (!curr.offer) return best;
    const currDiscount = curr.discountedPrice / curr.regularPrice;
    if (!best) return curr;
    const bestDiscount = best.discountedPrice / best.regularPrice;
    return currDiscount < bestDiscount ? curr : best;
  }, null);

  // Slider state for flash offers
  const [flashIndex, setFlashIndex] = useState(0);
  const [dealIndex, setDealIndex] = useState(0);
  const flashSliderRef = useRef(null);

  // Auto-advance flash offers slider every 3 seconds, pause on hover
  const [isFlashHovered, setIsFlashHovered] = useState(false);
  useEffect(() => {
    if (isFlashHovered || flashOffers.length <= 1) return;
    const interval = setInterval(() => {
      setFlashIndex(i => (i < flashOffers.length - 1 ? i + 1 : 0));
    }, 3000);
    return () => clearInterval(interval);
  }, [isFlashHovered, flashOffers.length]);

  // Scroll to active card when flashIndex changes
  useEffect(() => {
    if (flashSliderRef.current) {
      const card = flashSliderRef.current.children[flashIndex];
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [flashIndex]);

  // Helper for fake countdown (for demo)
  function getCountdown(hours = 3, minutes = 12) {
    // You can randomize or calculate real time if needed
    return `${hours}h ${minutes}m`;
  }

  useEffect(() => {
    async function fetchListings() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('http://localhost:3000/api/listings', { credentials: 'include' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch listings');
        const allListings = data.data?.listings || data.listings || data.listing || [];
        setListings(Array.isArray(allListings) ? allListings : [allListings]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchListings();
  }, []);

  // Slider controls
  const handlePrev = (id, images) => {
    setSliderIndexes((prev) => ({
      ...prev,
      [id]: prev[id] > 0 ? prev[id] - 1 : images.length - 1,
    }));
  };
  const handleNext = (id, images) => {
    setSliderIndexes((prev) => ({
      ...prev,
      [id]: prev[id] < images.length - 1 ? prev[id] + 1 : 0,
    }));
  };

  if (loading) return <div className="flex justify-center items-center h-64 text-xl font-bold">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-64 text-red-500 font-bold">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-10">
      {/* Hero Section */}
      <div className="relative w-full flex flex-col items-center justify-center min-h-[480px] md:min-h-[540px] px-4 pt-10 pb-20 overflow-hidden">
        {/* Soft map/abstract background (gradient + grid overlay) */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-200/60 via-purple-100/60 to-pink-100/60" />
          <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" width="100%" height="100%">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#bdb7e2" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        {/* Badge above headline */}
        <div className="relative z-10 flex flex-col items-center mb-4">
          <div className="flex items-center gap-2 bg-white/80 px-4 py-1 rounded-full shadow border border-gray-200 mb-2">
            <div className="flex -space-x-2">
              <FaUserCircle className="w-6 h-6 text-blue-400 bg-white rounded-full border border-white" />
              <FaUserCircle className="w-6 h-6 text-pink-400 bg-white rounded-full border border-white" />
              <FaUserCircle className="w-6 h-6 text-purple-400 bg-white rounded-full border border-white" />
              <FaUserCircle className="w-6 h-6 text-green-400 bg-white rounded-full border border-white" />
            </div>
            <span className="text-xs font-semibold text-gray-700 ml-2">Built for <span className="text-blue-600">Real Estate Pros</span></span>
          </div>
        </div>
        {/* Headline */}
        <h1 className="relative z-10 text-3xl md:text-5xl font-extrabold text-center leading-tight mb-4">
          From Address to{' '}
          <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">Market-Ready</span>
          {' '}—{' '}
          <span className="text-black">Instantly</span>
          <span className="absolute left-1/2 -translate-x-1/2 bottom-[-18px] md:bottom-[-22px] w-40 h-3 bg-purple-200 rounded-full opacity-70 -z-10" style={{filter:'blur(2px)'}}></span>
        </h1>
        {/* Subheadline */}
        <p className="relative z-10 text-lg md:text-xl text-gray-700 text-center max-w-2xl mb-8 font-medium">
          Let AI deliver instant insights, polished marketing content, pro-level reports — and now, fully designed listing websites ready to share.
        </p>
        {/* Search Bar with CTA */}
        <form className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-3 w-full max-w-xl mx-auto">
          <div className="flex items-center bg-white border border-gray-300 rounded-full px-4 py-2 w-full md:w-80 shadow">
            <FaMapMarkerAlt className="text-purple-400 mr-2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Enter address or location..."
              className="bg-transparent outline-none w-full text-lg text-gray-700 placeholder-gray-400"
            />
          </div>
          <button type="submit" className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold px-6 py-3 rounded-full shadow-lg border-none transition text-lg focus:outline-none focus:ring-2 focus:ring-blue-200 hover:scale-105 active:scale-100">
            <FaSearch className="inline mr-2" /> Run AI Property Insight (1 Free Use)
          </button>
        </form>
        <div className="relative z-10 text-center text-gray-500 text-sm mt-4 italic">Try it now. Access your first report in under 60 seconds.</div>
      </div>

      {/* Flash Offers Section */}
      {flashOffers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 mb-12">
          <h2 className="text-2xl md:text-3xl font-extrabold text-pink-600 mb-4 flex items-center gap-2">
            <span className="bg-gradient-to-r from-pink-400 to-pink-600 text-white px-4 py-1 rounded-full text-lg font-bold shadow">Flash Offers</span>
            <span className="text-base font-normal text-gray-400">Hot deals, limited time only!</span>
          </h2>
          <Swiper
            slidesPerView={1}
            spaceBetween={24}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            modules={[Pagination, Autoplay]}
            className="mySwiper"
          >
            {flashOffers.map((listing, idx) => {
              const images = listing.imageUrls && listing.imageUrls.length > 0 ? listing.imageUrls : ["https://via.placeholder.com/400x250"];
              let city = 'India';
              if (listing.location) city = listing.location.split(',').pop().trim();
              else if (listing.address) city = listing.address.split(',').pop().trim();
              return (
                <SwiperSlide key={listing._id || listing.name}>
                  <div
                    className="min-w-[320px] max-w-xs w-full bg-white/90 rounded-2xl shadow-xl border-2 border-pink-200 overflow-hidden flex flex-col group transition-all duration-300 relative hover:scale-105"
                    style={{ flex: '0 0 320px' }}
                  >
                    {/* Countdown badge */}
                    <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold shadow-lg z-20 border border-white/40 bg-gradient-to-r from-yellow-400 to-pink-400 text-white animate-pulse">
                      Ends in {getCountdown(3 - idx, 12 + idx * 3)}
                    </span>
                    <span className="absolute top-4 left-4 px-4 py-1 rounded-full text-xs font-bold shadow-lg z-20 border border-white/40 bg-gradient-to-r from-pink-400 to-pink-600 text-white">Flash Offer</span>
                    {/* City/State Badge */}
                    <span className={`absolute top-4 left-32 px-3 py-1 rounded-full text-xs font-bold shadow z-20 border border-white/40 ${getBadgeColor(city)}`}>{city}</span>
                    <div className="relative h-40 w-full bg-gray-100 flex items-center justify-center z-10">
                      <img
                        src={images[0]}
                        alt={listing.name}
                        className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105 rounded-t-2xl"
                        draggable="false"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-pink-200/30 via-transparent to-transparent pointer-events-none" />
                    </div>
                    <div className="p-4 flex flex-col gap-1 flex-1 z-10">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg font-bold text-pink-700 truncate drop-shadow-sm">{listing.name}</span>
                        <span className="ml-auto bg-pink-50 text-pink-600 text-xs px-2 py-0.5 rounded-full border border-pink-200 shadow-sm">{listing.type}</span>
                      </div>
                      <div className="text-gray-600 text-xs truncate flex items-center gap-2"><FaMapMarkerAlt className="text-pink-400" />{listing.location || listing.address}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-green-600 font-bold text-base flex items-center"><FaRupeeSign />{listing.discountedPrice}</span>
                        <span className="text-gray-400 line-through text-xs flex items-center"><FaRupeeSign />{listing.regularPrice}</span>
                      </div>
                      <div className="flex gap-2 mt-1 text-gray-500 text-xs flex-wrap">
                        <span><FaBed className="inline mr-1" />{listing.bedrooms} Bed</span>
                        <span><FaBath className="inline mr-1" />{listing.bathrooms} Bath</span>
                        {listing.size && <span><span className="inline mr-1">📏</span>{listing.size} sqft</span>}
                        {listing.yearBuilt && <span><span className="inline mr-1">🏗️</span>{listing.yearBuilt}</span>}
                        <span>{listing.furnished ? 'Furnished' : 'Unfurnished'}</span>
                        <span>{listing.parking ? 'Parking' : 'No Parking'}</span>
                      </div>
                      {listing.amenities && (
                        <div className="flex gap-2 mt-1 text-xs text-blue-500 flex-wrap">
                          {listing.amenities.wifi && <span className="bg-blue-100 px-2 py-0.5 rounded-full">WiFi</span>}
                          {listing.amenities.pool && <span className="bg-blue-100 px-2 py-0.5 rounded-full">Pool</span>}
                          {listing.amenities.garden && <span className="bg-blue-100 px-2 py-0.5 rounded-full">Garden</span>}
                        </div>
                      )}
                      <div className="mt-2 text-gray-700 text-xs line-clamp-2">{listing.description}</div>
                      {/* Action Buttons */}
                      <div className="flex justify-center gap-3 mt-4">
                        <button className="bg-gradient-to-r from-pink-400 to-pink-600 text-white font-semibold rounded-full px-5 py-2 shadow hover:from-pink-500 hover:to-pink-700 transition focus:outline-none focus:ring-2 focus:ring-pink-200" onClick={() => navigate(`/view-listing/${listing._id}`)}>View</button>
                        <button
                          className="border border-pink-400 text-pink-600 font-semibold rounded-full px-5 py-2 bg-white hover:bg-pink-50 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-pink-100"
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
                          Contact
                        </button>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </section>
      )}

      {/* Deal of the Day Section */}
      {dealOfTheDay && (
        <section className="max-w-3xl mx-auto px-4 mb-12 relative">
          {/* Animated Glow */}
          <div className="absolute inset-0 flex justify-center items-center pointer-events-none z-0">
            <div className="w-[420px] h-[340px] rounded-3xl bg-gradient-to-br from-purple-400/30 via-blue-300/20 to-pink-300/20 blur-2xl animate-pulse-slow" />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-purple-600 mb-4 flex items-center gap-2 relative z-10">
            <span className="bg-gradient-to-r from-purple-400 to-blue-500 text-white px-4 py-1 rounded-full text-lg font-bold shadow flex items-center gap-2">
              Deal of the Day <span className="ml-1">✨</span>
            </span>
            <span className="text-base font-normal text-gray-400">Best value, just for you!</span>
          </h2>
          <div className="relative flex justify-center z-10">
            <div className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-2xl border-2 border-purple-200 overflow-hidden flex flex-col group hover:shadow-purple-200 hover:scale-[1.03] transition-all duration-300 relative max-w-md w-full">
              {/* Discount Badge */}
              {dealOfTheDay.regularPrice > dealOfTheDay.discountedPrice && (
                <span className="absolute top-4 right-4 px-4 py-1 rounded-full text-xs font-bold shadow-lg z-20 border border-white/40 bg-gradient-to-r from-green-400 to-blue-400 text-white animate-bounce">
                  Save {Math.round(100 - (dealOfTheDay.discountedPrice / dealOfTheDay.regularPrice) * 100)}%
                </span>
              )}
              {/* Countdown Timer */}
              <span className="absolute top-4 left-4 px-4 py-1 rounded-full text-xs font-bold shadow-lg z-20 border border-white/40 bg-gradient-to-r from-purple-400 to-blue-500 text-white flex items-center gap-1">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="inline mr-1"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/><path d="M12 6v6l4 2" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
                Ends in {getCountdown(3, 12)}
              </span>
              {/* Image with gradient overlay */}
              <div className="relative h-52 w-full bg-gray-100 flex items-center justify-center z-10">
                <img
                  src={dealOfTheDay.imageUrls && dealOfTheDay.imageUrls.length > 0 ? dealOfTheDay.imageUrls[dealIndex] : 'https://via.placeholder.com/400x250'}
                  alt={dealOfTheDay.name}
                  className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105 rounded-t-3xl shadow-xl"
                  draggable="false"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 via-transparent to-transparent rounded-t-3xl pointer-events-none" />
                {/* Image slider controls */}
                {dealOfTheDay.imageUrls && dealOfTheDay.imageUrls.length > 1 && (
                  <>
                    <button
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-purple-100 text-purple-600 rounded-full p-2 shadow border border-purple-200"
                      onClick={() => setDealIndex(i => (i > 0 ? i - 1 : dealOfTheDay.imageUrls.length - 1))}
                      aria-label="Previous image"
                    >
                      <FaChevronLeft />
                    </button>
                    <button
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-purple-100 text-purple-600 rounded-full p-2 shadow border border-purple-200"
                      onClick={() => setDealIndex(i => (i < dealOfTheDay.imageUrls.length - 1 ? i + 1 : 0))}
                      aria-label="Next image"
                    >
                      <FaChevronRight />
                    </button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                      {dealOfTheDay.imageUrls.map((_, idx) => (
                        <span
                          key={idx}
                          className={`inline-block w-2 h-2 rounded-full ${idx === dealIndex ? 'bg-purple-500' : 'bg-purple-200'}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
              {/* Card Content */}
              <div className="p-7 flex flex-col gap-3 flex-1 z-10">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl font-extrabold text-purple-900 truncate drop-shadow-sm tracking-tight">{dealOfTheDay.name}</span>
                  <span className="ml-auto bg-purple-50 text-purple-600 text-xs px-2 py-0.5 rounded-full border border-purple-200 shadow-sm font-semibold uppercase tracking-wide">{dealOfTheDay.type}</span>
                </div>
                <div className="text-gray-600 text-base truncate flex items-center gap-2"><FaMapMarkerAlt className="text-purple-400" />{dealOfTheDay.location || dealOfTheDay.address}</div>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-green-600 font-bold text-2xl flex items-center"><FaRupeeSign />{dealOfTheDay.discountedPrice}</span>
                  <span className="text-gray-400 line-through text-lg flex items-center"><FaRupeeSign />{dealOfTheDay.regularPrice}</span>
                </div>
                <div className="flex gap-4 mt-2 text-gray-500 text-sm">
                  <span><FaBed className="inline mr-1" />{dealOfTheDay.bedrooms} Bed</span>
                  <span><FaBath className="inline mr-1" />{dealOfTheDay.bathrooms} Bath</span>
                  <span><FaCouch className="inline mr-1" />{dealOfTheDay.furnished ? 'Furnished' : 'Unfurnished'}</span>
                  <span><FaCar className="inline mr-1" />{dealOfTheDay.parking ? 'Parking' : 'No Parking'}</span>
                </div>
                <div className="mt-4 text-gray-700 text-base line-clamp-3 drop-shadow-sm font-medium">{dealOfTheDay.description}</div>
                {/* View Deal Button */}
                <button
                  className="mt-6 w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold py-3 rounded-full shadow-lg text-lg flex items-center justify-center gap-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-200 hover:scale-105 active:scale-100"
                  onClick={() => navigate(`/view-listing/${dealOfTheDay._id}`)}
                >
                  <span>View Deal</span> <span className="text-xl">🎉</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Listings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-7xl mx-auto px-4">
        {listings.length === 0 ? (
          <div className="col-span-full text-center text-gray-400 text-lg">No listings found.</div>
        ) : listings.map((listing, idx) => {
          const images = listing.imageUrls && listing.imageUrls.length > 0 ? listing.imageUrls : ["https://via.placeholder.com/400x250"];
          const sliderIndex = sliderIndexes[listing._id] || 0;
          // Try to extract city/state from location or address
          let city = 'India';
          if (listing.location) {
            city = listing.location.split(',').pop().trim();
          } else if (listing.address) {
            city = listing.address.split(',').pop().trim();
          }
          return (
            <div
              key={listing._id || listing.name}
              className="relative bg-white/60 backdrop-blur-lg rounded-3xl shadow-2xl border border-blue-100 overflow-hidden flex flex-col group hover:shadow-blue-300 hover:scale-[1.04] transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              {/* City/State Badge */}
              <span className={`absolute top-4 left-4 px-4 py-1 rounded-full text-xs font-bold shadow-lg z-20 border border-white/40 ${getBadgeColor(city)}`}>{city}</span>
              {/* Glassy gradient overlay */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-blue-100/30 via-white/10 to-green-100/20 opacity-80 z-0" />
              {/* Image Slider */}
              <div className="relative h-56 w-full bg-gray-100 flex items-center justify-center z-10">
                <img
                  src={images[sliderIndex]}
                  alt={listing.name}
                  className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105 rounded-t-3xl"
                  draggable="false"
                />
                {images.length > 1 && (
                  <>
                    <button
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-blue-700 rounded-full p-2 shadow focus:outline-none"
                      onClick={() => handlePrev(listing._id, images)}
                      aria-label="Previous image"
                    >
                      <FaChevronLeft />
                    </button>
                    <button
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-blue-700 rounded-full p-2 shadow focus:outline-none"
                      onClick={() => handleNext(listing._id, images)}
                      aria-label="Next image"
                    >
                      <FaChevronRight />
                    </button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                      {images.map((_, idx) => (
                        <span
                          key={idx}
                          className={`inline-block w-2 h-2 rounded-full ${idx === sliderIndex ? 'bg-blue-500' : 'bg-blue-200'}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
              {/* Listing Info */}
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
                <div className="flex gap-4 mt-2 text-gray-500 text-xs">
                  <span><FaBed className="inline mr-1" />{listing.bedrooms} Bed</span>
                  <span><FaBath className="inline mr-1" />{listing.bathrooms} Bath</span>
                  <span><FaCouch className="inline mr-1" />{listing.furnished ? 'Furnished' : 'Unfurnished'}</span>
                  <span><FaCar className="inline mr-1" />{listing.parking ? 'Parking' : 'No Parking'}</span>
                </div>
                {listing.offer && (
                  <span className="inline-block mt-2 bg-green-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow">Offer</span>
                )}
                <div className="mt-4 text-gray-700 text-sm line-clamp-3 drop-shadow-sm">{listing.description}</div>
                {/* Action Buttons */}
                <div className="flex justify-center gap-3 mt-4">
                  <button className="bg-gradient-to-r from-blue-400 to-green-400 text-white font-semibold rounded-full px-5 py-2 shadow hover:from-blue-500 hover:to-green-500 transition focus:outline-none focus:ring-2 focus:ring-blue-200" onClick={() => navigate(`/view-listing/${listing._id}`)}>View</button>
                  <button
                    className="border border-blue-400 text-blue-600 font-semibold rounded-full px-5 py-2 bg-white hover:bg-blue-50 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-100"
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
                    Contact
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Footer */}
      <footer className="mt-16 w-full bg-gray-50 border-t border-gray-200 pt-12 pb-0">
        <div className="max-w-7xl mx-auto px-4 flex flex-col gap-10">
          {/* Logos Row */}
          <div className="flex flex-wrap justify-center gap-10 mb-8 opacity-70">
            <img src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Adobe_logo.png" alt="Adobe Homes" className="h-10 object-contain grayscale" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Builder.png" alt="AA Builders" className="h-10 object-contain grayscale" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="The Capital" className="h-10 object-contain grayscale" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/Bitmap_rosewood_logo.png" alt="Rosewood Homes" className="h-10 object-contain grayscale" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2c/Font_Awesome_5_solid_building.svg" alt="Ironwood Apartments" className="h-10 object-contain grayscale" />
          </div>
          {/* Main Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-blue-900">Contact Info</h3>
              <div className="text-gray-600 text-sm mb-2">3015 Grand Ave, Coconut Grove,<br />Merrick Way, FL 12345</div>
              <div className="text-gray-600 text-sm mb-2">Phone: 123-456-7890</div>
              <div className="text-gray-600 text-sm mb-2">Email: <a href="mailto:info@yourwebsite.com" className="text-blue-600 hover:underline">info@yourwebsite.com</a></div>
            </div>
            {/* Property Types */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-blue-900">Property Types</h3>
              <ul className="text-gray-600 text-sm space-y-1">
                <li><span className="mr-2">&#9654;</span>Commercial
                  <ul className="ml-6 list-disc text-xs text-gray-500">
                    <li>Office</li>
                    <li>Shop</li>
                  </ul>
                </li>
                <li><span className="mr-2">&#9654;</span>Residential
                  <ul className="ml-6 list-disc text-xs text-gray-500">
                    <li>Apartment</li>
                    <li>Apartment Building</li>
                    <li>Condominium</li>
                    <li>Single Family Home</li>
                    <li>Villa</li>
                  </ul>
                </li>
              </ul>
            </div>
            {/* Newsletter */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-blue-900">Newsletter</h3>
              <form className="flex flex-col gap-2">
                <label htmlFor="newsletter-email" className="text-gray-600 text-sm">Email address:</label>
                <input id="newsletter-email" type="email" placeholder="Your email address" className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
                <button type="submit" className="bg-orange-400 hover:bg-orange-500 text-white font-semibold rounded px-4 py-2 mt-1 transition">Sign up</button>
              </form>
            </div>
            {/* Recent Posts */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-blue-900">Recent Posts</h3>
              <ul className="text-gray-600 text-sm space-y-1">
                <li><span className="mr-2">&#9654;</span>Standard Blog Post With Featured Image</li>
                <li><span className="mr-2">&#9654;</span>Example Post With Gallery Post Format</li>
                <li><span className="mr-2">&#9654;</span>Example Post With Image Post Format</li>
                <li><span className="mr-2">&#9654;</span>Lorem Ipsum Dolor Sit Amet</li>
                <li><span className="mr-2">&#9654;</span>Example Video Blog Post</li>
              </ul>
            </div>
          </div>
        </div>
        {/* Cityscape Silhouette */}
        <div className="w-full h-24 bg-gradient-to-t from-gray-200 to-transparent flex items-end">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path fill="#e5e7eb" d="M0,100 L0,60 Q120,80 240,60 Q360,40 480,60 Q600,80 720,60 Q840,40 960,60 Q1080,80 1200,60 Q1320,40 1440,60 L1440,100 Z" />
          </svg>
        </div>
        <div className="text-center text-gray-400 text-xs pb-4">© {new Date().getFullYear()}. All rights reserved.</div>
      </footer>
    </div>
  );
}

export default Home;
