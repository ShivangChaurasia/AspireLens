
import React, { useState } from 'react';
import {
  Sparkles,
  ChevronRight
} from 'lucide-react';

const WelcomePage = () => {
  const [userName, setUserName] = useState('');

  // 🕒 Derive time-based values (no useEffect needed)
  const hour = new Date().getHours();

  const greeting =
    hour < 12 ? 'Good Morning' :
    hour < 18 ? 'Good Afternoon' :
    'Good Evening';

  const timeOfDay =
    hour < 12 ? 'morning' :
    hour < 18 ? 'afternoon' :
    'evening';

  const nameSuggestions = ['Traveler', 'Explorer', 'Creator', 'Dreamer', 'Innovator'];

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (!userName.trim()) {
      const randomName =
        nameSuggestions[Math.floor(Math.random() * nameSuggestions.length)];
      setUserName(randomName);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 text-gray-800">

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero */}
        <section className="text-center mb-16">
          <div className="inline-block mb-4 p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse">
            <Sparkles className="text-white" size={28} />
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {greeting}
            </span>
            <br />
            <span className="text-4xl md:text-5xl">
              {userName || 'One Word that Defines You!!'}!
            </span>
          </h1>

          <p className="text-xl max-w-2xl mx-auto mb-8 text-gray-600">
            It's a wonderful {timeOfDay}. Welcome to a modern React experience.
          </p>

          {/* Name Input */}
          <form onSubmit={handleNameSubmit} className="max-w-md mx-auto mb-10">
            <div className="flex gap-2">
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name (optional)"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all flex items-center gap-2"
              >
                Set Name
                <ChevronRight size={20} />
              </button>
            </div>
            <p className="text-sm mt-2 text-gray-500">
              Or choose: {nameSuggestions.map((name, i) => (
                <button
                  key={i}
                  onClick={() => setUserName(name)}
                  className="mx-1 text-blue-500 hover:text-blue-600 hover:underline"
                >
                  {name}
                </button>
              ))}
            </p>
          </form>
        </section>
      </main>
    </div>
  );
};

export default WelcomePage;