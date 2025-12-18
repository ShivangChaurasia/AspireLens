import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminSidebar = () => {
  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/users', label: 'Users', icon: '👥' },
    { path: '/admin/tests', label: 'Tests', icon: '📝' },
    { path: '/admin/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="font-bold">A</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Admin Portal</h2>
            <p className="text-xs text-gray-400 mt-1">Secure Area</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                <span className="text-lg mr-3">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="text-xs text-gray-400 p-3 bg-gray-800 rounded-lg">
          <p className="font-medium">Security Status</p>
          <div className="flex items-center mt-2">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <p>All systems secure</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;