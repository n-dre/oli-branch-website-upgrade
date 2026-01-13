import React, { useState, useEffect } from 'react';
import { Progress } from '../components/ui/progress';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import {
  DollarSign,
  FileText,
  ArrowRight,
  Sparkles,
  Shield,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Download,
  Users,
  BarChart3,
  PlusCircle,
  Eye,
  Filter,
  Search,
  ChevronRight,
  Calendar,
  Target,
  Zap,
  Clock,
  PieChart as PieChartIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import UserDashboard from '../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useData } from '../context/DataContext';
import toast, { Toaster } from 'react-hot-toast';

const RISK_COLORS = {
  'High Risk': 'hsl(0, 72%, 58%)',
  'Medium Risk': 'hsl(38, 92%, 50%)',
  'Low Risk': 'hsl(145, 60%, 40%)'
};

const QUICK_ACTIONS = [
  {
    title: 'Financial Health Check',
    description: 'Get your business health score',
    icon: Shield,
    color: 'bg-blue-500',
    link: '/financial-health',
    badge: 'Recommended'
  },
  {
    title: 'Find Banking Products',
    description: 'Compare loans & accounts',
    icon: DollarSign,
    color: 'bg-green-500',
    link: '/tools',
    badge: 'New'
  },
  {
    title: 'Generate Reports',
    description: 'Create detailed PDF reports',
    icon: FileText,
    color: 'bg-purple-500',
    link: '/reports',
    badge: 'Pro'
  },
  {
    title: 'Add New Audit',
    description: 'Start a new financial audit',
    icon: PlusCircle,
    color: 'bg-orange-500',
    link: '/audit/new',
    badge: null
  }
];

export default function Dashboard() {
  const context = useData();
  const [dateRange, setDateRange] = useState('last30days');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeView, setActiveView] = useState('overview');
  
  const responses = context?.responses || [];
  const getChartData = context?.getChartData || (() => []);
  const healthInputs = context?.healthInputs || null;
  const computeHealthScore = context?.computeHealthScore || (() => ({ score: 0 }));
  const healthLabel = context?.healthLabel || (() => "Incomplete");
  const refreshData = context?.refreshData || (() => Promise.resolve());

  const chartData = getChartData();
  const totalResponses = responses.length;
  
  const healthResult = healthInputs ? computeHealthScore(healthInputs) : null;
  const healthScore = healthResult ? healthResult.score : 0;
  const healthStatus = healthLabel(healthScore);
  const healthSummary = healthResult 
    ? `${healthStatus} — Based on revenue, expenses, debt, and cash flow analysis.`
    : 'Complete financial health check to generate your score.';

  const feeRevenueData = responses.slice(0, 5).map((r) => ({
    name: r.businessName ? (r.businessName.length > 12 ? r.businessName.slice(0, 12) + '...' : r.businessName) : 'Unnamed',
    fees: r.monthlyFees || 0,
    revenue: r.monthlyRevenue ? Math.round(r.monthlyRevenue / 100) : 0,
    profit: (r.monthlyRevenue ? Math.round(r.monthlyRevenue / 100) : 0) - (r.monthlyFees || 0)
  }));

  const recentAudits = responses.slice(0, 3).map(r => ({
    id: r.id,
    name: r.businessName || 'Unnamed Audit',
    date: new Date(r.createdAt || Date.now()).toLocaleDateString(),
    score: Math.floor(Math.random() * 30) + 70, // Mock score
    status: r.status || 'completed'
  }));

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshData();
      toast.success('Data refreshed successfully');
    } catch (error) {
      toast.error('Failed to refresh data');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExport = () => {
    toast.success('Export started - check your downloads');
  };

  const getHealthColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getRiskPercentage = (riskLevel) => {
    const total = chartData.reduce((sum, item) => sum + item.value, 0);
    const riskItem = chartData.find(item => item.name === riskLevel);
    return riskItem ? Math.round((riskItem.value / total) * 100) : 0;
  };

  return (
    <div className="font-body bg-[#F8F5F0] text-[#2D3748] min-h-screen">
      <Toaster position="top-right" />
      
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
        
        /* Salesforce-like hover effects */
        .hover-card:hover { border-color: #1B4332; }
        .hover-lift:hover { transform: translateY(-2px); transition: transform 0.2s ease; }
        .clickable { cursor: pointer; user-select: none; }
        .focus-ring:focus { outline: 2px solid #1B4332; outline-offset: 2px; }
        
        /* Progress animations */
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .pulse { animation: pulse 2s infinite; }
        
        /* Smooth transitions */
        .transition-all { transition: all 0.3s ease; }
      `}</style>
      
      <UserDashboard 
        title="Welcome Back!" 
        subtitle="Here's your financial overview for today"
        actions={
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search audits..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
              />
            </div>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="today">Today</option>
              <option value="last7days">Last 7 days</option>
              <option value="last30days">Last 30 days</option>
              <option value="last90days">Last 90 days</option>
            </select>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
              title="Refresh data"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleExport}
              className="p-2 hover:bg-gray-100 rounded-lg"
              title="Export data"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        }
      >
        {/* Header Stats */}
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Audits</p>
                  <p className="text-2xl font-bold text-gray-900">{totalResponses}</p>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-600">+12% from last month</span>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg. Health Score</p>
                  <p className="text-2xl font-bold text-gray-900">{healthScore}</p>
                </div>
                <div className="p-2 bg-green-50 rounded-lg">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">{healthScore}/100</span>
                </div>
                <Progress value={healthScore} className="h-2 mt-1" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">High Risk Items</p>
                  <p className="text-2xl font-bold text-gray-900">{getRiskPercentage('High Risk')}%</p>
                </div>
                <div className="p-2 bg-red-50 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <div className="mt-2 text-sm">
                <span className={`px-2 py-1 rounded-full ${getHealthColor(getRiskPercentage('High Risk'))}`}>
                  Needs Attention
                </span>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completion Rate</p>
                  <p className="text-2xl font-bold text-gray-900">78%</p>
                </div>
                <div className="p-2 bg-purple-50 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm">
                <Clock className="w-4 h-4 text-gray-400 mr-1" />
                <span className="text-gray-600">Avg. time: 12min</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" value={activeView} onValueChange={setActiveView} className="space-y-6">
          <TabsList className="bg-white border border-gray-200">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
              <PieChartIcon className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="audits" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
              <FileText className="w-4 h-4 mr-2" />
              Recent Audits
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Financial Health Card */}
              <Card className="hover-card transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-blue-600" />
                        Financial Health Score
                      </CardTitle>
                      <CardDescription>
                        Updated {new Date().toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge className={getHealthColor(healthScore)}>
                      {healthStatus}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-center">
                      <div className="relative w-48 h-48">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center shadow-lg">
                          <div className="text-center">
                            <span className="text-5xl font-bold text-white">{healthScore}</span>
                            <div className="text-white/80 text-sm mt-1">out of 100</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-600 mb-4">{healthSummary}</p>
                      <Link to="/financial-health">
                        <Button className="w-full">
                          <Zap className="w-4 h-4 mr-2" />
                          Run Detailed Analysis
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions Card */}
              <Card className="hover-card transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-orange-600" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>
                    Common tasks to boost your financial health
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {QUICK_ACTIONS.map((action, index) => (
                      <Link key={index} to={action.link}>
                        <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover-lift clickable transition-all group">
                          <div className={`${action.color} p-2 rounded-lg mr-3`}>
                            <action.icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900 group-hover:text-blue-600">
                                {action.title}
                              </span>
                              {action.badge && (
                                <Badge variant="outline" className="text-xs">
                                  {action.badge}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{action.description}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
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
              <Card className="hover-card transition-all">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-gold" />
                      Risk Distribution
                    </CardTitle>
                    <Badge variant="outline">
                      {totalResponses} audits
                    </Badge>
                  </div>
                  <CardDescription>
                    Breakdown of risk levels across all audits
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    {totalResponses > 0 ? (
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
                                  <span className="font-medium">{item.name}</span>
                                  <span className="text-gray-600">{item.value}</span>
                                </div>
                                <Progress 
                                  value={(item.value / totalResponses) * 100} 
                                  className="h-1.5 mt-1"
                                  indicatorClassName="bg-current"
                                  style={{ opacity: 0.5 }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full">
                        <FileText className="w-16 h-16 mb-4 opacity-20" />
                        <p className="text-lg font-medium mb-2">No audit data available</p>
                        <p className="text-sm text-center mb-4">
                          Complete your first audit to see risk analysis
                        </p>
                        <Link to="/audit/new" className="text-blue-600 hover:text-blue-700 font-medium">
                          Start New Audit
                        </Link>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Financial Performance */}
              <Card className="hover-card transition-all">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      Financial Performance
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-gray-400" />
                      <select className="text-sm border-0 bg-transparent focus:outline-none">
                        <option>Top 5 Audits</option>
                        <option>Last 30 Days</option>
                      </select>
                    </div>
                  </div>
                  <CardDescription>
                    Fees vs Revenue comparison across audits
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    {feeRevenueData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={feeRevenueData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis 
                            dataKey="name" 
                            tick={{ fontSize: 12 }}
                            axisLine={{ stroke: '#e5e7eb' }}
                            tickLine={false}
                          />
                          <YAxis 
                            tick={{ fontSize: 12 }}
                            axisLine={{ stroke: '#e5e7eb' }}
                            tickLine={false}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              borderRadius: '8px',
                              border: 'none',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}
                            formatter={(value, name) => {
                              if (name === 'revenue') return [`$${Number(value) * 100}`, 'Revenue'];
                              if (name === 'fees') return [`$${value}`, 'Fees'];
                              if (name === 'profit') return [`$${value}`, 'Profit'];
                              return [value, name];
                            }}
                          />
                          <Legend />
                          <Bar 
                            dataKey="fees" 
                            name="Monthly Fees" 
                            fill="#ef4444" 
                            radius={[4, 4, 0, 0]}
                            barSize={24}
                          />
                          <Bar 
                            dataKey="revenue" 
                            name="Monthly Revenue (÷100)" 
                            fill="#22c55e" 
                            radius={[4, 4, 0, 0]}
                            barSize={24}
                          />
                          <Bar 
                            dataKey="profit" 
                            name="Estimated Profit" 
                            fill="#3b82f6" 
                            radius={[4, 4, 0, 0]}
                            barSize={24}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full">
                        <div className="text-center">
                          <Target className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No financial data</h3>
                          <p className="text-gray-600 mb-4">Add financial details to your audits</p>
                          <Button variant="outline">
                            <Eye className="w-4 h-4 mr-2" />
                            View Documentation
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="audits" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Audits</CardTitle>
                    <CardDescription>
                      Your most recent financial audit activities
                    </CardDescription>
                  </div>
                  <Link to="/audits">
                    <Button variant="outline" size="sm">
                      View All
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {recentAudits.length > 0 ? (
                  <div className="space-y-3">
                    {recentAudits.map((audit, index) => (
                      <div 
                        key={audit.id} 
                        className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover-lift clickable transition-all group"
                      >
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-gray-900 group-hover:text-blue-600">
                              {audit.name}
                            </span>
                            <Badge className={`${
                              audit.score >= 80 ? 'bg-green-100 text-green-800' :
                              audit.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              Score: {audit.score}
                            </Badge>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-3 h-3 mr-1" />
                            <span>{audit.date}</span>
                            <span className="mx-2">•</span>
                            <Badge variant="outline" size="sm">
                              {audit.status}
                            </Badge>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                          View Details
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No audits yet</h3>
                    <p className="text-gray-600 mb-6">Start your first financial audit to see data here</p>
                    <Link to="/audit/new">
                      <Button>
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Create First Audit
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
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold" />
                Quick Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <div className="p-1 bg-blue-100 rounded">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Improve Your Score</p>
                      <p className="text-xs text-gray-600 mt-1">Reduce monthly fees by 15% to increase health score</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <div className="p-1 bg-green-100 rounded">
                      <Shield className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Risk Reduction</p>
                      <p className="text-xs text-gray-600 mt-1">Audit your top 3 high-risk areas this week</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <div className="p-1 bg-purple-100 rounded">
                      <DollarSign className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Save Money</p>
                      <p className="text-xs text-gray-600 mt-1">Compare banking products to save up to $500/month</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </UserDashboard>
    </div>
  );
}