import React from 'react';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-100 flex flex-col items-center py-10 px-4">
      {/* Hero Section */}
      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-xl p-8 mb-10 border border-blue-100 text-center">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-4">About BrokerX</h1>
        <p className="text-lg text-gray-700 mb-2">
          <span className="font-semibold text-green-600">BrokerX</span> is your modern real estate platform, designed to make buying, selling, and renting properties seamless, transparent, and enjoyable.
        </p>
        <p className="text-base text-gray-500">
          We combine technology, local expertise, and a passion for service to help you find your perfect home or investment.
        </p>
      </div>

      {/* Mission Section */}
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow p-6 mb-10 border border-green-100">
        <h2 className="text-2xl font-bold text-green-700 mb-2">Our Mission</h2>
        <p className="text-gray-700">
          To empower people to make smarter real estate decisions by providing instant insights, verified listings, and a user-friendly experience. We believe everyone deserves a trusted partner on their property journey.
        </p>
      </div>

      {/* Features Section */}
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="bg-white rounded-2xl shadow p-6 border border-blue-100">
          <h3 className="text-xl font-semibold text-blue-700 mb-2">Why Choose BrokerX?</h3>
          <ul className="list-disc ml-6 text-gray-700 space-y-1">
            <li>Verified, up-to-date property listings</li>
            <li>AI-powered search and instant property insights</li>
            <li>Easy-to-use interface for buyers, sellers, and agents</li>
            <li>Secure, transparent transactions</li>
            <li>Personalized recommendations</li>
            <li>Responsive support team</li>
          </ul>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 border border-green-100 flex flex-col justify-center">
          <h3 className="text-xl font-semibold text-green-700 mb-2">What We Offer</h3>
          <ul className="list-disc ml-6 text-gray-700 space-y-1">
            <li>Buy, sell, or rent homes, apartments, and commercial spaces</li>
            <li>Advanced filtering and map-based search</li>
            <li>Professional property photography and virtual tours</li>
            <li>Expert advice and market reports</li>
            <li>End-to-end support from listing to closing</li>
          </ul>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow p-6 mb-10 border border-purple-100">
        <h2 className="text-2xl font-bold text-purple-700 mb-2">Meet Our Team</h2>
        <div className="flex flex-wrap gap-6 justify-center mt-4">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-200 to-green-200 flex items-center justify-center text-3xl font-bold text-blue-700 mb-2">S</div>
            <div className="font-semibold text-gray-800">Sonu Nigam</div>
            <div className="text-sm text-gray-500">Founder & Lead Developer</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center text-3xl font-bold text-pink-700 mb-2">A</div>
            <div className="font-semibold text-gray-800">Amit Sharma</div>
            <div className="text-sm text-gray-500">Product Manager</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-200 to-orange-200 flex items-center justify-center text-3xl font-bold text-yellow-700 mb-2">R</div>
            <div className="font-semibold text-gray-800">Riya Patel</div>
            <div className="text-sm text-gray-500">Customer Success</div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow p-6 border border-blue-100">
        <h2 className="text-2xl font-bold text-blue-700 mb-2">Contact Us</h2>
        <p className="text-gray-700 mb-2">Have questions or want to partner with us? Reach out!</p>
        <div className="flex flex-col md:flex-row gap-4 md:gap-10 mt-2">
          <div className="flex-1">
            <div className="text-sm text-gray-500">Email</div>
            <a href="mailto:info@brokerx.com" className="text-blue-600 hover:underline font-semibold">info@brokerx.com</a>
          </div>
          <div className="flex-1">
            <div className="text-sm text-gray-500">Phone</div>
            <a href="tel:1234567890" className="text-blue-600 hover:underline font-semibold">123-456-7890</a>
          </div>
        </div>
      </div>
    </div>
  );
}
