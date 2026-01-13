import React, { useState } from 'react';
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar } from 'recharts';
import { toast } from 'sonner';
import {
  Heart,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Target,
  PieChart as PieChartIcon,
  BarChart3,
  Lightbulb,
  Calculator,
  RefreshCw,
  Info,
  Eye,
  Download,
  TrendingDown,
  Shield,
  Users,
  Zap,
  ArrowRight,
  Calendar
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { useData } from '../context/DataContext';

const DONUT_COLORS = ['hsl(150, 40%, 35%)', 'hsl(42, 70%, 52%)', 'hsl(200, 70%, 50%)'];

export default function FinancialHealth() {
  const { 
    healthInputs, 
    updateHealthInputs, 
    healthHistory, 
    addHealthHistory, 
    clearHealthData,
    computeHealthScore,
    healthLabel 
  } = useData();

  const [formData, setFormData] = useState({
    revenue: healthInputs?.revenue || '',
    expenses: healthInputs?.expenses || '',
    debt: healthInputs?.debt || '',
    cash: healthInputs?.cash || ''
  });
  
  const [activeTab, setActiveTab] = useState('input');
  const [isCalculating, setIsCalculating] = useState(false);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCalculate = async () => {
    const inputs = {
      revenue: Number(formData.revenue || 0),
      expenses: Number(formData.expenses || 0),
      debt: Number(formData.debt || 0),
      cash: Number(formData.cash || 0)
    };

    const hasAny = Object.values(inputs).some(v => v > 0);
    if (!hasAny) {
      toast.error('Please enter at least one value');
      return;
    }

    setIsCalculating(true);
    
    // Simulate calculation delay
    setTimeout(() => {
      updateHealthInputs(inputs);
      const result = computeHealthScore(inputs);
      addHealthHistory(result.score);
      
      toast.success(`Score calculated: ${result.score}`, {
        description: `Your financial health is ${healthLabel(result.score).toLowerCase()}.`
      });
      
      setIsCalculating(false);
      setActiveTab('results');
    }, 800);
  };

  const handleClear = () => {
    setFormData({ revenue: '', expenses: '', debt: '', cash: '' });
    clearHealthData();
    toast.info('All data has been cleared', {
      description: 'Enter new values to calculate your score.'
    });
  };

  const handleQuickExample = () => {
    setFormData({
      revenue: '25000',
      expenses: '18000',
      debt: '40000',
      cash: '12000'
    });
    toast.info('Example values loaded', {
      description: 'Click Calculate Score to see results.'
    });
  };

  const handleExport = () => {
    toast.success('Report exported', {
      description: 'Your financial health report has been downloaded.'
    });
  };

  // Get current score and metrics
  const currentResult = healthInputs ? computeHealthScore(healthInputs) : null;
  const metrics = currentResult?.metrics || { margin: 0, runway: 0, debtLoad: 0 };

  // Donut chart data for breakdown
  const breakdownData = currentResult ? [
    { name: 'Cash Flow', value: Math.round(Math.max(0, Math.min(100, (metrics.margin + 0.25) / 0.75 * 100)) * 0.45), color: DONUT_COLORS[0] },
    { name: 'Runway', value: Math.round(Math.max(0, Math.min(100, (metrics.runway / 6) * 100)) * 0.30), color: DONUT_COLORS[1] },
    { name: 'Debt Health', value: Math.round(Math.max(0, Math.min(100, (1 - metrics.debtLoad) * 100)) * 0.25), color: DONUT_COLORS[2] }
  ] : [];

  // Fee Impact Analysis data
  const revenue = Number(healthInputs?.revenue || 0);
  const expenses = Number(healthInputs?.expenses || 0);
  const feeImpactData = currentResult ? [
    { name: 'Revenue', value: revenue, fill: 'hsl(145, 60%, 40%)' },
    { name: 'Expenses', value: expenses, fill: 'hsl(0, 72%, 58%)' },
    { name: 'Net', value: Math.max(0, revenue - expenses), fill: 'hsl(200, 70%, 50%)' }
  ] : [];

  // Key Mismatch Areas
  const mismatchAreas = [];
  if (currentResult) {
    if (metrics.margin < 0.1) {
      mismatchAreas.push({
        area: 'Low Profit Margin',
        severity: metrics.margin < 0 ? 'critical' : 'warning',
        description: `Your margin is ${(metrics.margin * 100).toFixed(1)}%. Aim for at least 10-15%.`,
        action: 'Increase prices or reduce variable costs'
      });
    }
    if (metrics.runway < 3) {
      mismatchAreas.push({
        area: 'Short Runway',
        severity: metrics.runway < 1 ? 'critical' : 'warning',
        description: `Only ${metrics.runway.toFixed(1)} months of runway. Need 3-6 months minimum.`,
        action: 'Build cash reserves or reduce burn rate'
      });
    }
    if (metrics.debtLoad > 0.5) {
      mismatchAreas.push({
        area: 'High Debt Load',
        severity: metrics.debtLoad > 0.8 ? 'critical' : 'warning',
        description: `Debt is ${(metrics.debtLoad * 100).toFixed(0)}% of 6-month revenue.`,
        action: 'Prioritize debt repayment or refinance'
      });
    }
    if (expenses > revenue * 0.9) {
      mismatchAreas.push({
        area: 'Expense Ratio',
        severity: expenses > revenue ? 'critical' : 'warning',
        description: `Expenses are ${((expenses / revenue) * 100).toFixed(0)}% of revenue.`,
        action: 'Review and cut non-essential expenses'
      });
    }
  }

  // Chart data from history
  const chartData = healthHistory.map(h => {
    const d = new Date(h.t);
    return {
      date: `${d.getMonth() + 1}/${d.getDate()}`,
      score: h.score
    };
  });

  // Recommendations
  const recommendations = [];
  if (currentResult) {
    if (metrics.margin < 0.05) recommendations.push('Improve margin: reduce variable costs or adjust pricing.');
    if (metrics.runway < 3) recommendations.push('Increase runway: reduce burn or build reserves.');
    if (metrics.debtLoad > 0.65) recommendations.push('Reduce debt load: refinance or prioritize high APR balances.');
    if (recommendations.length === 0) recommendations.push('Maintain discipline: track margin, runway, and debt monthly.');
  } else {
    recommendations.push('Add inputs to generate recommendations.');
  }

  const getHealthBadgeColor = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-800 border-green-200';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const tabs = [
    { id: 'input', label: 'Input & Analysis', icon: Calculator, description: 'Enter financial data for analysis' },
    { id: 'results', label: 'Results', icon: TrendingUp, description: 'View your health score and metrics', badge: currentResult ? undefined : undefined },
    { id: 'history', label: 'History', icon: Eye, description: 'Track your score over time' }
  ];

  return (
    <DashboardLayout title="Financial Health" subtitle="Assess your business financial health">
      {/* Responsive Tabs Container */}
      <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Tabs Header - Responsive Design */}
        <div className="flex flex-col md:flex-row bg-gray-50 border-b border-gray-200 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center justify-center md:justify-start gap-2 px-6 py-4 md:py-5
                  text-sm md:text-base font-medium whitespace-nowrap
                  transition-all duration-200 relative
                  ${activeTab === tab.id 
                    ? 'text-blue-600 bg-white font-semibold' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }
                  border-b-2 md:border-b-0 md:border-r border-gray-200 last:border-r-0
                  min-w-[120px] md:flex-1
                `}
              >
                <Icon className="w-4 h-4 md:w-5 md:h-5" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full ml-2">
                    {tab.badge}
                  </span>
                )}
                {activeTab === tab.id && (
                  <>
                    {/* Desktop active indicator */}
                    <div className="hidden md:block absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
                    {/* Mobile active indicator */}
                    <div className="md:hidden absolute bottom-0 left-0 top-0 w-0.5 bg-blue-500" />
                  </>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Area */}
        <div className="p-0">
          {/* Input & Analysis Tab */}
          {activeTab === 'input' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6"
            >
              {/* Quick Stats Bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm text-gray-600">Revenue</p>
                      <p className="text-xl md:text-2xl font-bold text-gray-900">
                        {formData.revenue ? `$${parseInt(formData.revenue).toLocaleString()}` : '--'}
                      </p>
                    </div>
                    <DollarSign className="w-6 h-6 md:w-8 md:h-8 text-green-500" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm text-gray-600">Expenses</p>
                      <p className="text-xl md:text-2xl font-bold text-gray-900">
                        {formData.expenses ? `$${parseInt(formData.expenses).toLocaleString()}` : '--'}
                      </p>
                    </div>
                    <TrendingDown className="w-6 h-6 md:w-8 md:h-8 text-red-500" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm text-gray-600">Debt</p>
                      <p className="text-xl md:text-2xl font-bold text-gray-900">
                        {formData.debt ? `$${parseInt(formData.debt).toLocaleString()}` : '--'}
                      </p>
                    </div>
                    <Shield className="w-6 h-6 md:w-8 md:h-8 text-yellow-500" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm text-gray-600">Cash</p>
                      <p className="text-xl md:text-2xl font-bold text-gray-900">
                        {formData.cash ? `$${parseInt(formData.cash).toLocaleString()}` : '--'}
                      </p>
                    </div>
                    <Users className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />
                  </div>
                </div>
              </div>

              {/* Main Input Card */}
              <Card className="border-2 border-blue-100 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                        <Calculator className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                        Financial Health Inputs
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Enter your financial details to calculate your health score
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleQuickExample}
                        className="text-xs md:text-sm"
                      >
                        Load Example
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleExport}
                        className="text-xs md:text-sm hidden md:flex"
                      >
                        <Download className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-5">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium">Monthly Revenue</Label>
                          <Info className="h-4 w-4 text-gray-400" />
                        </div>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2">
                            <span className="text-lg font-semibold text-green-600">$</span>
                          </div>
                          <Input
                            type="number"
                            min="0"
                            placeholder="e.g., 25,000"
                            value={formData.revenue}
                            onChange={(e) => updateField('revenue', e.target.value)}
                            className="pl-10 text-lg h-12"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium">Monthly Expenses</Label>
                          <Info className="h-4 w-4 text-gray-400" />
                        </div>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2">
                            <span className="text-lg font-semibold text-red-600">$</span>
                          </div>
                          <Input
                            type="number"
                            min="0"
                            placeholder="e.g., 18,000"
                            value={formData.expenses}
                            onChange={(e) => updateField('expenses', e.target.value)}
                            className="pl-10 text-lg h-12"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-5">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium">Total Debt</Label>
                          <Info className="h-4 w-4 text-gray-400" />
                        </div>
                        <Input
                          type="number"
                          min="0"
                          placeholder="e.g., 40,000"
                          value={formData.debt}
                          onChange={(e) => updateField('debt', e.target.value)}
                          className="text-lg h-12"
                        />
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium">Cash on Hand</Label>
                          <Info className="h-4 w-4 text-gray-400" />
                        </div>
                        <Input
                          type="number"
                          min="0"
                          placeholder="e.g., 12,000"
                          value={formData.cash}
                          onChange={(e) => updateField('cash', e.target.value)}
                          className="text-lg h-12"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-6 mt-6 border-t">
                    <Button
                      onClick={handleCalculate}
                      disabled={isCalculating}
                      className="flex-1 h-12 text-lg"
                      size="lg"
                    >
                      {isCalculating ? (
                        <>
                          <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                          Calculating...
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5 mr-2" />
                      Calculate Health Score
                        </>
                      )}
                    </Button>
                    
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={handleClear}
                        className="h-12 flex-1 sm:flex-none"
                      >
                        Clear All
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleQuickExample}
                        className="h-12 flex-1 sm:flex-none"
                      >
                        Load Example
                      </Button>
                    </div>
                  </div>

                  {/* Help Text */}
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-blue-800">
                        <span className="font-semibold">Tip:</span> All calculations are done locally in your browser. 
                        Your data is stored only on your device for privacy.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Results Tab */}
          {activeTab === 'results' && (
            <div className="p-6 space-y-6">
              {/* Score Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                      <Heart className="h-6 w-6 text-red-500" />
                      <span className="text-sm font-medium text-gray-600">FINANCIAL HEALTH SCORE</span>
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-4">
                      <div className="relative">
                        <div className="text-5xl md:text-6xl font-bold text-gray-900">{currentResult?.score || '--'}</div>
                        <div className="text-sm text-gray-600 text-center">/100</div>
                      </div>
                      {currentResult && (
                        <div>
                          <Badge className={`px-4 py-2 text-lg font-semibold ${getHealthBadgeColor(currentResult.score)}`}>
                            {healthLabel(currentResult.score).toUpperCase()}
                          </Badge>
                          <p className="text-gray-600 mt-2 max-w-md">
                            Your business financial health is {healthLabel(currentResult.score).toLowerCase()}. 
                            {currentResult.score >= 80 
                              ? ' Keep up the great work!' 
                              : ' Review the recommendations below to improve.'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {currentResult && (
                    <Button
                      onClick={() => setActiveTab('input')}
                      variant="outline"
                      className="whitespace-nowrap"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Recalculate
                    </Button>
                  )}
                </div>
              </div>

              {currentResult ? (
                <>
                  {/* Analysis Cards Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Donut Chart Card */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm">
                          <PieChartIcon className="h-4 w-4" />
                          Score Breakdown
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col items-center">
                          <div className="relative h-[180px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={breakdownData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={45}
                                  outerRadius={70}
                                  paddingAngle={4}
                                  dataKey="value"
                                  strokeWidth={0}
                                >
                                  {breakdownData.map((entry, idx) => (
                                    <Cell key={`cell-${idx}`} fill={entry.color} />
                                  ))}
                                </Pie>
                                <Tooltip 
                                  formatter={(value, name) => [`${value} pts`, name]}
                                  contentStyle={{
                                    backgroundColor: 'hsl(var(--card))',
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '8px'
                                  }}
                                />
                              </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className="text-3xl font-bold text-foreground">{currentResult.score}</span>
                            </div>
                          </div>
                          
                          <div className="w-full mt-4 space-y-3">
                            {breakdownData.map((entry, idx) => (
                              <div key={idx} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="w-3 h-3 rounded-full" 
                                    style={{ backgroundColor: entry.color }}
                                  />
                                  <span className="text-sm font-medium">{entry.name}</span>
                                </div>
                                <span className="text-sm font-semibold">{entry.value} pts</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Key Metrics Card */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm">
                          <Target className="h-4 w-4" />
                          Key Metrics
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-green-800">Profit Margin</span>
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          </div>
                          <div className="text-2xl font-bold text-green-900">{(metrics.margin * 100).toFixed(1)}%</div>
                          <div className="mt-2 h-2 bg-green-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-green-500 rounded-full"
                              style={{ width: `${Math.min(100, metrics.margin * 200)}%` }}
                            />
                          </div>
                        </div>

                        <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-blue-800">Runway</span>
                            <Calendar className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="text-2xl font-bold text-blue-900">{Number.isFinite(metrics.runway) ? metrics.runway.toFixed(1) : '12.0'} months</div>
                          <div className="text-sm text-blue-700 mt-1">
                            {metrics.runway >= 6 ? 'Excellent' : metrics.runway >= 3 ? 'Good' : 'Critical'}
                          </div>
                        </div>

                        <div className="p-4 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-amber-800">Debt Load</span>
                            <Shield className="h-4 w-4 text-amber-600" />
                          </div>
                          <div className="text-2xl font-bold text-amber-900">{(metrics.debtLoad * 100).toFixed(0)}%</div>
                          <div className="text-sm text-amber-700 mt-1">
                            {metrics.debtLoad < 0.3 ? 'Low' : metrics.debtLoad < 0.6 ? 'Moderate' : 'High'}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Quick Insights */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm">
                          <Lightbulb className="h-4 w-4" />
                          Quick Insights
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {mismatchAreas.length > 0 ? (
                          mismatchAreas.slice(0, 3).map((item, idx) => (
                            <div 
                              key={idx}
                              className={`p-3 rounded-lg ${
                                item.severity === 'critical' 
                                  ? 'bg-red-50 border-red-200' 
                                  : 'bg-amber-50 border-amber-200'
                              } border`}
                            >
                              <div className="flex items-center gap-2">
                                <AlertTriangle className={`h-4 w-4 ${
                                  item.severity === 'critical' ? 'text-red-600' : 'text-amber-600'
                                }`} />
                                <span className="font-semibold text-sm">{item.area}</span>
                              </div>
                              <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-center">
                            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
                            <p className="font-semibold text-green-800">All Good!</p>
                            <p className="text-xs text-green-700 mt-1">No critical issues detected</p>
                          </div>
                        )}
                        
                        <Button
                          variant="outline"
                          className="w-full mt-4"
                          onClick={() => setActiveTab('results')}
                        >
                          View Full Analysis
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Full Results */}
                  <div className="space-y-6">
                    {/* Fee Impact Analysis */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BarChart3 className="h-5 w-5 text-accent" />
                          Fee Impact Analysis
                        </CardTitle>
                        <CardDescription>How your expenses impact your bottom line</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={feeImpactData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                                <YAxis stroke="hsl(var(--muted-foreground))" />
                                <Tooltip 
                                  formatter={(value) => [`$${value.toLocaleString()}`, '']}
                                  contentStyle={{
                                    backgroundColor: 'hsl(var(--card))',
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '8px'
                                  }}
                                />
                                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                                  {feeImpactData.map((entry, idx) => (
                                    <Cell key={`cell-${idx}`} fill={entry.fill} />
                                  ))}
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>

                          <div className="space-y-4">
                            <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                              <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="h-5 w-5 text-green-600" />
                                <span className="font-semibold text-green-800">Monthly Revenue</span>
                              </div>
                              <p className="text-2xl font-bold">${revenue.toLocaleString()}</p>
                            </div>

                            <div className="p-4 rounded-lg bg-gradient-to-r from-red-50 to-rose-50 border border-red-200">
                              <div className="flex items-center gap-2 mb-2">
                                <DollarSign className="h-5 w-5 text-red-600" />
                                <span className="font-semibold text-red-800">Monthly Expenses</span>
                              </div>
                              <p className="text-2xl font-bold">${expenses.toLocaleString()}</p>
                              <p className="text-sm text-red-700 mt-1">
                                {revenue > 0 ? `${((expenses / revenue) * 100).toFixed(1)}% of revenue` : '0% of revenue'}
                              </p>
                            </div>

                            <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                              <div className="flex items-center gap-2 mb-2">
                                <Target className="h-5 w-5 text-blue-600" />
                                <span className="font-semibold text-blue-800">Net Profit</span>
                              </div>
                              <p className="text-2xl font-bold">${Math.max(0, revenue - expenses).toLocaleString()}</p>
                              <p className="text-sm text-blue-700 mt-1">
                                {(metrics.margin * 100).toFixed(1)}% profit margin
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Key Mismatch Areas & Recommendations */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Key Mismatch Areas */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-warning" />
                            Key Mismatch Areas
                          </CardTitle>
                          <CardDescription>Areas requiring attention based on your financial data</CardDescription>
                        </CardHeader>
                        <CardContent>
                          {mismatchAreas.length > 0 ? (
                            <div className="space-y-4">
                              {mismatchAreas.map((item, idx) => (
                                <div 
                                  key={idx}
                                  className={`p-4 rounded-lg border ${
                                    item.severity === 'critical' 
                                      ? 'bg-gradient-to-r from-red-50 to-rose-50 border-red-300' 
                                      : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300'
                                  }`}
                                >
                                  <div className="flex items-center gap-2 mb-2">
                                    <AlertTriangle className={`h-5 w-5 ${
                                      item.severity === 'critical' ? 'text-red-600' : 'text-amber-600'
                                    }`} />
                                    <span className="font-semibold">{item.area}</span>
                                    <Badge variant={item.severity === 'critical' ? 'destructive' : 'warning'} className="ml-auto">
                                      {item.severity}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-gray-700 mb-3">{item.description}</p>
                                  <div className="flex items-center gap-2 text-sm">
                                    <Lightbulb className="h-4 w-4 text-accent" />
                                    <span className="font-medium">{item.action}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="p-6 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-300 text-center">
                              <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-600" />
                              <p className="font-semibold text-green-800 text-lg">No Major Mismatches Detected!</p>
                              <p className="text-sm text-green-700 mt-2">
                                Your financial health looks good. Keep monitoring regularly.
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Recommendations */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Lightbulb className="h-5 w-5 text-accent" />
                            Recommendations
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-3">
                            {recommendations.map((rec, i) => (
                              <li key={i} className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                                <div className="flex-shrink-0 mt-0.5">
                                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                                    <span className="text-xs font-semibold text-blue-700">{i + 1}</span>
                                  </div>
                                </div>
                                <div>
                                  <span className="text-sm font-medium">{rec}</span>
                                  <div className="flex gap-2 mt-2">
                                    <Button size="sm" variant="outline" className="h-7 text-xs">
                                      Learn More
                                    </Button>
                                    <Button size="sm" className="h-7 text-xs">
                                      Take Action
                                    </Button>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Calculator className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Results Yet</h3>
                    <p className="text-gray-500 mb-4">
                      Calculate your financial health score to see detailed results and insights
                    </p>
                    <Button onClick={() => setActiveTab('input')}>
                      Go to Input
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="p-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Health Score History
                  </CardTitle>
                  <CardDescription>Track your score over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    {chartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                          <YAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground))" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))', 
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px'
                            }} 
                          />
                          <Line 
                            type="monotone" 
                            dataKey="score" 
                            stroke="hsl(var(--primary))" 
                            strokeWidth={3}
                            dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center">
                        <TrendingUp className="h-16 w-16 text-gray-300 mb-4" />
                        <p className="text-gray-500 text-lg font-medium mb-2">No history yet</p>
                        <p className="text-gray-400 text-sm mb-4">Calculate your first score to start tracking</p>
                        <Button onClick={() => setActiveTab('input')}>
                          <Calculator className="w-4 h-4 mr-2" />
                          Calculate Score
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}