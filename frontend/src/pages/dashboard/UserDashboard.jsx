import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import {
  DollarSign,
  FileText,
  Shield,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Download,
  BarChart3,
  PlusCircle,
  ChevronRight,
  Zap,
  Clock,
  PieChart as PieChartIcon,
  Search
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
  'Low Risk': '#95A792'
};

const QUICK_ACTIONS = [
  {
    title: 'Financial Health Analysis',
    description: 'Comprehensive business health assessment',
    icon: Shield,
    color: 'bg-[#1B4332]',
    link: '/health'
  },
  {
    title: 'Banking Product Analysis',
    description: 'Evaluate loans and financial products',
    icon: DollarSign,
    color: 'bg-[#52796F]',
    link: '/tools'
  },
  {
    title: 'Generate Financial Reports',
    description: 'Create detailed financial documentation',
    icon: FileText,
    color: 'bg-[#1B4332]',
    link: '/report'
  },
  {
    title: 'Initiate New Audit',
    description: 'Begin financial audit process',
    icon: PlusCircle,
    color: 'bg-[#52796F]',
    link: '/intake'
  }
];

const UserDashboard = () => {
  const context = useData();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeView, setActiveView] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  
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
  const feeRevenueData = totalResponses > 0 ? responses.map((r) => ({
    name: r.businessName ? (r.businessName.length > 8 ? r.businessName.slice(0, 8) + '..' : r.businessName) : `Audit ${responses.indexOf(r) + 1}`,
    fees: r.monthlyFees || 0,
    revenue: r.monthlyRevenue ? Math.round(r.monthlyRevenue / 100) : 0,
    profit: (r.monthlyRevenue ? Math.round(r.monthlyRevenue / 100) : 0) - (r.monthlyFees || 0)
  })) : [];

  // Recent audits from actual responses
  const recentAudits = totalResponses > 0 ? responses.slice(0, 3).map((r) => ({
    id: r.id || `audit-${responses.indexOf(r)}`,
    name: r.businessName || `Business Audit ${responses.indexOf(r) + 1}`,
    date: r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A',
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
    } catch {
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
    if (score >= 80) return 'text-green-700 bg-green-50 border-green-200';
    if (score >= 60) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-red-700 bg-red-50 border-red-200';
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
        return 'bg-green-50 text-green-700 border-green-200';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'draft':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  // Filter audits based on search query
  const filteredAudits = searchQuery 
    ? recentAudits.filter(audit => 
        audit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        audit.status.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : recentAudits;

  return (
    <div className="font-sans bg-gray-50 text-gray-900 min-h-screen">
      <Toaster position="top-right" />
      
      <DashboardLayout 
        title="Financial Control Dashboard" 
        subtitle="Monitor financial health and audit progress"
        actions={
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search audits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#1B4332] focus:border-[#1B4332] w-48 transition-colors"
              />
            </div>
            <div className="flex items-center gap-2 border-l pl-3">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2 text-gray-600 hover:text-[#1B4332] hover:bg-gray-100 rounded-lg disabled:opacity-50 transition-colors"
                title="Refresh data"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={handleExport}
                className="p-2 text-gray-600 hover:text-[#1B4332] hover:bg-gray-100 rounded-lg transition-colors"
                title="Export data"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        }
      >
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Audits</p>
                  <p className="text-2xl font-semibold text-gray-900">{totalResponses}</p>
                </div>
                <div className="p-2 bg-[#1B4332]/5 rounded-lg">
                  <FileText className="w-5 h-5 text-[#1B4332]" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Health Score</p>
                  <p className="text-2xl font-semibold text-gray-900">{healthScore}</p>
                </div>
                <div className="p-2 bg-[#1B4332]/5 rounded-lg">
                  <Shield className="w-5 h-5 text-[#1B4332]" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium text-gray-900">{healthScore}/100</span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full"
                    style={{ 
                      width: `${healthScore}%`,
                      backgroundColor: healthScore >= 80 ? '#10B981' : healthScore >= 60 ? '#F59E0B' : '#DC2626'
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">High Risk Items</p>
                  <p className="text-2xl font-semibold text-gray-900">{getRiskPercentage('High Risk')}%</p>
                </div>
                <div className="p-2 bg-red-50 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className={`text-xs px-2 py-1 rounded-full ${getRiskPercentage('High Risk') > 0 ? 'text-red-700 bg-red-50 border border-red-200' : 'text-green-700 bg-green-50 border border-green-200'}`}>
                  {getRiskPercentage('High Risk') > 0 ? 'Requires Attention' : 'No High Risk'}
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Completion Rate</p>
                  <p className="text-2xl font-semibold text-gray-900">{completionRate}%</p>
                </div>
                <div className="p-2 bg-[#1B4332]/5 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-[#1B4332]" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs text-gray-600">
                <Clock className="w-3 h-3 mr-1" />
                <span>{avgTime ? `Avg: ${avgTime}min` : 'No time data'}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" value={activeView} onValueChange={setActiveView} className="space-y-6">
          <TabsList className="bg-white border border-gray-200">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#1B4332] data-[state=active]:text-white">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-[#1B4332] data-[state=active]:text-white">
              <PieChartIcon className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="audits" className="data-[state=active]:bg-[#1B4332] data-[state=active]:text-white">
              <FileText className="w-4 h-4 mr-2" />
              Recent Audits
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Financial Health Card */}
              <Card className="border border-gray-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900">Financial Health Analysis</CardTitle>
                      <CardDescription className="text-gray-600">
                        {healthResult ? `Updated ${new Date().toLocaleDateString()}` : 'Incomplete analysis'}
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
                  {healthScore > 0 ? (
                    <>
                      <div className="flex items-center justify-center mb-6">
                        <div className="relative">
                          <div className="w-32 h-32 rounded-full bg-[#1B4332] flex items-center justify-center">
                            <div className="text-center">
                              <span className="text-3xl font-bold text-white">{healthScore}</span>
                              <div className="text-white/80 text-xs mt-1">Score</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <p className="text-gray-600 text-sm">{healthSummary}</p>
                        <Link to="/health">
                          <Button 
                            className="w-full bg-[#1B4332] hover:bg-[#2D5A4B] text-white"
                          >
                            <Zap className="w-4 h-4 mr-2" />
                            Run Detailed Analysis
                          </Button>
                        </Link>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <Shield className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Health Analysis</h3>
                      <p className="text-gray-600 mb-4">Complete a financial health analysis to get your score</p>
                      <Link to="/health">
                        <Button className="bg-[#1B4332] hover:bg-[#2D5A4B] text-white">
                          <Zap className="w-4 h-4 mr-2" />
                          Start Health Analysis
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions Card */}
              <Card className="border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">System Controls</CardTitle>
                  <CardDescription className="text-gray-600">
                    Access key financial management functions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {QUICK_ACTIONS.map((action) => (
                      <Link key={action.link} to={action.link}>
                        <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className={`${action.color} p-2 rounded-lg mr-3`}>
                            <action.icon className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{action.title}</div>
                            <p className="text-xs text-gray-600">{action.description}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
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
              <Card className="border border-gray-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900">Risk Distribution Analysis</CardTitle>
                      <CardDescription className="text-gray-600">
                        Risk assessment across all financial audits
                      </CardDescription>
                    </div>
                    <Badge className="bg-gray-100 text-gray-700 border border-gray-300">
                      {totalResponses} audits
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[280px]">
                    {totalResponses > 0 && chartData.length > 0 ? (
                      <div className="flex h-full">
                        <div className="w-2/3">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie 
                                data={chartData} 
                                cx="50%" 
                                cy="50%" 
                                innerRadius={50} 
                                outerRadius={80} 
                                paddingAngle={2}
                                dataKey="value"
                              >
                                {chartData.map((entry) => (
                                  <Cell 
                                    key={entry.name}
                                    fill={RISK_COLORS[entry.name]} 
                                    stroke="#fff" 
                                    strokeWidth={1}
                                  />
                                ))}
                              </Pie>
                              <Tooltip 
                                formatter={(value) => [`${value} audits`, 'Count']}
                                contentStyle={{ 
                                  borderRadius: '6px',
                                  border: '1px solid #e5e7eb',
                                  backgroundColor: 'white'
                                }}
                              />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="w-1/3 pl-4 flex flex-col justify-center space-y-3">
                          {chartData.map((item) => (
                            <div key={item.name} className="flex items-center">
                              <div 
                                className="w-3 h-3 rounded-full mr-2"
                                style={{ backgroundColor: RISK_COLORS[item.name] }}
                              />
                              <div className="flex-1">
                                <div className="flex justify-between text-xs">
                                  <span className="font-medium text-gray-900">{item.name}</span>
                                  <span className="text-gray-600">{item.value}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                          <PieChartIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Risk Data</h3>
                          <p className="text-gray-600 mb-4">Complete audits to see risk distribution</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Fee vs Revenue Analysis */}
              <Card className="border border-gray-200">
                <CardHeader>
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900">Financial Performance</CardTitle>
                    <CardDescription className="text-gray-600">
                      Fee and revenue analysis across audits
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[280px]">
                    {feeRevenueData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={feeRevenueData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                          <YAxis tick={{ fontSize: 11 }} />
                          <Tooltip 
                            contentStyle={{ 
                              borderRadius: '6px',
                              border: '1px solid #e5e7eb',
                              backgroundColor: 'white'
                            }}
                          />
                          <Legend />
                          <Bar dataKey="fees" fill="#DC2626" name="Fees" radius={[2, 2, 0, 0]} />
                          <Bar dataKey="revenue" fill="#10B981" name="Revenue" radius={[2, 2, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                          <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Financial Data</h3>
                          <p className="text-gray-600">Complete audits to see performance analysis</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="audits" className="space-y-6">
            <Card className="border border-gray-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900">Audit Management</CardTitle>
                    <CardDescription className="text-gray-600">
                      {searchQuery ? `Search results for "${searchQuery}"` : 'Recent financial audits'}
                    </CardDescription>
                  </div>
                  <Link to="/intake">
                    <Button 
                      className="bg-[#1B4332] hover:bg-[#2D5A4B] text-white"
                    >
                      <PlusCircle className="w-4 h-4 mr-2" />
                      New Audit
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {filteredAudits.length > 0 ? (
                  <div className="space-y-3">
                    {filteredAudits.map((audit) => (
                      <div 
                        key={audit.id} 
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#1B4332]/10 flex items-center justify-center">
                            <FileText className="w-4 h-4 text-[#1B4332]" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{audit.name}</h4>
                            <p className="text-xs text-gray-600">{audit.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-sm font-semibold text-gray-900">{audit.score}</div>
                            <div className="text-xs text-gray-600">Score</div>
                          </div>
                          <Badge className={`${getStatusBadgeColor(audit.status)} border text-xs capitalize`}>
                            {audit.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    
                    {totalResponses > 3 && (
                      <div className="text-center pt-4">
                        <Link to="/intake">
                          <Button 
                            className="border border-gray-300 bg-white text-gray-900 hover:bg-gray-50"
                          >
                            View All Audits
                            <ChevronRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {searchQuery ? 'No matching audits' : 'No Audits Found'}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {searchQuery ? 'Try a different search term' : 'Create your first audit to begin'}
                    </p>
                    <Link to="/intake">
                      <Button className="bg-[#1B4332] hover:bg-[#2D5A4B] text-white">
                        <PlusCircle className="w-4 h-4 mr-2" />
                        {searchQuery ? 'View All Audits' : 'Create Audit'}
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* System Status */}
        <div className="mt-8">
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-900">System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-start gap-2">
                    <TrendingUp className="w-4 h-4 text-[#1B4332]" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Performance</p>
                      <p className="text-xs text-gray-600 mt-1">System operating at optimal levels</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-[#1B4332]" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Security</p>
                      <p className="text-xs text-gray-600 mt-1">All systems secured and encrypted</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-start gap-2">
                    <DollarSign className="w-4 h-4 text-[#1B4332]" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Data</p>
                      <p className="text-xs text-gray-600 mt-1">Real-time financial data processing</p>
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

export default UserDashboard;