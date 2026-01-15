import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import {
  BookOpen,
  Award,
  CheckCircle,
  Star,
  Clock,
  TrendingUp,
  Users,
  PlayCircle,
  ChevronRight,
  Bookmark,
  Target,
  Calendar,
  BarChart,
  Trophy,
  Flame,
  GraduationCap,
  User,
  Search,
  Filter,
  AlertCircle
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';

// Mock user data - in production, this would come from context/API
const useUserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with error handling
    try {
      // In production, fetch from localStorage or API
      const savedName = localStorage.getItem('userName') || 'Alex';
      const savedAvatar = localStorage.getItem('userAvatar') || '';
      const savedLevel = localStorage.getItem('userLevel') || 'Intermediate';
      
      setUserData({
        name: savedName,
        avatar: savedAvatar,
        level: savedLevel,
        joinedDate: '2024-01-15',
        totalPoints: 850,
        weeklyStreak: 7
      });
    } catch (error) {
      console.error('Error loading user profile:', error);
      // Fallback data
      setUserData({
        name: 'Guest',
        avatar: '',
        level: 'Beginner',
        joinedDate: '2024-01-01',
        totalPoints: 0,
        weeklyStreak: 0
      });
    } finally {
      setLoading(false);
    }
  }, []);

  return { userData, loading };
};

