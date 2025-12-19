import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/authContext";
import { 
  User,
  Mail,
  Calendar,
  GraduationCap,
  BookOpen,
  Target,
  Edit3,
  CheckCircle,
  Shield,
  Upload,
  Camera,
  Sparkles,
  Loader2,
  Save,
  X,
  AlertCircle,
  LogIn
} from "lucide-react";
import api from "../api/api";

export default function MyProfile() {
  const {logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    age: "",
    educationLevel: "",
    educationStage: "",  // ADDED: Education stage field
    stream: "",
    interests: ""
  });
  const [formErrors, setFormErrors] = useState({});

  // Get token from localStorage
  const getToken = () => {
    return localStorage.getItem("token");
  };

  // Format dates
  const formatLastActive = (dateString) => {
    if (!dateString) return "Never";
    try {
      const now = new Date();
      const lastActive = new Date(dateString);
      const diffTime = Math.abs(now - lastActive);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays} days ago`;
      
      return lastActive.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    } catch{
      return "Unknown";
    }
  };

  const formatJoinedDate = (dateString) => {
    if (!dateString) return "Recently";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
      });
    } catch{
      return "Recently";
    }
  };

  const getUserInitials = () => {
    if (!profileData) return "U";
    const first = profileData.firstName?.charAt(0) || "";
    const last = profileData.lastName?.charAt(0) || "";
    return (first + last).toUpperCase() || "U";
  };

  // Safe display helper
  const displayValue = (value, fallback = "Not set") => {
    if (value === null || value === undefined || value === "") {
      return <span className="text-gray-400 italic">{fallback}</span>;
    }
    return value;
  };

  // Fetch profile
  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getToken();
      if (!token) {
        setError("Please login to view your profile");
        setLoading(false);
        return;
      }

      const res = await api.get("/api/user/me", {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = res.data;
      setProfileData(data);
      
      const completion = data.profile?.profileCompletion || 0;
      setProfileCompletion(completion);
      
      // Fill edit form - USE ONLY PROFILE FIELDS
      setEditForm({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        age: data.profile?.age ? String(data.profile.age) : "",
        educationLevel: data.profile?.educationLevel || "",
        educationStage: data.profile?.educationStage || "", // FIXED: Use profile.educationStage
        stream: data.profile?.stream || "", // FIXED: Use only profile.stream
        interests: data.profile?.interests?.join(", ") || "" // FIXED: Use only profile.interests
      });
      
    } catch (error) {
      console.error("Profile fetch error:", error);
      if (error.response?.status === 401) {
        setError("Session expired. Please login again.");
        logout();
      } else {
        setError("Failed to load profile. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  },[]);

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!editForm.firstName.trim()) errors.firstName = "First name is required";
    if (!editForm.lastName.trim()) errors.lastName = "Last name is required";
    if (editForm.age) {
      const ageNum = parseInt(editForm.age);
      if (isNaN(ageNum) || ageNum < 12 || ageNum > 100) {
        errors.age = "Age must be between 12 and 100";
      }
    }
    
    // Validate education level and stage
    if (!editForm.educationLevel) {
      errors.educationLevel = "Education level is required";
    } else if (editForm.educationLevel === "School" && !["11", "12"].includes(editForm.educationStage)) {
      errors.educationStage = "School students must select class 11 or 12";
    } else if (["Undergraduate", "Postgraduate"].includes(editForm.educationLevel) && !["1", "2", "3", "4"].includes(editForm.educationStage)) {
      errors.educationStage = "UG/PG students must select a valid year";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save profile
  const handleSaveProfile = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);
      setError(null);

      const token = getToken();
      if (!token) {
        setError("Please login to save changes");
        setSaving(false);
        return;
      }

      // Format interests array
      const formattedInterests = editForm.interests
        .split(",")
        .map(i => i.trim())
        .filter(i => i.length > 0);

      // Prepare update data - SEND ONLY PROFILE FIELDS
      const updateData = {
        firstName: editForm.firstName.trim(),
        lastName: editForm.lastName.trim(),
        profile: {
          age: editForm.age ? parseInt(editForm.age) : null,
          educationLevel: editForm.educationLevel.trim(),
          educationStage: editForm.educationStage.trim() || null,
          stream: editForm.stream.trim() || null,
          interests: formattedInterests
        }
      };

      const res = await api.post("/api/user/update-profile", updateData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Update state with response
      const updatedData = res.data;
      setProfileData(updatedData);
      setProfileCompletion(updatedData.profile?.profileCompletion || 0);

      // Update edit form with PROFILE DATA ONLY
      setEditForm({
        firstName: updatedData.firstName || "",
        lastName: updatedData.lastName || "",
        age: updatedData.profile?.age ? String(updatedData.profile.age) : "",
        educationLevel: updatedData.profile?.educationLevel || "",
        educationStage: updatedData.profile?.educationStage || "",
        stream: updatedData.profile?.stream || "",
        interests: updatedData.profile?.interests?.join(", ") || ""
      });

      setIsEditing(false);
      setFormErrors({});

      alert("✅ Profile updated successfully!");

    } catch (error) {
      console.error("Save error:", error);
      if (error.response?.status === 401) {
        setError("Session expired. Please login again.");
        logout();
      } else if (error.response?.status === 400) {
        setError(error.response.data.message || "Invalid data provided");
      } else {
        setError("Failed to save changes. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (profileData) {
      setEditForm({
        firstName: profileData.firstName || "",
        lastName: profileData.lastName || "",
        age: profileData.profile?.age ? String(profileData.profile.age) : "",
        educationLevel: profileData.profile?.educationLevel || "",
        educationStage: profileData.profile?.educationStage || "",
        stream: profileData.profile?.stream || "",
        interests: profileData.profile?.interests?.join(", ") || ""
      });
    }
    setIsEditing(false);
    setFormErrors({});
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  const handlePasswordChange = async () => {
    setPasswordError("");
    setPasswordSuccess("");

    if (!oldPassword || !newPassword) {
      return setPasswordError("Both fields required");
    }
    if (newPassword.length < 6) {
      return setPasswordError("New password must be at least 6 characters");
    }

    try {
      setChangingPassword(true);

      const token = getToken();
      if (!token) {
        setPasswordError("Not authenticated. Please login again.");
        return;
      }

      const res = await api.post(
        "/api/user/change-password",
        { oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          timeout: 10000
        }
      );

      // success
      setPasswordSuccess(res.data?.message || "Password changed.");
      setOldPassword("");
      setNewPassword("");
      setTimeout(() => setShowPasswordModal(false), 1200);

    } catch (err) {
      console.error("Change password error (frontend):", err);

      // Try to surface server message if present
      const serverMsg = err?.response?.data?.message;
      if (serverMsg) {
        setPasswordError(serverMsg);
      } else if (err.code === "ECONNABORTED") {
        setPasswordError("Request timed out. Try again.");
      } else if (err.response) {
        setPasswordError(`Server error: ${err.response.status}`);
      } else {
        setPasswordError("Something went wrong. Check console & server logs.");
      }
    } finally {
      setChangingPassword(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">Loading your profile...</h2>
          <p className="text-gray-500 mt-2">Please wait</p>
        </div>
      </div>
    );
  }

  // Error state - No token
  if (error && !getToken()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-3xl shadow-2xl border border-gray-100">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={handleLoginRedirect}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-colors"
          >
            <LogIn className="h-5 w-5" />
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Error state - Other errors
  if (error && !profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Profile</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={fetchProfile}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Get education stage options based on level
  const getEducationStageOptions = (level) => {
    switch(level) {
      case "School":
        return [
          { value: "", label: "Select Class" },
          { value: "11", label: "Class 11" },
          { value: "12", label: "Class 12" }
        ];
      case "Undergraduate":
      case "Postgraduate":
        return [
          { value: "", label: "Select Year" },
          { value: "1", label: "Year 1" },
          { value: "2", label: "Year 2" },
          { value: "3", label: "Year 3" },
          { value: "4", label: "Year 4" }
        ];
      default:
        return [{ value: "", label: "Not applicable" }];
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 p-4 md:p-8">
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Change Password</h2>
      
              {passwordError && (
                <p className="text-red-500 text-sm mb-2">{passwordError}</p>
              )}
              {passwordSuccess && (
                <p className="text-green-600 text-sm mb-2">{passwordSuccess}</p>
              )}
      
              <input
                type="password"
                placeholder="Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full mb-3 px-3 py-2 border rounded-lg"
              />
      
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full mb-4 px-3 py-2 border rounded-lg"
              />
      
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg"
                >
                  Cancel
                </button>
      
                <button
                  onClick={handlePasswordChange}
                  disabled={changingPassword}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  {changingPassword ? "Saving..." : "Change Password"}
                </button>
              </div>
            </div>
          </div>
        )}
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* --------------------------- */}
        {/* 1. Profile Header */}
        {/* --------------------------- */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 p-8 md:p-10 shadow-2xl">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8 relative z-10">
            
            {/* Avatar */}
            <div className="relative group">
              <div className="h-32 w-32 rounded-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center shadow-2xl">
                <div className="text-4xl font-bold text-white">
                  {getUserInitials()}
                </div>
              </div>
              
              <button 
                onClick={() => setIsEditing(true)}
                className="absolute bottom-2 right-2 h-10 w-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
              >
                <Camera className="h-5 w-5 text-white" />
              </button>
            </div>

            {/* Profile info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  {profileData?.firstName} {profileData?.lastName}
                </h1>
                {profileData?.role === "premium" && (
                  <div className="flex items-center gap-1 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                    <Sparkles className="h-3 w-3 text-white" />
                    <span className="text-white text-sm font-medium">Premium</span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-white/90 mb-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  <span>{profileData?.email}</span>
                </div>
                <div className="hidden md:block h-4 w-px bg-white/30" />
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>Joined {formatJoinedDate(profileData?.profile?.joinedAt)}</span>
                </div>
              </div>

              {/* Last Active */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/15 backdrop-blur-sm rounded-full">
                <span className="text-white text-sm">
                  Last active: {formatLastActive(profileData?.profile?.lastActive)}
                </span>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-cyan-300/10 rounded-full -translate-x-20 translate-y-20" />
        </section>

        {/* --------------------------- */}
        {/* 2. Profile Details Section */}
        {/* --------------------------- */}
        <section className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Personal Details</h2>
                <p className="text-gray-500">Your basic information and preferences</p>
              </div>
            </div>
            
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-600 font-semibold rounded-xl border border-blue-200 hover:bg-blue-100 transition-colors"
              >
                <Edit3 className="h-4 w-4" />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button 
                  onClick={handleCancelEdit}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl border border-gray-300 hover:bg-gray-200 transition-colors"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
                <button 
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-600 transition-colors disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Info */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <User className="h-5 w-5 text-blue-500" />
                Personal Information
              </h3>
              
              <div className="space-y-4">
                {/* First Name */}
                <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-200">
                  <label className="text-sm font-medium text-gray-500 mb-1 block">First Name *</label>
                  {isEditing ? (
                    <div>
                      <input 
                        type="text" 
                        value={editForm.firstName}
                        onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                        className={`w-full px-3 py-2 bg-white border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          formErrors.firstName ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter first name"
                      />
                      {formErrors.firstName && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.firstName}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-lg font-medium text-gray-900">
                      {displayValue(profileData?.firstName)}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-200">
                  <label className="text-sm font-medium text-gray-500 mb-1 block">Last Name *</label>
                  {isEditing ? (
                    <div>
                      <input 
                        type="text" 
                        value={editForm.lastName}
                        onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                        className={`w-full px-3 py-2 bg-white border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          formErrors.lastName ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter last name"
                      />
                      {formErrors.lastName && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.lastName}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-lg font-medium text-gray-900">
                      {displayValue(profileData?.lastName)}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-200">
                  <label className="text-sm font-medium text-gray-500 mb-1 block">Email Address</label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <p className="text-lg font-medium text-gray-900">
                      {profileData?.email}
                    </p>
                  </div>
                </div>

                {/* Age */}
                <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-200">
                  <label className="text-sm font-medium text-gray-500 mb-1 block">Age</label>
                  {isEditing ? (
                    <div>
                      <input 
                        type="number" 
                        value={editForm.age}
                        onChange={(e) => setEditForm({...editForm, age: e.target.value})}
                        className={`w-full px-3 py-2 bg-white border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          formErrors.age ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter age (optional)"
                        min="12"
                        max="100"
                      />
                      {formErrors.age && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.age}</p>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <p className="text-lg font-medium text-gray-900">
                        {profileData?.profile?.age ? `${profileData.profile.age} years` : "Not set"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Academic Info */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-purple-500" />
                Academic Information
              </h3>
              
              <div className="space-y-4">
                {/* Education Level - FIXED VALUES */}
                <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-200">
                  <label className="text-sm font-medium text-gray-500 mb-1 block">Education Level *</label>
                  {isEditing ? (
                    <div>
                      <select 
                        value={editForm.educationLevel}
                        onChange={(e) => setEditForm({...editForm, educationLevel: e.target.value, educationStage: ""})}
                        className={`w-full px-3 py-2 bg-white border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          formErrors.educationLevel ? 'border-red-300' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select education level</option>
                        <option value="School">School</option>
                        <option value="Undergraduate">Undergraduate</option>
                        <option value="Postgraduate">Postgraduate</option>
                        <option value="Professional">Professional</option>
                      </select>
                      {formErrors.educationLevel && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.educationLevel}</p>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-gray-400" />
                      <p className="text-lg font-medium text-gray-900">
                        {displayValue(profileData?.profile?.educationLevel)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Education Stage - DYNAMIC BASED ON LEVEL */}
                <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-200">
                  <label className="text-sm font-medium text-gray-500 mb-1 block">
                    {editForm.educationLevel === "School" ? "Class" : 
                     ["Undergraduate", "Postgraduate"].includes(editForm.educationLevel) ? "Year" : 
                     "Stage"}
                  </label>
                  {isEditing ? (
                    <div>
                      <select
                        value={editForm.educationStage || ""}
                        onChange={(e) => setEditForm({ ...editForm, educationStage: e.target.value })}
                        className={`w-full px-3 py-2 bg-white border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          formErrors.educationStage ? 'border-red-300' : 'border-gray-300'
                        }`}
                        disabled={editForm.educationLevel === "Professional" || !editForm.educationLevel}
                      >
                        {getEducationStageOptions(editForm.educationLevel).map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {formErrors.educationStage && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.educationStage}</p>
                      )}
                      {editForm.educationLevel === "Professional" && (
                        <p className="text-gray-500 text-sm mt-1">Not applicable for professionals</p>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-gray-400" />
                      <p className="text-lg font-medium text-gray-900">
                        {profileData?.profile?.educationLevel === "Professional" 
                          ? "Not applicable" 
                          : displayValue(profileData?.profile?.educationStage)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Stream */}
                <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-200">
                  <label className="text-sm font-medium text-gray-500 mb-1 block">Stream/Field</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={editForm.stream}
                      onChange={(e) => setEditForm({...editForm, stream: e.target.value})}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Computer Science"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-gray-400" />
                      <p className="text-lg font-medium text-gray-900">
                        {displayValue(profileData?.profile?.stream)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Interests - FIXED: Use only profile.interests */}
                <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-200">
                  <label className="text-sm font-medium text-gray-500 mb-1 block">Interests & Skills</label>
                  {isEditing ? (
                    <textarea 
                      value={editForm.interests}
                      onChange={(e) => setEditForm({...editForm, interests: e.target.value})}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24"
                      placeholder="AI/ML, Web Development, Data Science"
                    />
                  ) : (
                    <div className="mt-2">
                      {profileData?.profile?.interests?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {profileData.profile.interests.map((interest, index) => (
                            <span 
                              key={index}
                              className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-200"
                            >
                              {interest}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">No interests added yet</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Security */}
                <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-200">
                  <label className="text-sm font-medium text-gray-500 mb-1 block">Account Security</label>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-green-500" />
                      <span className="text-gray-900">Password protected</span>
                    </div>
                    <button
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      onClick={() => setShowPasswordModal(true)}
                    >
                      Change Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --------------------------- */}
        {/* 3. Profile Completion Card */}
        {/* --------------------------- */}
        <div className="">
          <section className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-green-100 to-emerald-100 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Profile Completion</h2>
                <p className="text-gray-500">Complete your profile for better recommendations</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Progress bar */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-2xl font-bold text-gray-900">{profileCompletion}%</span>
                </div>
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${profileCompletion}%` }}
                  />
                </div>
              </div>

              {/* Checklist */}
              <div className="space-y-3">
                {[
                  { label: "Basic Information", completed: !!profileData?.firstName && !!profileData?.lastName },
                  { label: "Academic Details", completed: !!(profileData?.profile?.stream) },
                  { label: "Age Set", completed: !!profileData?.profile?.age },
                  { label: "Education Level", completed: !!profileData?.profile?.educationLevel },
                  { label: "Education Stage", completed: profileData?.profile?.educationLevel === "Professional" ? true : !!profileData?.profile?.educationStage },
                  { label: "Interests Added", completed: !!(profileData?.profile?.interests?.length) }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center ${
                        item.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {item.completed ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <div className="h-2 w-2 rounded-full bg-current" />
                        )}
                      </div>
                      <span className={`font-medium ${item.completed ? 'text-gray-900' : 'text-gray-600'}`}>
                        {item.label}
                      </span>
                    </div>
                    {!item.completed && (
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Add
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <button 
                onClick={() => setIsEditing(true)}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3.5 rounded-xl font-semibold text-lg hover:from-green-700 hover:to-emerald-700 transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <Target className="h-5 w-5" />
                Complete My Profile
              </button>
            </div>
          </section>
        </div>

        {/* --------------------------- */}
        {/* 4. Footer Actions */}
        {/* --------------------------- */}
        <div className="border-2 rounded-lg flex space-x-4 p-4 border-red-500">
          <X></X>
          <div>
            <h4 className="font-bold text-red-500">Want to Delete Account?</h4>
            <p className="text-gray-600 text-sm">Contact <a className="underline text-blue-500">careerwith.aspirelens@gmail.com</a></p>
          </div>
        </div>
          {/* <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center">
                  <Upload className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Export Your Data</h4>
                    <p className="text-gray-600 text-sm">Download your profile data and activity history</p>
                  </div>
              </div>
              <div className="flex gap-3">
                <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl border border-blue-200 hover:bg-blue-50 transition-colors">
                  Download Report
                </button>
                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-cyan-700 transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg hover:shadow-xl">
                  Share Profile
                </button>
              </div>
            </div>
          </div> */}
      </div>
    </div>
  );
}