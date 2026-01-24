import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Heart,
  Building2,
  Compass,
  BookOpen,
  CreditCard,
  AlertCircle,
  Bell,
  Zap,
  TrendingUp,
  Target,
  Users,
  BarChart3,
  Star,
  Clock,
  CheckCircle,
  HelpCircle,
  ChevronRight,
} from "lucide-react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";

export default function Tools() {
  const tools = [
    {
      icon: Heart,
      title: "Financial Health Check",
      description:
        "Assess your business financial health with detailed scoring and insights",
      link: "/health",
      color: "text-[#DC2626]",
      bgColor: "bg-red-50",
      iconBgColor: "bg-gradient-to-r from-red-50 to-red-100",
      tag: "Most Popular",
      features: ["Health Score", "Risk Analysis", "Recommendations"],
      time: "5 min",
      rating: 4.8,
    },
    {
      icon: Building2,
      title: "Product Matcher",
      description: "Find perfect banking products tailored to your business needs",
      link: "/nearby-banks",
      color: "text-[#1B4332]",
      bgColor: "bg-[#1B4332]/5",
      iconBgColor: "bg-gradient-to-r from-[#1B4332]/10 to-[#52796F]/10",
      tag: "Smart Match",
      features: ["Banking Products", "Fee Comparison", "Best Fit"],
      time: "3 min",
      rating: 4.6,
    },
    {
      icon: Compass,
      title: "Resource Finder",
      description: "Discover government programs and financial assistance",
      link: "/finder",
      color: "text-[#52796F]",
      bgColor: "bg-[#52796F]/5",
      iconBgColor: "bg-gradient-to-r from-[#52796F]/10 to-[#84A98C]/10",
      tag: "Free Resources",
      features: ["Grants", "Loans", "Tax Credits"],
      time: "7 min",
      rating: 4.9,
    },
    {
      icon: BookOpen,
      title: "Learning Tracker",
      description:
        "Track your financial education journey with personalized lessons",
      link: "/learning",
      color: "text-[#8B5CF6]",
      bgColor: "bg-purple-50",
      iconBgColor: "bg-gradient-to-r from-purple-50 to-purple-100",
      tag: "Learning Path",
      features: ["Courses", "Progress", "Certificates"],
      time: "10 min",
      rating: 4.7,
    },
  ];

  const stats = [
    {
      label: "Tools Available",
      value: "4",
      icon: Zap,
      color: "text-[#1B4332]",
      bgColor: "bg-[#1B4332]/10",
    },
    {
      label: "Active Users",
      value: "",
      icon: Users,
      color: "text-[#52796F]",
      bgColor: "bg-[#52796F]/10",
    },
    {
      label: "Success Rate",
      value: "",
      icon: TrendingUp,
      color: "text-[#DC2626]",
      bgColor: "bg-red-500/10",
    },
    {
      label: "Avg. Time Saved",
      value: "",
      icon: Clock,
      color: "text-[#F59E0B]",
      bgColor: "bg-yellow-500/10",
    },
  ];

  // ✅ demo removed (production-ready: no fake activity rendered)
  // const recentActivity = [...]

  const budgetFeatures = [
    {
      title: "Fee Tracking",
      description: "Monitor actual vs budgeted banking costs",
      icon: BarChart3,
      color: "text-[#1B4332]",
      bgColor: "bg-gradient-to-br from-[#1B4332]/5 to-white",
      borderColor: "border-[#1B4332]/20",
      iconBg: "bg-[#1B4332]/10",
    },
    {
      title: "Smart Alerts",
      description: "Get notified when approaching budget limits",
      icon: Bell,
      color: "text-[#52796F]",
      bgColor: "bg-gradient-to-br from-[#52796F]/5 to-white",
      borderColor: "border-[#52796F]/20",
      iconBg: "bg-[#52796F]/10",
    },
    {
      title: "Performance Insights",
      description: "Detailed analytics and improvement tips",
      icon: TrendingUp,
      color: "text-[#8B5CF6]",
      bgColor: "bg-gradient-to-br from-[#8B5CF6]/5 to-white",
      borderColor: "border-[#8B5CF6]/20",
      iconBg: "bg-[#8B5CF6]/10",
    },
  ];

  return (
    <DashboardLayout
      title="Tools Hub"
      subtitle="Powerful tools to grow and manage your business"
    >
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

        .tool-card {
          transition: all 0.3s ease;
          border: 1px solid rgba(82, 121, 111, 0.1);
          background: linear-gradient(135deg, rgba(27, 67, 50, 0.02) 0%, rgba(82, 121, 111, 0.02) 100%);
        }

        .tool-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(27, 67, 50, 0.15);
          border-color: #52796F;
        }

        .highlight-border {
          border-left: 4px solid #1B4332;
        }

        .hover-lift:hover {
          transform: translateY(-2px);
          transition: transform 0.2s ease;
        }

        .budget-gradient {
          background: linear-gradient(135deg, rgba(27, 67, 50, 0.05) 0%, rgba(82, 121, 111, 0.05) 100%);
        }

        .resource-gradient {
          background: linear-gradient(135deg, rgba(27, 67, 50, 0.1) 0%, rgba(82, 121, 111, 0.1) 100%);
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Hero Section */}
        <div className="hero-gradient rounded-2xl p-6 border border-[#52796F]/30 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-3">
                Welcome to Your Financial Toolkit
              </h1>
              <p className="text-white/90 text-sm md:text-base max-w-2xl">
                Access powerful tools designed to simplify financial management,
                reduce costs, and help your business thrive. Everything you need in
                one place.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <Link to="/how" className="w-full sm:w-auto">
                <Button
                  type="button"
                  className="w-full sm:w-auto btn-secondary bg-white/10 border-white/30 text-white hover:bg-white/20 gap-2"
                >
                  <HelpCircle className="w-4 h-4" />
                  How it Works
                </Button>
              </Link>

              <Link to="/quick" className="w-full sm:w-auto">
                <Button
                  type="button"
                  className="w-full sm:w-auto bg-white text-[#1B4332] hover:bg-gray-100 gap-2"
                >
                  <Zap className="w-4 h-4" />
                  Quick Start Guide
                </Button>
              </Link>
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
                <div className="stats-card rounded-xl p-4 hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-[#1B4332]">
                        {stat.value}
                      </p>
                      <p className="text-sm text-[#52796F] mt-1">{stat.label}</p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Main Tools Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-[#1B4332]">Featured Tools</h2>
              <p className="text-[#52796F] text-sm">Select a tool to get started</p>
            </div>

            <Badge className="tag-badge gap-2">
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
                    <div className="tool-card h-full rounded-xl p-6 cursor-pointer overflow-hidden highlight-border hover:shadow-xl transition-all group">
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className={`p-3 rounded-xl ${tool.iconBgColor} group-hover:scale-110 transition-transform duration-300`}
                        >
                          <Icon className={`w-6 h-6 ${tool.color}`} />
                        </div>

                        <div className="flex flex-col items-end gap-1">
                          {tool.tag && (
                            <Badge className="tag-badge text-xs">{tool.tag}</Badge>
                          )}

                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            <span className="text-xs font-medium text-[#1B4332]">
                              {tool.rating}
                            </span>
                          </div>
                        </div>
                      </div>

                      <h3 className="font-bold text-lg text-[#1B4332] mb-2 group-hover:text-[#52796F] transition-colors">
                        {tool.title}
                      </h3>
                      <p className="text-sm text-[#52796F] mb-4">
                        {tool.description}
                      </p>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3 text-[#52796F]" />
                            <span className="text-xs text-[#52796F]">
                              Takes {tool.time}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            {tool.features.slice(0, 2).map((feature, idx) => (
                              <Badge key={idx} className="tag-badge text-xs">
                                {feature}
                              </Badge>
                            ))}
                            {tool.features.length > 2 && (
                              <Badge className="tag-badge text-xs">
                                +{tool.features.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-[#52796F]/10">
                          <span className="text-xs text-[#52796F]">Click to start</span>
                          <div className="flex items-center gap-1 text-[#1B4332] group-hover:gap-2 group-hover:text-[#52796F] transition-all">
                            <span className="text-sm font-medium">Open Tool</span>
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </div>
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
            <div className="budget-gradient h-full rounded-xl p-6 border-2 border-[#52796F]/10 hover:border-[#52796F]/30 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-full bg-gradient-to-r from-[#1B4332]/10 to-[#52796F]/10">
                  <CreditCard className="h-6 w-6 text-[#1B4332]" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#1B4332]">
                    Budget Management & Tracking
                  </h3>
                  <p className="text-sm text-[#52796F]">
                    Track banking fees and monitor budget performance
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {budgetFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-lg ${feature.bgColor} border ${feature.borderColor}`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`p-1 rounded-md ${feature.iconBg}`}>
                          <Icon className={`w-4 h-4 ${feature.color}`} />
                        </div>
                        <h4 className={`font-semibold text-sm ${feature.color}`}>
                          {feature.title}
                        </h4>
                      </div>
                      <p className="text-xs text-[#52796F]">
                        {feature.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              <Link to="/budget">
                <Button className="w-full btn-primary h-12 text-lg">
                  Open Budget Dashboard
                </Button>
              </Link>
            </div>
          </div>

          {/* Recent Activity Card */}
          <div className="budget-gradient rounded-xl p-6 border border-[#52796F]/10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-[#1B4332] flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Recent Activity
                </h3>
                <p className="text-sm text-[#52796F]">What others are achieving</p>
              </div>
              <Badge className="category-badge">Live</Badge>
            </div>

            {/* ✅ demo content removed, structure preserved */}
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-[#F8F5F0] hover:bg-[#1B4332]/5 transition-colors">
                <div className="flex items-start justify-between mb-1">
                  <span className="font-medium text-sm text-[#1B4332]">
                    No recent activity
                  </span>
                  <span className="text-xs text-[#52796F]">—</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#52796F]">
                    Activity will appear here when users run tools.
                  </span>
                  <Badge className="tag-badge text-xs">Live</Badge>
                </div>
              </div>

              <div className="pt-4 border-t border-[#52796F]/10">
                <Button className="btn-secondary w-full gap-2">
                  <Users className="w-4 h-4" />
                  View Community Success
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Value Proposition */}
        <div className="resource-gradient rounded-2xl p-8 text-center border-2 border-[#52796F]/20">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-[#1B4332]" />
          <h3 className="text-xl font-bold mb-2 text-[#1B4332]">
            Stop Financial Leaks
          </h3>
          <p className="text-[#52796F] mb-6 max-w-lg mx-auto">
            We help businesses identify mismatches, reduce unnecessary banking fees,
            and connect with resources to grow sustainably.
          </p>

          <div className="inline-flex items-center justify-center gap-6 mb-6 flex-wrap">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#10B981]" />
              <span className="text-sm font-medium text-[#1B4332]">
                Banking fee analysis
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#10B981]" />
              <span className="text-sm font-medium text-[#1B4332]">
                Financial health scoring
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#10B981]" />
              <span className="text-sm font-medium text-[#1B4332]">
                Local resource finder
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/health">
              <Button className="btn-primary">
                <Heart className="w-4 h-4 mr-2" />
                Check Your Financial Health
              </Button>
            </Link>
            <Link to="/finder">
              <Button className="btn-secondary">
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