// Safe Input Component with fallback
const SafeInput = ({ value, onChange, placeholder, className = '', ...props }) => {
  const [internalValue, setInternalValue] = useState(value || '');

  useEffect(() => {
    // Use setTimeout to avoid synchronous state update in useEffect
    const timer = setTimeout(() => {
      setInternalValue(value || '');
    }, 0);
    
    return () => clearTimeout(timer);
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <input
      type="text"
      value={internalValue}
      onChange={handleChange}
      placeholder={placeholder}
      className={`w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/20 focus:outline-none transition-colors ${className}`}
      {...props}
    />
  );
};

// Filter Button Component
const FilterButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
      active 
        ? 'bg-[#1B4332] text-white' 
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`}
  >
    {children}
  </button>
);

// Progress Indicator Component
const ProgressIndicator = ({ value, label }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <span className="text-sm font-semibold text-[#1B4332]">{value}%</span>
    </div>
    <Progress value={value} className="h-2" />
  </div>
);

// Calendar Display Component
const CalendarDisplay = ({ date }) => (
  <div className="flex items-center gap-2 text-sm text-gray-600">
    <Calendar className="h-4 w-4" />
    <span>{date}</span>
  </div>
);

// Target Display Component
const TargetDisplay = ({ value, label }) => (
  <div className="flex items-center gap-2">
    <Target className="h-5 w-5 text-[#52796F]" />
    <div>
      <div className="font-semibold text-[#1B4332]">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  </div>
);

export default function Learning() {
  const { userData, loading } = useUserProfile();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [error, setError] = useState(null);

  // Safe state updates
  const handleSearchChange = (e) => {
    try {
      setSearchQuery(e?.target?.value || '');
    } catch (err) {
      console.error('Search change error:', err);
      setSearchQuery('');
      setError(err);
    }
  };

  // Handle filter level change
  const handleFilterChange = (level) => {
    try {
      setFilterLevel(level);
    } catch (err) {
      console.error('Filter change error:', err);
      setError(err);
    }
  };

  // Default data if userData is not loaded
  const safeUserData = userData || {
    name: 'Guest',
    weeklyStreak: 0,
    totalPoints: 0
  };

  const courses = [
    {
      id: 1,
      title: 'Business Credit Basics',
      lessons: 5,
      completed: 5,
      progress: 100,
      category: 'Credit Fundamentals',
      duration: '45 min',
      instructor: 'Sarah Johnson',
      instructorInitials: 'SJ',
      enrolled: 1240,
      rating: 4.8,
      thumbnail: '📊',
      level: 'beginner',
      tags: ['Essential', 'Popular'],
      description: 'Learn the fundamentals of business credit and how to build a strong credit profile for your company.',
      status: 'completed'
    },
    {
      id: 2,
      title: 'Understanding Banking Fees',
      lessons: 4,
      completed: 2,
      progress: 50,
      category: 'Banking',
      duration: '30 min',
      instructor: 'Michael Chen',
      instructorInitials: 'MC',
      enrolled: 890,
      rating: 4.5,
      thumbnail: '💰',
      level: 'intermediate',
      tags: ['Money Saving'],
      description: 'Master banking fee structures and learn strategies to minimize costs for your business.',
      status: 'in-progress'
    },
    {
      id: 3,
      title: 'SBA Loan Application',
      lessons: 6,
      completed: 0,
      progress: 0,
      category: 'Funding',
      duration: '60 min',
      instructor: 'David Rodriguez',
      instructorInitials: 'DR',
      enrolled: 2100,
      rating: 4.9,
      thumbnail: '🏦',
      level: 'advanced',
      tags: ['Government', 'Essential'],
      description: 'Step-by-step guide to successfully applying for SBA loans and securing business funding.',
      status: 'not-started'
    }
  ];

  const achievements = [
    { 
      id: 1,
      title: 'First Health Check', 
      icon: '🏆', 
      description: 'Completed first financial health assessment', 
      earned: '2 days ago',
      points: 100,
      category: 'Milestone'
    },
    { 
      id: 2,
      title: 'Credit Basics', 
      icon: '📚', 
      description: 'Mastered credit fundamentals', 
      earned: '1 week ago',
      points: 250,
      category: 'Knowledge'
    },
    { 
      id: 3,
      title: 'Quick Learner', 
      icon: '⚡', 
      description: 'Completed 3 lessons in one day', 
      earned: '3 days ago',
      points: 150,
      category: 'Speed'
    }
  ];

  const recommendedCourses = [
    {
      id: 4,
      title: 'Financial Forecasting',
      category: 'Advanced',
      duration: '50 min',
      instructor: 'Lisa Wang',
      thumbnail: '📈',
      rating: 4.7,
      enrolled: 1560
    },
    {
      id: 5,
      title: 'Tax Optimization Strategies',
      category: 'Tax',
      duration: '40 min',
      instructor: 'Robert Kim',
      thumbnail: '💸',
      rating: 4.9,
      enrolled: 2340
    }
  ];

  const learningStats = {
    totalMinutes: 345,
    weeklyStreak: safeUserData.weeklyStreak,
    certificatesEarned: 3,
    enrolledCourses: 5,
    totalPoints: safeUserData.totalPoints,
    completionRate: '78%'
  };

  // Filter courses safely
  const filteredCourses = courses.filter(course => {
    try {
      const matchesSearch = !searchQuery || 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLevel = filterLevel === 'all' || course.level === filterLevel;
      return matchesSearch && matchesLevel;
    } catch (err) {
      console.error('Filter error:', err);
      return true;
    }
  });

  // Error boundary content
  if (error) {
    return (
      <DashboardLayout title="Learning Center" subtitle="Master financial concepts">
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6">
          <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Page</h2>
          <p className="text-gray-600 mb-6 text-center max-w-md">
            There was an issue loading the learning content. Please try refreshing the page.
          </p>
          <div className="space-y-2 text-sm text-gray-500 mb-6">
            <p>Error: {error.message || 'Unknown error'}</p>
            <p>Type: {error.type || 'Loading Error'}</p>
          </div>
          <Button 
            className="btn-primary px-6"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Learning Center" subtitle="Master financial concepts to grow your business">
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

        .course-card {
          transition: all 0.3s ease;
          border: 1px solid rgba(82, 121, 111, 0.1);
          background: linear-gradient(135deg, rgba(27, 67, 50, 0.02) 0%, rgba(82, 121, 111, 0.02) 100%);
        }

        .course-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(27, 67, 50, 0.15);
          border-color: #52796F;
        }

        .achievement-card {
          border-left: 4px solid #1B4332 !important;
          transition: all 0.3s ease;
          background: linear-gradient(135deg, rgba(27, 67, 50, 0.05) 0%, rgba(82, 121, 111, 0.05) 100%);
        }

        .achievement-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(27, 67, 50, 0.15);
          border-color: #52796F !important;
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

        @media (max-width: 640px) {
          .mobile-stack {
            flex-direction: column !important;
          }
          
          .mobile-full {
            width: 100% !important;
          }
          
          .mobile-text-center {
            text-align: center !important;
          }
          
          .mobile-p-4 {
            padding: 1rem !important;
          }
          
          .mobile-gap-4 {
            gap: 1rem !important;
          }
        }

        @media (max-width: 768px) {
          .tablet-flex-col {
            flex-direction: column !important;
          }
          
          .tablet-w-full {
            width: 100% !important;
          }
          
          .tablet-mb-4 {
            margin-bottom: 1rem !important;
          }
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="px-4 sm:px-6 lg:px-8 py-6"
      >
        {/* Hero Banner */}
        <div className="hero-gradient rounded-2xl mb-6 sm:mb-8 p-6 text-white overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <User className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold mb-1">
                    {loading ? 'Loading...' : `Welcome back, ${safeUserData.name}!`}
                  </h1>
                  <p className="text-white/90">
                    Your financial knowledge is growing! Continue your journey to financial mastery.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-white/10 backdrop-blur-sm">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
                    <Flame className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{safeUserData.weeklyStreak}</div>
                    <div className="text-sm text-white/80">day streak</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 rounded-lg bg-white/10 backdrop-blur-sm">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{safeUserData.totalPoints}</div>
                    <div className="text-sm text-white/80">points</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 rounded-lg bg-white/10 backdrop-blur-sm">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-600 flex items-center justify-center">
                    <GraduationCap className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{learningStats.certificatesEarned}</div>
                    <div className="text-sm text-white/80">certificates</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:self-start">
              <Button 
                className="w-full lg:w-auto bg-white text-[#1B4332] hover:bg-gray-100 font-semibold text-base px-6 py-3 h-auto"
              >
                <PlayCircle className="h-5 w-5 mr-2" />
                Resume Learning
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search and Filters */}
            <Card className="border-2 border-[#52796F]/10">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4 mobile-stack">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <SafeInput
                      placeholder="Search courses..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="pl-12 py-3"
                    />
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={filterLevel}
                      onChange={(e) => handleFilterChange(e.target.value)}
                      className="px-4 py-3 rounded-lg border border-gray-300 focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/20 focus:outline-none transition-colors"
                    >
                      <option value="all">All Levels</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                    <FilterButton 
                      active={filterLevel === 'all'} 
                      onClick={() => handleFilterChange('all')}
                    >
                      <Filter className="h-4 w-4 inline mr-1" />
                      All
                    </FilterButton>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* My Courses Section */}
            <Card className="border-2 border-[#52796F]/10">
              <CardHeader className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-6 w-6 text-[#1B4332]" />
                    <div>
                      <CardTitle className="text-[#1B4332] text-xl">My Learning Path</CardTitle>
                      <CardDescription className="text-[#52796F]">
                        Track your progress and continue where you left off
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <CalendarDisplay date="Today" />
                    <div className="text-sm text-[#52796F]">
                      {filteredCourses.length} of {courses.length} courses
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {filteredCourses.map((course) => (
                  <motion.div
                    key={course.id}
                    whileHover={{ scale: 1.01 }}
                    className="course-card rounded-xl p-6 cursor-pointer"
                  >
                    <div className="flex flex-col lg:flex-row items-start gap-6">
                      <div className="w-full lg:w-20 h-20 bg-gradient-to-br from-[#1B4332]/10 to-[#52796F]/10 rounded-xl flex items-center justify-center text-4xl flex-shrink-0">
                        {course.thumbnail}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <h3 className="text-xl font-bold text-gray-900">
                                {course.title}
                              </h3>
                              <Badge className={`${
                                course.level === 'beginner' ? 'bg-green-100 text-green-800' :
                                course.level === 'intermediate' ? 'bg-blue-100 text-blue-800' :
                                'bg-purple-100 text-purple-800'
                              }`}>
                                {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                              </Badge>
                            </div>
                            <p className="text-gray-600 mb-3">{course.description}</p>
                            <div className="flex flex-wrap items-center gap-4 text-sm">
                              <span className="text-[#52796F] font-medium">{course.category}</span>
                              <span className="text-gray-500 flex items-center gap-1">
                                <Clock className="h-4 w-4" /> {course.duration}
                              </span>
                              <span className="text-gray-500 flex items-center gap-1">
                                <Users className="h-4 w-4" /> {course.enrolled.toLocaleString()} enrolled
                              </span>
                              <span className="text-gray-500 flex items-center gap-1">
                                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                {course.rating}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {course.tags?.map((tag) => (
                            <Badge key={tag} className="tag-badge">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        {/* Progress Section */}
                        <div className="space-y-3 mb-6">
                          <ProgressIndicator 
                            value={course.progress}
                            label={`${course.completed} of ${course.lessons} lessons completed`}
                          />
                        </div>

                        {/* Footer */}
                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#1B4332]/10 flex items-center justify-center text-[#1B4332] font-semibold">
                              {course.instructorInitials}
                            </div>
                            <div>
                              <div className="font-medium text-[#52796F]">{course.instructor}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {course.progress === 100 ? (
                              <Button className="bg-green-600 hover:bg-green-700 text-white gap-2 px-6">
                                <CheckCircle className="h-5 w-5" />
                                Completed
                              </Button>
                            ) : course.progress > 0 ? (
                              <Button className="btn-primary gap-2 px-6">
                                <PlayCircle className="h-5 w-5" />
                                Continue
                              </Button>
                            ) : (
                              <Button className="btn-primary gap-2 px-6">
                                <PlayCircle className="h-5 w-5" />
                                Start Course
                              </Button>
                            )}
                            <Button variant="ghost" className="h-10 w-10 p-0 hover:bg-[#52796F]/10">
                              <Bookmark className="h-5 w-5 text-[#52796F]" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Achievements Gallery */}
            <Card className="border-2 border-[#52796F]/10">
              <CardHeader className="p-6">
                <CardTitle className="flex items-center justify-between text-[#1B4332]">
                  <div className="flex items-center gap-3">
                    <Award className="h-6 w-6" />
                    <span className="text-xl">Achievements</span>
                  </div>
                  <Badge className="bg-[#1B4332] text-white">{achievements.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="achievement-card p-4 rounded-lg cursor-pointer"
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-3xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-[#1B4332]">{achievement.title}</h4>
                            <Badge className="bg-[#52796F] text-white">
                              +{achievement.points} pts
                            </Badge>
                          </div>
                          <p className="text-sm text-[#52796F] mb-2">{achievement.description}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Earned {achievement.earned}</span>
                            <Badge className="category-badge">
                              {achievement.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-5 rounded-lg bg-gradient-to-r from-[#1B4332]/10 to-[#52796F]/10 border border-[#52796F]/20">
                  <div className="flex items-center gap-4">
                    <Trophy className="h-8 w-8 text-[#1B4332]" />
                    <div>
                      <p className="font-bold text-[#1B4332]">Next Goal: Financial Pro</p>
                      <p className="text-sm text-[#52796F]">
                        Complete 2 more courses to unlock this achievement
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Learning Stats */}
            <Card className="border-2 border-[#52796F]/10">
              <CardHeader className="p-6">
                <CardTitle className="flex items-center gap-3 text-[#1B4332]">
                  <BarChart className="h-6 w-6" />
                  <span className="text-xl">Learning Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Certificates', value: learningStats.certificatesEarned, icon: GraduationCap, color: 'bg-emerald-500' },
                    { label: 'Courses', value: learningStats.enrolledCourses, icon: BookOpen, color: 'bg-blue-500' },
                    { label: 'Minutes', value: learningStats.totalMinutes, icon: Clock, color: 'bg-purple-500' },
                    { label: 'Completion', value: learningStats.completionRate, icon: TrendingUp, color: 'bg-amber-500' },
                  ].map((stat, index) => (
                    <div key={index} className="stats-card p-4 rounded-xl text-center">
                      <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                        <stat.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-[#1B4332]">{stat.value}</div>
                      <div className="text-sm text-[#52796F] font-medium mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-5 rounded-lg bg-gradient-to-r from-[#1B4332] to-[#52796F] text-white">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
                      <Flame className="h-7 w-7" />
                    </div>
                    <div>
                      <div className="text-xl font-bold">{safeUserData.weeklyStreak} day streak</div>
                      <p className="text-sm opacity-90 mt-1">Keep it up! Don't break the chain.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommended Courses */}
            <Card className="border-2 border-[#52796F]/10">
              <CardHeader className="p-6">
                <CardTitle className="flex items-center gap-3 text-[#1B4332]">
                  <Target className="h-6 w-6" />
                  <span className="text-xl">Recommended Courses</span>
                </CardTitle>
                <CardDescription className="text-[#52796F]">
                  Based on your learning history
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {recommendedCourses.map((course) => (
                    <div key={course.id} className="p-4 rounded-lg border border-[#52796F]/10 hover:border-[#52796F]/30 transition-colors cursor-pointer">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-[#1B4332]/10 to-[#52796F]/10 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                          {course.thumbnail}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-[#1B4332] truncate">{course.title}</h4>
                          <p className="text-sm text-[#52796F] mt-1 truncate">{course.instructor}</p>
                          <div className="flex items-center justify-between mt-3">
                            <Badge className="category-badge">{course.category}</Badge>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4 text-[#52796F]" />
                                <span className="text-sm text-[#52796F]">{course.duration}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                <span className="text-sm text-[#52796F]">{course.rating}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <TargetDisplay 
                  value="5 new courses"
                  label="Recommended for you"
                />
                <Button 
                  className="w-full mt-6 btn-secondary py-4 text-base font-semibold"
                  variant="outline"
                >
                  View All Recommendations
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}