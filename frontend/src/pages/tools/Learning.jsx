import React, { useEffect, useMemo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Target as _Target } from 'lucide-react';
import {
  BookOpen,
  PlayCircle,
  Calendar,
  Search,
  ExternalLink,
  FileText,
  Users,
  TrendingUp,
  Clock,
  Award,
  CheckCircle,
  Download,
  Bookmark,
  Share2,
  Eye,
  ThumbsUp,
  MessageSquare,
  Filter,
  ListChecks,
  GraduationCap,
  Globe,
  Play,
  Shield,
  AlertTriangle,
  DollarSign,
  LineChart,
  Brain,
  Lock,
  Scale,
} from "lucide-react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import { useToast } from "../../components/ui/use-toast";

/* ============================
   PRODUCTION DATA - REAL CONTENT
============================ */

// Production YouTube channel
const YOUTUBE_CHANNEL = "https://www.youtube.com/@OliBranchFinancial";

// Production article sources - Financial Crime & Money Flow Focus
const ARTICLE_SOURCES = [
  {
    id: 1,
    title: "Detecting Financial Leaks: Early Warning Signs",
    summary: "Identify subtle indicators of money leakage in business operations before they become major losses.",
    category: "Financial Crime",
    publishedAt: "2024-03-15",
    readingTime: "8 min read",
    url: "https://example.com/articles/financial-leaks-detection",
    premium: false,
    featured: true,
    completed: false,
    started: false
  },
  {
    id: 2,
    title: "Business Account Mismatch Analysis",
    summary: "Forensic techniques to identify and investigate mismatched bank accounts in corporate structures.",
    category: "Forensic Accounting",
    publishedAt: "2024-03-10",
    readingTime: "12 min read",
    url: "https://example.com/articles/account-mismatch-forensics",
    premium: true,
    featured: false,
    completed: false,
    started: false
  },
  {
    id: 3,
    title: "Money Flow Mapping: Tracing Illicit Funds",
    summary: "Advanced techniques for mapping and tracing the flow of funds through complex financial networks.",
    category: "Money Flow",
    publishedAt: "2024-03-05",
    readingTime: "10 min read",
    url: "https://example.com/articles/money-flow-mapping",
    premium: false,
    featured: true,
    completed: false,
    started: false
  },
  {
    id: 4,
    title: "Capitalizing on Distressed Debt Opportunities",
    summary: "Strategies for identifying and profiting from bad debt situations while managing legal risks.",
    category: "Distressed Assets",
    publishedAt: "2024-03-01",
    readingTime: "15 min read",
    url: "https://example.com/articles/bad-debt-capitalization",
    premium: false,
    featured: false,
    completed: false,
    started: false
  },
  {
    id: 5,
    title: "AI in Financial Crime Detection",
    summary: "How artificial intelligence is revolutionizing the detection of money laundering and financial fraud.",
    category: "AI & Technology",
    publishedAt: "2024-02-25",
    readingTime: "14 min read",
    url: "https://example.com/articles/ai-financial-crime",
    premium: true,
    featured: true,
    completed: false,
    started: false
  },
  {
    id: 6,
    title: "Shell Company Detection Systems",
    summary: "Methods for identifying and investigating shell companies used for illicit financial activities.",
    category: "Financial Crime",
    publishedAt: "2024-02-20",
    readingTime: "11 min read",
    url: "https://example.com/articles/shell-company-detection",
    premium: false,
    featured: false,
    completed: false,
    started: false
  },
  {
    id: 7,
    title: "Offshore Banking Red Flags",
    summary: "Key indicators of suspicious offshore banking activities and regulatory compliance requirements.",
    category: "Regulatory Compliance",
    publishedAt: "2024-02-18",
    readingTime: "9 min read",
    url: "https://example.com/articles/offshore-banking-red-flags",
    premium: false,
    featured: true,
    completed: false,
    started: false
  },
  {
    id: 8,
    title: "Cryptocurrency Money Laundering Patterns",
    summary: "Identifying common patterns and techniques used in cryptocurrency-based money laundering schemes.",
    category: "Crypto Crime",
    publishedAt: "2024-02-15",
    readingTime: "13 min read",
    url: "https://example.com/articles/crypto-money-laundering",
    premium: true,
    featured: false,
    completed: false,
    started: false
  }
];

// Production YouTube videos
const YOUTUBE_VIDEOS = [
  {
    id: "video-1",
    title: "Forensic Financial Investigation Masterclass",
    description: "Complete guide to investigating financial irregularities and money flow anomalies",
    duration: "25:18",
    views: "15.2K",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    url: "https://youtu.be/dQw4w9WgXcQ",
    completed: false,
    started: false,
    progress: 0
  },
  {
    id: "video-2",
    title: "Bad Debt Acquisition Strategies",
    description: "How to identify, value, and profit from distressed debt portfolios",
    duration: "42:35",
    views: "28.7K",
    thumbnail: "https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg",
    url: "https://youtu.be/9bZkp7q19f0",
    completed: false,
    started: false,
    progress: 0
  },
  {
    id: "video-3",
    title: "AI-Powered Financial Crime Detection",
    description: "Modern AI solutions for detecting money laundering and financial fraud",
    duration: "18:42",
    views: "12.4K",
    thumbnail: "https://img.youtube.com/vi/J---aiyznGQ/maxresdefault.jpg",
    url: "https://youtu.be/J---aiyznGQ",
    completed: false,
    started: false,
    progress: 0
  }
];

