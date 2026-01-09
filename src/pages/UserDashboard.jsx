import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import {
  DollarSign,
  FileText,
  ArrowRight,
  Sparkles,
  Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';
import UserDashboard from '../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useData } from '../context/DataContext';

const RISK_COLORS = {
  'High Risk': 'hsl(0, 72%, 58%)',
  'Medium Risk': 'hsl(38, 92%, 50%)',
  'Low Risk': 'hsl(145, 60%, 40%)'
};

export default function Dashboard() {
  const context = useData();
  
  const responses = context?.responses || [];
  const getChartData = context?.getChartData || (() => []);
  const healthInputs = context?.healthInputs || null;
  const computeHealthScore = context?.computeHealthScore || (() => ({ score: 0 }));
  const healthLabel = context?.healthLabel || (() => "Incomplete");

  const chartData = getChartData();
  const totalResponses = responses.length;
  
  const healthResult = healthInputs ? computeHealthScore(healthInputs) : null;
  const healthScoreDisplay = healthResult ? healthResult.score : '--';
  const healthSummary = healthResult 
    ? `${healthLabel(healthResult.score)} — based on your revenue, expenses, debt, and cash.`
    : 'Add your numbers to generate a real score.';

  const feeRevenueData = responses.slice(0, 5).map((r) => ({
    name: r.businessName ? (r.businessName.length > 12 ? r.businessName.slice(0, 12) + '...' : r.businessName) : 'Unnamed',
    fees: r.monthlyFees || 0,
    revenue: r.monthlyRevenue ? Math.round(r.monthlyRevenue / 100) : 0
  }));

  return (
    <UserDashboard title="Welcome Back!" subtitle="Here's your financial overview for today">
      <div className="space-y-4 sm:space-y-6 px-4 sm:px-0">
        {/* Top Section - Health Score & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Financial Health Score */}
          <div>
            <Card className="h-full">
              <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6 text-center">
                <h3 className="font-display text-base sm:text-lg font-bold text-foreground mb-4 sm:mb-6">
                  Financial Health Score
                </h3>
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 mx-auto mb-3 sm:mb-4">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                    <span className="text-3xl sm:text-4xl font-bold text-white">{healthScoreDisplay}</span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-5 px-2">
                  {healthSummary}
                </p>
                <Link to="/financial-health">
                  <Button variant="outline" className="mb-2 sm:mb-4 w-full sm:w-auto">
                    Run Health Check
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card className="h-full">
              <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
                <CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 px-4 sm:px-6 pb-4 sm:pb-6">
                <Link to="/financial-health" className="block">
                  <div className="flex items-center gap-3 p-3 sm:p-4 rounded-xl bg-forest text-white hover:opacity-90 transition-all cursor-pointer group">
                    <Shield className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
                    <span className="font-medium text-sm sm:text-base">Take Financial Health Check</span>
                    <ArrowRight className="h-4 w-4 ml-auto flex-shrink-0" />
                  </div>
                </Link>
                <Link to="/tools" className="block">
                  <div className="flex items-center gap-3 p-3 sm:p-4 rounded-xl bg-forest text-white hover:opacity-90 transition-all cursor-pointer group">
                    <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
                    <span className="font-medium text-sm sm:text-base">Find Banking Products</span>
                    <ArrowRight className="h-4 w-4 ml-auto flex-shrink-0" />
                  </div>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Section - Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Risk Distribution Chart */}
          <div>
            <Card className="h-full">
              <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-gold" /> 
                  Risk Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                <div className="h-[200px] sm:h-[250px]">
                  {totalResponses > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie 
                          data={chartData} 
                          cx="50%" 
                          cy="50%" 
                          innerRadius={40} 
                          outerRadius={70} 
                          dataKey="value"
                        >
                          {chartData.map((entry, idx) => (
                            <Cell key={`cell-${idx}`} fill={RISK_COLORS[entry.name]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                      <FileText className="h-10 w-10 sm:h-12 sm:w-12 mb-2 opacity-20" />
                      <p className="text-sm sm:text-base">No audit data available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Fees vs Revenue Chart */}
          <div>
            <Card className="h-full">
              <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-gold" /> 
                  Fees vs Revenue
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                <div className="h-[200px] sm:h-[250px]">
                  {feeRevenueData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={feeRevenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="name" 
                          tick={{ fontSize: 12 }}
                          angle={-45}
                          textAnchor="end"
                          height={60}
                        />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Bar dataKey="fees" fill="#ef4444" name="Fees ($)" />
                        <Bar dataKey="revenue" fill="#22c55e" name="Revenue (x100)" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <p className="text-sm sm:text-base text-center px-4">
                        Complete an audit to see data
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </UserDashboard>
  );
}
