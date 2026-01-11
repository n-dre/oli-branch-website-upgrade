import React from 'react';
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  DollarSign,
  TrendingUp,
  PiggyBank,
  Receipt,
  PieChart,
  BarChart3
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

export default function Budget() {
  const stats = [
    { label: 'Total Budget', value: '$0', icon: '\u2705', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
    { label: 'Total Spent', value: '$0', icon: '\ud83e\uddfe', bgColor: 'bg-red-100 dark:bg-red-900/30' },
    { label: 'Budget Utilization', value: '0.0%', icon: '\ud83d\udcc8', bgColor: 'bg-green-100 dark:bg-green-900/30' },
    { label: 'Potential Savings', value: '$0', icon: '\ud83d\udcb0', bgColor: 'bg-green-100 dark:bg-green-900/30', valueColor: 'text-success' }
  ];

  return (
    <DashboardLayout 
      title="Budget Dashboard" 
      subtitle="Oli-Branch"
    >
      <div className="space-y-6">
        {/* Back Button & Actions */}
        <div className="flex items-center justify-between">
          <Link to="/tools" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Tools
          </Link>
          <div className="flex items-center gap-3">
            <Select defaultValue="30">
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">Last 30 Days</SelectItem>
                <SelectItem value="60">Last 60 Days</SelectItem>
                <SelectItem value="90">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
            <Button><Plus className="h-4 w-4 mr-2" /> Add Budget</Button>
            <Button variant="outline"><Plus className="h-4 w-4 mr-2" /> Record Fee</Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-2xl font-bold ${stat.valueColor || 'text-foreground'}`}>
                    {stat.value}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${stat.bgColor}`}>
                    <span>{stat.icon}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analysis">Budget Analysis</TabsTrigger>
            <TabsTrigger value="trends">Fee Trends</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Budget vs Spending */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Budget vs Spending</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                      <BarChart3 className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="font-semibold">No Budget Data</p>
                    <p className="text-sm text-muted-foreground mb-4">Create budgets to see spending analysis</p>
                    <Button><Plus className="h-4 w-4 mr-2" /> Add Budget</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Fee Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Fee Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                      <PieChart className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="font-semibold">No Fee Data</p>
                    <p className="text-sm text-muted-foreground mb-4">Record fees to see distribution analysis</p>
                    <Button variant="outline"><Plus className="h-4 w-4 mr-2" /> Record Fee</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="mt-6">
            <Card>
              <CardContent className="py-12 text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-30" />
                <p className="text-muted-foreground">Add budgets to see detailed analysis</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="mt-6">
            <Card>
              <CardContent className="py-12 text-center">
                <Receipt className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-30" />
                <p className="text-muted-foreground">Record fees to see trend analysis</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="mt-6">
            <Card>
              <CardContent className="py-12 text-center">
                <PiggyBank className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-30" />
                <p className="text-muted-foreground">Categorize your expenses to see breakdown</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