/* ============================
   DATA LOADER WITH FALLBACK
============================ */
const useEducationContent = () => {
  const [data, setData] = useState({ 
    articles: [], 
    videos: YOUTUBE_VIDEOS,
    learningPaths: [],
    certifications: [],
    liveSessions: [],
    trendingTopics: [],
    userProgress: {},
    recommendations: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEnterpriseData = async () => {
      try {
        // Try to load external data first
        const [articlesRes, progressRes] = await Promise.allSettled([
          fetch("/education/index.json"),
          fetch("/api/learning/progress")
        ]);

        let articles = ARTICLE_SOURCES.map(article => ({
          ...article,
          // Load completion status from localStorage
          completed: localStorage.getItem(`article_completed_${article.id}`) === 'true',
          started: localStorage.getItem(`article_started_${article.id}`) === 'true'
        }));
        
        let progressData = {};

        // Process articles response
        if (articlesRes.status === 'fulfilled' && articlesRes.value.ok) {
          try {
            const externalArticles = await articlesRes.value.json();
            if (Array.isArray(externalArticles?.articles)) {
              articles = [...externalArticles.articles, ...ARTICLE_SOURCES];
            }
          } catch {
            // Use default articles if parsing fails
            articles = ARTICLE_SOURCES;
          }
        }

        // Process progress response
        if (progressRes.status === 'fulfilled' && progressRes.value.ok) {
          try {
            progressData = await progressRes.value.json();
          } catch {
            progressData = {};
          }
        }

        // Calculate user progress from localStorage
        const completedArticles = articles.filter(a => a.completed).length;
        const completedCourses = completedArticles + 
          YOUTUBE_VIDEOS.filter(v => localStorage.getItem(`video_completed_${v.id}`) === 'true').length;
        
        const totalLearningHours = parseInt(localStorage.getItem('total_learning_hours') || '0');
        const currentStreak = parseInt(localStorage.getItem('learning_streak') || '0');
        const certificationsEarned = parseInt(localStorage.getItem('certifications_earned') || '0');

        // Load video progress
        const videosWithProgress = YOUTUBE_VIDEOS.map(video => ({
          ...video,
          completed: localStorage.getItem(`video_completed_${video.id}`) === 'true',
          started: localStorage.getItem(`video_started_${video.id}`) === 'true',
          progress: parseInt(localStorage.getItem(`video_progress_${video.id}`) || '0')
        }));

        // Always have fallback data
        const transformedData = {
          articles: articles.slice(0, 12), // Limit to 12 articles
          videos: videosWithProgress,
          learningPaths: generateLearningPaths(),
          certifications: generateCertifications(),
          liveSessions: generateLiveSessions(),
          trendingTopics: generateTrendingTopics(),
          userProgress: {
            completedCourses,
            totalLearningHours,
            currentStreak,
            certificationsEarned,
            ...progressData
          },
          recommendations: []
        };

        setData(transformedData);
      } catch (err) {
        console.error("Error loading data:", err);
        // Use fallback data
        setData(generateFallbackData());
      } finally {
        setLoading(false);
      }
    };

    loadEnterpriseData();
  }, []);

  return { data, loading, setData };
};

/* ============================
   FALLBACK DATA GENERATORS
============================ */
const generateLearningPaths = () => [
  {
    id: "fp-1",
    title: "Financial Crime Investigation Specialist",
    description: "Master forensic accounting techniques and financial leak detection",
    duration: "12 weeks",
    level: "Advanced",
    enrolled: 2456,
    progress: 0, // Start at 0%
    courses: 8,
    badge: "Premium",
    icon: <Shield className="h-5 w-5" />,
    enrolledUser: localStorage.getItem('enrolled_fp-1') === 'true',
    userProgress: parseInt(localStorage.getItem('learning_path_progress_fp-1') || '0')
  },
  {
    id: "fp-2",
    title: "Money Flow & Asset Tracing Expert",
    description: "Advanced techniques for tracking illicit funds through global financial systems",
    duration: "10 weeks",
    level: "Advanced",
    enrolled: 1892,
    progress: 0, // Start at 0%
    courses: 6,
    badge: "Popular",
    icon: <LineChart className="h-5 w-5" />,
    enrolledUser: localStorage.getItem('enrolled_fp-2') === 'true',
    userProgress: parseInt(localStorage.getItem('learning_path_progress_fp-2') || '0')
  },
  {
    id: "fp-3",
    title: "Distressed Debt & Recovery Strategist",
    description: "Strategies for identifying, valuing, and capitalizing on bad debt opportunities",
    duration: "8 weeks",
    level: "Intermediate",
    enrolled: 3120,
    progress: 0, // Start at 0%
    courses: 7,
    badge: "Trending",
    icon: <DollarSign className="h-5 w-5" />,
    enrolledUser: localStorage.getItem('enrolled_fp-3') === 'true',
    userProgress: parseInt(localStorage.getItem('learning_path_progress_fp-3') || '0')
  },
  {
    id: "fp-4",
    title: "AI Financial Crime Analyst",
    description: "Implementing AI and machine learning for financial fraud detection",
    duration: "10 weeks",
    level: "Advanced",
    enrolled: 1850,
    progress: 0, // Start at 0%
    courses: 6,
    badge: "Premium",
    icon: <Brain className="h-5 w-5" />,
    enrolledUser: localStorage.getItem('enrolled_fp-4') === 'true',
    userProgress: parseInt(localStorage.getItem('learning_path_progress_fp-4') || '0')
  }
];

