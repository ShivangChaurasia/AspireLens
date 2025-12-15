// src/pages/TestResult.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Award,
  BarChart,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  TrendingUp,
  Download,
  Home,
  Users,
  Target,
  AlertCircle,
  Loader2,
  BookOpen,
  Calendar,
  User
} from "lucide-react";

export default function TestResult() {
  const { testSessionId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [downloading, setDownloading] = useState(false);

  const getToken = () => localStorage.getItem("token");

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Fetch test result
  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true);
        setError("");

        const token = getToken();
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/api/test/result/${testSessionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            timeout: 10000
          }
        );

        if (response.data.success) {
          setResult(response.data);
        } else {
          setError(response.data.message || "Failed to load result");
        }

      } catch (err) {
        console.error("Error fetching test result:", err);
        
        if (err.response?.status === 401) {
          setError("Session expired. Please login again.");
          setTimeout(() => navigate("/login"), 2000);
        } else if (err.response?.status === 404) {
          setError("Test result not found.");
        } else if (err.response?.status === 400) {
          setError(err.response.data?.message || "Test not evaluated yet");
        } else if (err.code === 'ECONNABORTED' || !navigator.onLine) {
          setError("Network error. Please check your connection.");
        } else {
          setError("Failed to load test result. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (testSessionId) {
      fetchResult();
    }
  }, [testSessionId, navigate]);

  // Handle PDF download
  const handleDownloadPDF = async () => {
    try {
      setDownloading(true);
      
      const token = getToken();
      if (!token) return;

      const response = await axios.get(
        `http://localhost:5000/api/test/result/${testSessionId}/pdf`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'blob',
          timeout: 15000
        }
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `AspireLens_Result_${testSessionId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

    } catch (err) {
      console.error("Error downloading PDF:", err);
      alert("Failed to download PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">Loading Result</h2>
          <p className="text-gray-600 mt-2">Fetching your test evaluation...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center border border-gray-200">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Unable to Load Result</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-colors"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => navigate(`/test/submitted/${testSessionId}`)}
              className="w-full px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
            >
              View Submission
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Check if pending evaluation
  const isPending = result?.status === "pending_evaluation";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50/30 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 md:p-8 shadow-xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-white/20 rounded-xl flex items-center justify-center">
                  <Award className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">
                    {result?.testName || "Test Result"}
                  </h1>
                  <p className="text-blue-100 mt-1 text-lg">
                    {isPending ? "Evaluation in Progress" : "Detailed Performance Analysis"}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <div className={`px-4 py-2 rounded-xl font-medium backdrop-blur-sm ${
                  isPending 
                    ? 'bg-amber-500/20 text-amber-100' 
                    : 'bg-green-500/20 text-green-100'
                }`}>
                  {isPending ? "⏳ Pending Evaluation" : "✅ Evaluated"}
                </div>
                <div className="px-4 py-2 bg-white/20 rounded-xl text-white font-medium backdrop-blur-sm">
                  🎯 Level {result?.level || 1}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Evaluation Banner */}
        {isPending && (
          <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border-l-4 border-amber-500">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-amber-800">Evaluation in Progress</p>
                <p className="text-amber-700 text-sm mt-1">
                  Your test is currently being evaluated. This usually takes 2-5 minutes. 
                  Please check back shortly or refresh this page.
                </p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors text-sm font-medium"
              >
                Refresh
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Test Overview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Test Overview Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">Test Overview</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Candidate</p>
                      <p className="font-bold text-gray-900">{result?.userDetails?.name || "User"}</p>
                    </div>
                    <User className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="mt-3 text-sm text-gray-600">
                    <p>Class: {result?.userDetails?.classLevel || "N/A"}</p>
                    <p>Stream: {result?.userDetails?.stream || "N/A"}</p>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Submission Date</p>
                      <p className="font-bold text-gray-900">
                        {formatDate(result?.submittedAt).split(',')[0]}
                      </p>
                    </div>
                    <Calendar className="h-8 w-8 text-purple-600" />
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    {formatDate(result?.submittedAt).split(',').slice(1).join(',')}
                  </p>
                </div>
              </div>

              {/* Basic Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 bg-gray-50 rounded-xl text-center">
                  <p className="text-2xl font-bold text-gray-900">{result?.totalQuestions || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">Total Questions</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl text-center">
                  <p className="text-2xl font-bold text-green-700">{result?.attemptedQuestions || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">Attempted</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl text-center">
                  <p className="text-2xl font-bold text-amber-700">{result?.unattemptedQuestions || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">Unattempted</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl text-center">
                  <p className="text-2xl font-bold text-blue-700">{result?.level || 1}</p>
                  <p className="text-xs text-gray-500 mt-1">Test Level</p>
                </div>
              </div>
            </div>

            {/* Score Summary Card (Only if evaluated) */}
            {!isPending && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <BarChart className="h-6 w-6 text-green-600" />
                  <h2 className="text-xl font-bold text-gray-900">Score Summary</h2>
                </div>
                
                {/* Overall Score Circle */}
                <div className="flex flex-col items-center mb-8">
                  <div className="relative">
                    <div className="h-40 w-40 rounded-full border-8 border-gray-100 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-4xl font-bold text-gray-900">{result?.scorePercentage || 0}%</p>
                        <p className="text-gray-500 text-sm mt-1">Overall Score</p>
                      </div>
                    </div>
                    <div 
                      className="absolute top-0 left-0 h-40 w-40 rounded-full border-8 border-green-500 border-t-transparent border-r-transparent"
                      style={{ 
                        transform: 'rotate(45deg)',
                        clipPath: 'inset(0 0 0 50%)'
                      }}
                    ></div>
                  </div>
                  <p className="text-gray-600 mt-4 text-center max-w-md">
                    Accuracy: <span className="font-bold text-green-600">{result?.accuracyPercentage || 0}%</span> • 
                    Based on {result?.attemptedQuestions || 0} attempted questions
                  </p>
                </div>

                {/* Score Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-semibold text-gray-900">Correct</span>
                    </div>
                    <p className="text-3xl font-bold text-green-700">{result?.correctAnswers || 0}</p>
                    <div className="h-2 bg-green-100 rounded-full mt-2 overflow-hidden">
                      <div 
                        className="h-full bg-green-500"
                        style={{ 
                          width: `${((result?.correctAnswers || 0) / (result?.totalQuestions || 1)) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-red-50 to-rose-50 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <XCircle className="h-5 w-5 text-red-600" />
                      <span className="font-semibold text-gray-900">Wrong</span>
                    </div>
                    <p className="text-3xl font-bold text-red-700">{result?.wrongAnswers || 0}</p>
                    <div className="h-2 bg-red-100 rounded-full mt-2 overflow-hidden">
                      <div 
                        className="h-full bg-red-500"
                        style={{ 
                          width: `${((result?.wrongAnswers || 0) / (result?.totalQuestions || 1)) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="h-5 w-5 text-amber-600" />
                      <span className="font-semibold text-gray-900">Unattempted</span>
                    </div>
                    <p className="text-3xl font-bold text-amber-700">{result?.unattemptedQuestions || 0}</p>
                    <div className="h-2 bg-amber-100 rounded-full mt-2 overflow-hidden">
                      <div 
                        className="h-full bg-amber-500"
                        style={{ 
                          width: `${((result?.unattemptedQuestions || 0) / (result?.totalQuestions || 1)) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Section-wise Performance (Optional) */}
            {!isPending && result?.sectionWiseScore && Object.keys(result.sectionWiseScore).length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                  <h2 className="text-xl font-bold text-gray-900">Section-wise Performance</h2>
                </div>
                
                <div className="space-y-4">
                  {Object.entries(result.sectionWiseScore).map(([section, data]) => (
                    <div key={section} className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-900 capitalize">{section.replace('_', ' ')}</span>
                        <span className="font-bold text-blue-700">{data.percentage || 0}%</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Correct: {data.correct || 0}/{data.total || 0}</span>
                        <span>Score: {Math.round(data.percentage || 0)}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                          style={{ width: `${data.percentage || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Actions & Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">Result Status</h2>
              </div>
              
              <div className="space-y-4">
                <div className={`p-4 rounded-xl ${isPending ? 'bg-amber-50 border border-amber-200' : 'bg-green-50 border border-green-200'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${isPending ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
                      {isPending ? <Clock className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">
                        {isPending ? "Pending Evaluation" : "Evaluated"}
                      </p>
                      <p className="text-gray-600 text-sm mt-1">
                        {isPending 
                          ? "AI evaluation in progress"
                          : `Completed on ${formatDate(result?.evaluatedAt)}`
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Evaluation Info */}
                <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                  <p className="text-sm text-gray-700">
                    {isPending 
                      ? "⏳ Your test is being evaluated by our AI system. Results will appear here automatically."
                      : "✅ Evaluation complete. You can download your detailed result report."
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Actions Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <Target className="h-6 w-6 text-green-600" />
                <h2 className="text-xl font-bold text-gray-900">Actions</h2>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={handleDownloadPDF}
                  disabled={isPending || downloading}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {downloading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <Download className="h-5 w-5" />
                      Download Result (PDF)
                    </>
                  )}
                </button>

                <button
                  onClick={() => navigate("/dashboard")}
                  className="w-full px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  <Home className="h-5 w-5" />
                  Go to Dashboard
                </button>

                <button
                  onClick={() => navigate(`/counselling/${testSessionId}`)}
                  className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Users className="h-5 w-5" />
                  Career Counselling
                </button>

                <button
                  onClick={() => navigate(`/test/submitted/${testSessionId}`)}
                  className="w-full px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-colors flex items-center justify-center gap-2"
                >
                  <FileText className="h-5 w-5" />
                  View Submission
                </button>
              </div>
            </div>

            {/* Important Notes */}
            {/* <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-800 mb-2">Important Notes</p>
                  <ul className="text-amber-700 text-sm space-y-1">
                    <li>• This result is AI-evaluated</li>
                    <li>• Scores are based on attempted questions only</li>
                    <li>• Download PDF for official record</li>
                    <li>• For counselling, book a session with experts</li>
                    <li>• Results are valid for 6 months</li>
                  </ul>
                </div>
              </div>
            </div> */}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-500 text-sm">
            AspireLens Career Assessment • Result ID: {testSessionId?.substring(0, 24)}
          </p>
          <p className="text-gray-400 text-xs mt-2">
            {isPending 
              ? "Evaluation started on " + formatDate(result?.submittedAt)
              : "Evaluated on " + formatDate(result?.evaluatedAt)
            }
          </p>
        </div>
      </div>
    </div>
  );
}