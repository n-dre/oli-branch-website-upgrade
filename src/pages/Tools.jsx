import React from 'react';
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';
import {
  Heart,
  Building2,
  Compass,
  BookOpen,
  CreditCard,
  AlertCircle,
  Bell,
  Zap,
  Shield,
  TrendingUp,
  Target,
  Users,
  BarChart3,
  Star,
  Clock,
  CheckCircle,
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

export default function Tools() {
  const tools = [
    {
      icon: Heart,
      title: 'Financial Health Check',
      description: 'Assess your business financial health with detailed scoring and insights',
      link: '/financial-health',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      tag: 'Most Popular',
      features: ['Health Score', 'Risk Analysis', 'Recommendations'],
      time: '5 min',
      rating: 4.8
    },
    {
      icon: Building2,
      title: 'Product Matcher',
      description: 'Find perfect banking products tailored to your business needs',
      link: '/report',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      tag: 'Smart Match',
      features: ['Banking Products', 'Fee Comparison', 'Best Fit'],
      time: '3 min',
      rating: 4.6
    },
    {
      icon: Compass,
      title: 'Resource Finder',
      description: 'Discover government programs and financial assistance',
      link: '/report',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      tag: 'Free Resources',
      features: ['Grants', 'Loans', 'Tax Credits'],
      time: '7 min',
      rating: 4.9
    },
    {
      icon: BookOpen,
      title: 'Learning Tracker',
      description: 'Track your financial education journey with personalized lessons',
      link: '/learning',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      tag: 'Learning Path',
      features: ['Courses', 'Progress', 'Certificates'],
      time: '10 min',
      rating: 4.7
    }
  ];

  const stats = [
    { label: 'Tools Available', value: '4', icon: Zap, color: 'text-blue-600' },
    { label: 'Active Users', value: '2.4k', icon: Users, color: 'text-green-600' },
    { label: 'Success Rate', value: '94%', icon: TrendingUp, color: 'text-purple-600' },
    { label: 'Avg. Time Saved', value: '3.5h', icon: Clock, color: 'text-orange-600' }
  ];

  const recentActivity = [
    { tool: 'Financial Health Check', user: 'Sarah Chen', time: '2 hours ago', result: 'Score: 82' },
    { tool: 'Product Matcher', user: 'Mike Rodriguez', time: '5 hours ago', result: '3 matches found' },
    { tool: 'Resource Finder', user: 'Alex Johnson', time: '1 day ago', result: 'Grant identified' }
  ];

  return (
    <DashboardLayout title="Business Tools Hub" subtitle="Powerful tools to grow and manage your business">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Welcome to Your Financial Toolkit
              </h1>
              <p className="text-gray-600 text-sm md:text-base max-w-2xl">
                Access powerful tools designed to simplify financial management, reduce costs, 
                and help your business thrive. Everything you need in one place.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="gap-2">
                <HelpCircle className="w-4 h-4" />
                How it Works
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 gap-2">
                <Zap className="w-4 h-4" />
                Quick Start Guide
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                      </div>
                      <div className={`p-3 rounded-full ${stat.color.replace('text', 'bg')} bg-opacity-10`}>
                        <Icon className={`w-5 h-5 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Main Tools Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Featured Tools</h2>
              <p className="text-gray-600 text-sm">Select a tool to get started</p>
            </div>
            <Badge variant="outline" className="gap-2">
              <Target className="w-3 h-3" />
              All tools are free
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {tools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <motion.div
                  key={tool.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                >
                  <Link to={tool.link}>
                    <Card className="h-full hover:shadow-lg hover:border-blue-200 transition-all duration-300 group cursor-pointer overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`p-3 rounded-xl ${tool.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                            <Icon className={`w-6 h-6 ${tool.color}`} />
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            {tool.tag && (
                              <Badge className="text-xs bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border-blue-200">
                                {tool.tag}
                              </Badge>
                            )}
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                              <span className="text-xs font-medium">{tool.rating}</span>
                            </div>
                          </div>
                        </div>

                        <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {tool.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                          {tool.description}
                        </p>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Clock className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-500">Takes {tool.time}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              {tool.features.slice(0, 2).map((feature, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                              {tool.features.length > 2 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{tool.features.length - 2} more
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <span className="text-xs text-gray-500">Click to start</span>
                            <div className="flex items-center gap-1 text-blue-600 group-hover:gap-2 transition-all">
                              <span className="text-sm font-medium">Open Tool</span>
                              <ArrowRight className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Budget Management Card */}
          <div className="lg:col-span-2">
            <Card className="h-full border-2 border-blue-100 hover:border-blue-200 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100">
                    <CreditCard className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-gray-900">Budget Management & Tracking</h3>
                    <p className="text-sm text-gray-600">Track banking fees and monitor budget performance</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-white border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1 rounded-md bg-blue-100">
                        <BarChart3 className="w-4 h-4 text-blue-600" />
                      </div>
                      <h4 className="font-semibold text-sm text-blue-800">Fee Tracking</h4>
                    </div>
                    <p className="text-xs text-gray-600">Monitor actual vs budgeted banking costs</p>
                  </div>
                  <div className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-white border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1 rounded-md bg-green-100">
                        <Bell className="w-4 h-4 text-green-600" />
                      </div>
                      <h4 className="font-semibold text-sm text-green-800">Smart Alerts</h4>
                    </div>
                    <p className="text-xs text-gray-600">Get notified when approaching budget limits</p>
                  </div>
                  <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-white border border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1 rounded-md bg-purple-100">
                        <TrendingUp className="w-4 h-4 text-purple-600" />
                      </div>
                      <h4 className="font-semibold text-sm text-purple-800">Performance Insights</h4>
                    </div>
                    <p className="text-xs text-gray-600">Detailed analytics and improvement tips</p>
                  </div>
                </div>

                <Link to="/budget">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 h-12 text-lg">
                    Open Budget Dashboard
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Recent Activity
              </CardTitle>
              <CardDescription>What others are achieving</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex items-start justify-between mb-1">
                      <span className="font-medium text-sm text-gray-900">{activity.tool}</span>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">{activity.user}</span>
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                        {activity.result}
                      </Badge>
                    </div>
                  </div>
                ))}
                <div className="pt-4 border-t border-gray-200">
                  <Button variant="outline" className="w-full gap-2">
                    <Users className="w-4 h-4" />
                    View Community Success
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Value Proposition */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 text-center border-2 border-blue-200">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-blue-600" />
          <h3 className="text-xl font-bold mb-2 text-gray-900">Stop Financial Leaks</h3>
          <p className="text-gray-700 mb-6 max-w-lg mx-auto">
            We help businesses identify mismatches, reduce unnecessary banking fees, and connect with resources to grow sustainably.
          </p>
          
          <div className="inline-flex items-center justify-center gap-6 mb-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Banking fee analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Financial health scoring</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Local resource finder</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/financial-health">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90">
                <Heart className="w-4 h-4 mr-2" />
                Check Your Financial Health
              </Button>
            </Link>
            <Link to="/report">
              <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                <Compass className="w-4 h-4 mr-2" />
                Find Local Resources
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}