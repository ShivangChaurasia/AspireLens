// src/context/AuthProvider.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import AuthContext from "./AuthContext"; // ✅ Import named export

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  
  // ✅ Add isAuthenticated state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false); // ✅ Update isAuthenticated too
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setUser(null);
          setIsAuthenticated(false);
          setLoadingUser(false);
          return;
        }

        const res = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data.user);
        setIsAuthenticated(true); // ✅ Set to true when user loads
      } catch {
        setUser(null);
        setIsAuthenticated(false); // ✅ Set to false on error
      }

      setLoadingUser(false);
    };

    loadUser();
  }, []);

  // ✅ Include isAuthenticated in context value
  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      loadingUser,
      logout,
      isAuthenticated // ✅ Add this
    }}>
      {children}
    </AuthContext.Provider>
  );
}