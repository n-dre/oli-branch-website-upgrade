import React from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Building2,
  Compass,
  BookOpen,
  CreditCard,
  AlertCircle,
  Bell
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';

export default function Tools() {
  const tools = [
    {
      icon: Heart,
      title: 'Financial Health Check',
      description: 'Assess your business financial health',
      link: '/financial-health',
      color: 'text-destructive'
    },
    {
      icon: Building2,
      title: 'Product Matcher',
      description: 'Find banking products for your needs',
      link: '/report',
      color: 'text-primary'
    },
    {
      icon: Compass,
      title: 'Resource Finder',
      description: 'Discover government programs',
      link: '/report',
      color: 'text-accent'
    },
    {
      icon: BookOpen,
      title: 'Learning Tracker',
      description: 'Track your financial education',
      link: '/learning',
      color: 'text-success'
    }
  ];

  return (
    <DashboardLayout title="Available Tools" subtitle="Tools to help manage your business finances">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Tool Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={tool.link}>
                <Card className="h-full text-center hover:shadow-elevated transition-shadow cursor-pointer group">
                  <CardContent className="pt-6">
                    <div className="w-14 h-14 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4 group-hover:bg-muted transition-colors">
                      <tool.icon className={`h-7 w-7 ${tool.color}`} />
                    </div>
                    <h4 className="font-semibold text-foreground text-sm mb-2">{tool.title}</h4>
                    <p className="text-xs text-muted-foreground">{tool.description}</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Budget Management Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="h-6 w-6 text-accent" />
              <h3 className="font-display text-lg font-bold text-foreground">Budget Management & Tracking</h3>
            </div>
            <p className="text-muted-foreground text-sm mb-5">
              Track banking fees and monitor budget performance.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <div className="p-4 rounded-lg bg-muted/50">
                <h4 className="font-semibold text-sm mb-1 text-purple-600 dark:text-purple-400">Fee Tracking</h4>
                <p className="text-xs text-muted-foreground">Monitor actual vs budgeted banking costs</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <h4 className="font-semibold text-sm mb-1 text-success">Smart Alerts</h4>
                <p className="text-xs text-muted-foreground">Get notified when approaching budget limits</p>
              </div>
            </div>

            <Link to="/budget">
              <Button className="w-full bg-gradient-to-r from-primary to-blue-500 hover:opacity-90">
                Open Budget Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
}
