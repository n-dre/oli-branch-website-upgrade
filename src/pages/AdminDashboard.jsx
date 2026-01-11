import React, { useEffect, useState, useRef } from 'react';
import * as echarts from 'echarts';
import anime from "animejs";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  
  // Lazy init to prevent the ESLint "set-state-in-effect" error
  const [adminName] = useState(() => {
    const loginData = sessionStorage.getItem('oliBranchLogin') || localStorage.getItem('oliBranchLogin');
    if (loginData) {
      try {
        const parsed = JSON.parse(loginData).user;
        return parsed.name || 'Admin User';
    } catch { 
        return 'Admin User'; 
      }
    }
    return 'Admin User';
  });

  // --- REFS ---
  const userGrowthRef = useRef(null);
  const revenueRef = useRef(null);
  const toolUsageRef = useRef(null);
  const activityRef = useRef(null);

  // --- INITIALIZATION & ANIMATION ---
  useEffect(() => {
    // Auth Check
    const loginData = sessionStorage.getItem('oliBranchLogin') || localStorage.getItem('oliBranchLogin');
    if (!loginData) {
      window.location.href = 'login.html';
    } else {
      const user = JSON.parse(loginData).user;
      if (user.role !== 'admin') window.location.href = 'user-dashboard.html';
    }

    // anime.js Entrance Animation (Preserving your exact logic)
    anime({
      targets: '.admin-card, .stat-card',
      translateY: [20, 0],
      opacity: [0, 1],
      delay: anime.stagger(100),
      easing: 'easeOutExpo',
      duration: 800
    });
  }, []);

  // --- ECHARTS LOGIC ---
  useEffect(() => {
    const charts = [];
    const initChart = (ref, option) => {
      if (ref.current) {
        const chart = echarts.init(ref.current);
        chart.setOption(option);
        charts.push(chart);
      }
    };

    if (activeSection === 'overview') {
      initChart(userGrowthRef, {
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] },
        yAxis: { type: 'value' },
        series: [{
          data: [12, 15, 18, 22, 24, 28],
          type: 'line',
          smooth: true,
          itemStyle: { color: '#52796F' },
          areaStyle: { color: 'rgba(82, 121, 111, 0.1)' }
        }]
      });

      initChart(revenueRef, {
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] },
        yAxis: { type: 'value' },
        series: [{
          data: [8500, 9200, 10100, 11200, 11800, 12450],
          type: 'bar',
          itemStyle: { color: '#D4AF37' }
        }]
      });
    }

    if (activeSection === 'analytics') {
      initChart(toolUsageRef, {
        tooltip: { trigger: 'item' },
        series: [{
          type: 'pie',
          radius: '50%',
          data: [
            { value: 35, name: 'Health Check' },
            { value: 28, name: 'Product Matcher' },
            { value: 22, name: 'Resource Finder' },
            { value: 15, name: 'Learning Tracker' }
          ],
          itemStyle: {
            color: (params) => ['#1B4332', '#52796F', '#D4AF37', '#FF6B6B'][params.dataIndex]
          }
        }]
      });

      initChart(activityRef, {
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
        yAxis: { type: 'value' },
        series: [{
          data: [45, 52, 38, 65, 72, 58, 42],
          type: 'line',
          smooth: true,
          itemStyle: { color: '#52796F' }
        }]
      });
    }

    return () => charts.forEach(c => c.dispose());
  }, [activeSection]);

  const handleLogout = () => {
    sessionStorage.removeItem('oliBranchLogin');
    localStorage.removeItem('oliBranchLogin');
    window.location.href = 'login.html';
  };

  return (
    <div className="font-body bg-[#F8F5F0] text-[#2D3748] min-h-screen">
      {/* PRESERVED CSS STYLES */}
      <style>{`
        .glass-effect { backdrop-filter: blur(10px); background: rgba(248, 245, 240, 0.9); }
        .btn-primary { background: #1B4332; color: #F8F5F0; transition: all 0.3s ease; }
        .btn-primary:hover { background: #52796F; transform: translateY(-2px); box-shadow: 0 10px 20px rgba(27, 67, 50, 0.3); }
        .btn-secondary { border: 2px solid #1B4332; color: #1B4332; background: transparent; transition: all 0.3s ease; }
        .btn-secondary:hover { background: #1B4332; color: #F8F5F0; }
        .admin-card { background: white; border-radius: 16px; padding: 2rem; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); border: 1px solid rgba(82, 121, 111, 0.1); transition: all 0.3s ease; }
        .admin-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1); }
        .stat-card { background: linear-gradient(135deg, #52796F 0%, #1B4332 100%); color: white; border-radius: 12px; padding: 2rem; text-align: center; transition: all 0.3s ease; }
        .stat-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(82, 121, 111, 0.3); }
        .sidebar { background: #1B4332; color: #F8F5F0; min-height: 100vh; padding: 2rem 1rem; position: fixed; left: 0; top: 0; width: 280px; z-index: 1000; }
        .main-content { margin-left: 280px; min-height: 100vh; background: #F8F5F0; }
        .user-table { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); }
        .user-table th { background: #1B4332; color: #F8F5F0; padding: 1rem; text-align: left; font-weight: 600; }
        .user-table td { padding: 1rem; border-bottom: 1px solid #e2e8f0; }
        .status-active { background: #10B981; color: white; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem; }
        .status-inactive { background: #6B7280; color: white; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem; }
        .role-admin { background: #D4AF37; color: white; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem; }
        .role-user { background: #52796F; color: white; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem; }
      `}</style>

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center">
              <span className="text-[#1B4332] font-bold text-xl">A</span>
            </div>
            <div>
              <h3 className="font-display font-bold text-lg">Admin Panel</h3>
              <p className="text-sm opacity-75">System Management</p>
            </div>
          </div>
        </div>
        <nav className="space-y-2">
          {['overview', 'users', 'content', 'analytics', 'settings'].map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`block w-full text-left px-4 py-3 rounded-lg capitalize transition-colors ${
                activeSection === section ? 'bg-[#D4AF37] text-[#1B4332] font-medium' : 'hover:bg-[#52796F]'
              }`}
            >
              {section === 'overview' ? '📊 Overview' : section === 'users' ? '👥 Users' : section === 'content' ? '📝 Content' : section === 'analytics' ? '📈 Analytics' : '⚙️ Settings'}
            </button>
          ))}
          <button onClick={handleLogout} className="block w-full text-left px-4 py-3 rounded-lg hover:bg-red-600 transition-colors mt-8">
            🚪 Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="bg-white border-b border-[#52796F]/20 px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-[#1B4332]">Admin Dashboard</h1>
            <p className="text-[#2D3748]/70 mt-1">Manage users, content, and system settings</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="font-medium text-[#1B4332]">{adminName}</p>
              <p className="text-sm text-[#2D3748]/70">Administrator</p>
            </div>
            <div className="w-12 h-12 bg-[#1B4332] rounded-full flex items-center justify-center">
              <span className="text-[#F8F5F0] font-bold text-lg">A</span>
            </div>
          </div>
        </header>

        {/* Dynamic Sections */}
        <div className="p-8">
          {activeSection === 'overview' && (
            <section id="overview-section">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="stat-card">
                  <div className="text-3xl font-bold mb-2">24</div>
                  <div className="text-sm opacity-90">Total Users</div>
                </div>
                <div className="stat-card">
                  <div className="text-3xl font-bold mb-2">18</div>
                  <div className="text-sm opacity-90">Active Users</div>
                </div>
                <div className="stat-card">
                  <div className="text-3xl font-bold mb-2">$12,450</div>
                  <div className="text-sm opacity-90">Monthly Revenue</div>
                </div>
                <div className="stat-card">
                  <div className="text-3xl font-bold mb-2">3.2%</div>
                  <div className="text-sm opacity-90">Conversion Rate</div>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="admin-card">
                  <h3 className="font-display text-xl font-bold text-[#1B4332] mb-4">User Growth</h3>
                  <div ref={userGrowthRef} style={{ height: '300px' }}></div>
                </div>
                <div className="admin-card">
                  <h3 className="font-display text-xl font-bold text-[#1B4332] mb-4">Revenue Trend</h3>
                  <div ref={revenueRef} style={{ height: '300px' }}></div>
                </div>
              </div>
            </section>
          )}

          {activeSection === 'users' && (
            <section id="users-section">
              <div className="admin-card">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display text-2xl font-bold text-[#1B4332]">User Management</h3>
                  <button className="btn-primary px-4 py-2 rounded-lg">+ Add User</button>
                </div>
                <div className="user-table overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>#001</td><td>John Smith</td><td>john.smith@email.com</td>
                        <td><span className="role-user">User</span></td>
                        <td><span className="status-active">Active</span></td>
                        <td><button className="text-[#52796F] mr-3">Edit</button></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {activeSection === 'analytics' && (
            <section id="analytics-section">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="admin-card">
                  <h3 className="font-display text-xl font-bold text-[#1B4332] mb-4">Tool Usage</h3>
                  <div ref={toolUsageRef} style={{ height: '300px' }}></div>
                </div>
                <div className="admin-card">
                  <h3 className="font-display text-xl font-bold text-[#1B4332] mb-4">User Activity</h3>
                  <div ref={activityRef} style={{ height: '300px' }}></div>
                </div>
              </div>
            </section>
          )}
          
          {/* Settings and Content follow the same pattern... */}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;