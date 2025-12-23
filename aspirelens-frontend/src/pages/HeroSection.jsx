import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

export default function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState({
    badge: false,
    title: false,
    subtitle: false,
    button: false,
    features: false,
    stats: false
  });
  
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  
  // Mouse movement effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 40;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 40;
        setMousePosition({ x, y });
      }
    };
    
    // Intersection Observer for scroll animations
    const handleIntersection = (entries) => {
      entries.forEach(entry => {
        const id = entry.target.dataset.section;
        if (entry.isIntersecting) {
          setIsVisible(prev => ({ ...prev, [id]: true }));
        }
      });
    };
    
    const observer = new IntersectionObserver(
      handleIntersection,
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );
    
    // Observe all sections
    document.querySelectorAll('[data-section]').forEach(el => observer.observe(el));
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);
  
  // Canvas background animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let time = 0;
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Create particles
    const createParticles = () => {
      particles = [];
      const particleCount = Math.min(50, Math.floor((canvas.width * canvas.height) / 20000));
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          color: Math.random() > 0.5 ? 'rgba(59, 130, 246, 0.3)' : 'rgba(6, 182, 212, 0.3)',
          orbitRadius: Math.random() * 100 + 50,
          orbitSpeed: Math.random() * 0.01 + 0.005,
          angle: Math.random() * Math.PI * 2
        });
      }
    };
    
    createParticles();
    
    // Draw grid
    const drawGrid = () => {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      const gridSize = 50;
      const offsetX = mousePosition.x * 0.1;
      const offsetY = mousePosition.y * 0.1;
      
      // Vertical lines
      for (let x = offsetX % gridSize; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      // Horizontal lines
      for (let y = offsetY % gridSize; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    };
    
    // Draw particles
    const drawParticles = () => {
      particles.forEach(p => {
        ctx.beginPath();
        ctx.fillStyle = p.color;
        
        // Orbital movement
        p.angle += p.orbitSpeed;
        const orbitX = Math.cos(p.angle) * p.orbitRadius;
        const orbitY = Math.sin(p.angle) * p.orbitRadius;
        
        const x = p.x + orbitX + time * p.speedX;
        const y = p.y + orbitY + time * p.speedY;
        
        // Wrap around edges
        p.x = (x + canvas.width) % canvas.width;
        p.y = (y + canvas.height) % canvas.height;
        
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw connections
        particles.forEach(other => {
          const dx = p.x - other.x;
          const dy = p.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.2 * (1 - distance / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        });
      });
    };
    
    // Draw gradient blobs
    const drawGradientBlobs = () => {
      const gradient1 = ctx.createRadialGradient(
        canvas.width * 0.3 + mousePosition.x * 0.2,
        canvas.height * 0.3 + mousePosition.y * 0.2,
        0,
        canvas.width * 0.3 + mousePosition.x * 0.2,
        canvas.height * 0.3 + mousePosition.y * 0.2,
        300
      );
      gradient1.addColorStop(0, 'rgba(59, 130, 246, 0.1)');
      gradient1.addColorStop(1, 'rgba(59, 130, 246, 0)');
      
      const gradient2 = ctx.createRadialGradient(
        canvas.width * 0.7 - mousePosition.x * 0.2,
        canvas.height * 0.7 - mousePosition.y * 0.2,
        0,
        canvas.width * 0.7 - mousePosition.x * 0.2,
        canvas.height * 0.7 - mousePosition.y * 0.2,
        400
      );
      gradient2.addColorStop(0, 'rgba(6, 182, 212, 0.1)');
      gradient2.addColorStop(1, 'rgba(6, 182, 212, 0)');
      
      ctx.fillStyle = gradient1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = gradient2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      drawGradientBlobs();
      drawGrid();
      drawParticles();
      
      time += 0.01;
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [mousePosition]);
  
  const features = [
    { 
      icon: "🧭", 
      title: "Smart Navigation", 
      desc: "Intuitive mapping with AI-powered insights",
      gradient: "from-blue-500 to-cyan-500"
    },
    { 
      icon: "⚡", 
      title: "Real-Time Analysis", 
      desc: "Process information instantly for faster decisions",
      gradient: "from-amber-500 to-orange-500"
    },
    { 
      icon: "🎯", 
      title: "Purpose-Driven", 
      desc: "Tools designed with your goals in mind",
      gradient: "from-cyan-500 to-teal-500"
    }
  ];
  
  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center px-6 md:px-12 lg:px-20 py-20 bg-gray-900 overflow-hidden"
    >
      {/* Canvas background */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900/95 to-gray-900" />
      
      {/* Floating orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"
          style={{
            top: '20%',
            left: '10%',
            transform: `translate(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1}px)`
          }}
        />
        <div 
          className="absolute w-80 h-80 bg-gradient-to-r from-amber-500/5 to-orange-500/5 rounded-full blur-3xl"
          style={{
            top: '60%',
            right: '15%',
            transform: `translate(${-mousePosition.x * 0.15}px, ${-mousePosition.y * 0.15}px)`
          }}
        />
      </div>
      
      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div 
          data-section="badge"
          className={`transition-all duration-1000 ${isVisible.badge ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-sm rounded-full border border-blue-500/20 mb-8 group hover:border-blue-500/40 hover:scale-105 transition-all duration-300">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            <span className="text-cyan-300 text-sm font-semibold tracking-wide">
              Intelligent Exploration Platform
            </span>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          </div>
        </div>
        
        {/* Main title */}
        <div 
          data-section="title"
          className={`mb-8 transition-all duration-1000 ${isVisible.title ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            <span className="block">See the World Through</span>
            <div className="relative inline-block mt-4">
              <span className="relative z-10 bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent animate-gradient">
                a Smarter Lens
              </span>
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-blue-500/20 blur-3xl -z-10" />
            </div>
          </h1>
        </div>
        
        {/* Subtitle */}
        <div 
          data-section="subtitle"
          className={`mb-12 transition-all duration-1000 delay-300 ${isVisible.subtitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            <span className="font-semibold text-white">AspireLens</span> helps you explore, map, and understand your surroundings with clarity and purpose.
            <span className="block text-cyan-200 italic mt-4 text-center animate-float-slow">
              Discover smarter • Act faster • Live better
            </span>
          </p>
        </div>
        
        {/* CTA Button */}
        <div 
          data-section="button"
          className={`mb-20 transition-all duration-1000 delay-500 ${isVisible.button ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        >
          <Link to="/login">
            <div className="relative inline-block group">
              <button className="relative px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-lg rounded-xl overflow-hidden transform group-hover:scale-105 group-hover:shadow-[0_0_40px_rgba(6,182,212,0.5)] transition-all duration-500">
                {/* Button shine */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative z-10 flex items-center gap-3">
                  <span className="group-hover:rotate-12 transition-transform duration-300">🚀</span>
                  Evaluate Your Career
                  <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                </span>
              </button>
              
              {/* Button glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 via-cyan-500/30 to-blue-500/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
              
              {/* Floating indicators */}
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-cyan-400 rounded-full animate-ping" />
              <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '0.2s' }} />
            </div>
          </Link>
          
          {/* Subtext */}
          <p className="text-gray-400 text-sm text-center mt-4">
            Join 10,000+ professionals who transformed their careers
          </p>
        </div>
        
        {/* Features grid */}
        <div 
          data-section="features"
          className={`grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20 transition-all duration-1000 delay-700 ${isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
        >
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="relative group"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Card glow effect */}
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${feature.gradient} rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
              
              {/* Card */}
              <div className="relative bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 group-hover:border-gray-600/50 transition-all duration-300 h-full">
                {/* Icon */}
                <div className="relative mb-6">
                  <div className="text-4xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                    {feature.icon}
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-pulse" />
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-4 relative">
                  {feature.title}
                  <div className={`absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r ${feature.gradient} rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
                </h3>
                
                {/* Description */}
                <p className="text-gray-400 leading-relaxed">
                  {feature.desc}
                </p>
                
                {/* Hover indicator */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Stats */}
        <div 
          data-section="stats"
          className={`grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto transition-all duration-1000 delay-900 ${isVisible.stats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
        >
          {[
            { value: "10K+", label: "Active Users", color: "blue" },
            { value: "24/7", label: "Uptime", color: "cyan" },
            { value: "99.9%", label: "Accuracy", color: "amber" },
            { value: "<1s", label: "Response Time", color: "green" }
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="text-center group"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className={`text-3xl md:text-4xl font-bold bg-gradient-to-r from-${stat.color}-400 to-${stat.color}-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300`}>
                {stat.value}
              </div>
              <div className="text-gray-400 text-sm">
                {stat.label}
              </div>
              {/* Animated underline */}
              <div className="relative h-1 w-16 mx-auto mt-4 overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-r from-${stat.color}-500/0 via-${stat.color}-500 to-${stat.color}-500/0 group-hover:translate-x-full transition-transform duration-1000`} />
              </div>
            </div>
          ))}
        </div>
        
        {/* Trusted by */}
        <div className="mt-20 pt-12 border-t border-gray-800/50">
          <p className="text-gray-400 text-sm text-center mb-8 animate-pulse-slow">
            Trusted by forward-thinking individuals and teams
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12">
            {["🚀 Explorers", "🔬 Researchers", "🎓 Educators", "📊 Analysts", "🎨 Creators"].map((item, index) => (
              <div
                key={item}
                className="text-gray-300 font-medium px-4 py-2 bg-gray-800/30 backdrop-blur-sm rounded-lg border border-gray-700/30 hover:border-cyan-500/30 hover:text-cyan-300 hover:scale-105 hover:shadow-lg transition-all duration-300 transform hover:translate-y-[-2px]"
                style={{
                  animation: `logo-float ${3 + index}s infinite ease-in-out`,
                  animationDelay: `${index * 0.2}s`
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex flex-col items-center gap-2">
          <span className="text-gray-400 text-sm animate-pulse">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center p-2">
            <div className="w-1 h-2 bg-gradient-to-b from-cyan-400 to-blue-400 rounded-full animate-bounce" />
          </div>
        </div>
      </div>
      
      {/* Custom animations */}
      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes logo-float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-5px) scale(1.05); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 3s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
        
        .animate-bounce {
          animation: bounce 2s infinite;
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        .backdrop-blur-sm {
          backdrop-filter: blur(8px);
        }
      `}</style>
    </section>
  );
}