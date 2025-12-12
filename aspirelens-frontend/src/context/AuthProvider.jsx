import { useEffect, useState } from "react";
import axios from "axios";
import AuthContext from "./AuthContext";



export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const logout = () => {
    localStorage.removeItem("token"); // remove JWT
    setUser(null); // immediately update state
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setUser(null);
          setLoadingUser(false);
          return;
        }

        const res = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data.user);
      } catch {
        setUser(null);
      }

      setLoadingUser(false);
    };

    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loadingUser, logout }}>
      {children}
    </AuthContext.Provider>

  );
}
