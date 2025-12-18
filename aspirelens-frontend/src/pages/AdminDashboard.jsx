import React from 'react';

const AdminDashboard = () => {
  const stats = [
    { title: 'Total Users', value: '1,847', change: '+12%', color: 'blue' },
    { title: 'Active Tests', value: '342', change: '+5%', color: 'green' },
    { title: 'Avg. Score', value: '78.5%', change: '+2.3%', color: 'purple' },
    { title: 'Completion Rate', value: '92%', change: '+8%', color: 'orange' },
  ];

  const recentActivities = [
    { user: 'John Doe', action: 'Completed Career Test', time: '10 min ago' },
    { user: 'Jane Smith', action: 'Updated Profile', time: '25 min ago' },
    { user: 'Bob Wilson', action: 'Started Aptitude Test', time: '1 hour ago' },
    { user: 'Alice Brown', action: 'Booked Counselling', time: '2 hours ago' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">Welcome back, Admin. Here's what's happening with AspireLens today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">{stat.value}</p>
              </div>
              <span className={`text-sm font-medium px-2 py-1 rounded-full bg-${stat.color}-100 text-${stat.color}-800`}>
                {stat.change}
              </span>
            </div>
            <div className="mt-4">
              <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                <div className={`h-full bg-${stat.color}-500`} style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Recent Activities</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="font-medium text-gray-600">{activity.user.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{activity.user}</p>
                        <p className="text-sm text-gray-600">{activity.action}</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Quick Actions</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors duration-200">
                  <div className="font-medium">Add New Test</div>
                  <div className="text-sm">Create a new assessment</div>
                </button>
                <button className="w-full text-left px-4 py-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors duration-200">
                  <div className="font-medium">View Reports</div>
                  <div className="text-sm">Generate system reports</div>
                </button>
                <button className="w-full text-left px-4 py-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors duration-200">
                  <div className="font-medium">Manage Users</div>
                  <div className="text-sm">User administration</div>
                </button>
                <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors duration-200">
                  <div className="font-medium">System Settings</div>
                  <div className="text-sm">Configure preferences</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;