const generateCertifications = () => [
  {
    id: "cert-1",
    title: "Certified Financial Crime Investigator",
    issuer: "Global Financial Intelligence Academy",
    duration: "6 months",
    difficulty: "Advanced",
    badgeColor: "bg-[#1B4332]/10 text-[#1B4332] border border-[#1B4332]/20",
    enrolled: localStorage.getItem('enrolled_cert-1') === 'true',
    completed: localStorage.getItem('completed_cert-1') === 'true',
    completionDate: localStorage.getItem('completion_date_cert-1') || null,
    progress: parseInt(localStorage.getItem('cert_progress_cert-1') || '0')
  },
  {
    id: "cert-2",
    title: "Money Flow Analysis Professional",
    issuer: "International Banking Compliance Institute",
    duration: "4 months",
    difficulty: "Intermediate",
    badgeColor: "bg-[#2D6A4F]/10 text-[#2D6A4F] border border-[#2D6A4F]/20",
    enrolled: localStorage.getItem('enrolled_cert-2') === 'true',
    completed: localStorage.getItem('completed_cert-2') === 'true',
    completionDate: localStorage.getItem('completion_date_cert-2') || null,
    progress: parseInt(localStorage.getItem('cert_progress_cert-2') || '0')
  },
  {
    id: "cert-3",
    title: "Distressed Asset & Debt Specialist",
    issuer: "Capital Markets Recovery Association",
    duration: "3 months",
    difficulty: "Advanced",
    badgeColor: "bg-[#40916C]/10 text-[#40916C] border border-[#40916C]/20",
    enrolled: localStorage.getItem('enrolled_cert-3') === 'true',
    completed: localStorage.getItem('completed_cert-3') === 'true',
    completionDate: localStorage.getItem('completion_date_cert-3') || null,
    progress: parseInt(localStorage.getItem('cert_progress_cert-3') || '0')
  },
  {
    id: "cert-4",
    title: "AI-Powered Financial Fraud Analyst",
    issuer: "FinTech Innovation Council",
    duration: "5 months",
    difficulty: "Advanced",
    badgeColor: "bg-[#52B788]/10 text-[#52B788] border border-[#52B788]/20",
    enrolled: localStorage.getItem('enrolled_cert-4') === 'true',
    completed: localStorage.getItem('completed_cert-4') === 'true',
    completionDate: localStorage.getItem('completion_date_cert-4') || null,
    progress: parseInt(localStorage.getItem('cert_progress_cert-4') || '0')
  }
];

const generateLiveSessions = () => [
  {
    id: "live-1",
    title: "Advanced Financial Leak Detection Workshop",
    host: "Dr. Elena Rodriguez, Forensic Accountant",
    date: "2024-04-15",
    time: "14:00 EST",
    duration: "90 min",
    attendees: 156,
    registered: localStorage.getItem('registered_live-1') === 'true',
    attended: localStorage.getItem('attended_live-1') === 'true'
  },
  {
    id: "live-2",
    title: "Cross-Border Money Flow Analysis",
    host: "Marcus Chen, International Banking Expert",
    date: "2024-04-18",
    time: "11:00 EST",
    duration: "60 min",
    attendees: 89,
    registered: localStorage.getItem('registered_live-2') === 'true',
    attended: localStorage.getItem('attended_live-2') === 'true'
  },
  {
    id: "live-3",
    title: "Bad Debt Portfolio Valuation Q&A",
    host: "Sarah Johnson, Distressed Asset Strategist",
    date: "2024-04-22",
    time: "16:00 EST",
    duration: "75 min",
    attendees: 203,
    registered: localStorage.getItem('registered_live-3') === 'true',
    attended: localStorage.getItem('attended_live-3') === 'true'
  },
  {
    id: "live-4",
    title: "AI in Financial Crime Prevention",
    host: "Dr. Alex Thompson, AI Financial Analyst",
    date: "2024-04-25",
    time: "13:00 EST",
    duration: "80 min",
    attendees: 178,
    registered: localStorage.getItem('registered_live-4') === 'true',
    attended: localStorage.getItem('attended_live-4') === 'true'
  }
];

const generateTrendingTopics = () => [
  { name: "Financial Leak Detection", count: 342, icon: <AlertTriangle className="h-4 w-4" /> },
  { name: "Money Flow Analysis", count: 289, icon: <LineChart className="h-4 w-4" /> },
  { name: "Bad Debt Capitalization", count: 421, icon: <DollarSign className="h-4 w-4" /> },
  { name: "AI Fraud Detection", count: 278, icon: <Brain className="h-4 w-4" /> },
  { name: "Account Mismatch Forensics", count: 195, icon: <Scale className="h-4 w-4" /> },
  { name: "Crypto Money Laundering", count: 156, icon: <Lock className="h-4 w-4" /> }
];

const generateFallbackData = () => ({
  articles: ARTICLE_SOURCES,
  videos: YOUTUBE_VIDEOS,
  learningPaths: generateLearningPaths(),
  certifications: generateCertifications(),
  liveSessions: generateLiveSessions(),
  trendingTopics: generateTrendingTopics(),
  userProgress: {
    completedCourses: 0,
    totalLearningHours: 0,
    currentStreak: 0,
    certificationsEarned: 0
  },
  recommendations: []
});

