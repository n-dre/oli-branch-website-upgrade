import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import {
  DollarSign,
  FileText,
  Sparkles,
  Shield,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Download,
  BarChart3,
  PlusCircle,
  Search,
  ChevronRight,
  Zap,
  Clock,
  PieChart as PieChartIcon,
  User,
  Award
} from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { useData } from '../../context/DataContext';
import toast, { Toaster } from 'react-hot-toast';

const RISK_COLORS = {
  'High Risk': '#1B4332',
  'Medium Risk': '#52796F',
  'Low Risk': '#D4AF37'
};

const QUICK_ACTIONS = [
  {
    title: 'Financial Health Check',
    description: 'Get your business health score',
    icon: Shield,
    color: 'bg-[#1B4332]',
    link: '/health',
    badge: 'Recommended'
  },
  {
    title: 'Find Banking Products',
    description: 'Compare loans & accounts',
    icon: DollarSign,
    color: 'bg-[#52796F]',
    link: '/tools',
    badge: 'New'
  },
  {
    title: 'Generate Reports',
    description: 'Create detailed PDF reports',
    icon: FileText,
    color: 'bg-[#1B4332]',
    link: '/report',
    badge: 'Pro'
  },
  {
    title: 'Add New Audit',
    description: 'Start a new financial audit',
    icon: PlusCircle,
    color: 'bg-[#52796F]',
    link: '/intake',
    badge: null
  }
];

