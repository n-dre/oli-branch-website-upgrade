// src/pages/AdminDashboard.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as echarts from "echarts";
import {
  BarChart3,
  Users,
  DollarSign,
  TrendingUp,
  Settings,
  UserPlus,
  Search,
  Download,
  Bell,
  PieChart,
  Activity,
  Shield,
  Mail,
  Database,
  RefreshCw,
  LogOut,
  Menu,
  X,
  Save
} from "lucide-react";
import toast, { Toaster } from 'react-hot-toast';

// Extracted StatCard component outside main component for performance (fixes ESLint warning)
const StatCard = ({ title, value, icon: Icon, change, changeType, isLoading }) => (
  <div 
    className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow" 
    data-testid={`stat-card-${title.toLowerCase().replace(/\s+/g, '-')}`}
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`p-2 rounded-lg ${isLoading ? 'bg-gray-100' : 'bg-blue-50'}`}>
        <Icon className={`w-6 h-6 ${isLoading ? 'text-gray-400' : 'text-blue-600'}`} />
      </div>
      {change && !isLoading && (
        <span className={`text-sm font-medium px-2 py-1 rounded ${
          changeType === 'positive' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {changeType === 'positive' ? '↑' : '↓'} {change}
        </span>
      )}
    </div>
    <h3 className="text-3xl font-bold text-gray-900 mb-1">
      {isLoading ? '...' : value}
    </h3>
    <p className="text-gray-600 text-sm">{title}</p>
  </div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();

  // ----------------------------
  // State
  // ----------------------------
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [authToken, setAuthToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Metrics
  const [metrics, setMetrics] = useState({
    totals: { totalUsers: 0, activeUsers: 0, monthlyRevenue: 0, conversionRate: 0 },
    charts: {
      userGrowth: { labels: [], data: [] },
      revenue: { labels: [], data: [] },
      toolUsage: [],
      activity: { labels: [], data: [] },
    },
  });
  const [metricsLoading, setMetricsLoading] = useState(true);

  // Users
  const [users, setUsers] = useState([]);
  const [usersTotal, setUsersTotal] = useState(0);
  const [usersLoading, setUsersLoading] = useState(false);

  const [userQuery, setUserQuery] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  const [userStatusFilter, setUserStatusFilter] = useState("all");
  const [userPage, setUserPage] = useState(1);
  const [userLimit] = useState(10);

  // Modals
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    role: "user",
    status: "active",
    sendInviteEmail: true,
  });
  const [userFormSaving, setUserFormSaving] = useState(false);

  // Settings
  const [settings, setSettings] = useState({
    registrationMode: "open",
    defaultRole: "user",
    features: {
      financialTools: true,
      learningHub: true,
      bankLinking: false,
      reports: true,
    },
    security: {
      force2FAForAdmins: true,
      sessionMaxAgeMinutes: 1440,
      maxLoginAttempts: 10,
    },
    email: {
      provider: "sendgrid",
      fromName: "OliBranch Admin",
      fromEmail: "admin@olibranch.com",
    },
    audit: {
      retainDays: 90,
    },
  });
  const [settingsSaving, setSettingsSaving] = useState(false);

  // Notifications
  const [notifications] = useState([]);

  // Charts refs
  const userGrowthRef = useRef(null);
  const revenueRef = useRef(null);
  const toolUsageRef = useRef(null);
  const activityRef = useRef(null);

  // ----------------------------
  // Helper Functions
  // ----------------------------
  // Changed from import.meta.env to process.env for Create React App compatibility
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';
    const DEV_BYPASS = import.meta.env.DEV &&
    String(import.meta.env.VITE_DEV_BYPASS_AUTH) === 'true';

    const readLogin = () => {
    const raw = sessionStorage.getItem("oliBranchLogin") || localStorage.getItem("oliBranchLogin");
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  };

  const safeMoney = (n) => {
    const num = Number(n || 0);
    return num.toLocaleString(undefined, { style: "currency", currency: "USD" });
  };

  const apiFetch = async (path, options = {}) => {
    const headers = new Headers(options.headers || {});
    if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }
    if (authToken) {
      headers.set("Authorization", `Bearer ${authToken}`);
    }

    try {
      const res = await fetch(`${BACKEND_URL}${path}`, {
        ...options,
        headers,
        credentials: 'include'
      });

      if (res.status === 401) {
        clearSessionAndGoLogin();
        throw new Error("Session expired. Please login again.");
      }

      if (res.status === 403) {
        navigate("/dashboard");
        throw new Error("Access denied");
      }

      const text = await res.text();
      let data = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        throw new Error("Invalid server response");
      }

      if (!res.ok) {
        throw new Error(data?.message || `Request failed (${res.status})`);
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

  const clearSessionAndGoLogin = () => {
    sessionStorage.removeItem("oliBranchLogin");
    localStorage.removeItem("oliBranchLogin");
    navigate("/login", { replace: true });
  };

  // ----------------------------
  // Authentication
  // ----------------------------
  useEffect(() => {
    const verifyAuth = async () => {
      setIsLoading(true);
      
      if (DEV_BYPASS) {
        const fake = {
          token: "DEV_PREVIEW_TOKEN",
          user: { id: "dev-admin", name: "Admin User", role: "admin" },
        };
        sessionStorage.setItem("oliBranchLogin", JSON.stringify(fake));
        setAuthToken(fake.token);
        setAdminName(fake.user.name);
        setIsLoading(false);
        return;
      }

      const login = readLogin();
      if (!login?.token || !login?.user) {
        clearSessionAndGoLogin();
        return;
      }

      if (login.user.role !== "admin") {
        navigate("/dashboard", { replace: true });
        return;
      }

      setAuthToken(login.token);
      setAdminName(login.user.name || "Admin");
      setIsLoading(false);
    };

    verifyAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [DEV_BYPASS]);

  // ----------------------------
  // Data Loading
  // ----------------------------
  const loadMetrics = async () => {
    if (DEV_BYPASS) {
      // Mock data for development
      setTimeout(() => {
        setMetrics({
          totals: {
            totalUsers: 2450,
            activeUsers: 1980,
            monthlyRevenue: 125000,
            conversionRate: 4.2
          },
          charts: {
            userGrowth: {
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
              data: [120, 150, 180, 200, 240, 280, 320, 350, 380, 420, 460, 500]
            },
            revenue: {
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
              data: [12000, 15000, 18000, 21000, 24000, 27000, 30000, 32000, 35000, 38000, 42000, 45000]
            },
            toolUsage: [
              { name: 'Financial Tools', value: 35 },
              { name: 'Learning Hub', value: 25 },
              { name: 'Bank Linking', value: 20 },
              { name: 'Reports', value: 15 },
              { name: 'Analytics', value: 5 }
            ],
            activity: {
              labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
              data: [120, 200, 150, 180, 190, 170, 140]
            }
          }
        });
        setMetricsLoading(false);
      }, 500);
      return;
    }

    try {
      setMetricsLoading(true);
      const data = await apiFetch("/api/admin/metrics");
      setMetrics(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setMetricsLoading(false);
    }
  };

  const loadUsers = async () => {
    if (DEV_BYPASS) {
      // Mock users for development
      setTimeout(() => {
        const mockUsers = Array.from({ length: 50 }, (_, i) => ({
          id: `user_${i + 1}`,
          name: `User ${i + 1}`,
          email: `user${i + 1}@example.com`,
          role: i % 5 === 0 ? 'admin' : 'user',
          status: i % 10 === 0 ? 'suspended' : 'active',
          createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
          lastLoginAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        }));
        setUsers(mockUsers.slice((userPage - 1) * userLimit, userPage * userLimit));
        setUsersTotal(50);
        setUsersLoading(false);
      }, 300);
      return;
    }

    try {
      setUsersLoading(true);
      const params = new URLSearchParams({
        page: userPage,
        limit: userLimit,
        ...(userQuery && { search: userQuery }),
        ...(userRoleFilter !== 'all' && { role: userRoleFilter }),
        ...(userStatusFilter !== 'all' && { status: userStatusFilter }),
      });

      const data = await apiFetch(`/api/admin/users?${params}`);
      setUsers(data.items || []);
      setUsersTotal(data.total || 0);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUsersLoading(false);
    }
  };

  const loadSettings = async () => {
    if (DEV_BYPASS) return;

    try {
      const data = await apiFetch("/api/admin/settings");
      setSettings(data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (!authToken) return;

    if (activeSection === "overview" || activeSection === "analytics") {
      loadMetrics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authToken, activeSection]);

  useEffect(() => {
    if (!authToken) return;

    if (activeSection === "users") {
      loadUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authToken, activeSection, userQuery, userRoleFilter, userStatusFilter, userPage, userLimit]);

  useEffect(() => {
    if (!authToken) return;

    if (activeSection === "settings") {
      loadSettings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authToken, activeSection]);

  // ----------------------------
  // User Management Functions
  // ----------------------------
  const handleCreateUser = async () => {
    if (!userForm.name.trim() || !userForm.email.trim()) {
      toast.error("Name and email are required");
      return;
    }

    try {
      setUserFormSaving(true);
      await apiFetch("/api/admin/users", {
        method: "POST",
        body: JSON.stringify(userForm),
      });

      toast.success("User created successfully");
      setShowAddUser(false);
      setUserForm({
        name: "",
        email: "",
        role: "user",
        status: "active",
        sendInviteEmail: true,
      });
      loadUsers();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUserFormSaving(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!editUser?.id) return;

    try {
      setUserFormSaving(true);
      await apiFetch(`/api/admin/users/${editUser.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: userForm.name,
          email: userForm.email,
          role: userForm.role,
          status: userForm.status,
        }),
      });

      toast.success("User updated successfully");
      setShowEditUser(false);
      loadUsers();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUserFormSaving(false);
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      await apiFetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role: newRole }),
      });

      toast.success(`Role updated to ${newRole}`);
      loadUsers();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleUpdateUserStatus = async (userId, newStatus) => {
    try {
      await apiFetch(`/api/admin/users/${userId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });

      toast.success(`Status updated to ${newStatus}`);
      loadUsers();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleExportUsers = async () => {
    try {
      const response = await apiFetch("/api/admin/users/export");
      const blob = new Blob([JSON.stringify(response, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `users_export_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("Export started");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ----------------------------
  // Settings Functions
  // ----------------------------
  const handleSaveSettings = async () => {
    try {
      setSettingsSaving(true);
      await apiFetch("/api/admin/settings", {
        method: "PATCH",
        body: JSON.stringify(settings),
      });
      toast.success("Settings saved successfully");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSettingsSaving(false);
    }
  };

  const updateSetting = (path, value) => {
    setSettings(prev => {
      const newSettings = { ...prev };
      const keys = path.split('.');
      let current = newSettings;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newSettings;
    });
  };

  // ----------------------------
  // ECharts Configuration
  // ----------------------------
  useEffect(() => {
    const charts = [];

    const initChart = (ref, option) => {
      if (!ref.current) return;
      const chart = echarts.init(ref.current);
      chart.setOption(option, true);
      charts.push(chart);
    };

    if (activeSection === "overview") {
      initChart(userGrowthRef, {
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderWidth: 0,
          borderRadius: 6,
          textStyle: { color: '#1f2937' }
        },
        grid: { left: '3%', right: '4%', bottom: '3%', top: '10%', containLabel: true },
        xAxis: {
          type: 'category',
          data: metrics.charts.userGrowth.labels || [],
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { color: '#6b7280' }
        },
        yAxis: {
          type: 'value',
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { lineStyle: { color: '#f3f4f6' } },
          axisLabel: { color: '#6b7280' }
        },
        series: [{
          data: metrics.charts.userGrowth.data || [],
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 8,
          lineStyle: { width: 3, color: '#3b82f6' },
          itemStyle: { color: '#3b82f6' },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(59, 130, 246, 0.2)' },
              { offset: 1, color: 'rgba(59, 130, 246, 0.05)' }
            ])
          }
        }]
      });

      initChart(revenueRef, {
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderWidth: 0,
          borderRadius: 6
        },
        grid: { left: '3%', right: '4%', bottom: '3%', top: '10%', containLabel: true },
        xAxis: {
          type: 'category',
          data: metrics.charts.revenue.labels || [],
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { color: '#6b7280' }
        },
        yAxis: {
          type: 'value',
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { lineStyle: { color: '#f3f4f6' } },
          axisLabel: { color: '#6b7280', formatter: '${value}' }
        },
        series: [{
          data: metrics.charts.revenue.data || [],
          type: 'bar',
          barWidth: '60%',
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#10b981' },
              { offset: 1, color: '#34d399' }
            ]),
            borderRadius: [3, 3, 0, 0]
          }
        }]
      });
    }

    if (activeSection === "analytics") {
      initChart(toolUsageRef, {
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderWidth: 0,
          borderRadius: 6
        },
        legend: {
          orient: 'vertical',
          right: 10,
          top: 'center',
          textStyle: { color: '#6b7280' }
        },
        series: [{
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['35%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 8,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: { show: false },
          emphasis: {
            scale: true,
            scaleSize: 10
          },
          data: metrics.charts.toolUsage.map((item, index) => ({
            ...item,
            itemStyle: {
              color: ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'][index % 5]
            }
          }))
        }]
      });

      initChart(activityRef, {
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderWidth: 0,
          borderRadius: 6
        },
        grid: { left: '3%', right: '4%', bottom: '3%', top: '10%', containLabel: true },
        xAxis: {
          type: 'category',
          data: metrics.charts.activity.labels || [],
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { color: '#6b7280' }
        },
        yAxis: {
          type: 'value',
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { lineStyle: { color: '#f3f4f6' } },
          axisLabel: { color: '#6b7280' }
        },
        series: [{
          data: metrics.charts.activity.data || [],
          type: 'bar',
          barWidth: '60%',
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#8b5cf6' },
              { offset: 1, color: '#a78bfa' }
            ]),
            borderRadius: [6, 6, 0, 0]
          }
        }]
      });
    }

    const handleResize = () => {
      charts.forEach((chart) => chart.resize());
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      charts.forEach((chart) => chart.dispose());
    };
  }, [activeSection, metrics]);

  const handleLogout = () => {
    clearSessionAndGoLogin();
  };

  const totalPages = Math.max(1, Math.ceil(usersTotal / userLimit));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" data-testid="loading-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" data-testid="admin-dashboard">
      <Toaster position="top-right" />

      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4" data-testid="top-nav">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 hover:bg-gray-100 rounded-lg"
              data-testid="sidebar-toggle"
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Manage your platform operations</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button 
                className="p-2 hover:bg-gray-100 rounded-lg relative" 
                data-testid="notifications-btn" 
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900" data-testid="admin-name">{adminName}</p>
                <p className="text-xs text-gray-600">Administrator</p>
              </div>
              <div 
                className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold" 
                aria-label="Admin avatar"
              >
                {adminName.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside 
          className={`${sidebarCollapsed ? 'w-20' : 'w-64'} bg-white border-r border-gray-200 min-h-screen transition-all duration-300 fixed h-full`} 
          data-testid="sidebar"
        >
          <div className="p-6">
            {!sidebarCollapsed && (
              <h2 className="text-lg font-bold text-gray-900 mb-6">Navigation</h2>
            )}
            <nav className="space-y-1" role="navigation" aria-label="Main navigation">
              {[
                { key: "overview", label: "Overview", icon: BarChart3 },
                { key: "users", label: "User Management", icon: Users },
                { key: "analytics", label: "Analytics", icon: Activity },
                { key: "settings", label: "Settings", icon: Settings },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActiveSection(item.key)}
                  className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-lg transition-colors ${
                    activeSection === item.key
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  data-testid={`nav-${item.key}`}
                  aria-current={activeSection === item.key ? "page" : undefined}
                >
                  <item.icon className="w-5 h-5" />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </button>
              ))}

              <div className="pt-8">
                <button
                  onClick={handleLogout}
                  className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors`}
                  data-testid="logout-btn"
                >
                  <LogOut className="w-5 h-5" />
                  {!sidebarCollapsed && <span>Logout</span>}
                </button>
              </div>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main 
          className={`flex-1 p-6 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`} 
          data-testid="main-content"
        >
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {activeSection === "overview" && "Dashboard Overview"}
                  {activeSection === "users" && "User Management"}
                  {activeSection === "analytics" && "Analytics"}
                  {activeSection === "settings" && "Settings"}
                </h1>
                <p className="text-gray-600 mt-1">
                  {activeSection === "overview" && "Monitor key metrics and performance indicators"}
                  {activeSection === "users" && "Manage user accounts and permissions"}
                  {activeSection === "analytics" && "Detailed analytics and insights"}
                  {activeSection === "settings" && "Configure system settings"}
                </p>
              </div>

              <div className="flex items-center space-x-3">
                {activeSection === "users" && (
                  <button
                    onClick={handleExportUsers}
                    className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm hover:bg-gray-50"
                    data-testid="export-users-btn"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Overview Section */}
          {activeSection === "overview" && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" data-testid="stats-grid">
                <StatCard
                  title="Total Users"
                  value={metrics.totals.totalUsers.toLocaleString()}
                  icon={Users}
                  change="+12.5%"
                  changeType="positive"
                  isLoading={metricsLoading}
                />
                <StatCard
                  title="Active Users"
                  value={metrics.totals.activeUsers.toLocaleString()}
                  icon={TrendingUp}
                  change="+8.3%"
                  changeType="positive"
                  isLoading={metricsLoading}
                />
                <StatCard
                  title="Monthly Revenue"
                  value={safeMoney(metrics.totals.monthlyRevenue)}
                  icon={DollarSign}
                  change="+15.2%"
                  changeType="positive"
                  isLoading={metricsLoading}
                />
                <StatCard
                  title="Conversion Rate"
                  value={`${metrics.totals.conversionRate.toFixed(1)}%`}
                  icon={BarChart3}
                  change="-2.1%"
                  changeType="negative"
                  isLoading={metricsLoading}
                />
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8" data-testid="charts-grid">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">User Growth</h3>
                      <p className="text-sm text-gray-600">Monthly new user registrations</p>
                    </div>
                    <button
                      onClick={loadMetrics}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      data-testid="refresh-user-growth"
                    >
                      Refresh
                    </button>
                  </div>
                  <div ref={userGrowthRef} style={{ height: 300 }} data-testid="user-growth-chart" />
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
                      <p className="text-sm text-gray-600">Monthly revenue performance</p>
                    </div>
                    <button
                      onClick={loadMetrics}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      data-testid="refresh-revenue"
                    >
                      Refresh
                    </button>
                  </div>
                  <div ref={revenueRef} style={{ height: 300 }} data-testid="revenue-chart" />
                </div>
              </div>
            </>
          )}

          {/* Users Section */}
          {activeSection === "users" && (
            <div className="space-y-6" data-testid="users-section">
              {/* Header with Actions */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">User Management</h2>
                    <p className="text-gray-600 mt-1">Manage user accounts, roles, and permissions</p>
                  </div>
                  <button
                    onClick={() => setShowAddUser(true)}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    data-testid="add-user-btn"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Add User</span>
                  </button>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6" data-testid="user-filters">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={userQuery}
                      onChange={(e) => setUserQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      data-testid="user-search-input"
                      aria-label="Search users"
                    />
                  </div>

                  <select
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    data-testid="role-filter"
                    aria-label="Filter by role"
                  >
                    <option value="all">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>

                  <select
                    value={userStatusFilter}
                    onChange={(e) => setUserStatusFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    data-testid="status-filter"
                    aria-label="Filter by status"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                  </select>

                  <button
                    onClick={loadUsers}
                    disabled={usersLoading}
                    className="flex items-center justify-center space-x-2 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 disabled:opacity-50"
                    data-testid="refresh-users-btn"
                  >
                    <RefreshCw className={`w-4 h-4 ${usersLoading ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>
                </div>

                {/* Users Table */}
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200" data-testid="users-table">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {usersLoading ? (
                        <tr>
                          <td colSpan="5" className="px-6 py-8 text-center">
                            <div className="flex justify-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                          </td>
                        </tr>
                      ) : users.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                            No users found
                          </td>
                        </tr>
                      ) : (
                        users.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50" data-testid={`user-row-${user.id}`}>
                            <td className="px-6 py-4">
                              <div>
                                <div className="font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                user.role === 'admin' 
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                user.status === 'active'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {user.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Never'}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => {
                                    setEditUser(user);
                                    setUserForm({
                                      name: user.name,
                                      email: user.email,
                                      role: user.role,
                                      status: user.status,
                                      sendInviteEmail: false,
                                    });
                                    setShowEditUser(true);
                                  }}
                                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                  data-testid={`edit-user-${user.id}`}
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleUpdateUserRole(user.id, user.role === 'admin' ? 'user' : 'admin')}
                                  className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                                  data-testid={`toggle-role-${user.id}`}
                                >
                                  {user.role === 'admin' ? 'Make User' : 'Make Admin'}
                                </button>
                                <button
                                  onClick={() => handleUpdateUserStatus(user.id, user.status === 'active' ? 'suspended' : 'active')}
                                  className={`text-sm font-medium ${
                                    user.status === 'active' 
                                      ? 'text-red-600 hover:text-red-800' 
                                      : 'text-green-600 hover:text-green-800'
                                  }`}
                                  data-testid={`toggle-status-${user.id}`}
                                >
                                  {user.status === 'active' ? 'Suspend' : 'Activate'}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {users.length > 0 && (
                  <div className="flex items-center justify-between mt-6" data-testid="pagination">
                    <div className="text-sm text-gray-700">
                      Showing <span className="font-medium">{((userPage - 1) * userLimit) + 1}</span> to{" "}
                      <span className="font-medium">{Math.min(userPage * userLimit, usersTotal)}</span> of{" "}
                      <span className="font-medium">{usersTotal}</span> users
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setUserPage(p => Math.max(1, p - 1))}
                        disabled={userPage <= 1}
                        className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        data-testid="prev-page-btn"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setUserPage(p => Math.min(totalPages, p + 1))}
                        disabled={userPage >= totalPages}
                        className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        data-testid="next-page-btn"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Analytics Section */}
          {activeSection === "analytics" && (
            <div className="space-y-6" data-testid="analytics-section">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Tool Usage Distribution</h3>
                      <p className="text-sm text-gray-600">Feature adoption across platform</p>
                    </div>
                    <PieChart className="w-5 h-5 text-gray-400" />
                  </div>
                  <div ref={toolUsageRef} style={{ height: 400 }} data-testid="tool-usage-chart" />
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Weekly Activity</h3>
                      <p className="text-sm text-gray-600">User activity over the past week</p>
                    </div>
                    <Activity className="w-5 h-5 text-gray-400" />
                  </div>
                  <div ref={activityRef} style={{ height: 400 }} data-testid="activity-chart" />
                </div>
              </div>
            </div>
          )}

          {/* Settings Section */}
          {activeSection === "settings" && (
            <div className="space-y-6" data-testid="settings-section">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Registration Settings */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Registration Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-900" htmlFor="registration-mode">Registration Mode</label>
                      <select
                        id="registration-mode"
                        value={settings.registrationMode}
                        onChange={(e) => updateSetting('registrationMode', e.target.value)}
                        className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        data-testid="registration-mode-select"
                      >
                        <option value="open">Open Registration</option>
                        <option value="invite">Invite Only</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-900" htmlFor="default-role">Default User Role</label>
                      <select
                        id="default-role"
                        value={settings.defaultRole}
                        onChange={(e) => updateSetting('defaultRole', e.target.value)}
                        className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        data-testid="default-role-select"
                      >
                        <option value="user">User</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Security Settings */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center space-x-3 mb-6">
                    <Shield className="w-6 h-6 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-900" htmlFor="force-2fa">Force 2FA for Admins</label>
                        <p className="text-sm text-gray-500">Require two-factor authentication for admin accounts</p>
                      </div>
                      <input
                        id="force-2fa"
                        type="checkbox"
                        checked={settings.security.force2FAForAdmins}
                        onChange={(e) => updateSetting('security.force2FAForAdmins', e.target.checked)}
                        className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                        data-testid="force-2fa-checkbox"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-900" htmlFor="session-timeout">Session Timeout (minutes)</label>
                      <input
                        id="session-timeout"
                        type="number"
                        value={settings.security.sessionMaxAgeMinutes}
                        onChange={(e) => updateSetting('security.sessionMaxAgeMinutes', parseInt(e.target.value) || 0)}
                        className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        data-testid="session-timeout-input"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-900" htmlFor="max-login-attempts">Max Login Attempts</label>
                      <input
                        id="max-login-attempts"
                        type="number"
                        value={settings.security.maxLoginAttempts}
                        onChange={(e) => updateSetting('security.maxLoginAttempts', parseInt(e.target.value) || 0)}
                        className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        data-testid="max-login-attempts-input"
                      />
                    </div>
                  </div>
                </div>

                {/* Feature Flags */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Feature Flags</h3>
                  <div className="space-y-4">
                    {Object.entries(settings.features).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-900 capitalize" htmlFor={`feature-${key}`}>
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </label>
                          <p className="text-sm text-gray-500">
                            {key === 'financialTools' && 'Enable financial analysis tools'}
                            {key === 'learningHub' && 'Enable educational content'}
                            {key === 'bankLinking' && 'Enable bank account connections'}
                            {key === 'reports' && 'Enable detailed reporting'}
                          </p>
                        </div>
                        <input
                          id={`feature-${key}`}
                          type="checkbox"
                          checked={value}
                          onChange={(e) => updateSetting(`features.${key}`, e.target.checked)}
                          className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                          data-testid={`feature-${key}-checkbox`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Email Settings */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center space-x-3 mb-6">
                    <Mail className="w-6 h-6 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Email Settings</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-900" htmlFor="email-provider">Email Provider</label>
                      <select
                        id="email-provider"
                        value={settings.email.provider}
                        onChange={(e) => updateSetting('email.provider', e.target.value)}
                        className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        data-testid="email-provider-select"
                      >
                        <option value="sendgrid">SendGrid</option>
                        <option value="ses">Amazon SES</option>
                        <option value="mailgun">Mailgun</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-900" htmlFor="from-name">From Name</label>
                      <input
                        id="from-name"
                        type="text"
                        value={settings.email.fromName}
                        onChange={(e) => updateSetting('email.fromName', e.target.value)}
                        className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        data-testid="from-name-input"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-900" htmlFor="from-email">From Email</label>
                      <input
                        id="from-email"
                        type="email"
                        value={settings.email.fromEmail}
                        onChange={(e) => updateSetting('email.fromEmail', e.target.value)}
                        className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        data-testid="from-email-input"
                      />
                    </div>
                  </div>
                </div>

                {/* Data Retention */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center space-x-3 mb-6">
                    <Database className="w-6 h-6 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Data Retention</h3>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-900" htmlFor="retain-days">Audit Log Retention (days)</label>
                    <input
                      id="retain-days"
                      type="number"
                      value={settings.audit.retainDays}
                      onChange={(e) => updateSetting('audit.retainDays', parseInt(e.target.value) || 0)}
                      className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      data-testid="retain-days-input"
                    />
                    <p className="text-sm text-gray-500 mt-2">How long to keep audit logs before automatic deletion</p>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleSaveSettings}
                  disabled={settingsSaving}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                  data-testid="save-settings-btn"
                >
                  {settingsSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>Save All Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" 
          data-testid="add-user-modal" 
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="add-user-title"
        >
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-6">
              <h3 id="add-user-title" className="text-lg font-semibold text-gray-900 mb-4">Add New User</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-900" htmlFor="new-user-name">Full Name</label>
                  <input
                    id="new-user-name"
                    type="text"
                    value={userForm.name}
                    onChange={(e) => setUserForm(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="John Doe"
                    data-testid="new-user-name-input"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-900" htmlFor="new-user-email">Email Address</label>
                  <input
                    id="new-user-email"
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="john@example.com"
                    data-testid="new-user-email-input"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-900" htmlFor="new-user-role">Role</label>
                  <select
                    id="new-user-role"
                    value={userForm.role}
                    onChange={(e) => setUserForm(prev => ({ ...prev, role: e.target.value }))}
                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    data-testid="new-user-role-select"
                  >
                    <option value="user">User</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-900" htmlFor="new-user-status">Status</label>
                  <select
                    id="new-user-status"
                    value={userForm.status}
                    onChange={(e) => setUserForm(prev => ({ ...prev, status: e.target.value }))}
                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    data-testid="new-user-status-select"
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="sendInvite"
                    checked={userForm.sendInviteEmail}
                    onChange={(e) => setUserForm(prev => ({ ...prev, sendInviteEmail: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                    data-testid="send-invite-checkbox"
                  />
                  <label htmlFor="sendInvite" className="text-sm text-gray-900">Send invitation email</label>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddUser(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  data-testid="cancel-add-user-btn"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateUser}
                  disabled={userFormSaving || !userForm.name.trim() || !userForm.email.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  data-testid="submit-add-user-btn"
                >
                  {userFormSaving ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditUser && editUser && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" 
          data-testid="edit-user-modal" 
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="edit-user-title"
        >
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-6">
              <h3 id="edit-user-title" className="text-lg font-semibold text-gray-900 mb-4">Edit User</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-900" htmlFor="edit-user-name">Full Name</label>
                  <input
                    id="edit-user-name"
                    type="text"
                    value={userForm.name}
                    onChange={(e) => setUserForm(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    data-testid="edit-user-name-input"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-900" htmlFor="edit-user-email">Email Address</label>
                  <input
                    id="edit-user-email"
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    data-testid="edit-user-email-input"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-900" htmlFor="edit-user-role">Role</label>
                  <select
                    id="edit-user-role"
                    value={userForm.role}
                    onChange={(e) => setUserForm(prev => ({ ...prev, role: e.target.value }))}
                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    data-testid="edit-user-role-select"
                  >
                    <option value="user">User</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-900" htmlFor="edit-user-status">Status</label>
                  <select
                    id="edit-user-status"
                    value={userForm.status}
                    onChange={(e) => setUserForm(prev => ({ ...prev, status: e.target.value }))}
                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    data-testid="edit-user-status-select"
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowEditUser(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  data-testid="cancel-edit-user-btn"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateUser}
                  disabled={userFormSaving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  data-testid="submit-edit-user-btn"
                >
                  {userFormSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;


