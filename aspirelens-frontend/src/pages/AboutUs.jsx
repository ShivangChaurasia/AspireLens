// src/pages/AboutUs.jsx
import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
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
      `}</style>
    </div>
  );
};

export default AboutUs;