export default function Dashboard() {
  const context = useData();
  const [dateRange, setDateRange] = useState('last30days');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeView, setActiveView] = useState('overview');
  
  // Get data from context with fallbacks to empty state
  const responses = context?.responses || [];
  const getChartData = context?.getChartData || (() => []);
  const healthInputs = context?.healthInputs || null;
  const computeHealthScore = context?.computeHealthScore || (() => ({ score: 0 }));
  const healthLabel = context?.healthLabel || (() => "Incomplete");
  const refreshData = context?.refreshData || (() => Promise.resolve());

  const chartData = getChartData();
  const totalResponses = responses.length;
  
  // Health score calculation based on real user data
  const healthResult = healthInputs ? computeHealthScore(healthInputs) : null;
  const healthScore = healthResult ? healthResult.score : 0;
  const healthStatus = healthLabel(healthScore);
  const healthSummary = healthResult 
    ? `${healthStatus} — Based on revenue, expenses, debt, and cash flow analysis.`
    : 'Complete financial health check to generate your score.';

  // Fee revenue data from actual audit responses
  const feeRevenueData = totalResponses > 0 ? responses.map((r, index) => ({
    name: r.businessName ? (r.businessName.length > 12 ? r.businessName.slice(0, 12) + '...' : r.businessName) : `Audit ${index + 1}`,
    fees: r.monthlyFees || 0,
    revenue: r.monthlyRevenue ? Math.round(r.monthlyRevenue / 100) : 0,
    profit: (r.monthlyRevenue ? Math.round(r.monthlyRevenue / 100) : 0) - (r.monthlyFees || 0)
  })) : [];

  // Recent audits from actual responses
  const recentAudits = totalResponses > 0 ? responses.slice(0, 3).map((r, index) => ({
    id: r.id || `audit-${index}`,
    name: r.businessName || `Business Audit ${index + 1}`,
    date: r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No date',
    score: r.healthScore || 0,
    status: r.status || 'completed'
  })) : [];

  // Calculate actual completion rate from responses
  const completedAudits = responses.filter(r => r.status === 'completed' || r.status === 'submitted').length;
  const completionRate = totalResponses > 0 ? Math.round((completedAudits / totalResponses) * 100) : 0;

  // Calculate average time from responses
  const calculateAverageTime = () => {
    if (responses.length === 0) return null;
    const auditsWithTime = responses.filter(r => r.completionTime);
    if (auditsWithTime.length === 0) return null;
    const totalTime = auditsWithTime.reduce((sum, r) => sum + (r.completionTime || 0), 0);
    return Math.round(totalTime / auditsWithTime.length);
  };
  const avgTime = calculateAverageTime();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshData();
      toast.success('Data refreshed successfully');
    } catch (error) { // eslint-disable-line no-unused-vars
      toast.error('Failed to refresh data');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExport = () => {
    if (totalResponses === 0) {
      toast.error('No data available to export');
      return;
    }
    toast.success('Export started - check your downloads');
  };

  const getHealthColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getRiskPercentage = (riskLevel) => {
    const total = chartData.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) return 0;
    const riskItem = chartData.find(item => item.name === riskLevel);
    return riskItem ? Math.round((riskItem.value / total) * 100) : 0;
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'draft':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="font-body bg-[#F8F5F0] text-[#2D3748] min-h-screen">
      <Toaster position="top-right" />
      
      <style>{`
        .hero-gradient {
          background: linear-gradient(135deg, #1B4332 0%, #52796F 100%);
        }
        .btn-primary {
          background: #1B4332 !important;
          color: #F8F5F0 !important;
          transition: all 0.3s ease;
        }
        .btn-primary:hover {
          background: #52796F !important;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(27, 67, 50, 0.3);
        }
        .btn-secondary {
          border: 2px solid #1B4332 !important;
          color: #1B4332 !important;
          background: transparent !important;
          transition: all 0.3s ease;
        }
        .btn-secondary:hover {
          background: #1B4332 !important;
          color: #F8F5F0 !important;
        }
        .stats-card {
          background: linear-gradient(135deg, rgba(27, 67, 50, 0.05) 0%, rgba(82, 121, 111, 0.05) 100%);
          border: 1px solid rgba(82, 121, 111, 0.1);
        }
        .stats-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(27, 67, 50, 0.1);
        }
        .progress-gradient {
          background: linear-gradient(90deg, #1B4332 0%, #52796F 100%);
        }
        .tag-badge {
          background: rgba(27, 67, 50, 0.1) !important;
          color: #1B4332 !important;
          border: 1px solid rgba(27, 67, 50, 0.2) !important;
        }
        .category-badge {
          background: rgba(82, 121, 111, 0.1) !important;
          color: #52796F !important;
          border: 1px solid rgba(82, 121, 111, 0.2) !important;
        }
        .glass-effect {
          -webkit-backdrop-filter: blur(10px); /* Vendor prefix first */
          backdrop-filter: blur(10px); /* Standard property after */
          background: rgba(248, 245, 240, 0.9);
        }
        .admin-card {
          transition: all 0.3s ease;
          border: 1px solid rgba(82, 121, 111, 0.1);
          background: white;
        }
        .admin-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(27, 67, 50, 0.15);
          border-color: #52796F;
        }
        .hover-card {
          transition: all 0.3s ease;
          border: 1px solid rgba(82, 121, 111, 0.1);
          background: white;
        }
        .hover-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(27, 67, 50, 0.15);
          border-color: #52796F;
        }
        .clickable {
          cursor: pointer;
          user-select: none;
        }
        .focus-ring:focus {
          outline: 2px solid #1B4332;
          outline-offset: 2px;
        }
        .hover-lift:hover {
          transform: translateY(-2px);
          transition: transform 0.2s ease;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .pulse { animation: pulse 2s infinite; }
        .health-progress-bg {
         background: linear-gradient(90deg, #D4AF37 0%, #D4AF37 100%);
        }
        .risk-high-progress {
         background: linear-gradient(90deg, #52796F 0%, #1B4332 100%);
        }
        .risk-medium-progress {
          background: linear-gradient(90deg, #1B4332 0%, #52796F 100%);
        }
        .risk-low-progress {
          background: linear-gradient(90deg, #D4AF37 0%, #D4AF37 100%);
        }
        .achievement-gradient {
          background: linear-gradient(135deg, #1B4332 0%, #52796F 100%);
        }
        .highlight-border {
          border-left: 4px solid #1B4332;
        }
      `}</style>
      
      <DashboardLayout 
        title="Dashboard Overview" 
        subtitle="Monitor your financial health and audit progress"
        actions={
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search audits..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332] w-48 transition-all"
                data-testid="search-audits-input"
              />
            </div>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332] transition-all"
              data-testid="date-range-select"
            >
              <option value="today">Today</option>
              <option value="last7days">Last 7 days</option>
              <option value="last30days">Last 30 days</option>
              <option value="last90days">Last 90 days</option>
            </select>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 hover:bg-[#1B4332]/10 rounded-lg disabled:opacity-50 transition-colors"
              title="Refresh data"
              data-testid="refresh-data-btn"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleExport}
              className="p-2 hover:bg-[#1B4332]/10 rounded-lg transition-colors"
              title="Export data"
              data-testid="export-data-btn"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        }
      >
        {/* Welcome Header with Stats */}
        <div className="hero-gradient rounded-2xl mb-6 sm:mb-8 p-6 text-white overflow-hidden" data-testid="welcome-header">
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                    <User className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold mb-1">Welcome back!</h1>
                    <p className="text-white/90">
                      {totalResponses > 0 
                        ? `You have ${totalResponses} audit${totalResponses !== 1 ? 's' : ''} in your dashboard`
                        : 'Get started with your first financial audit to unlock insights'
                      }
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-white/10 backdrop-blur-sm" data-testid="total-audits-stat">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{totalResponses}</div>
                      <div className="text-sm text-white/80">Total Audits</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-white/10 backdrop-blur-sm" data-testid="health-score-stat">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 flex items-center justify-center">
                      <Award className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{healthScore}</div>
                      <div className="text-sm text-white/80">Health Score</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-white/10 backdrop-blur-sm" data-testid="completion-rate-stat">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{completionRate}%</div>
                      <div className="text-sm text-white/80">Completion Rate</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6" data-testid="stats-grid">
          <div className="stats-card rounded-xl p-4 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#52796F] font-medium">Total Audits</p>
                <p className="text-2xl font-bold text-[#1B4332]">{totalResponses}</p>
              </div>
              <div className="p-2 bg-[#1B4332]/10 rounded-lg">
                <FileText className="w-6 h-6 text-[#1B4332]" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              {totalResponses > 0 ? (
                <span className="text-[#52796F]">Based on your actual audits</span>
              ) : (
                <span className="text-[#52796F]">No audits created yet</span>
              )}
            </div>
          </div>
          
          <div className="stats-card rounded-xl p-4 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#52796F] font-medium">Avg. Health Score</p>
                <p className="text-2xl font-bold text-[#1B4332]">{healthScore}</p>
              </div>
              <div className="p-2 bg-[#1B4332]/10 rounded-lg">
                <Shield className="w-6 h-6 text-[#1B4332]" />
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#52796F]">Progress</span>
                <span className="font-medium text-[#1B4332]">{healthScore}/100</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                <div 
                  className="health-progress-bg h-full rounded-full transition-all duration-500"
                  style={{ width: `${healthScore}%` }}
                />
              </div>
            </div>
          </div>
          
          <div className="stats-card rounded-xl p-4 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#52796F] font-medium">High Risk Items</p>
                <p className="text-2xl font-bold text-[#1B4332]">{getRiskPercentage('High Risk')}%</p>
              </div>
              <div className="p-2 bg-red-50 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <div className="mt-2 text-sm">
              <span className={`px-2 py-1 rounded-full ${getRiskPercentage('High Risk') > 0 ? 'text-red-600 bg-red-50 border-red-200' : 'text-green-600 bg-green-50 border-green-200'}`}>
                {getRiskPercentage('High Risk') > 0 ? 'Needs Attention' : 'No High Risk Items'}
              </span>
            </div>
          </div>
          
          <div className="stats-card rounded-xl p-4 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#52796F] font-medium">Completion Rate</p>
                <p className="text-2xl font-bold text-[#1B4332]">{completionRate}%</p>
              </div>
              <div className="p-2 bg-[#1B4332]/10 rounded-lg">
                <CheckCircle className="w-6 h-6 text-[#1B4332]" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <Clock className="w-4 h-4 text-[#52796F] mr-1" />
              <span className="text-[#52796F]">
                {avgTime ? `Avg. time: ${avgTime}min` : 'No time data available'}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" value={activeView} onValueChange={setActiveView} className="space-y-6">
          <TabsList className="bg-white border border-[#52796F]/10">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#1B4332] data-[state=active]:text-white" data-testid="tab-overview">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-[#1B4332] data-[state=active]:text-white" data-testid="tab-analytics">
              <PieChartIcon className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="audits" className="data-[state=active]:bg-[#1B4332] data-[state=active]:text-white" data-testid="tab-audits">
              <FileText className="w-4 h-4 mr-2" />
              Recent Audits
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Financial Health Card */}
              <Card className="hover-card transition-all border-[#52796F]/10" data-testid="financial-health-card">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-[#1B4332]">
                        <Shield className="w-5 h-5" />
                        Financial Health Score
                      </CardTitle>
                      <CardDescription className="text-[#52796F]">
                        {healthResult ? `Updated ${new Date().toLocaleDateString()}` : 'No health check completed'}
                      </CardDescription>
                    </div>
                    {healthScore > 0 && (
                      <Badge className={`${getHealthColor(healthScore)} border`}>
                        {healthStatus}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {healthScore > 0 ? (
                      <>
                        <div className="flex items-center justify-center">
                          <div className="relative w-48 h-48">
                            <div className="absolute inset-0 rounded-full achievement-gradient flex items-center justify-center shadow-lg">
                              <div className="text-center">
                                <span className="text-5xl font-bold text-white">{healthScore}</span>
                                <div className="text-white/80 text-sm mt-1">out of 100</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-[#52796F] mb-4">{healthSummary}</p>
                          <Link to="/health">
                            <Button className="w-full btn-primary" data-testid="run-analysis-btn">
                              <Zap className="w-4 h-4 mr-2" />
                              Run Detailed Analysis
                            </Button>
                          </Link>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <Shield className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-lg font-medium text-[#1B4332] mb-2">No Health Score Yet</h3>
                        <p className="text-[#52796F] mb-4">Complete a financial health check to get your score</p>
                        <Link to="/health">
                          <Button className="btn-primary" data-testid="start-health-check-btn">
                            <Zap className="w-4 h-4 mr-2" />
                            Start Health Check
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions Card */}
              <Card className="hover-card transition-all border-[#52796F]/10" data-testid="quick-actions-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#1B4332]">
                    <Zap className="w-5 h-5" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription className="text-[#52796F]">
                    Common tasks to boost your financial health
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {QUICK_ACTIONS.map((action, index) => (
                      <Link key={index} to={action.link}>
                        <div className="flex items-center p-3 border border-[#52796F]/10 rounded-lg hover:bg-[#52796F]/5 hover-lift clickable transition-all group highlight-border" data-testid={`quick-action-${index}`}>
                          <div className={`${action.color} p-2 rounded-lg mr-3`}>
                            <action.icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-[#1B4332] group-hover:text-[#52796F]">
                                {action.title}
                              </span>
                              {action.badge && (
                                <Badge className="tag-badge text-xs">
                                  {action.badge}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-[#52796F]">{action.description}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[#52796F] group-hover:text-[#1B4332]" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Risk Distribution */}
              <Card className="hover-card transition-all border-[#52796F]/10" data-testid="risk-distribution-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-[#1B4332]">
                      <Sparkles className="w-5 h-5" />
                      Risk Distribution
                    </CardTitle>
                    <Badge className="category-badge">
                      {totalResponses} {totalResponses === 1 ? 'audit' : 'audits'}
                    </Badge>
                  </div>
                  <CardDescription className="text-[#52796F]">
                    Breakdown of risk levels across all audits
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    {totalResponses > 0 && chartData.length > 0 ? (
                      <div className="flex h-full">
                        <div className="w-2/3">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie 
                                data={chartData} 
                                cx="50%" 
                                cy="50%" 
                                innerRadius={60} 
                                outerRadius={90} 
                                paddingAngle={5}
                                dataKey="value"
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              >
                                {chartData.map((entry, idx) => (
                                  <Cell 
                                    key={`cell-${idx}`} 
                                    fill={RISK_COLORS[entry.name]} 
                                    stroke="#fff" 
                                    strokeWidth={2}
                                  />
                                ))}
                              </Pie>
                              <Tooltip 
                                formatter={(value) => [`${value} audits`, 'Count']}
                                contentStyle={{ 
                                  borderRadius: '8px',
                                  border: 'none',
                                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }}
                              />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="w-1/3 pl-6 flex flex-col justify-center space-y-4">
                          {chartData.map((item, idx) => (
                            <div key={idx} className="flex items-center">
                              <div 
                                className="w-3 h-3 rounded-full mr-2"
                                style={{ backgroundColor: RISK_COLORS[item.name] }}
                              />
                              <div className="flex-1">
                                <div className="flex justify-between text-sm">
                                  <span className="font-medium text-[#1B4332]">{item.name}</span>
                                  <span className="text-[#52796F]">{item.value}</span>
                                </div>
                                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mt-1">
                                  <div 
                                    className={`h-full rounded-full ${
                                      item.name === 'High Risk' ? 'risk-high-progress' :
                                      item.name === 'Medium Risk' ? 'risk-medium-progress' :
                                      'risk-low-progress'
                                    }`}
                                    style={{ width: `${(item.value / totalResponses) * 100}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                          <PieChartIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                          <h3 className="text-lg font-medium text-[#1B4332] mb-2">No Data Available</h3>
                          <p className="text-[#52796F] mb-4">Complete audits to see risk distribution</p>
                          <Link to="/intake">
                            <Button className="btn-primary" data-testid="create-first-audit-btn">
                              <PlusCircle className="w-4 h-4 mr-2" />
                              Create First Audit
                            </Button>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Fee vs Revenue Analysis */}
              <Card className="hover-card transition-all border-[#52796F]/10" data-testid="fee-revenue-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#1B4332]">
                    <BarChart3 className="w-5 h-5" />
                    Fee vs Revenue Analysis
                  </CardTitle>
                  <CardDescription className="text-[#52796F]">
                    Compare fees and revenue across your audits
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    {feeRevenueData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={feeRevenueData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip 
                            contentStyle={{ 
                              borderRadius: '8px',
                              border: 'none',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}
                          />
                          <Legend />
                          <Bar dataKey="fees" fill="#DC2626" name="Fees" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="revenue" fill="#10B981" name="Revenue" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                          <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                          <h3 className="text-lg font-medium text-[#1B4332] mb-2">No Revenue Data</h3>
                          <p className="text-[#52796F]">Complete audits to see fee and revenue analysis</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="audits" className="space-y-6">
            <Card className="hover-card transition-all border-[#52796F]/10" data-testid="recent-audits-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-[#1B4332]">
                      <FileText className="w-5 h-5" />
                      Recent Audits
                    </CardTitle>
                    <CardDescription className="text-[#52796F]">
                      Your most recent financial audits
                    </CardDescription>
                  </div>
                  <Link to="/intake">
                    <Button className="btn-secondary" data-testid="new-audit-btn">
                      <PlusCircle className="w-4 h-4 mr-2" />
                      New Audit
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {recentAudits.length > 0 ? (
                  <div className="space-y-4">
                    {recentAudits.map((audit, index) => (
                      <div 
                        key={audit.id} 
                        className="flex items-center justify-between p-4 border border-[#52796F]/10 rounded-lg hover:bg-[#52796F]/5 transition-all"
                        data-testid={`recent-audit-${index}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-[#1B4332]/10 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-[#1B4332]" />
                          </div>
                          <div>
                            <h4 className="font-medium text-[#1B4332]">{audit.name}</h4>
                            <p className="text-sm text-[#52796F]">{audit.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-lg font-bold text-[#1B4332]">{audit.score}</div>
                            <div className="text-xs text-[#52796F]">Health Score</div>
                          </div>
                          <Badge className={`${getStatusBadgeColor(audit.status)} border capitalize`}>
                            {audit.status}
                          </Badge>
                          <Link to={`/intake/${audit.id}`}>
                            <Button variant="ghost" size="sm" className="text-[#1B4332] hover:bg-[#1B4332]/10">
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                    
                    {totalResponses > 3 && (
                      <div className="text-center pt-4">
                        <Link to="/intake">
                          <Button className="btn-secondary" data-testid="view-all-audits-btn">
                            View All Audits
                            <ChevronRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-[#1B4332] mb-2">No Audits Yet</h3>
                    <p className="text-[#52796F] mb-4">Create your first audit to get started</p>
                    <Link to="/intake">
                      <Button className="btn-primary" data-testid="create-audit-empty-btn">
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Create Your First Audit
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Tips Section */}
        <div className="mt-8">
          <Card className="border-[#52796F]/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-[#1B4332] flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Quick Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-[#1B4332]/5 rounded-lg border border-[#1B4332]/10">
                  <div className="flex items-start gap-2">
                    <div className="p-1 bg-[#1B4332]/10 rounded">
                      <TrendingUp className="w-4 h-4 text-[#1B4332]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#1B4332]">Improve Your Score</p>
                      <p className="text-xs text-[#52796F] mt-1">Complete financial audits to get personalized recommendations</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-[#52796F]/5 rounded-lg border border-[#52796F]/10">
                  <div className="flex items-start gap-2">
                    <div className="p-1 bg-[#52796F]/10 rounded">
                      <Shield className="w-4 h-4 text-[#52796F]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#1B4332]">Risk Reduction</p>
                      <p className="text-xs text-[#52796F] mt-1">Regular audits help identify and mitigate financial risks</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-start gap-2">
                    <div className="p-1 bg-purple-100 rounded">
                      <DollarSign className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#1B4332]">Save Money</p>
                      <p className="text-xs text-[#52796F] mt-1">Track monthly fees and revenue to optimize spending</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </div>
  );
}