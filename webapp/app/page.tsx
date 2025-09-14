'use client';

import { useState } from 'react';

export default function Home() {
  const [isClicked, setIsClicked] = useState(false);

  const handleGetStarted = () => {
    setIsClicked(true);
    alert('Welcome to Health Journal App! 🎉\n\nFeatures coming soon:\n• Health tracking\n• AI insights\n• Data visualization\n• Export capabilities');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-800 mb-6">
            Health Journal App
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Comprehensive health tracking and AI-powered insights
          </p>
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
              <h3 className="text-xl font-semibold mb-4">📱 Mobile App</h3>
              <p className="text-gray-600">
                SwiftUI-based iOS app with audio recording and health tracking
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
              <h3 className="text-xl font-semibold mb-4">🌐 Web Dashboard</h3>
              <p className="text-gray-600">
                Next.js web application with comprehensive health analytics
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
              <h3 className="text-xl font-semibold mb-4">🤖 AI Intelligence</h3>
              <p className="text-gray-600">
                OpenAI-powered analysis and health pattern recognition
              </p>
            </div>
          </div>
          <div className="mt-12">
            <button 
              onClick={handleGetStarted}
              className={`${
                isClicked 
                  ? 'bg-green-600 hover:bg-green-700 transform scale-105' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white font-bold py-3 px-8 rounded-lg text-lg transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl`}
            >
              {isClicked ? '✅ Welcome!' : 'Get Started'}
            </button>
          </div>
          {isClicked && (
            <div className="mt-6 p-4 bg-green-100 border border-green-300 rounded-lg">
              <p className="text-green-800">
                🎉 Great! You've successfully interacted with the Health Journal App!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
