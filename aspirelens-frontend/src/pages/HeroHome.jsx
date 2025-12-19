import { useContext } from "react";
import AuthContext from "../context/authContext";
import { Link } from "react-router-dom";

export default function HeroHome() {
  const { user } = useContext(AuthContext);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 md:px-20 py-20 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
      <div className="max-w-6xl mx-auto text-center">

        {/* Greeting badge */}
        <div className="inline-block mb-6">
          <span className="px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-full text-sm md:text-base shadow-lg">
            👋 Welcome back, {user?.firstName || "Explorer"}!
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-gray-900">
          <span className="block">Your Journey to a</span>
          <span className="block bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mt-2">
            Brighter Career Starts Here
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-10 leading-relaxed">
          You’ve unlocked AspireLens — your personalized hub for career clarity, growth,
          and structured self-improvement powered by AI insights.
          <br />
          <span className="italic text-gray-600 mt-2 block">
            Let's build your future, one smart step at a time.
          </span>
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          
          <Link to="/dashboard">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-lg rounded-xl hover:from-blue-700 hover:to-cyan-700 transform hover:-translate-y-1 transition-all duration-300 shadow-xl hover:shadow-2xl w-full sm:w-auto">
              Go to Dashboard
            </button>
          </Link>

          <Link to="/start-test">
            <button className="px-8 py-4 bg-white border border-blue-300 text-blue-700 font-semibold text-lg rounded-xl hover:bg-blue-50 transform hover:-translate-y-1 transition-all duration-300 shadow-md w-full sm:w-auto">
              Take Career Assessment
            </button>
          </Link>

        </div>

        {/* Feature Cards for Logged-In Users */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100">
            <div className="text-3xl text-blue-600 mb-3">📊</div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">AI Insights Dashboard</h3>
            <p className="text-gray-600">Track your goals, test results, strengths, and growth patterns in one place.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-cyan-100">
            <div className="text-3xl text-cyan-600 mb-3">🎯</div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">Personalized Roadmap</h3>
            <p className="text-gray-600">Get a step-by-step AI-generated plan aligned with your dream career.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-purple-100">
            <div className="text-3xl text-purple-600 mb-3">🚀</div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">Skill Progress Tracker</h3>
            <p className="text-gray-600">Stay consistent with habit tracking, goal streaks, and weekly progress logs.</p>
          </div>

        </div>

        {/* Inspirational Footer */}
        <div className="mt-20 pt-10 border-t border-gray-200">
          <p className="text-gray-500 text-sm md:text-base mb-6">
            “Every step you take today shapes the career you build tomorrow.”
          </p>
          <div className="text-blue-700 font-semibold opacity-70">
            Powered by AspireLens AI • Career Intelligence Engine ⚡
          </div>
        </div>

      </div>
    </section>
  );
}
