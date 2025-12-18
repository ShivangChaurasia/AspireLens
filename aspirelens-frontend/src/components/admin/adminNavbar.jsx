import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-800">AspireLens Admin</h1>
          <p className="text-sm text-gray-500 mt-1">Control Panel</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors duration-200"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default AdminNavbar;