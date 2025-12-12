import { useContext, useEffect, useState } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";

import { 
  TrendingUp, 
  Target, 
  BookOpen, 
  Clock, 
  Brain, 
  Rocket, 
  Sparkles, 
  BarChart3,
  ChevronRight,
  CheckCircle,
  Star,
  Award,
  Zap
} from "lucide-react";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    profileCompletion: 0,
    testsTaken: 0,
    weeklyProgress: 0,
    dailyStreak: 0,
    lastActive: null,
  });

  // Fetch stats from backend
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/dashboard/stats",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setStats({
        profileCompletion: res.data.profileCompletion || 0,
        testsTaken: res.data.testsTaken || 0,
        weeklyProgress: res.data.weeklyProgress || 0,
        dailyStreak: res.data.dailyStreak || 0,
        lastActive: res.data.lastActive || null,
      });

      setLoading(false);
    } catch (err) {
      console.log("Dashboard Load Error:", err.response?.data || err);
      setLoading(false);
    }
  };

  // Update lastActive on visit
  const updateActivity = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/user/update-activity",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.log("Activity Update Error:", err.message);
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchStats();
      await updateActivity();
  };

  init();
}, []);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
        Loading Dashboard...
      </div>
    );
  }

  const { profileCompletion, testsTaken, weeklyProgress, dailyStreak } = stats;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ---------------------- */}
        {/* 1. Welcome Section - Enhanced */}
        {/* ---------------------- */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 p-8 md:p-10 shadow-2xl">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <Sparkles className="h-4 w-4 text-white" />
              <span className="text-white text-sm font-medium">Welcome back</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">
              Hello, {user?.firstName || "Explorer"}! 👋
            </h1>
            <p className="text-blue-100 text-lg md:text-xl max-w-2xl">
              Your journey to smarter career decisions continues. Here's your Dashborad.
            </p>
            
            <div className="flex items-center gap-4 mt-8">
              <div className="flex items-center gap-2 text-white/90">
                <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
                <span className="text-sm">Last active: Today</span>
              </div>
              {/* <div className="h-4 w-px bg-white/30" />
              <div className="flex items-center gap-2 text-white/90">
                <Star className="h-4 w-4" />
                <span className="text-sm">Premium Member</span>
              </div> */}
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-cyan-300/10 rounded-full -translate-x-20 translate-y-20" />
        </section>

        {/* ---------------------- */}
        {/* 3. Stats Section - Enhanced */}
        {/* ---------------------- */}
        <section className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Your Progress Dashboard
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="group bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl border border-blue-100 hover:border-blue-200 transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-700">Profile Completion</h3>
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="mb-3">
                <div className="text-3xl font-bold text-gray-900">
                  {profileCompletion}%
                </div>
                <div className="text-sm text-gray-500 mt-1">Almost there!</div>
              </div>
              <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>
            </div>

            <div className="group bg-gradient-to-br from-purple-50 to-white p-6 rounded-2xl border border-purple-100 hover:border-purple-200 transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-700">Tests Taken</h3>
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="mb-3">
                <div className="text-3xl font-bold text-gray-900">
                  {testsTaken}
                </div>
                <div className="text-sm text-gray-500 mt-1">This month</div>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(Math.min(testsTaken, 5))].map((_, i) => (
                  <div 
                    key={i}
                    className="h-2 flex-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full group-hover:opacity-80 transition-opacity"
                  />
                ))}
              </div>
            </div>

            <div className="group bg-gradient-to-br from-green-50 to-white p-6 rounded-2xl border border-green-100 hover:border-green-200 transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-700">Weekly Progress</h3>
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="mb-3">
                <div className="text-3xl font-bold text-gray-900">
                  {weeklyProgress}%
                </div>
                <div className="text-sm text-gray-500 mt-1">+12% from last week</div>
              </div>
              <div className="flex items-center text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">Excellent pace!</span>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-amber-50 to-white p-6 rounded-2xl border border-amber-100 hover:border-amber-200 transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-700">Daily Streak</h3>
                <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Award className="h-5 w-5 text-amber-600" />
                </div>
              </div>
              <div className="mb-3">
                <div className="text-3xl font-bold text-gray-900">
                  {dailyStreak} days
                </div>
                <div className="text-sm text-gray-500 mt-1">Keep going! 🔥</div>
              </div>
              <div className="flex items-center">
                {[...Array(Math.min(dailyStreak, 7))].map((_, i) => (
                  <div 
                    key={i}
                    className="h-2 w-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 mx-0.5 group-hover:scale-125 transition-transform"
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------- */}
        {/* 4. Feature Cards - Enhanced */}
        {/* ---------------------- */}
        <section className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Explore AspireLens Features
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Career Assessment Card */}
            <div className="group bg-gradient-to-br from-white to-blue-50 p-8 rounded-3xl border border-blue-100 hover:shadow-2xl hover:shadow-blue-50 transition-all duration-500 hover:-translate-y-1">
              <div className="flex items-start justify-between mb-6">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Brain className="h-7 w-7 text-white" />
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  Most Popular
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Career Assessment
              </h3>
              <p className="text-gray-600 mb-6">
                Analyze your interests, strengths, and future career opportunities with AI-powered insights.
              </p>
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-cyan-700 transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg hover:shadow-xl">
                Start Assessment
              </button>
            </div>

            {/* Goal Suggestions Card */}
            <div className="group bg-gradient-to-br from-white to-amber-50 p-8 rounded-3xl border border-amber-100 hover:shadow-2xl hover:shadow-amber-50 transition-all duration-500 hover:-translate-y-1">
              <div className="flex items-start justify-between mb-6">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
                  <Target className="h-7 w-7 text-white" />
                </div>
                <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                  New
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Goal Suggestions
              </h3>
              <p className="text-gray-600 mb-6">
                Get AI-powered goals to accelerate your learning path and career growth.
              </p>
              <button className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-xl hover:from-amber-700 hover:to-orange-700 transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg hover:shadow-xl">
                Explore Goals
              </button>
            </div>
          </div>

          {/* AI Mentor Card */}
            <div className="group relative bg-gradient-to-br from-white to-gray-50 p-8 rounded-3xl border border-gray-200 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5" />
              <div className="relative">
                <div className="flex items-start justify-between mb-6">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center backdrop-blur-sm">
                    <Sparkles className="h-7 w-7 text-white" />
                  </div>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                    Coming Soon
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  AI Mentor
                </h3>
                <p className="text-gray-600 mb-6">
                  Your personalized guidance assistant for learning and growth. Available soon!
                </p>
                <button 
                  disabled
                  className="px-6 py-3 bg-gray-200 text-gray-500 font-semibold rounded-xl cursor-not-allowed"
                >
                  Coming Soon
                </button>
              </div>
            </div>

        </section>


        {/* ---------------------- */}
        {/* 5. Additional Info Bar */}
        {/* ---------------------- */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Clock className="h-6 w-6 text-blue-600" />
              <div>
                <h4 className="font-semibold text-gray-900">Need help getting started?</h4>
                <p className="text-gray-600 text-sm">Check our onboarding guide</p>
              </div>
            </div>
            <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl border border-blue-200 hover:bg-blue-50 transition-colors">
              View Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}