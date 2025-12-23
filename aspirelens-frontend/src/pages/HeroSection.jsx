import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  
  const [badgeRef, badgeInView] = useInView({ triggerOnce: true, threshold: 0.5 });
  const [titleRef, titleInView] = useInView({ triggerOnce: true, threshold: 0.3 });
  const [subtitleRef, subtitleInView] = useInView({ triggerOnce: true, threshold: 0.3 });
  const [buttonRef, buttonInView] = useInView({ triggerOnce: true, threshold: 0.5 });
  const [featuresRef, featuresInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [trustedRef, trustedInView] = useInView({ triggerOnce: true, threshold: 0.2 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
        setMousePosition({ x, y });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const floatAnimation = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const featureVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: "easeOut"
      }
    })
  };

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
      <motion.div 
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"
        animate={{
          x: mousePosition.x * 0.5,
          y: mousePosition.y * 0.5,
        }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
      />
      <motion.div 
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-amber-400/10 to-orange-400/10 rounded-full blur-3xl"
        animate={{
          x: -mousePosition.x * 0.3,
          y: -mousePosition.y * 0.3,
        }}
        transition={{ type: "spring", stiffness: 30, damping: 20 }}
      />
      
      {/* Floating particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + i * 10}%`,
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, Math.sin(i) * 20, 0],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        />
      ))}

      <div className="max-w-6xl mx-auto text-center relative z-10">
        {/* Eyebrow/badge */}
        <motion.div 
          ref={badgeRef}
          initial={{ opacity: 0, y: -20, scale: 0.8 }}
          animate={badgeInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.5, type: "spring" }}
          className="inline-block mb-6"
        >
          <motion.span 
            whileHover={{ scale: 1.05, rotate: [-1, 1, -1, 1, 0] }}
            className="px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-400 text-white font-semibold rounded-full text-sm md:text-base shadow-lg backdrop-blur-sm"
          >
            🚀 Intelligent Exploration
          </motion.span>
        </motion.div>

        {/* Main heading */}
        <div ref={titleRef}>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="block text-gray-900">See the World Through</span>
            <motion.span 
              initial={{ backgroundPosition: "0% 50%" }}
              animate={{ backgroundPosition: "100% 50%" }}
              transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
              style={{ backgroundSize: "200% 200%" }}
              className="block bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent mt-2"
            >
              a Smarter Lens
            </motion.span>
          </motion.h1>
        </div>

        {/* Subheading */}
        <motion.div 
          ref={subtitleRef}
          initial={{ opacity: 0 }}
          animate={subtitleInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-10 leading-relaxed">
            <span className="font-semibold text-gray-900">AspireLens</span> helps you explore, map, and understand your surroundings with clarity and purpose.
            <br />
            <motion.span 
              variants={floatAnimation}
              animate="animate"
              className="text-lg md:text-xl text-gray-600 italic mt-2 block"
            >
              Discover smarter. Act faster. Live better.
            </motion.span>
          </p>
        </motion.div>

        {/* Button */}
        <motion.div 
          ref={buttonRef}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={buttonInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          <Link to="/login">
            <motion.button 
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="relative px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-lg rounded-xl overflow-hidden group w-full sm:w-auto"
            >
              {/* Button shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
              <span className="relative z-10">Evaluate Your Career</span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Stats/Features */}
        <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              custom={index}
              initial="hidden"
              animate={featuresInView ? "visible" : "hidden"}
              variants={featureVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className={`bg-white p-6 rounded-2xl shadow-lg border border-${feature.color}-100 backdrop-blur-sm relative overflow-hidden group`}
            >
              {/* Hover effect background */}
              <div className={`absolute inset-0 bg-gradient-to-br from-${feature.color}-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className={`text-3xl text-${feature.color}-600 mb-2 relative z-10`}
              >
                {feature.icon}
              </motion.div>
              <h3 className="font-bold text-gray-900 text-lg mb-2 relative z-10">{feature.title}</h3>
              <p className="text-gray-600 relative z-10">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Trusted section */}
        <motion.div 
          ref={trustedRef}
          initial={{ opacity: 0, y: 30 }}
          animate={trustedInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mt-20 pt-10 border-t border-gray-200"
        >
          <motion.p 
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-gray-500 text-sm md:text-base mb-6"
          >
            Trusted by forward-thinking individuals and teams
          </motion.p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70">
            {trustedItems.map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 20 }}
                animate={trustedInView ? { opacity: 0.7, y: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                whileHover={{ opacity: 1, scale: 1.1, color: "#3b82f6" }}
                className="text-gray-700 font-semibold cursor-pointer"
              >
                {item}
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* Scroll indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2" />
        </div>
      </motion.div>
    </section>
  );
}