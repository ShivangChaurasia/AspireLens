import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

export default function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isBadgeVisible, setIsBadgeVisible] = useState(false);
  const [isTitleVisible, setIsTitleVisible] = useState(false);
  const [isSubtitleVisible, setIsSubtitleVisible] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const [isFeaturesVisible, setIsFeaturesVisible] = useState(false);
  const [isTrustedVisible, setIsTrustedVisible] = useState(false);
  
  const containerRef = useRef(null);
  const badgeRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonRef = useRef(null);
  const featuresRef = useRef(null);
  const trustedRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
        setMousePosition({ x, y });
      }
    };

    // Intersection Observer for scroll animations
    const createObserver = (ref, setVisible) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        },
        { threshold: 0.2 }
      );
      
      if (ref.current) {
        observer.observe(ref.current);
      }
      
      return observer;
    };

    const observers = [
      createObserver(badgeRef, setIsBadgeVisible),
      createObserver(titleRef, setIsTitleVisible),
      createObserver(subtitleRef, setIsSubtitleVisible),
      createObserver(buttonRef, setIsButtonVisible),
      createObserver(featuresRef, setIsFeaturesVisible),
      createObserver(trustedRef, setIsTrustedVisible),
    ];

    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      observers.forEach(observer => observer.disconnect());
    };
  }, []);

  const features = [
    { icon: "🧭", title: "Smart Navigation", desc: "Intuitive mapping with AI-powered insights", color: "blue" },
    { icon: "⚡", title: "Real-Time Analysis", desc: "Process information instantly for faster decisions", color: "amber" },
    { icon: "🎯", title: "Purpose-Driven", desc: "Tools designed with your goals in mind", color: "cyan" }
  ];

  const trustedItems = ["Explorers", "Researchers", "Educators", "Analysts", "Creators"];

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center px-6 md:px-20 py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 overflow-hidden"
    >
      {/* Animated background elements */}
      <div 
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl transition-transform duration-300"
        style={{
          transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`
        }}
      />
      <div 
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-amber-400/10 to-orange-400/10 rounded-full blur-3xl transition-transform duration-500"
        style={{
          transform: `translate(${-mousePosition.x * 0.3}px, ${-mousePosition.y * 0.3}px)`
        }}
      />
      
      {/* Floating particles */}
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-float"
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + i * 10}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${3 + i}s`
          }}
        />
      ))}

      <div className="max-w-6xl mx-auto text-center relative z-10">
        {/* Eyebrow/badge */}
        <div 
          ref={badgeRef}
          className={`inline-block mb-6 transition-all duration-700 ${isBadgeVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-5 scale-95'}`}
        >
          <span 
            className="px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-400 text-white font-semibold rounded-full text-sm md:text-base shadow-lg backdrop-blur-sm hover:scale-105 hover:rotate-1 transition-transform duration-300 inline-block"
          >
            🚀 Intelligent Exploration
          </span>
        </div>

        {/* Main heading */}
        <div ref={titleRef}>
          <h1 
            className={`text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight transition-all duration-700 ${isTitleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <span className="block text-gray-900">See the World Through</span>
            <span 
              className="block bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent mt-2 animate-gradient"
              style={{ backgroundSize: "200% 200%" }}
            >
              a Smarter Lens
            </span>
          </h1>
        </div>

        {/* Subheading */}
        <div 
          ref={subtitleRef}
          className={`transition-all duration-700 ${isSubtitleVisible ? 'opacity-100' : 'opacity-0'}`}
        >
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-10 leading-relaxed">
            <span className="font-semibold text-gray-900">AspireLens</span> helps you explore, map, and understand your surroundings with clarity and purpose.
            <br />
            <span 
              className="text-lg md:text-xl text-gray-600 italic mt-2 block animate-float-slow"
            >
              Discover smarter. Act faster. Live better.
            </span>
          </p>
        </div>

        {/* Button */}
        <div 
          ref={buttonRef}
          className={`flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 transition-all duration-700 ${isButtonVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
        >
          <Link to="/login">
            <button 
              className="relative px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-lg rounded-xl overflow-hidden group w-full sm:w-auto hover:scale-105 hover:-translate-y-1 active:scale-95 transition-all duration-300"
            >
              {/* Button shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-600" />
              <span className="relative z-10">Evaluate Your Career</span>
            </button>
          </Link>
        </div>

        {/* Stats/Features */}
        <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`bg-white p-6 rounded-2xl shadow-lg border border-${feature.color}-100 backdrop-blur-sm relative overflow-hidden group transition-all duration-500 hover:-translate-y-2 hover:scale-102 ${isFeaturesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Hover effect background */}
              <div className={`absolute inset-0 bg-gradient-to-br from-${feature.color}-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              
              <div 
                className={`text-3xl text-${feature.color}-600 mb-2 relative z-10 group-hover:rotate-360 transition-transform duration-600`}
              >
                {feature.icon}
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2 relative z-10">{feature.title}</h3>
              <p className="text-gray-600 relative z-10">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Trusted section */}
        <div 
          ref={trustedRef}
          className={`mt-20 pt-10 border-t border-gray-200 transition-all duration-700 ${isTrustedVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <p 
            className="text-gray-500 text-sm md:text-base mb-6 animate-pulse-slow"
          >
            Trusted by forward-thinking individuals and teams
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70">
            {trustedItems.map((item, index) => (
              <div
                key={item}
                className={`text-gray-700 font-semibold cursor-pointer transition-all duration-300 hover:opacity-100 hover:scale-110 hover:text-blue-600 ${isTrustedVisible ? 'opacity-70 translate-y-0' : 'opacity-0 translate-y-5'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Scroll indicator */}
      <div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-slow"
      >
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2" />
        </div>
      </div>

      {/* Add custom animation keyframes to your CSS or Tailwind config */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.5; }
          50% { transform: translateY(-40px) translateX(20px); opacity: 1; }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translate(-50%, 0); }
          50% { transform: translate(-50%, 10px); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        
        @keyframes rotate-360 {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-float {
          animation: float infinite ease-in-out;
        }
        
        .animate-float-slow {
          animation: float-slow 3s infinite ease-in-out;
        }
        
        .animate-gradient {
          animation: gradient 3s infinite linear;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 1.5s infinite ease-in-out;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 2s infinite ease-in-out;
        }
        
        .group-hover\\:rotate-360:hover {
          animation: rotate-360 0.6s ease-in-out;
        }
        
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
        
        .duration-600 {
          transition-duration: 600ms;
        }
        
        .scale-102 {
          transform: scale(1.02);
        }
      `}</style>
    </section>
  );
}