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
  Lightbulb
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

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCalculate = () => {
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

    updateHealthInputs(inputs);
    const result = computeHealthScore(inputs);
    addHealthHistory(result.score);
    toast.success(`Score calculated: ${result.score} (${healthLabel(result.score)})`);
  };

  const handleClear = () => {
    setFormData({ revenue: '', expenses: '', debt: '', cash: '' });
    clearHealthData();
    toast.info('Health data cleared');
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

  return (
    <DashboardLayout title="Financial Health" subtitle="Assess your business financial health">
      <div className="space-y-6">
        {/* Top Row - Inputs and Donut Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inputs Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Health Check Inputs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Monthly Revenue ($)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      min="0"
                      placeholder="e.g., 25000"
                      value={formData.revenue}
                      onChange={(e) => updateField('revenue', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Monthly Expenses ($)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      min="0"
                      placeholder="e.g., 18000"
                      value={formData.expenses}
                      onChange={(e) => updateField('expenses', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Total Debt ($)</Label>
                    <Input
                      type="number"
                      min="0"
                      placeholder="e.g., 40000"
                      value={formData.debt}
                      onChange={(e) => updateField('debt', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Cash on Hand ($)</Label>
                    <Input
                      type="number"
                      min="0"
                      placeholder="e.g., 12000"
                      value={formData.cash}
                      onChange={(e) => updateField('cash', e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button onClick={handleCalculate}>
                    Calculate Score
                  </Button>
                  <Button variant="outline" onClick={handleClear}>
                    Clear
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground">
                  Your score is computed locally in your browser and stored in localStorage.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Donut Chart Breakdown Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5 text-primary" />
                  Financial Health Breakdown
                </CardTitle>
                <CardDescription>Score composition by category</CardDescription>
              </CardHeader>
              <CardContent>
                {currentResult ? (
                  <div className="flex flex-col items-center">
                    <div className="relative h-[200px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={breakdownData}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={85}
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
                      {/* Center Score */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-foreground">{currentResult.score}</span>
                        <span className="text-xs text-muted-foreground">{healthLabel(currentResult.score)}</span>
                      </div>
                    </div>
                    
                    {/* Legend */}
                    <div className="flex flex-wrap justify-center gap-4 mt-4">
                      {breakdownData.map((entry) => (
                        <div key={entry.name} className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: entry.color }}
                          />
                          <span className="text-sm text-muted-foreground">
                            {entry.name}: {entry.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Metric Details */}
                    <div className="w-full mt-6 space-y-2 p-4 rounded-lg bg-muted/50">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Cash Flow Margin</span>
                        <span className="font-semibold">{(metrics.margin * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Runway</span>
                        <span className="font-semibold">{Number.isFinite(metrics.runway) ? metrics.runway.toFixed(1) : '12.0'} months</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Debt Load</span>
                        <span className="font-semibold">{(metrics.debtLoad * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-[280px] flex items-center justify-center">
                    <div className="text-center">
                      <PieChartIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                      <p className="font-semibold">No data yet</p>
                      <p className="text-sm text-muted-foreground">Enter your numbers and click &quot;Calculate Score&quot;</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Fee Impact Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-accent" />
                Fee Impact Analysis
              </CardTitle>
              <CardDescription>How your expenses impact your bottom line</CardDescription>
            </CardHeader>
            <CardContent>
              {currentResult ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Bar Chart */}
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

                  {/* Impact Stats */}
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-5 w-5 text-success" />
                        <span className="font-semibold text-success">Monthly Revenue</span>
                      </div>
                      <p className="text-2xl font-bold">${revenue.toLocaleString()}</p>
                    </div>

                    <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-5 w-5 text-destructive" />
                        <span className="font-semibold text-destructive">Monthly Expenses</span>
                      </div>
                      <p className="text-2xl font-bold">${expenses.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {revenue > 0 ? `${((expenses / revenue) * 100).toFixed(1)}% of revenue` : '0% of revenue'}
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-5 w-5 text-primary" />
                        <span className="font-semibold text-primary">Net Profit</span>
                      </div>
                      <p className="text-2xl font-bold">${Math.max(0, revenue - expenses).toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {(metrics.margin * 100).toFixed(1)}% profit margin
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-[200px] flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
                    <p className="text-muted-foreground">Calculate your score to see fee impact analysis</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Key Mismatch Areas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Key Mismatch Areas
              </CardTitle>
              <CardDescription>Areas requiring attention based on your financial data</CardDescription>
            </CardHeader>
            <CardContent>
              {currentResult ? (
                mismatchAreas.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mismatchAreas.map((item, idx) => (
                      <div 
                        key={idx}
                        className={`p-4 rounded-lg border ${
                          item.severity === 'critical' 
                            ? 'bg-destructive/10 border-destructive/30' 
                            : 'bg-warning/10 border-warning/30'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className={`h-5 w-5 ${
                            item.severity === 'critical' ? 'text-destructive' : 'text-warning'
                          }`} />
                          <span className="font-semibold">{item.area}</span>
                          <Badge variant={item.severity === 'critical' ? 'destructive' : 'warning'} className="ml-auto">
                            {item.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                        <div className="flex items-center gap-2 text-sm">
                          <Lightbulb className="h-4 w-4 text-accent" />
                          <span className="text-foreground font-medium">{item.action}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 rounded-lg bg-success/10 border border-success/20 text-center">
                    <CheckCircle className="h-12 w-12 mx-auto mb-3 text-success" />
                    <p className="font-semibold text-success text-lg">No Major Mismatches Detected!</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Your financial health looks good. Keep monitoring regularly.
                    </p>
                  </div>
                )
              ) : (
                <div className="h-[150px] flex items-center justify-center">
                  <div className="text-center">
                    <AlertTriangle className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
                    <p className="text-muted-foreground">Calculate your score to identify mismatch areas</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-accent" />
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* History Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Health Score History
              </CardTitle>
              <CardDescription>Track your score over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
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
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p>No history yet. Calculate your first score!</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}