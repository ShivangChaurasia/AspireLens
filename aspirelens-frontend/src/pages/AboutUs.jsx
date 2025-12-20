// src/pages/AboutUs.jsx
import React, { useContext } from 'react';
import AuthContext from '../context/authContext';
import { 
  Target, 
  Eye, 
  Brain, 
  ShieldCheck, 
  Mail, 
  Lightbulb,
  Users,
  TrendingUp
} from 'lucide-react';

const AboutUs = () => {
  const { user } = useContext(AuthContext);
  const isAuthenticated = !!user;



return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-blue-50/30 py-8 px-4 sm:px-6 lg:px-8 animate-fadeIn">
      {/* Animated background elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-1000"></div>
      
      <div className="max-w-7xl mx-auto relative">
        {/* Hero Section with Animation */}
        <div className="mb-16 text-center transform transition-all duration-700 hover:scale-[1.02]">
          <div className="inline-block mb-6">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur opacity-30"></div>
              <div className="relative bg-white rounded-full p-3 shadow-2xl">
                <Users className="w-12 h-12 text-blue-600" />
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 animate-slideUp">
            {isAuthenticated && user?.firstName 
              ? `Hello, ${user.firstName} 👋` 
              : 'Welcome to AspireLens'
            }
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed animate-slideUp delay-100">
            {isAuthenticated 
              ? "Let's explore what makes AspireLens your trusted career partner"
              : 'Helping you discover your career direction'
            }
          </p>
          
          {/* Animated underline */}
          <div className="mt-8 w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full animate-widthGrow"></div>
        </div>

        {/* Company Overview - Glass Morphism Effect */}
        <section className="mb-20 transform transition-all duration-500 hover:scale-[1.01]">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-white/50 relative overflow-hidden group">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            <div className="relative flex items-center mb-8">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mr-6 shadow-lg transform group-hover:rotate-12 transition-transform duration-500">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900">About AspireLens</h2>
            </div>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed relative z-10">
              AspireLens is a technology-driven career guidance platform designed to support informed decision-making through structured assessments and personalized insights. We focus on delivering clarity, fairness, and growth-oriented guidance rather than generic advice.
            </p>
            
            {/* Floating particles */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-400/20 rounded-full blur-sm animate-float"></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-purple-400/20 rounded-full blur-sm animate-float delay-1000"></div>
          </div>
        </section>

        {/* Mission & Vision Cards - Side by side with hover effects */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {/* Mission Card */}
          <div className="group transform transition-all duration-500 hover:-translate-y-2">
            <div className="bg-gradient-to-br from-white to-green-50 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-green-100/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full -translate-y-16 translate-x-16"></div>
              
              <div className="flex items-start mb-8 relative z-10">
                <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mr-6 shadow-lg transform group-hover:scale-110 transition-transform duration-500">
                  <Target className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h3>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    To empower individuals with reliable career insights by combining thoughtful assessment design with modern technology.
                  </p>
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
            </div>
          </div>

          {/* Vision Card */}
          <div className="group transform transition-all duration-500 hover:-translate-y-2">
            <div className="bg-gradient-to-br from-white to-purple-50 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-purple-100/50 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/5 rounded-full -translate-y-16 -translate-x-16"></div>
              
              <div className="flex items-start mb-8 relative z-10">
                <div className="p-4 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl mr-6 shadow-lg transform group-hover:scale-110 transition-transform duration-500">
                  <Eye className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h3>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    To create a trusted ecosystem that bridges the gap between education and real-world career opportunities.
                  </p>
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-violet-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
            </div>
          </div>
        </div>

        {/* What We Offer Section */}
        <section className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What We <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Offer</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools and insights to guide your career journey
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Brain className="w-10 h-10" />,
                title: "Structured Assessments",
                description: "Well-designed aptitude and skill-based evaluations",
                color: "from-blue-500 to-cyan-500",
                bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50"
              },
              {
                icon: <TrendingUp className="w-10 h-10" />,
                title: "Career Insights",
                description: "Performance-based recommendations for growth",
                color: "from-green-500 to-emerald-500",
                bgColor: "bg-gradient-to-br from-green-50 to-emerald-50"
              },
              {
                icon: <Lightbulb className="w-10 h-10" />,
                title: "Personalized Guidance",
                description: "Tailored learning and development pathways",
                color: "from-amber-500 to-orange-500",
                bgColor: "bg-gradient-to-br from-amber-50 to-orange-50"
              },
              {
                icon: <ShieldCheck className="w-10 h-10" />,
                title: "Continuous Improvement",
                description: "Data-backed feedback for ongoing growth",
                color: "from-indigo-500 to-purple-500",
                bgColor: "bg-gradient-to-br from-indigo-50 to-purple-50"
              }
            ].map((item, index) => (
              <div 
                key={index}
                className="group transform transition-all duration-500 hover:-translate-y-3"
              >
                <div className={`${item.bgColor} rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/50 h-full relative overflow-hidden`}>
                  {/* Animated corner accent */}
                  <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-bl-3xl`}></div>
                  
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${item.color} w-fit mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-500`}>
                    <div className="text-white">
                      {item.icon}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {item.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {item.description}
                  </p>
                  
                  {/* Hover indicator line */}
                  <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${item.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left`}></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Trust & Principles - Card Grid */}
        <section className="mb-20">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-3xl p-8 md:p-12 shadow-xl border border-gray-200/50 relative overflow-hidden">
            <div className="text-center mb-12">
              <div className="inline-block p-3 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl mb-6">
                <ShieldCheck className="w-12 h-12 text-gray-700" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Built on <span className="bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">Trust & Integrity</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our commitment to fairness, privacy, and transparency
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: "Fair & Unbiased",
                  description: "Consistent assessment structure for all users",
                  icon: "⚖️"
                },
                {
                  title: "Question Integrity",
                  description: "No repeated questions for authentic results",
                  icon: "🔒"
                },
                {
                  title: "Privacy First",
                  description: "Strong emphasis on data safety and security",
                  icon: "👁️"
                },
                {
                  title: "Transparent Outcomes",
                  description: "Clear explanations for all results and insights",
                  icon: "💎"
                }
              ].map((item, index) => (
                <div 
                  key={index}
                  className="group transform transition-all duration-300 hover:scale-[1.05]"
                >
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200/50 h-full">
                    <div className="text-4xl mb-6 transform group-hover:scale-125 transition-transform duration-300">
                      {item.icon}
                    </div>
                    <div className="flex items-center mb-4">
                      <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mr-3"></div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-gray-600">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why AspireLens Section - Highlight */}
        <section className="mb-20 transform transition-all duration-500 hover:scale-[1.01]">
          <div className="bg-gradient-to-br from-indigo-50/80 via-blue-50/50 to-purple-50/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-indigo-100/50 relative overflow-hidden group">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-10 left-10 w-40 h-40 border-2 border-blue-400 rounded-full animate-spin-slow"></div>
              <div className="absolute bottom-10 right-10 w-32 h-32 border-2 border-purple-400 rounded-full animate-spin-slow reverse"></div>
            </div>
            
            <div className="relative flex flex-col md:flex-row items-center mb-8">
              <div className="p-5 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl mr-0 md:mr-8 mb-6 md:mb-0 shadow-xl transform group-hover:rotate-12 transition-transform duration-700">
                <Lightbulb className="w-12 h-12 text-white" />
              </div>
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Why <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">AspireLens?</span>
                </h2>
                <p className="text-xl text-gray-700 leading-relaxed">
                  Because your career journey deserves clarity, not confusion. We believe in empowering you with the insights needed to make informed decisions, build confidence, and navigate your professional path with purpose. AspireLens is here to illuminate possibilities, not dictate paths.
                </p>
              </div>
            </div>
            
            {/* Floating element */}
            <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-2xl animate-pulse"></div>
          </div>
        </section>

        {/* Contact Section - Call to Action */}
        <section className="mb-12 transform transition-all duration-500 hover:scale-[1.01]">
          <div className="bg-gradient-to-br from-white to-blue-50/50 rounded-3xl p-8 md:p-12 shadow-2xl border border-blue-100/50 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            <div className="text-center relative z-10">
              <div className="inline-flex items-center justify-center p-5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl mb-8 shadow-xl transform group-hover:scale-110 transition-transform duration-500">
                <Mail className="w-14 h-14 text-white" />
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Get in <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Touch</span>
              </h2>
              
              <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                Have questions or feedback? We're here to help you navigate your career journey.
              </p>
              
              {/* Email Button with Glow Effect */}
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=careerwith.aspirelens@gmail.com&su=AspireLens%20Inquiry"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold text-lg rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-500 transform hover:-translate-y-1 group/button"
              >
                <Mail className="w-6 h-6 mr-3 group-hover/button:rotate-12 transition-transform duration-500" />
                <span>Email Us on Gmail</span>
                <span className="ml-3 opacity-0 group-hover/button:opacity-100 group-hover/button:translate-x-1 transition-all duration-500">→</span>
              </a>
              
              <p className="text-gray-500 mt-6">
                Opens Gmail compose window in a new tab • We typically respond within 24 hours
              </p>
              
              {/* Decorative dots */}
              <div className="flex justify-center mt-10 space-x-3">
                {[1, 2, 3].map((dot) => (
                  <div 
                    key={dot}
                    className="w-3 h-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full opacity-60"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </section>

        // Add this section in your AboutUs.jsx, before the footer section

{/* Developer Card Section */}
<section className="mb-16">
  <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-700/50 relative overflow-hidden group">
    {/* Animated background pattern */}
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-10 right-10 w-40 h-40 border-2 border-blue-500 rounded-full animate-spin-slow"></div>
      <div className="absolute bottom-10 left-10 w-32 h-32 border-2 border-purple-500 rounded-full animate-spin-slow reverse"></div>
    </div>
    
    {/* Binary code background effect */}
    {/* <div className="absolute inset-0 opacity-5 text-xs font-mono text-green-400 overflow-hidden">
      {Array.from({ length: 50 }).map((_, i) => (
        <div 
          key={i}
          className="absolute animate-binary-flow"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${10 + Math.random() * 20}s`
          }}
        >
          {Math.random() > 0.5 ? '1010' : '0101'}
        </div>
      ))}
    </div> */}

    <div className="relative z-10">
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
        {/* Developer Avatar */}
        <div className="relative group/avatar">
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-30 group-hover/avatar:opacity-50 transition-opacity duration-500"></div>
          <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-4 border-gray-700 shadow-2xl transform group-hover/avatar:scale-105 transition-transform duration-500">
            {/* Placeholder for developer photo - you can replace this with an actual image */}
            <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <span className="text-4xl font-bold text-white">SC</span>
            </div>
            
            {/* Online status indicator */}
            <div className="absolute top-3 right-3 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse">
              <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></div>
            </div>
          </div>
          
          {/* Tech stack badges floating around avatar */}
          <div className="absolute -top-2 -left-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg transform rotate-12 group-hover/avatar:-translate-y-1 transition-transform duration-300">
            React
          </div>
          <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg transform -rotate-12 group-hover/avatar:translate-y-1 transition-transform duration-300">
            Node.js
          </div>
        </div>

        {/* Developer Info */}
        <div className="flex-1 text-center lg:text-left">
          <div className="mb-6">
            <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 rounded-full text-sm font-semibold border border-blue-500/30 mb-4">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              Lead Developer
            </span>
            
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Shivang <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Chaurasia</span>
            </h3>
            
            <p className="text-gray-300 text-lg leading-relaxed max-w-2xl">
              Full-stack developer passionate about creating innovative solutions. 
              I believe in writing clean, efficient code and building scalable applications 
              that make a difference.
            </p>
          </div>

          {/* Contact & Links */}
          <div className="flex flex-wrap gap-4 mb-6">
            <a
              href="mailto:shiva17ng@gmail.com"
              className="inline-flex items-center px-5 py-3 bg-gradient-to-r from-blue-600/20 to-blue-800/20 text-blue-300 rounded-xl font-medium hover:from-blue-600/30 hover:to-blue-800/30 transition-all duration-300 border border-blue-500/30 group/email"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              shiva17ng@gmail.com
              <svg className="w-4 h-4 ml-2 transform group-hover/email:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
            </a>
            
            <a
              href="https://github.com/shivang-chaurasia"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-5 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-gray-300 rounded-xl font-medium hover:from-gray-700 hover:to-gray-800 transition-all duration-300 border border-gray-700 hover:border-gray-600"
            >
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
            
            <a
              href="https://linkedin.com/in/shivang-chaurasia"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-5 py-3 bg-gradient-to-r from-blue-700 to-blue-800 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 border border-blue-600"
            >
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </a>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="text-lg font-semibold text-gray-300 mb-4">Tech Stack</h4>
            <div className="flex flex-wrap gap-3">
              {['React', 'Node.js', 'MongoDB', 'Express', 'Tailwind CSS', 'JavaScript', 'TypeScript', 'Python', 'AWS'].map((tech, index) => (
                <span 
                  key={index}
                  className="px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-900 text-gray-300 rounded-lg text-sm font-medium border border-gray-700 hover:border-blue-500/50 hover:text-blue-300 transition-all duration-300 hover:scale-105"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Developer Quote */}
      <div className="mt-10 pt-8 border-t border-gray-700/50">
        <div className="flex items-start">
          <svg className="w-8 h-8 text-blue-400/50 mr-4 mt-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
          </svg>
          <div>
            <p className="text-gray-300 italic text-lg">
              "Code is like humor. When you have to explain it, it's bad."
            </p>
            <p className="text-gray-500 text-sm mt-2">- Cory House</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

// Add these animations to your CSS


        {/* Footer Note */}
        <div className="text-center pt-12 border-t border-gray-200/50">
          <p className="text-gray-500 text-lg font-medium">
            AspireLens — <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent font-bold">Illuminating paths, empowering careers.</span>
          </p>
          <div className="mt-6 flex justify-center space-x-6">
            <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-transparent rounded-full"></div>
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent rounded-full"></div>
            <div className="w-20 h-1 bg-gradient-to-r from-transparent to-blue-400 rounded-full"></div>
          </div>
        </div>
      </div>
      
      {/* Add these animations to your global CSS or Tailwind config */}
      <style jsx>{`
            @keyframes spin-slow {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            @keyframes binary-flow {
              from { transform: translateY(-100px) rotate(0deg); opacity: 0; }
              10% { opacity: 1; }
              90% { opacity: 1; }
              to { transform: translateY(calc(100vh + 100px)) rotate(360deg); opacity: 0; }
            }
            .animate-spin-slow {
              animation: spin-slow 20s linear infinite;
            }
            .animate-spin-slow.reverse {
              animation-direction: reverse;
            }
            .animate-binary-flow {
              animation: binary-flow linear infinite;
            }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes widthGrow {
          from { width: 0; }
          to { width: 96px; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.8s ease-out forwards;
        }
        .animate-widthGrow {
          animation: widthGrow 1s ease-out 0.5s forwards;
          width: 0;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-spin-slow.reverse {
          animation-direction: reverse;
        }
      `}
      </style>
    </div>
  );
};

export default AboutUs;