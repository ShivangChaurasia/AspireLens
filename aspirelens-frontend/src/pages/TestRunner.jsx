import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Flag,
  Save,
  Loader2,
  Check,
  X,
  Timer,
  User,
  BookOpen,
  Calendar,
  Maximize2,
  Minimize2,
  EyeOff,
  Shield
} from "lucide-react";

export default function TestRunner() {
  const { testSessionId } = useParams();
  const navigate = useNavigate();
  
  // State management
  const [showWarningPopup, setShowWarningPopup] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [warningType, setWarningType] = useState("info");
  const [violationTimer, setViolationTimer] = useState(10);

  const tabSwitchCount = useRef(0);
  const fullscreenExitCount = useRef(0);
  const violationTimerRef = useRef(null);
  const isSubmittingRef = useRef(false);
  const lastAnswerSaveRef = useRef({});

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [testDetails, setTestDetails] = useState(null);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [unansweredQuestions, setUnansweredQuestions] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tabSwitchWarningActive, setTabSwitchWarningActive] = useState(false);

  // Get token helper
  const getToken = useCallback(() => {
    try {
      return localStorage.getItem("token");
    } catch (err) {
      console.error("Error reading token:", err);
      return null;
    }
  }, []);

  // Format time display
  const formatTime = useCallback((seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Show warning popup with type
  const showWarning = useCallback((message, type = "warning") => {
    setWarningMessage(message);
    setWarningType(type);
    setShowWarningPopup(true);
    
    // Auto-hide info warnings after 5 seconds
    if (type === "info") {
      setTimeout(() => {
        setShowWarningPopup(false);
      }, 5000);
    }
  }, []);

  // Auto-submit with proper flow control
  const autoSubmitTest = useCallback(async (reason) => {
    if (isSubmittingRef.current) {
      console.log("Auto-submit already in progress, skipping duplicate");
      return;
    }
    
    console.warn(`[AutoSubmit] Triggered: ${reason}`);
    isSubmittingRef.current = true;
    
    // Show critical warning
    showWarning(`⚠️ Test will be auto-submitted: ${reason}`, "critical");
    
    // Give user 3 seconds to see warning
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    try {
      const token = getToken();
      if (!token) {
        console.error("No token available for auto-submit");
        navigate("/login");
        return;
      }

      const response = await axios.post(
        `http://localhost:5000/api/test/submit/${testSessionId}`,
        { reason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          timeout: 10000
        }
      );

      console.log(`[AutoSubmit] Success: ${response.data.message}`);
      
      // Clean up localStorage
      localStorage.removeItem(`answers_${testSessionId}`);
      
      // Navigate to results page
      navigate(`/test/submitted/${testSessionId}`, {
        state: {
          autoSubmitted: true,
          reason: reason,
          submittedData: response.data,
          resultId: response.data?.resultId
        }
      });
      
    } catch (err) {
      console.error("[AutoSubmit] Failed:", err);
      
      if (err.response?.status === 400 && err.response.data?.alreadySubmitted) {
        // Test was already submitted, redirect anyway
        localStorage.removeItem(`answers_${testSessionId}`);
        navigate(`/test/submitted/${testSessionId}`);
      } else if (err.code === 'ECONNABORTED' || !navigator.onLine) {
        // Network error - store submission attempt locally
        localStorage.setItem(`pending_submit_${testSessionId}`, JSON.stringify({
          reason,
          timestamp: new Date().toISOString(),
          attempts: (JSON.parse(localStorage.getItem(`submit_attempts_${testSessionId}`) || '[]')).length + 1
        }));
        
        // Still navigate - backend will handle idempotency
        localStorage.removeItem(`answers_${testSessionId}`);
        navigate(`/test/submitted/${testSessionId}`, {
          state: { autoSubmitted: true, reason, networkError: true }
        });
      } else if (err.response?.status === 400) {
        // Other 400 errors - still navigate to results
        localStorage.removeItem(`answers_${testSessionId}`);
        navigate(`/test/submitted/${testSessionId}`, {
          state: { 
            autoSubmitted: true, 
            reason,
            serverError: err.response.data?.message 
          }
        });
      } else {
        // Any other error - still go to results page
        showWarning("Submission encountered an issue. Redirecting to results...", "critical");
        setTimeout(() => {
          localStorage.removeItem(`answers_${testSessionId}`);
          navigate(`/test/submitted/${testSessionId}`, {
            state: { 
              autoSubmitted: true, 
              reason,
              submissionError: true 
            }
          });
        }, 2000);
      }
    } finally {
      isSubmittingRef.current = false;
    }
  }, [testSessionId, navigate, getToken, showWarning]);

  // Fetch test session and questions - COMPLETE FIXED VERSION
  const fetchTestSession = useCallback(async () => {
    if (!testSessionId) {
      setError("Invalid test session ID");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const token = getToken();
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get(
        `http://localhost:5000/api/test/session/${testSessionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          timeout: 15000
        }
      );

      const { 
        questions: fetchedQuestions, 
        durationMinutes, 
        totalQuestions, 
        level, 
        createdAt, 
        testName, 
        status,
        submittedAt,
        testSession,
        message
      } = response.data;

      // Check if test is already submitted
      const isAlreadySubmitted = 
        status === 'submitted' || 
        submittedAt !== undefined ||
        (testSession && testSession.status === 'submitted') ||
        (message && message.toLowerCase().includes('submitted'));

      if (isAlreadySubmitted) {
        // Clean up localStorage
        localStorage.removeItem(`answers_${testSessionId}`);
        // Redirect to results page
        navigate(`/test/submitted/${testSessionId}`);
        return;
      }

      setTestDetails({
        testName: testName || "Career Assessment",
        level: level || 1,
        totalQuestions: totalQuestions || fetchedQuestions?.length || 0,
        durationMinutes: durationMinutes || 40,
        createdAt: createdAt || new Date().toISOString()
      });

      setQuestions(fetchedQuestions || []);
      
      // Initialize answers from localStorage if available
      const savedAnswers = localStorage.getItem(`answers_${testSessionId}`);
      if (savedAnswers) {
        try {
          setAnswers(JSON.parse(savedAnswers));
          console.log("Restored answers from localStorage");
        } catch (parseError) {
          console.error("Failed to parse saved answers:", parseError);
        }
      }
      
      setTimeLeft((durationMinutes || 40) * 60);

    } catch (err) {
      console.error("Error fetching test session:", err);

      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
        setTimeout(() => navigate("/login"), 2000);
      } else if (err.response?.status === 404) {
        setError("Test session not found.");
        navigate("/dashboard");
      } else if (err.response?.status === 400) {
        const errorMsg = err.response.data?.message || '';
        const alreadySubmitted = 
          err.response.data?.alreadySubmitted ||
          errorMsg.toLowerCase().includes("already submitted") ||
          errorMsg.toLowerCase().includes("test already submitted") ||
          errorMsg.toLowerCase().includes("already completed") ||
          errorMsg.toLowerCase().includes("submitted");
        
        if (alreadySubmitted) {
          localStorage.removeItem(`answers_${testSessionId}`);
          navigate(`/test/submitted/${testSessionId}`);
        } else {
          setError("Test session already submitted or expired.");
          navigate("/dashboard");
        }
      } else if (err.code === 'ECONNABORTED' || !navigator.onLine) {
        setError("Network error. Please check your connection.");
      } else {
        setError("Failed to load test. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [testSessionId, navigate, getToken]);

  // Enter fullscreen mode
  const enterFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      }
    } catch (err) {
      console.error("Fullscreen request failed:", err);
      showWarning("Fullscreen mode is recommended for best experience", "info");
    }
  }, [showWarning]);

  // Fullscreen detection
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNowFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isNowFullscreen);
      
      if (!isNowFullscreen) {
        fullscreenExitCount.current += 1;
        
        if (fullscreenExitCount.current === 1) {
          showWarning("⚠️ Please return to fullscreen mode. Next exit will auto-submit your test.", "warning");
          
          // Give 5 seconds to return
          setTimeout(() => {
            if (!document.fullscreenElement) {
              enterFullscreen();
            }
          }, 5000);
        } else if (fullscreenExitCount.current >= 2) {
          autoSubmitTest("Exited fullscreen multiple times");
        }
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    
    // Initial check
    setIsFullscreen(!!document.fullscreenElement);
    
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [autoSubmitTest, enterFullscreen, showWarning]);

  // Tab/window switching detection with timer
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        tabSwitchCount.current += 1;
        setTabSwitchWarningActive(true);
        
        // Start 10-second countdown
        let timeLeft = 10;
        setViolationTimer(timeLeft);
        
        violationTimerRef.current = setInterval(() => {
          timeLeft -= 1;
          setViolationTimer(timeLeft);
          
          if (timeLeft <= 0) {
            clearInterval(violationTimerRef.current);
            autoSubmitTest("Switched tab/window for more than 10 seconds");
          }
        }, 1000);
        
        showWarning(`⚠️ Tab switch detected. Return within ${timeLeft} seconds or test will be auto-submitted.`, "warning");
        
      } else {
        // User returned
        setTabSwitchWarningActive(false);
        
        if (violationTimerRef.current) {
          clearInterval(violationTimerRef.current);
          violationTimerRef.current = null;
        }
        
        if (tabSwitchCount.current > 0) {
          // Show brief confirmation
          showWarning("Returned to test", "info");
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (violationTimerRef.current) {
        clearInterval(violationTimerRef.current);
      }
    };
  }, [autoSubmitTest, showWarning]);

  // Before unload warning
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!submitting && !isSubmittingRef.current) {
        e.preventDefault();
        e.returnValue = "Are you sure you want to leave? Your test may be auto-submitted.";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [submitting]);

  // Initialize fullscreen on component mount
  useEffect(() => {
    enterFullscreen();
  }, [enterFullscreen]);

  // Save answers to localStorage for resilience
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      try {
        localStorage.setItem(`answers_${testSessionId}`, JSON.stringify(answers));
      } catch (storageError) {
        console.warn("Failed to save answers to localStorage:", storageError);
      }
    }
  }, [answers, testSessionId]);

  // Calculate unanswered questions
  useEffect(() => {
    const unanswered = questions
      .map((q, idx) => ({ index: idx, question: q }))
      .filter(({ question }) => !answers[question._id]);
    setUnansweredQuestions(unanswered);
  }, [questions, answers]);


  const saveAnswer = useCallback(async (questionId, answerData) => {
    // Skip if same answer was recently saved
    const lastSave = lastAnswerSaveRef.current[questionId];
    if (lastSave && lastSave.timestamp > Date.now() - 1000 && 
        JSON.stringify(lastSave.data) === JSON.stringify(answerData)) {
      return;
    }

    try {
      setSaving(true);

      const token = getToken();
      if (!token) return;

      const response = await axios.post(
        "http://localhost:5000/api/test/answer",
        {
          testSessionId,
          questionId,
          ...answerData,
          timestamp: new Date().toISOString()
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          timeout: 5000
        }
      );

      // FIX: Check response correctly
      if (response.data && (response.data.success || response.data.message || response.data.answerId)) {
        // Update last save record
        lastAnswerSaveRef.current[questionId] = {
          timestamp: Date.now(),
          data: answerData,
          savedAt: new Date().toISOString(),
          serverId: response.data.answerId || null,
          success: true
        };

        console.log(`✓ Answer saved for Q${questionId}`, response.data);
      } else {
        // Only warn if it's actually an error
        console.warn(`Unexpected response format for Q${questionId}:`, response.data);

        // Still update as successful if we got a 200 response
        lastAnswerSaveRef.current[questionId] = {
          timestamp: Date.now(),
          data: answerData,
          savedAt: new Date().toISOString(),
          serverAcknowledged: true
        };
      }

    } catch (err) {
      console.error("Error saving answer:", err);

      // Store failed save for retry
      const failedSaves = JSON.parse(localStorage.getItem('failed_saves') || '[]');
      failedSaves.push({
        testSessionId,
        questionId,
        answerData,
        timestamp: new Date().toISOString(),
        error: err.message,
        status: err.response?.status,
        retryCount: 0
      });

      // Keep only last 10 failed saves
      localStorage.setItem('failed_saves', JSON.stringify(failedSaves.slice(-10)));

      // Still update ref to prevent immediate retry
      lastAnswerSaveRef.current[questionId] = {
        timestamp: Date.now(),
        data: answerData,
        savedAt: new Date().toISOString(),
        saveFailed: true,
        error: err.message
      };
    } finally {
      setSaving(false);
    }
  }, [testSessionId, getToken]);


  // Handle MCQ answer selection
  const handleMCQAnswer = useCallback((questionId, selectedOption) => {
    const answerData = {
      answerType: "mcq",
      selectedOption,
      answeredAt: new Date().toISOString()
    };

    // Update local state immediately
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerData
    }));

    // Auto-save to backend
    saveAnswer(questionId, answerData);
  }, [saveAnswer]);

  // Handle short answer input with debounce
  const handleShortAnswer = useCallback((questionId, answerText) => {
    const answerData = {
      answerType: "short_answer",
      answerText,
      answeredAt: new Date().toISOString()
    };

    setAnswers(prev => ({
      ...prev,
      [questionId]: answerData
    }));

    // Debounced auto-save (1.5 seconds)
    const timeoutId = setTimeout(() => {
      saveAnswer(questionId, answerData);
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, [saveAnswer]);

  // Handle question navigation
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  // Handle manual test submission
  const handleSubmitTest = async () => {
    if (submitting || isSubmittingRef.current) {
      console.log("Submit already in progress");
      return;
    }

    try {
      setSubmitting(true);
      isSubmittingRef.current = true;
      setError("");

      const token = getToken();
      if (!token) {
        navigate("/login");
        return;
      }

      // Clear any pending auto-submit timers
      if (violationTimerRef.current) {
        clearInterval(violationTimerRef.current);
        violationTimerRef.current = null;
      }

      const response = await axios.post(
        `http://localhost:5000/api/test/submit/${testSessionId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          timeout: 10000
        }
      );

      console.log("Test submitted successfully:", response.data);
      
      // Clean up localStorage
      localStorage.removeItem(`answers_${testSessionId}`);
      
      // Navigate to results
      navigate(`/test/submitted/${testSessionId}`, {
        state: {
          submittedData: response.data, // Pass the response data
          resultId: response.data.resultId,
          attemptedQuestions: response.data.attemptedQuestions,
          totalQuestions: response.data.totalQuestions
        }
      });

    } catch (err) {
      console.error("Error submitting test:", err);
      
      if (err.response?.status === 400) {
        // Already submitted or invalid state
        if (err.response.data?.alreadySubmitted) {
          localStorage.removeItem(`answers_${testSessionId}`);
          navigate(`/test/submitted/${testSessionId}`);
          return;
        } else if (err.response.data?.message?.toLowerCase().includes("already submitted")) {
          localStorage.removeItem(`answers_${testSessionId}`);
          navigate(`/test/submitted/${testSessionId}`);
          return;
        }
        setError(err.response.data?.message || "Cannot submit test at this time");
      } else if (err.code === 'ECONNABORTED') {
        setError("Submission timeout. Please check your connection.");
      } else {
        setError("Failed to submit test. Please try again.");
      }
    } finally {
      setSubmitting(false);
      isSubmittingRef.current = false;
      setShowSubmitConfirm(false);
    }
  };

  // Show submit confirmation modal
  const showSubmitConfirmation = () => {
    if (timeLeft <= 0) {
      // Auto-submit if time is up
      autoSubmitTest("Time expired");
    } else {
      setShowSubmitConfirm(true);
    }
  };

  // Auto-submit when timer reaches 0
  useEffect(() => {
    if (timeLeft <= 0 && questions.length > 0 && !isSubmittingRef.current) {
      autoSubmitTest("Time expired");
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, questions.length, autoSubmitTest]);

  // Initial fetch
  useEffect(() => {
    fetchTestSession();
  }, [fetchTestSession]);

  // Calculate statistics
  const attemptedCount = useMemo(() => Object.keys(answers).length, [answers]);
  const currentQuestion = questions[currentIndex];
  const currentAnswer = currentQuestion ? answers[currentQuestion._id] : null;

  // Memoize time formatting
  const formattedTime = useMemo(() => formatTime(timeLeft), [timeLeft, formatTime]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">Loading Test...</h2>
          <p className="text-gray-500 mt-2">Preparing your assessment environment</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !questions.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Test</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => navigate("/dashboard")}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // No questions state
  if (!questions.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Questions Available</h2>
          <p className="text-gray-600 mb-6">The test questions could not be loaded.</p>
          <button 
            onClick={() => navigate("/dashboard")}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {testDetails?.testName || "Career Assessment"}
                </h1>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700">Level {testDetails?.level || 1}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <BookOpen className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700">{testDetails?.totalQuestions || questions.length} Questions</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700">
                      {testDetails?.durationMinutes || 40} minutes
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Security Indicators */}
                <div className="flex items-center gap-3">
                  {/* Fullscreen Indicator */}
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${isFullscreen ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {isFullscreen ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                    <span className="text-sm font-medium">{isFullscreen ? 'Fullscreen' : 'Windowed'}</span>
                  </div>
                  
                  {/* Tab Switch Counter */}
                  {tabSwitchCount.current > 0 && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg">
                      <EyeOff className="h-4 w-4" />
                      <span className="text-sm font-medium">Switches: {tabSwitchCount.current}</span>
                    </div>
                  )}
                  
                  {/* Integrity Shield */}
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg">
                    <Shield className="h-4 w-4" />
                    <span className="text-sm font-medium">Protected</span>
                  </div>
                </div>
                
                {/* Timer */}
                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold ${
                  timeLeft < 300 ? "bg-red-100 text-red-700 animate-pulse" : "bg-blue-100 text-blue-700"
                }`}>
                  <Timer className="h-5 w-5" />
                  <span className="text-lg">{formattedTime}</span>
                </div>
                
                {/* Auto-save indicator */}
                {saving && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </div>
                )}
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Question {currentIndex + 1} of {questions.length}</span>
                <span>{attemptedCount} of {questions.length} attempted</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Tab Switch Warning Banner */}
          {tabSwitchWarningActive && (
            <div className="mb-6 p-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5" />
                  <div>
                    <p className="font-bold">⚠️ RETURN TO TEST IMMEDIATELY</p>
                    <p className="text-sm opacity-90">Test will auto-submit in: <span className="font-bold text-white">{violationTimer} seconds</span></p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm">Tab switches: {tabSwitchCount.current}</p>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Question Navigation Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 sticky top-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Flag className="h-5 w-5 text-blue-600" />
                  Questions
                </h3>
                
                <div className="grid grid-cols-5 md:grid-cols-6 lg:grid-cols-4 gap-2 mb-6">
                  {questions.map((q, index) => {
                    const isAnswered = answers[q._id];
                    const isCurrent = index === currentIndex;
                    
                    return (
                      <button
                        key={q._id}
                        onClick={() => setCurrentIndex(index)}
                        className={`h-10 w-10 rounded-lg flex items-center justify-center font-medium transition-all relative ${
                          isCurrent
                            ? 'bg-blue-600 text-white shadow-md scale-105 ring-2 ring-blue-300'
                            : isAnswered
                            ? 'bg-green-100 text-green-700 border-2 border-green-300'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                        }`}
                      >
                        {index + 1}
                        {isAnswered && !isCurrent && (
                          <Check className="h-3 w-3 absolute -top-1 -right-1 text-green-600" />
                        )}
                      </button>
                    );
                  })}
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-700">Attempted</span>
                    <span className="font-bold text-green-600">{attemptedCount}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-700">Unattempted</span>
                    <span className="font-bold text-gray-600">{questions.length - attemptedCount}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-700">Time Left</span>
                    <span className={`font-bold ${timeLeft < 300 ? 'text-red-600' : 'text-blue-600'}`}>
                      {formattedTime}
                    </span>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="pt-4 border-t border-gray-200">
                    <button
                      onClick={enterFullscreen}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 rounded-xl hover:from-purple-100 hover:to-blue-100 transition-colors text-sm font-medium"
                    >
                      <Maximize2 className="h-4 w-4" />
                      Enter Fullscreen
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Question Area */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                {/* Question Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                      <span className="font-medium">{currentQuestion?.section || "General"}</span>
                      <span className="text-gray-400">•</span>
                      <span>{currentQuestion?.subject || "Subject"}</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Question {currentIndex + 1}</h2>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {currentAnswer && (
                      <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                        <CheckCircle className="h-4 w-4" />
                        Answered
                      </div>
                    )}
                    {saving && (
                      <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        <Save className="h-4 w-4 animate-pulse" />
                        Saving...
                      </div>
                    )}
                  </div>
                </div>

                {/* Question Text */}
                <div className="mb-8">
                  <p className="text-lg text-gray-800 leading-relaxed">
                    {currentQuestion?.questionText || "Loading question..."}
                  </p>
                </div>

                {/* Answer Options */}
                <div className="space-y-4">
                  {currentQuestion?.options ? (
                    // MCQ Options
                    <div className="space-y-3">
                      {currentQuestion.options.map((option, idx) => {
                        const optionLetter = String.fromCharCode(65 + idx);
                        const isSelected = currentAnswer?.selectedOption === optionLetter;
                        
                        return (
                          <button
                            key={idx}
                            onClick={() => handleMCQAnswer(currentQuestion._id, optionLetter)}
                            className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                              isSelected
                                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                                : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50/50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-medium ${
                                isSelected
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100 text-gray-700'
                              }`}>
                                {optionLetter}
                              </div>
                              <span className="text-gray-800">{option.text}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    // Short Answer Input
                    <div>
                      <textarea
                        value={currentAnswer?.answerText || ""}
                        onChange={(e) => handleShortAnswer(currentQuestion._id, e.target.value)}
                        onBlur={() => saveAnswer(currentQuestion._id, {
                          answerType: "short_answer",
                          answerText: currentAnswer?.answerText || "",
                          answeredAt: new Date().toISOString()
                        })}
                        placeholder="Type your answer here... (Auto-saves as you type)"
                        className="w-full h-48 p-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none resize-none transition-colors"
                      />
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-sm text-gray-500">
                          Your answer is auto-saved. Character count: {(currentAnswer?.answerText || "").length}
                        </p>
                        {saving && (
                          <div className="flex items-center gap-1 text-sm text-blue-600">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Saving...
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-10 pt-6 border-t border-gray-200">
                  <button
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-5 w-5" />
                    Previous
                  </button>
                  
                  <div className="flex items-center gap-4">
                    {saving && (
                      <div className="flex items-center gap-2 text-sm text-gray-500 animate-pulse">
                        <Save className="h-4 w-4" />
                        Auto-saving answer...
                      </div>
                    )}
                    
                    {currentIndex === questions.length - 1 ? (
                      <button
                        onClick={showSubmitConfirmation}
                        disabled={submitting || timeLeft <= 0}
                        className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-colors shadow-lg disabled:opacity-70 disabled:hover:from-green-600 disabled:hover:to-emerald-600"
                      >
                        {timeLeft <= 0 ? 'Time Up!' : 'Submit Test'}
                      </button>
                    ) : (
                      <button
                        onClick={handleNext}
                        className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-colors shadow-lg"
                      >
                        Next Question
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg animate-shake">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-700 font-medium">Error</p>
                      <p className="text-red-600 text-sm mt-1">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Warning for low time */}
              {timeLeft < 300 && timeLeft > 0 && (
                <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 rounded-r-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-amber-800 font-bold">⏰ Time Warning</p>
                      <p className="text-amber-700 text-sm mt-1">
                        Only <span className="font-bold">{formattedTime}</span> remaining. 
                        Complete your answers soon or test will auto-submit.
                      </p>
                      <div className="mt-2 h-2 bg-amber-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-1000"
                          style={{ width: `${(timeLeft / (300)) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Submit Test</h2>
                  <p className="text-gray-600 text-sm">Are you sure you want to submit?</p>
                </div>
              </div>
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={submitting}
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              {/* Test Summary */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2">Test Summary</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Questions:</span>
                    <span className="font-bold">{questions.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Attempted:</span>
                    <span className="font-bold text-green-600">{attemptedCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Unattempted:</span>
                    <span className="font-bold text-red-600">{questions.length - attemptedCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Time Left:</span>
                    <span className="font-bold">{formattedTime}</span>
                  </div>
                </div>
              </div>

              {/* Warning for unanswered questions */}
              {unansweredQuestions.length > 0 && (
                <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl animate-pulse">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-amber-800 mb-1">
                        ⚠️ {unansweredQuestions.length} unanswered question(s)
                      </p>
                      <p className="text-amber-700 text-sm">
                        Questions: {unansweredQuestions.map(q => q.index + 1).join(", ")}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Important Notes */}
              <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2">⚠️ Important</h4>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li className="flex items-start gap-2">
                    <X className="h-3 w-3 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>Once submitted, you cannot change your answers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Results will be available immediately</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>You will receive personalized career recommendations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-3 w-3 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>This action cannot be undone</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitTest}
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold rounded-xl hover:from-red-700 hover:to-orange-700 transition-colors disabled:opacity-50 shadow-lg"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  "Yes, Submit Test"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Central Warning Popup */}
      {showWarningPopup && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6 z-[9999]">
          <div className={`rounded-2xl p-6 max-w-md w-full shadow-2xl border-2 transform transition-all duration-300 ${
            warningType === 'critical' 
              ? 'bg-gradient-to-br from-red-50 to-orange-50 border-red-300 animate-pulse' 
              : warningType === 'warning'
              ? 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-300'
              : 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-300'
          }`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                warningType === 'critical' 
                  ? 'bg-red-100 text-red-600' 
                  : warningType === 'warning'
                  ? 'bg-amber-100 text-amber-600'
                  : 'bg-blue-100 text-blue-600'
              }`}>
                <AlertCircle className="h-5 w-5" />
              </div>
              <h3 className={`text-xl font-bold ${
                warningType === 'critical' ? 'text-red-800' : 
                warningType === 'warning' ? 'text-amber-800' : 
                'text-blue-800'
              }`}>
                {warningType === 'critical' ? '⚠️ Critical Warning' : 
                 warningType === 'warning' ? '⚠️ Warning' : 
                 'ℹ️ Information'}
              </h3>
            </div>
            
            <div className="mb-6">
              <p className={`text-lg ${
                warningType === 'critical' ? 'text-red-700' : 
                warningType === 'warning' ? 'text-amber-700' : 
                'text-blue-700'
              }`}>
                {warningMessage}
              </p>
              
              {tabSwitchWarningActive && violationTimerRef.current && (
                <div className="mt-4 p-3 bg-gradient-to-r from-red-100 to-orange-100 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-red-700 font-medium">Auto-submit timer:</span>
                    <span className="text-2xl font-bold text-red-700">{violationTimer}s</span>
                  </div>
                  <div className="mt-2 h-2 bg-red-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-1000"
                      style={{ width: `${(violationTimer / 10) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setShowWarningPopup(false);
                if (warningType === 'critical' && tabSwitchWarningActive) {
                  // User acknowledged critical warning, reset timer
                  if (violationTimerRef.current) {
                    clearInterval(violationTimerRef.current);
                    violationTimerRef.current = null;
                  }
                  setTabSwitchWarningActive(false);
                }
              }}
              className={`w-full py-3 font-semibold rounded-xl transition-colors ${
                warningType === 'critical' 
                  ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white hover:from-red-700 hover:to-orange-700' 
                  : warningType === 'warning'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white hover:from-amber-600 hover:to-yellow-600'
                  : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600'
              }`}
            >
              {warningType === 'critical' ? 'I Understand - Continue' : 
               warningType === 'warning' ? 'Acknowledge Warning' : 
               'Got It'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}