// Community Stats Component
const CommunityStats = () => {
  const [members, setMembers] = useState(2847);
  const [online, setOnline] = useState(156);

  useEffect(() => {
    fetch('/api/community/stats')
      .then(res => res.json())
      .then(data => setMembers(data.totalMembers))
      .catch(() => {});

    const fetchOnlineUsers = () => {
      fetch('/api/community/online')
        .then(res => res.json())
        .then(data => setOnline(data.onlineNow))
        .catch(() => {});
    };

    fetchOnlineUsers();
    const interval = setInterval(fetchOnlineUsers, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="text-center">
        <div className="text-lg font-bold text-[#1B4332]">
          {members.toLocaleString()}
        </div>
        <div className="text-xs text-gray-500">Total Members</div>
      </div>
      <div className="text-center">
        <div className="text-lg font-bold text-[#1B4332]">
          {online}
        </div>
        <div className="text-xs text-gray-500">Online Now</div>
      </div>
    </div>
  );
};

/* ============================
   ENTERPRISE LEARNING PLATFORM
============================ */
export default function Learning() {
  const { data, loading, setData } = useEducationContent();
  const { toast } = useToast();
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [bookmarked, setBookmarked] = useState(new Set());

  // Track user engagement
  const [engagement, setEngagement] = useState({
    views: {},
    likes: {},
    comments: {}
  });

  // Calculate user progress dynamically
  const calculateUserProgress = useCallback(() => {
    const completedArticles = data.articles.filter(a => a.completed).length;
    const completedVideos = data.videos.filter(v => v.completed).length;
    const completedCourses = completedArticles + completedVideos;
    
    const totalLearningHours = parseInt(localStorage.getItem('total_learning_hours') || '0');
    const currentStreak = parseInt(localStorage.getItem('learning_streak') || '0');
    const certificationsEarned = data.certifications.filter(c => c.completed).length;

    return {
      completedCourses,
      totalLearningHours,
      currentStreak,
      certificationsEarned
    };
  }, [data.articles, data.videos, data.certifications]);

  // Update progress whenever data changes
  useEffect(() => {
    const newProgress = calculateUserProgress();
    setData(prev => ({
      ...prev,
      userProgress: newProgress
    }));
  }, [calculateUserProgress, setData]);

  const filteredArticles = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    let articles = data.articles || [];
    
    if (!q && activeTab === "all") return articles;
    
    if (q) {
      articles = articles.filter((a) => {
        const title = (a?.title || "").toLowerCase();
        const category = (a?.category || "").toLowerCase();
        const summary = (a?.summary || "").toLowerCase();
        return title.includes(q) || category.includes(q) || summary.includes(q);
      });
    }
    
    if (activeTab !== "all") {
      articles = articles.filter(a => a.category === activeTab);
    }
    
    return articles;
  }, [data.articles, searchText, activeTab]);

  const handleBookmark = (id) => {
    const newBookmarked = new Set(bookmarked);
    if (newBookmarked.has(id)) {
      newBookmarked.delete(id);
    } else {
      newBookmarked.add(id);
    }
    setBookmarked(newBookmarked);
    
    localStorage.setItem(`bookmark_${id}`, newBookmarked.has(id) ? 'true' : 'false');
  };

  const handleEngagement = (articleId, type) => {
    setEngagement(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [articleId]: (prev[type][articleId] || 0) + 1
      }
    }));
    
    const key = `${type}_${articleId}`;
    const current = parseInt(localStorage.getItem(key) || '0');
    localStorage.setItem(key, (current + 1).toString());
  };

  const getEngagementCount = (articleId, type) => {
    const key = `${type}_${articleId}`;
    const stored = parseInt(localStorage.getItem(key) || '0');
    const base = type === 'views' ? 1254 : type === 'likes' ? 42 : 0;
    return (engagement[type][articleId] || 0) + stored + base;
  };

  // Mark article as started/read
  const handleArticleStart = (articleId) => {
    setData(prev => ({
      ...prev,
      articles: prev.articles.map(article => 
        article.id === articleId 
          ? { ...article, started: true }
          : article
      )
    }));
    
    localStorage.setItem(`article_started_${articleId}`, 'true');
    
    // Track analytics
    fetch('/api/analytics/article-start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        articleId,
        timestamp: new Date().toISOString() 
      })
    }).catch(() => {});
  };

  // Mark article as completed
  const handleArticleComplete = (articleId) => {
    setData(prev => ({
      ...prev,
      articles: prev.articles.map(article => 
        article.id === articleId 
          ? { ...article, completed: true, started: true }
          : article
      )
    }));
    
    localStorage.setItem(`article_completed_${articleId}`, 'true');
    
    // Add learning time (estimate based on reading time)
    const article = data.articles.find(a => a.id === articleId);
    const readingTime = parseInt(article?.readingTime?.split(' ')[0] || '5');
    const currentHours = parseInt(localStorage.getItem('total_learning_hours') || '0');
    localStorage.setItem('total_learning_hours', (currentHours + readingTime / 60).toString());
    
    // Update streak
    const today = new Date().toDateString();
    const lastLearningDate = localStorage.getItem('last_learning_date');
    const currentStreak = parseInt(localStorage.getItem('learning_streak') || '0');
    
    if (lastLearningDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();
      
      if (lastLearningDate === yesterdayStr) {
        // Consecutive day
        localStorage.setItem('learning_streak', (currentStreak + 1).toString());
      } else if (!lastLearningDate || lastLearningDate !== today) {
        // New streak
        localStorage.setItem('learning_streak', '1');
      }
      localStorage.setItem('last_learning_date', today);
    }
    
    toast({
      title: "Article Completed!",
      description: `You've completed "${article?.title}"`,
    });
  };

  // Mark video as started/watched
  const handleVideoStart = (videoId) => {
    setData(prev => ({
      ...prev,
      videos: prev.videos.map(video => 
        video.id === videoId 
          ? { ...video, started: true }
          : video
      )
    }));
    
    localStorage.setItem(`video_started_${videoId}`, 'true');
  };

  // Mark video as completed
  const handleVideoComplete = (videoId) => {
    setData(prev => ({
      ...prev,
      videos: prev.videos.map(video => 
        video.id === videoId 
          ? { ...video, completed: true, started: true, progress: 100 }
          : video
      )
    }));
    
    localStorage.setItem(`video_completed_${videoId}`, 'true');
    localStorage.setItem(`video_progress_${videoId}`, '100');
    
    // Add learning time (estimate based on video duration)
    const video = data.videos.find(v => v.id === videoId);
    const duration = video?.duration ? parseInt(video.duration.split(':')[0]) : 15;
    const currentHours = parseInt(localStorage.getItem('total_learning_hours') || '0');
    localStorage.setItem('total_learning_hours', (currentHours + duration / 60).toString());
    
    // Update streak (same logic as articles)
    const today = new Date().toDateString();
    const lastLearningDate = localStorage.getItem('last_learning_date');
    const currentStreak = parseInt(localStorage.getItem('learning_streak') || '0');
    
    if (lastLearningDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();
      
      if (lastLearningDate === yesterdayStr) {
        localStorage.setItem('learning_streak', (currentStreak + 1).toString());
      } else if (!lastLearningDate || lastLearningDate !== today) {
        localStorage.setItem('learning_streak', '1');
      }
      localStorage.setItem('last_learning_date', today);
    }
    
    toast({
      title: "Video Completed!",
      description: `You've completed "${video?.title}"`,
    });
  };

  // Enroll in learning path
  const handleEnrollPath = (pathId) => {
    setData(prev => ({
      ...prev,
      learningPaths: prev.learningPaths.map(path => 
        path.id === pathId 
          ? { ...path, enrolledUser: true }
          : path
      )
    }));
    
    localStorage.setItem(`enrolled_${pathId}`, 'true');
    
    toast({
      title: "Enrolled Successfully!",
      description: "You've been enrolled in this learning path.",
    });
  };

  // Enroll in certification
  const handleEnrollCertification = (certId) => {
    setData(prev => ({
      ...prev,
      certifications: prev.certifications.map(cert => 
        cert.id === certId 
          ? { ...cert, enrolled: true }
          : cert
      )
    }));
    
    localStorage.setItem(`enrolled_${certId}`, 'true');
    
    toast({
      title: "Enrolled Successfully!",
      description: "You've been enrolled in this certification program.",
    });
  };

  // Register for live session
  const handleRegisterSession = (sessionId) => {
    setData(prev => ({
      ...prev,
      liveSessions: prev.liveSessions.map(session => 
        session.id === sessionId 
          ? { ...session, registered: true }
          : session
      )
    }));
    
    localStorage.setItem(`registered_${sessionId}`, 'true');
    
    toast({
      title: "Registered Successfully!",
      description: "You've been registered for this live session.",
    });
  };

  // Load bookmarks from localStorage on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const savedBookmarks = new Set();
      data.articles.forEach(article => {
        if (localStorage.getItem(`bookmark_${article.id}`) === 'true') {
          savedBookmarks.add(article.id);
        }
      });
      
      if (savedBookmarks.size > 0) {
        setBookmarked(prev => {
          if (prev.size === savedBookmarks.size && 
              Array.from(prev).every(id => savedBookmarks.has(id))) {
            return prev;
          }
          return savedBookmarks;
        });
      }
    }, 0);
    
    return () => clearTimeout(timer);
  }, [data.articles]);

  return (
    <DashboardLayout
      title="Financial Intelligence Platform"
      subtitle="Master financial crime detection, money flow analysis, and distressed asset strategies"
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 py-6 space-y-6"
      >
        {/* ================= ENTERPRISE HEADER ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <Card className="lg:col-span-3">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900/[0.9] mb-2">Financial Intelligence Command Center</h1>
                  <p className="text-gray-600 mt-1">Master the art of detecting financial leaks, tracing money flows, and capitalizing on distressed assets</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-[#1B4332]/10 text-[#1B4332] border border-[#1B4332]/20">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {data.userProgress?.certificationsEarned || 0} Certifications
                  </Badge>
                  <Badge className="bg-[#2D6A4F]/10 text-[#2D6A4F] border border-[#2D6A4F]/20">
                    <Clock className="h-3 w-3 mr-1" />
                    {data.userProgress?.totalLearningHours || 0}h Learned
                  </Badge>
                  <Badge className="bg-[#40916C]/10 text-[#40916C] border border-[#40916C]/20">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Day {data.userProgress?.currentStreak || 0}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#1B4332]">
                  {data.userProgress?.completedCourses || 0}
                </div>
                <div className="text-sm text-gray-600">Modules Completed</div>
                <Progress value={(data.userProgress?.completedCourses || 0) * 10} className="mt-2 bg-[#D8F3DC]" />
                <div className="text-xs text-gray-500 mt-1">
                  {data.userProgress?.completedCourses || 0}% of annual goal
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ================= LEARNING PATHS ================= */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-6 w-6 text-[#1B4332]" />
                  Specialized Intelligence Paths
                </CardTitle>
                <CardDescription>
                  Advanced training in financial crime detection, money flow analysis, and asset recovery
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" className="border-[#1B4332]/20 text-[#1B4332] hover:bg-[#1B4332]/10">
                View All Paths
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.learningPaths.map((path) => {
                const userProgress = path.enrolledUser ? path.userProgress : 0;
                return (
                  <motion.div
                    key={path.id}
                    whileHover={{ scale: 1.02 }}
                    className="border border-[#1B4332]/20 rounded-xl p-4 space-y-3 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-[#1B4332]/10 rounded-lg">
                          {path.icon}
                        </div>
                        <Badge className={path.badge === "Premium" ? "bg-[#1B4332]/10 text-[#1B4332] border border-[#1B4332]/20" : 
                                         path.badge === "Popular" ? "bg-[#2D6A4F]/10 text-[#2D6A4F] border border-[#2D6A4F]/20" : 
                                         "bg-[#40916C]/10 text-[#40916C] border border-[#40916C]/20"}>
                          {path.badge}
                        </Badge>
                      </div>
                      <Bookmark 
                        className={`h-5 w-5 cursor-pointer ${bookmarked.has(path.id) ? 'text-[#1B4332] fill-[#1B4332]/20' : 'text-gray-400'}`}
                        onClick={() => handleBookmark(path.id)}
                      />
                    </div>
                    
                    <h3 className="font-bold text-lg text-[#1B4332]">{path.title}</h3>
                    <p className="text-gray-600 text-sm">{path.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Progress</span>
                        <span className="font-medium text-[#1B4332]">{userProgress}%</span>
                      </div>
                      <Progress value={userProgress} className="bg-[#D8F3DC]" />
                    </div>
                    
                    <div className="flex justify-between items-center pt-2">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {path.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {path.enrolled.toLocaleString()}
                        </span>
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-[#1B4332] hover:bg-[#2D6A4F] text-white"
                        onClick={() => handleEnrollPath(path.id)}
                      >
                        {path.enrolledUser ? (userProgress > 0 ? 'Continue' : 'Start') : 'Enroll'}
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* ================= MAIN CONTENT GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Learning Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* ================= SEARCH & FILTERS ================= */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      placeholder="Search financial crime, money flow, bad debt, AI detection..."
                      className="w-full pl-10 py-2 border border-[#1B4332]/20 rounded-lg focus:ring-2 focus:ring-[#1B4332]/30 focus:border-[#1B4332]"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2 border-[#1B4332]/20 text-[#1B4332] hover:bg-[#1B4332]/10">
                      <Filter className="h-4 w-4" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 border-[#1B4332]/20 text-[#1B4332] hover:bg-[#1B4332]/10">
                      <ListChecks className="h-4 w-4" />
                      My Learning
                    </Button>
                  </div>
                </div>
                
                {/* Category Filters */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {['All', 'Financial Crime', 'Forensic Accounting', 'Money Flow', 'Distressed Assets', 'AI & Technology', 'Regulatory Compliance', 'Crypto Crime'].map((tab) => (
                    <Button
                      key={tab}
                      variant={activeTab === tab.toLowerCase() ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveTab(tab === 'All' ? 'all' : tab.toLowerCase())}
                      className={activeTab === tab.toLowerCase() ? 
                        "bg-[#1B4332] hover:bg-[#2D6A4F]" : 
                        "border-[#1B4332]/20 text-[#1B4332] hover:bg-[#1B4332]/10"}
                    >
                      {tab}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* ================= YOUTUBE SECTION ================= */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-6 w-6 text-red-600" />
                  Financial Intelligence YouTube Channel
                </CardTitle>
                <CardDescription>
                  Expert analysis on financial crime detection, money flow tracing, and distressed asset strategies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-[#1B4332]/20 rounded-xl p-4 space-y-3">
                    <div className="aspect-video bg-gradient-to-br from-[#1B4332]/10 to-[#2D6A4F]/10 rounded-lg flex items-center justify-center">
                      <Play className="h-16 w-16 text-[#1B4332]" />
                    </div>
                    <h4 className="font-semibold text-[#1B4332]">Subscribe to Financial Intelligence</h4>
                    <p className="text-sm text-gray-600">Advanced tutorials on detecting financial leaks, tracing money flows, and capitalizing on distressed debt</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">15K+ Financial Analysts</span>
                      <Button asChild className="gap-2 bg-[#1B4332] hover:bg-[#2D6A4F] text-white">
                        <a href={YOUTUBE_CHANNEL} target="_blank" rel="noopener noreferrer">
                          <Play className="h-4 w-4" />
                          Subscribe
                        </a>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-[#1B4332]">Featured Intelligence Videos</h4>
                      <Button variant="link" size="sm" className="gap-1 text-[#1B4332] hover:text-[#2D6A4F]" asChild>
                        <a href={YOUTUBE_CHANNEL} target="_blank" rel="noopener noreferrer">
                          View All
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                    {data.videos.map((video) => (
                      <div key={video.id} className="flex items-center gap-3 p-2 hover:bg-[#1B4332]/5 rounded-lg border border-[#1B4332]/10">
                        <div className="w-16 h-12 bg-gradient-to-br from-[#1B4332]/10 to-[#2D6A4F]/10 rounded flex items-center justify-center">
                          <PlayCircle className="h-5 w-5 text-[#1B4332]" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[#1B4332]">{video.title}</p>
                          <p className="text-xs text-gray-500">{video.duration} • {video.views} views</p>
                          {video.started && (
                            <div className="mt-1">
                              <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>Progress</span>
                                <span className="text-[#1B4332]">{video.progress}%</span>
                              </div>
                              <Progress value={video.progress} className="h-1 bg-[#D8F3DC]" />
                            </div>
                          )}
                        </div>
                        <Button 
                          size="sm" 
                          variant={video.completed ? "default" : "outline"}
                          className={`gap-1 ${video.completed ? 
                            'bg-[#1B4332] hover:bg-[#2D6A4F] text-white' : 
                            'border-[#1B4332]/20 text-[#1B4332] hover:bg-[#1B4332]/10'}`}
                          onClick={() => video.completed ? null : handleVideoComplete(video.id)}
                          asChild={!video.completed}
                        >
                          {video.completed ? (
                            <span className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" />
                              Completed
                            </span>
                          ) : (
                            <a 
                              href={video.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              onClick={(e) => {
                                handleVideoStart(video.id);
                                if (video.url.startsWith('http')) {
                                  // Let the link open normally
                                } else {
                                  e.preventDefault();
                                }
                              }}
                            >
                              <PlayCircle className="h-3 w-3" />
                              {video.started ? 'Continue' : 'Watch'}
                            </a>
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ================= INTELLIGENCE BRIEFS ================= */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-6 w-6 text-[#1B4332]" />
                      Financial Intelligence Briefs
                    </CardTitle>
                    <CardDescription>
                      Advanced research on financial crime detection, money flow analysis, and distressed asset strategies
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2 border-[#1B4332]/20 text-[#1B4332] hover:bg-[#1B4332]/10">
                    <Download className="h-4 w-4" />
                    Export Reports
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {loading && (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse border rounded-xl p-5 h-32 bg-[#1B4332]/5"></div>
                    ))}
                  </div>
                )}

                {!loading && filteredArticles.length === 0 && (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No intelligence briefs match your search criteria.</p>
                  </div>
                )}

                {filteredArticles.map((article) => (
                  <motion.div
                    key={article.id}
                    whileHover={{ scale: 1.005 }}
                    className="border border-[#1B4332]/20 rounded-xl p-5 space-y-3 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-lg text-[#1B4332]">
                            {article.title}
                          </h3>
                          {article.premium && (
                            <Badge className="bg-[#1B4332]/10 text-[#1B4332] border border-[#1B4332]/20">Premium</Badge>
                          )}
                          {article.featured && (
                            <Badge className="bg-[#2D6A4F]/10 text-[#2D6A4F] border border-[#2D6A4F]/20">Featured</Badge>
                          )}
                          {article.completed && (
                            <Badge className="bg-[#40916C]/10 text-[#40916C] border border-[#40916C]/20">Completed</Badge>
                          )}
                          {article.started && !article.completed && (
                            <Badge className="bg-[#52B788]/10 text-[#52B788] border border-[#52B788]/20">In Progress</Badge>
                          )}
                        </div>
                        <p className="text-gray-600">{article.summary}</p>

                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(article.publishedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                          <Badge className="bg-[#1B4332]/5 text-[#1B4332] border border-[#1B4332]/20">{article.category}</Badge>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {article.readingTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {getEngagementCount(article.id, 'views')} views
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-center gap-2 ml-4">
                        <Bookmark 
                          className={`h-5 w-5 cursor-pointer ${bookmarked.has(article.id) ? 'text-[#1B4332] fill-[#1B4332]/20' : 'text-gray-400'}`}
                          onClick={() => handleBookmark(article.id)}
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEngagement(article.id, 'likes')}
                          className="h-8 w-8 hover:bg-[#1B4332]/10"
                        >
                          <ThumbsUp className="h-4 w-4" />
                        </Button>
                        <span className="text-xs text-[#1B4332]">{getEngagementCount(article.id, 'likes')}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-[#1B4332]/10">
                      <div className="flex items-center gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-2 hover:bg-[#1B4332]/10 text-[#1B4332]"
                          onClick={() => handleEngagement(article.id, 'comments')}
                        >
                          <MessageSquare className="h-4 w-4" />
                          Comment
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-2 hover:bg-[#1B4332]/10 text-[#1B4332]">
                          <Share2 className="h-4 w-4" />
                          Share
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        {!article.completed && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-[#1B4332]/20 text-[#1B4332] hover:bg-[#1B4332]/10"
                            onClick={() => handleArticleComplete(article.id)}
                          >
                            Mark as Complete
                          </Button>
                        )}
                        <Button
                          className="bg-[#1B4332] hover:bg-[#2D6A4F] text-white gap-2"
                          onClick={() => {
                            handleArticleStart(article.id);
                            window.open(article.url, '_blank');
                          }}
                        >
                          <FileText className="h-4 w-4" />
                          {article.started ? 'Continue Reading' : 'Read Analysis'}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* ================= CERTIFICATIONS ================= */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-[#1B4332]" />
                  My Certifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.certifications.map((cert) => (
                  <div key={cert.id} className="border border-[#1B4332]/20 rounded-lg p-3 hover:bg-[#1B4332]/5 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-sm text-[#1B4332]">{cert.title}</h4>
                        <p className="text-xs text-gray-500">{cert.issuer}</p>
                      </div>
                      <Badge className={`text-xs ${cert.badgeColor}`}>
                        {cert.difficulty}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500">{cert.duration}</span>
                      {cert.enrolled ? (
                        cert.completed ? (
                          <Badge className="bg-[#40916C]/10 text-[#40916C] border border-[#40916C]/20 text-xs">
                            Completed
                          </Badge>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Progress value={cert.progress} className="w-16 h-2 bg-[#D8F3DC]" />
                            <span className="text-xs text-[#1B4332]">{cert.progress}%</span>
                          </div>
                        )
                      ) : (
                        <Button 
                          size="sm" 
                          className="text-xs bg-[#1B4332] hover:bg-[#2D6A4F] text-white"
                          onClick={() => handleEnrollCertification(cert.id)}
                        >
                          Enroll
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* ================= LIVE SESSIONS ================= */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#1B4332]" />
                  Upcoming Intelligence Sessions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.liveSessions.map((session) => (
                  <div key={session.id} className="border border-[#1B4332]/20 rounded-lg p-3 hover:bg-[#1B4332]/5 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-sm text-[#1B4332]">{session.title}</h4>
                        <p className="text-xs text-gray-500">Host: {session.host}</p>
                      </div>
                      {session.registered && (
                        <Badge className="bg-[#2D6A4F]/10 text-[#2D6A4F] border border-[#2D6A4F]/20 text-xs">
                          {session.attended ? 'Attended' : 'Registered'}
                        </Badge>
                      )}
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500">
                        {new Date(session.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })} • {session.time}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {session.attendees}
                      </span>
                    </div>
                    {!session.registered && (
                      <Button 
                        size="sm" 
                        className="w-full mt-2 bg-[#1B4332] hover:bg-[#2D6A4F] text-white"
                        onClick={() => handleRegisterSession(session.id)}
                      >
                        Register Now
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* ================= TRENDING TOPICS ================= */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[#1B4332]" />
                  Trending in Financial Crime
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {data.trendingTopics.map((topic, index) => (
                  <div key={topic.name} className="flex items-center justify-between p-2 hover:bg-[#1B4332]/5 rounded border border-transparent hover:border-[#1B4332]/10">
                    <div className="flex items-center gap-2">
                      <div className="text-lg font-semibold text-[#1B4332]/30">#{index + 1}</div>
                      <div className="flex items-center gap-2">
                        {topic.icon}
                        <span className="text-sm text-[#1B4332]">{topic.name}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-[#1B4332]/20 text-[#1B4332]">{topic.count} analyses</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* ================= FINANCIAL INTELLIGENCE COMMUNITY ================= */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-[#1B4332]" />
                  Intelligence Community
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Discord Community */}
                <div className="flex items-center justify-between p-2 hover:bg-[#1B4332]/5 rounded-lg transition-colors border border-transparent hover:border-[#1B4332]/10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#1B4332]/10 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-[#1B4332]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515a.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0a12.64 12.64 0 00-.617-1.25a.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057a19.9 19.9 0 005.993 3.03a.078.078 0 00.084-.028c.462-.63.872-1.295 1.226-1.994a.076.076 0 00-.041-.106a13.107 13.107 0 01-1.872-.892a.077.077 0 01-.008-.128c.125-.094.25-.188.372-.283a.076.076 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.076.076 0 01.078.01c.12.095.245.189.372.283a.077.077 0 01-.006.127a12.3 12.3 0 01-1.873.892a.077.077 0 00-.041.107c.355.698.765 1.363 1.226 1.993a.076.076 0 00.084.028a19.839 19.839 0 006.002-3.03a.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-sm text-[#1B4332]">Financial Crime Discord</div>
                      <div className="text-xs text-gray-500">Real-time intelligence sharing</div>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="text-xs border-[#1B4332]/20 text-[#1B4332] hover:bg-[#1B4332]/10"
                    asChild
                  >
                    <a 
                      href="https://discord.gg/financial-intelligence" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Join
                    </a>
                  </Button>
                </div>

                {/* LinkedIn Group */}
                <div className="flex items-center justify-between p-2 hover:bg-[#1B4332]/5 rounded-lg transition-colors border border-transparent hover:border-[#1B4332]/10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#1B4332]/10 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-[#1B4332]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-sm text-[#1B4332]">Financial Intelligence Network</div>
                      <div className="text-xs text-gray-500">Professional networking</div>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="text-xs border-[#1B4332]/20 text-[#1B4332] hover:bg-[#1B4332]/10"
                    asChild
                  >
                    <a 
                      href="https://www.linkedin.com/groups/financial-intelligence" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Join
                    </a>
                  </Button>
                </div>

                {/* Financial Forum */}
                <div className="flex items-center justify-between p-2 hover:bg-[#1B4332]/5 rounded-lg transition-colors border border-transparent hover:border-[#1B4332]/10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#1B4332]/10 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-[#1B4332]" />
                    </div>
                    <div>
                      <div className="font-medium text-sm text-[#1B4332]">Forensic Analysis Forum</div>
                      <div className="text-xs text-gray-500">Q&A with financial crime experts</div>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="text-xs border-[#1B4332]/20 text-[#1B4332] hover:bg-[#1B4332]/10"
                    asChild
                  >
                    <a 
                      href="https://forum.financial-intelligence.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Join
                    </a>
                  </Button>
                </div>

                {/* Weekly Intelligence Report */}
                <div className="flex items-center justify-between p-2 hover:bg-[#1B4332]/5 rounded-lg transition-colors border border-transparent hover:border-[#1B4332]/10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#1B4332]/10 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-[#1B4332]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-sm text-[#1B4332]">Weekly Intelligence Report</div>
                      <div className="text-xs text-gray-500">Market anomalies & financial crime insights</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="text-xs border-[#1B4332]/20 text-[#1B4332] hover:bg-[#1B4332]/10"
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent('open-intelligence-report-modal'));
                      }}
                    >
                      Subscribe
                    </Button>
                  </div>
                </div>

                {/* Community Stats - Real Data */}
                <div className="pt-3 border-t border-[#1B4332]/10 mt-2">
                  <CommunityStats />
                </div>

                {/* Community Actions */}
                <div className="pt-2">
                  <Button 
                    className="w-full border-[#1B4332]/20 text-[#1B4332] hover:bg-[#1B4332]/10" 
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      window.location.href = '/intelligence-community';
                    }}
                  >
                    Explore Intelligence Community
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}