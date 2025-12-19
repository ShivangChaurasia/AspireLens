import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { Loader2, AlertCircle, Rocket, Clock, BookOpen, TrendingUp, Save, Lock, CheckCircle, X } from "lucide-react";

export default function StartTest() {
    // console.log("StartTest component mounted");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const navigate = useNavigate();

  const handleStartTest = async () => {
    try {
      setLoading(true);
      setError("");
  
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login again");
        return;
      }
  
      const response = await api.post(
        "/api/test/start",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      const data = response.data;
  
      if (!data?.success) {
        setError("Unable to start test");
        return;
      }
  
      const { testSessionId } = data;
  
      if (!testSessionId) {
        setError("Unable to start test");
        return;
      }
  
      navigate(`/test/${testSessionId}`);
  
    } catch (err) {
      console.error("Error starting test:", err);
  
      if (err.response) {
        if (err.response.status === 401) {
          setError("Your session has expired. Please login again.");
        } else {
          setError(err.response.data?.message || "Failed to start test");
        }
      } else {
        setError("Cannot connect to server.");
      }
    } finally {
      setLoading(false);
    }
  };


  const openConfirmModal = () => {
    setShowConfirmModal(true);
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
    setAgreedToTerms(false);
  };

  const handleConfirmStart = () => {
    if (!agreedToTerms || loading) return;
      closeConfirmModal();
      handleStartTest();

  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-50 flex items-center justify-center p-6">
        <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
          
          {/* Header */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              AspireLens Career Assessment
            </h1>
            
            <p className="text-gray-600 text-lg">
              Please read the following instructions carefully before starting your test
            </p>
          </div>

          {/* Test Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-100">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="h-8 w-8 text-blue-600" />
                <h3 className="font-bold text-gray-900">Test Structure</h3>
              </div>
              <p className="text-gray-700 text-sm">
                4–6 subjects based on your qualification and stream
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="h-8 w-8 text-purple-600" />
                <h3 className="font-bold text-gray-900">Question Types</h3>
              </div>
              <p className="text-gray-700 text-sm">
                MCQs and descriptive answers. Coding questions not included.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <h3 className="font-bold text-gray-900">Evaluation</h3>
              </div>
              <p className="text-gray-700 text-sm">
                AI-powered analysis with personalized career recommendations
              </p>
            </div>
          </div>

          {/* Detailed Instructions */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
              Test Instructions
            </h2>
            
            <div className="space-y-6">
              {/* Time Rules */}
              <div className="flex gap-4 p-4 bg-gradient-to-r from-blue-50/50 to-white rounded-xl">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">⏱️ Time Rules</h4>
                  <ul className="text-gray-700 space-y-1 text-sm">
                    <li>• Each question has 1 minute time limit</li>
                    <li>• Total duration = Number of questions × 1 minute</li>
                    <li>• Timer starts immediately when test begins</li>
                    <li>• Timer cannot be paused</li>
                    <li>• Test auto-submits when time expires</li>
                  </ul>
                </div>
              </div>

              {/* Test Structure */}
              <div className="flex gap-4 p-4 bg-gradient-to-r from-purple-50/50 to-white rounded-xl">
                <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">🧪 Test Structure</h4>
                  <ul className="text-gray-700 space-y-1 text-sm">
                    <li>• Multiple subjects based on your qualification and stream</li>
                    <li>• 4–6 subjects in total</li>
                    <li>• Each subject contains 10–15 questions</li>
                    <li>• Verbal Ability is mandatory for everyone</li>
                    <li>• Domain-specific subjects added based on your profile</li>
                  </ul>
                </div>
              </div>

              {/* Answer & Integrity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex gap-4 p-4 bg-gradient-to-r from-green-50/50 to-white rounded-xl">
                  <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Save className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">💾 Answer Saving</h4>
                    <ul className="text-gray-700 space-y-1 text-sm">
                      <li>• Answers are auto-saved</li>
                      <li>• Can change answers before submitting</li>
                      <li>• Unanswered questions marked as not attempted</li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-4 p-4 bg-gradient-to-r from-red-50/50 to-white rounded-xl">
                  <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                    <Lock className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">🔒 Test Integrity</h4>
                    <ul className="text-gray-700 space-y-1 text-sm">
                      <li>• Test cannot be resumed after submission</li>
                      <li>• Multiple attempts cannot run in parallel</li>
                      <li>• Do not refresh or close browser</li>
                      <li>• Misuse may result in auto-submission</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Evaluation & Outcomes */}
              <div className="flex gap-4 p-4 bg-gradient-to-r from-amber-50/50 to-white rounded-xl">
                <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">📊 Evaluation & Outcomes</h4>
                  <ul className="text-gray-700 space-y-1 text-sm">
                    <li>• MCQs evaluated instantly, descriptive answers by AI</li>
                    <li>• Receive section-wise and overall scores</li>
                    <li>• Priority-based career recommendations</li>
                    <li>• Personalized improvement plan</li>
                    <li>• Skill areas to focus on with learning roadmap</li>
                    <li>• Test level increases with more attempts</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="mb-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-gray-900 mb-2">⚠️ Important Notes</h4>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li>• Ensure a stable internet connection throughout the test</li>
                  <li>• Use a laptop or desktop computer for best experience</li>
                  <li>• Close unnecessary applications and browser tabs</li>
                  <li>• The test requires your full attention and focus</li>
                  <li>• Results will be available immediately after submission</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-700 font-medium">Error</p>
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Start Button */}
          <button
            onClick={openConfirmModal}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:transform-none"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Starting Assessment...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Rocket className="h-5 w-5" />
                Start Career Assessment
              </span>
            )}
          </button>

          {/* Footer Note */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-500 text-sm">
              By starting the assessment, you acknowledge that you have read and understood all instructions.
              Your responses will be used to provide personalized career guidance.
            </p>
          </div>
        </div>
      </div>

      {/* Pre-Test Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Confirm Test Start</h2>
              </div>
              <button
                onClick={closeConfirmModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <p className="text-gray-700">
                You are about to start your career assessment. Please confirm that:
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">You have read all instructions carefully</span>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">You have a stable internet connection</span>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">You won't refresh or close the browser during the test</span>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">You understand the test cannot be paused</span>
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="h-5 w-5 text-blue-600 rounded mt-0.5"
                />
                <label htmlFor="agreeTerms" className="text-sm text-gray-700 cursor-pointer">
                  I agree to all instructions and confirm that I am ready to begin the assessment. 
                  I understand that once started, the test cannot be paused or restarted.
                </label>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={closeConfirmModal}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmStart}
                disabled={!agreedToTerms || loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Starting...
                  </span>
                ) : (
                  "Start Now"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}