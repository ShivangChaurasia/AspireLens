import React, { useState } from 'react';
import {
  Sparkles,
  ChevronRight,
  Sun,
  Moon,
  Coffee,
  Zap,
  Star
} from 'lucide-react';

const WelcomePage = () => {
  const [userName, setUserName] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1); // Track selected suggestion
  const [isHovering, setIsHovering] = useState(false);
  const [nameAnimation, setNameAnimation] = useState(false);

  // 🕒 Derive time-based values
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
      // Deterministic selection: cycle through suggestions
      const nextIndex = selectedIndex === -1 ? 0 : (selectedIndex + 1) % nameSuggestions.length;
      setSelectedIndex(nextIndex);
      setUserName(nameSuggestions[nextIndex]);
    } else {
      setSelectedIndex(nameSuggestions.indexOf(userName));
    }
    setNameAnimation(true);
    setTimeout(() => setNameAnimation(false), 1000);
  };

  const handleSuggestionClick = (name, index) => {
    setUserName(name);
    setSelectedIndex(index);
    setNameAnimation(true);
    setTimeout(() => setNameAnimation(false), 1000);
  };

  // Time-based icon
  const TimeIcon = hour < 12 ? Sun : hour < 18 ? Coffee : Moon;

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-800">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating particles - deterministic positions */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full"
            style={{
              left: `${(i * 7) % 100}%`, // Deterministic positioning
              top: `${(i * 13) % 100}%`,  // No random values
              animation: `float ${3 + (i % 5)}s infinite ease-in-out`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
        
        {/* Gradient orbs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 py-16 md:py-24">
        
        {/* Header with advanced badge */}
        <div className="flex flex-col items-center mb-12">
          <div 
            className="relative group mb-6"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {/* Outer glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500" />
            
            {/* Animated icon container */}
            <div className="relative p-4 bg-gradient-to-br from-white via-white to-gray-50 rounded-2xl shadow-2xl border border-gray-100/50 backdrop-blur-sm">
              {/* Floating stars - deterministic positions */}
              <div className="absolute -top-2 -right-2">
                <Star className="w-5 h-5 text-yellow-400 animate-spin-slow" />
              </div>
              <div className="absolute -bottom-2 -left-2">
                <Zap className="w-4 h-4 text-blue-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
              </div>
              
              {/* Main icon */}
              <div className="relative">
                <TimeIcon 
                  className={`w-12 h-12 text-gradient-blue-purple transition-transform duration-500 ${
                    isHovering ? 'scale-110 rotate-12' : ''
                  }`}
                  strokeWidth={1.5}
                />
                {/* Icon glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-md" />
              </div>
            </div>
          </div>

          {/* Welcome text */}
          <p className="text-gray-500 text-sm font-medium tracking-wide uppercase mb-2 animate-fade-in">
            Welcome to AspireLens
          </p>
        </div>

        {/* Hero Section */}
        <section className="text-center mb-16 animate-slide-up">
          {/* Greeting with advanced typography */}
          <div className="mb-6">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4">
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                  {greeting}
                </span>
                {/* Text shadow effect */}
                <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent blur-lg opacity-50 -z-10">
                  {greeting}
                </span>
              </span>
            </h1>
            
            {/* Name display with animation */}
            <div className={`h-24 md:h-32 flex items-center justify-center transition-all duration-700 ${
              nameAnimation ? 'scale-110' : 'scale-100'
            }`}>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold">
                <span className={`bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-clip-text text-transparent ${
                  userName ? 'animate-name-appear' : ''
                }`}>
                  {userName || 'One Word that Defines You!!'}!
                </span>
                {userName && (
                  <Sparkles className="inline-block ml-3 w-8 h-8 md:w-10 md:h-10 text-yellow-400 animate-sparkle" />
                )}
              </h2>
            </div>
          </div>

          {/* Time of day message */}
          <p className="text-xl max-w-2xl mx-auto mb-10 text-gray-600 relative group">
            <span className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 px-4 py-2 rounded-lg">
              It's a wonderful {timeOfDay}. Welcome to a modern React experience.
            </span>
            {/* Decorative dots - deterministic positioning */}
            <div className="absolute -left-8 top-1/2 w-4 h-4 bg-blue-400/20 rounded-full group-hover:scale-150 transition-transform duration-300" />
            <div className="absolute -right-8 top-1/2 w-4 h-4 bg-purple-400/20 rounded-full group-hover:scale-150 transition-transform duration-300" />
          </p>

          {/* Enhanced Name Input Form */}
          <form onSubmit={handleNameSubmit} className="max-w-xl mx-auto mb-12">
            <div className="relative group">
              {/* Input glow effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl blur opacity-0 group-hover:opacity-100 transition-all duration-500" />
              
              <div className="relative flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => {
                      setUserName(e.target.value);
                      setSelectedIndex(-1); // Reset index when typing
                    }}
                    placeholder="Enter your name (optional)"
                    className="w-full px-6 py-4 rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent shadow-lg transition-all duration-300"
                  />
                  {/* Animated placeholder effect */}
                  {!userName && (
                    <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                      <span className="text-gray-400 animate-pulse">
                        ✨ Who shall we call you?
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Enhanced Submit Button */}
                <button
                  type="submit"
                  className="relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 group/btn"
                >
                  {/* Button shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                  
                  <span className="relative z-10">Set Name</span>
                  <ChevronRight size={20} className="relative z-10 group-hover/btn:translate-x-1 transition-transform duration-300" />
                  
                  {/* Button glow */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 blur opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 -z-10" />
                </button>
              </div>
            </div>

            {/* Name Suggestions with enhanced styling */}
            <div className="mt-6">
              <p className="text-sm text-gray-500 mb-3">
                Or choose: 
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {nameSuggestions.map((name, index) => (
                  <button
                    key={name}
                    onClick={() => handleSuggestionClick(name, index)}
                    className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-md group/suggestion ${
                      selectedIndex === index
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105'
                        : 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 hover:text-blue-600'
                    }`}
                  >
                    {/* Underline animation - only for non-selected */}
                    <span className="relative">
                      {name}
                      {selectedIndex !== index && (
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover/suggestion:w-full transition-all duration-300" />
                      )}
                    </span>
                    
                    {/* Hover glow - only for non-selected */}
                    {selectedIndex !== index && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover/suggestion:opacity-100 rounded-lg transition-opacity duration-300" />
                    )}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-3">
                Click "Set Name" to cycle through suggestions
              </p>
            </div>
          </form>
        </section>
      </main>

      {/* Custom Animations CSS */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes name-appear {
          0% { transform: scale(0.9); opacity: 0.5; }
          50% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes sparkle {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
          50% { transform: scale(1.3) rotate(180deg); opacity: 0.8; }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }
        
        .animate-name-appear {
          animation: name-appear 0.6s ease-out;
        }
        
        .animate-sparkle {
          animation: sparkle 2s ease-in-out infinite;
        }
        
        .text-gradient-blue-purple {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
    </div>
  );
};

export default WelcomePage;