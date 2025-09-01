import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  BookOpen, 
  PlayCircle, 
  GraduationCap, 
  Trophy, 
  Clock, 
  Users, 
  Star, 
  CheckCircle, 
  ArrowRight,
  Calculator,
  Shield,
  TrendingUp,
  FileText,
  Award,
  Target,
  Lightbulb,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  lessons: number;
  rating: number;
  enrolled: number;
  completed: boolean;
  progress: number;
  category: string;
  instructor: string;
  thumbnail: string;
}

interface SEBIResource {
  id: string;
  title: string;
  type: 'Video' | 'PDF' | 'Guide' | 'Regulation';
  duration?: string;
  description: string;
  url: string;
  category: string;
}

export function EducationSection() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  // Mock courses data
  const courses: Course[] = [
    {
      id: '1',
      title: 'Stock Market Basics for Beginners',
      description: 'Learn the fundamentals of stock market investing, including how markets work, key terminology, and basic strategies.',
      duration: '4 hours',
      difficulty: 'Beginner',
      lessons: 12,
      rating: 4.8,
      enrolled: 15420,
      completed: false,
      progress: 0,
      category: 'Fundamentals',
      instructor: 'Dr. Rajesh Sharma',
      thumbnail: 'beginner-course'
    },
    {
      id: '2',
      title: 'Technical Analysis Masterclass',
      description: 'Master the art of technical analysis with chart patterns, indicators, and trading strategies used by professionals.',
      duration: '8 hours',
      difficulty: 'Intermediate',
      lessons: 20,
      rating: 4.9,
      enrolled: 8750,
      completed: false,
      progress: 35,
      category: 'Technical Analysis',
      instructor: 'Priya Menon',
      thumbnail: 'technical-analysis'
    },
    {
      id: '3',
      title: 'Portfolio Management & Risk Assessment',
      description: 'Advanced strategies for building and managing a diversified investment portfolio with proper risk management.',
      duration: '6 hours',
      difficulty: 'Advanced',
      lessons: 15,
      rating: 4.7,
      enrolled: 5630,
      completed: true,
      progress: 100,
      category: 'Portfolio Management',
      instructor: 'Amit Gupta',
      thumbnail: 'portfolio-management'
    },
    {
      id: '4',
      title: 'Mutual Funds & SIP Strategies',
      description: 'Complete guide to mutual fund investing, SIP planning, and selecting the right funds for your goals.',
      duration: '5 hours',
      difficulty: 'Beginner',
      lessons: 14,
      rating: 4.6,
      enrolled: 12340,
      completed: false,
      progress: 60,
      category: 'Mutual Funds',
      instructor: 'Sneha Patel',
      thumbnail: 'mutual-funds'
    },
    {
      id: '5',
      title: 'Options & Derivatives Trading',
      description: 'Advanced course on options trading, derivatives, and complex trading strategies for experienced investors.',
      duration: '10 hours',
      difficulty: 'Advanced',
      lessons: 25,
      rating: 4.8,
      enrolled: 3420,
      completed: false,
      progress: 15,
      category: 'Derivatives',
      instructor: 'Rohit Agarwal',
      thumbnail: 'options-trading'
    },
    {
      id: '6',
      title: 'Fundamental Analysis Deep Dive',
      description: 'Learn to analyze company financials, ratios, and market conditions to make informed investment decisions.',
      duration: '7 hours',
      difficulty: 'Intermediate',
      lessons: 18,
      rating: 4.7,
      enrolled: 7890,
      completed: false,
      progress: 0,
      category: 'Fundamental Analysis',
      instructor: 'Kavya Reddy',
      thumbnail: 'fundamental-analysis'
    }
  ];

  // Mock SEBI resources
  const sebiResources: SEBIResource[] = [
    {
      id: '1',
      title: 'Introduction to Indian Capital Markets',
      type: 'Video',
      duration: '45 mins',
      description: 'Official SEBI video explaining the structure and functioning of Indian capital markets.',
      url: '#',
      category: 'Basics'
    },
    {
      id: '2',
      title: 'Investor Protection Guidelines',
      type: 'PDF',
      description: 'Comprehensive guide on investor rights, grievance redressal, and protection mechanisms.',
      url: '#',
      category: 'Investor Protection'
    },
    {
      id: '3',
      title: 'KYC and Account Opening Process',
      type: 'Guide',
      description: 'Step-by-step guide for opening demat and trading accounts with proper KYC documentation.',
      url: '#',
      category: 'Getting Started'
    },
    {
      id: '4',
      title: 'Mutual Fund Regulations',
      type: 'Regulation',
      description: 'Latest SEBI regulations governing mutual fund operations and investor guidelines.',
      url: '#',
      category: 'Regulations'
    },
    {
      id: '5',
      title: 'IPO Investment Guidelines',
      type: 'Video',
      duration: '30 mins',
      description: 'Understanding IPO process, application procedures, and investment considerations.',
      url: '#',
      category: 'IPO'
    }
  ];

  const learningPaths = [
    {
      id: '1',
      title: 'Complete Beginner',
      description: 'Start your investment journey from scratch',
      courses: ['Stock Market Basics', 'Mutual Funds & SIP', 'Risk Management'],
      duration: '15 hours',
      icon: <BookOpen className="w-6 h-6" />,
      color: 'bg-green-500'
    },
    {
      id: '2',
      title: 'Active Trader',
      description: 'Learn technical analysis and trading strategies',
      courses: ['Technical Analysis', 'Chart Patterns', 'Risk Management'],
      duration: '25 hours',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-blue-500'
    },
    {
      id: '3',
      title: 'Long-term Investor',
      description: 'Focus on fundamental analysis and portfolio building',
      courses: ['Fundamental Analysis', 'Portfolio Management', 'Value Investing'],
      duration: '20 hours',
      icon: <Target className="w-6 h-6" />,
      color: 'bg-purple-500'
    }
  ];

  const tools = [
    {
      id: '1',
      title: 'SIP Calculator',
      description: 'Calculate returns on systematic investment plans',
      icon: <Calculator className="w-6 h-6" />,
      action: 'Calculate'
    },
    {
      id: '2',
      title: 'Risk Assessment',
      description: 'Evaluate your risk tolerance and investment profile',
      icon: <Shield className="w-6 h-6" />,
      action: 'Assess'
    },
    {
      id: '3',
      title: 'Goal Planner',
      description: 'Plan your financial goals and investment strategy',
      icon: <Target className="w-6 h-6" />,
      action: 'Plan'
    }
  ];

  const filteredCourses = selectedDifficulty === 'all' 
    ? courses 
    : courses.filter(course => course.difficulty.toLowerCase() === selectedDifficulty);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Video':
        return <PlayCircle className="w-4 h-4" />;
      case 'PDF':
        return <FileText className="w-4 h-4" />;
      case 'Guide':
        return <BookOpen className="w-4 h-4" />;
      case 'Regulation':
        return <Shield className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center py-12 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-3xl blur-3xl"></div>
        <div className="relative">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-6"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-[var(--brand-gold)] to-[var(--brand-dark-gold)] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-[var(--brand-gold)]/20">
              <GraduationCap className="w-10 h-10 text-[var(--brand-navy)]" />
            </div>
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-[var(--brand-gold)] to-white bg-clip-text text-transparent">
              Learn. Invest.
            </span>
            <br />
            <span className="bg-gradient-to-r from-[var(--brand-gold)] via-yellow-300 to-[var(--brand-gold)] bg-clip-text text-transparent">
              Grow Wealth.
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Master the art of investing with comprehensive courses, SEBI-approved resources, and expert guidance. 
            Start your financial education journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-[var(--brand-gold)] to-[var(--brand-dark-gold)] text-[var(--brand-navy)] hover:shadow-2xl hover:shadow-[var(--brand-gold)]/25 transition-all duration-300 transform hover:scale-105 px-8 py-3 text-lg font-semibold"
            >
              <PlayCircle className="w-5 h-5 mr-2" />
              Start Learning
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-[var(--brand-gold)] text-[var(--brand-gold)] hover:bg-[var(--brand-gold)] hover:text-[var(--brand-navy)] transition-all duration-300 px-8 py-3 text-lg backdrop-blur-sm bg-white/10"
            >
              <Shield className="w-5 h-5 mr-2" />
              SEBI Resources
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Navigation Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-white/10 backdrop-blur-md">
          <TabsTrigger value="overview" className="data-[state=active]:bg-[var(--brand-gold)] data-[state=active]:text-[var(--brand-navy)]">
            Overview
          </TabsTrigger>
          <TabsTrigger value="courses" className="data-[state=active]:bg-[var(--brand-gold)] data-[state=active]:text-[var(--brand-navy)]">
            Courses
          </TabsTrigger>
          <TabsTrigger value="sebi" className="data-[state=active]:bg-[var(--brand-gold)] data-[state=active]:text-[var(--brand-navy)]">
            SEBI Resources
          </TabsTrigger>
          <TabsTrigger value="tools" className="data-[state=active]:bg-[var(--brand-gold)] data-[state=active]:text-[var(--brand-navy)]">
            Tools
          </TabsTrigger>
          <TabsTrigger value="progress" className="data-[state=active]:bg-[var(--brand-gold)] data-[state=active]:text-[var(--brand-navy)]">
            Progress
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-8">
          {/* Learning Paths */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-[var(--brand-gold)] bg-clip-text text-transparent mb-6">
              Choose Your Learning Path
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {learningPaths.map((path, index) => (
                <motion.div
                  key={path.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="group h-full hover:shadow-2xl transition-all duration-300 bg-white/10 backdrop-blur-md border-white/20 hover:border-[var(--brand-gold)] hover:-translate-y-1">
                    <CardHeader>
                      <div className={`w-12 h-12 ${path.color} rounded-xl flex items-center justify-center mb-4 text-white`}>
                        {path.icon}
                      </div>
                      <CardTitle className="text-white group-hover:text-[var(--brand-gold)] transition-colors">
                        {path.title}
                      </CardTitle>
                      <p className="text-gray-300 text-sm">{path.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-sm text-gray-400">
                          <Clock className="w-4 h-4 inline mr-1" />
                          {path.duration}
                        </div>
                        <div className="space-y-2">
                          {path.courses.map((course, i) => (
                            <div key={i} className="flex items-center text-sm text-gray-300">
                              <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                              {course}
                            </div>
                          ))}
                        </div>
                        <Button className="w-full bg-gradient-to-r from-[var(--brand-gold)] to-[var(--brand-dark-gold)] text-[var(--brand-navy)] hover:shadow-lg transition-all duration-300">
                          Start Path <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Quick Stats */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-[var(--brand-gold)] mb-2">50+</div>
                <div className="text-white">Expert Courses</div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-[var(--brand-gold)] mb-2">25K+</div>
                <div className="text-white">Active Learners</div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-[var(--brand-gold)] mb-2">4.8</div>
                <div className="text-white">Average Rating</div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-[var(--brand-gold)] mb-2">15+</div>
                <div className="text-white">SEBI Resources</div>
              </CardContent>
            </Card>
          </motion.section>
        </TabsContent>

        {/* Courses Tab */}
        <TabsContent value="courses" className="space-y-6">
          {/* Course Filters */}
          <div className="flex flex-wrap gap-4">
            <Button
              variant={selectedDifficulty === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedDifficulty('all')}
              className={selectedDifficulty === 'all' ? 'bg-[var(--brand-gold)] text-[var(--brand-navy)]' : 'border-[var(--brand-gold)] text-[var(--brand-gold)]'}
            >
              All Levels
            </Button>
            <Button
              variant={selectedDifficulty === 'beginner' ? 'default' : 'outline'}
              onClick={() => setSelectedDifficulty('beginner')}
              className={selectedDifficulty === 'beginner' ? 'bg-[var(--brand-gold)] text-[var(--brand-navy)]' : 'border-[var(--brand-gold)] text-[var(--brand-gold)]'}
            >
              Beginner
            </Button>
            <Button
              variant={selectedDifficulty === 'intermediate' ? 'default' : 'outline'}
              onClick={() => setSelectedDifficulty('intermediate')}
              className={selectedDifficulty === 'intermediate' ? 'bg-[var(--brand-gold)] text-[var(--brand-navy)]' : 'border-[var(--brand-gold)] text-[var(--brand-gold)]'}
            >
              Intermediate
            </Button>
            <Button
              variant={selectedDifficulty === 'advanced' ? 'default' : 'outline'}
              onClick={() => setSelectedDifficulty('advanced')}
              className={selectedDifficulty === 'advanced' ? 'bg-[var(--brand-gold)] text-[var(--brand-navy)]' : 'border-[var(--brand-gold)] text-[var(--brand-gold)]'}
            >
              Advanced
            </Button>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="group h-full hover:shadow-2xl transition-all duration-300 bg-white/10 backdrop-blur-md border-white/20 hover:border-[var(--brand-gold)] hover:-translate-y-1">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Badge className={`${getDifficultyColor(course.difficulty)} text-xs`}>
                        {course.difficulty}
                      </Badge>
                      {course.completed && (
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg leading-tight text-white group-hover:text-[var(--brand-gold)] transition-colors line-clamp-2">
                      {course.title}
                    </CardTitle>
                    <p className="text-gray-300 text-sm">By {course.instructor}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-300 text-sm line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                    
                    {course.progress > 0 && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          <span>{course.lessons} lessons</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span>{course.rating}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Users className="w-3 h-3" />
                        <span>{course.enrolled.toLocaleString()} enrolled</span>
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-gradient-to-r from-[var(--brand-gold)] to-[var(--brand-dark-gold)] text-[var(--brand-navy)] hover:shadow-lg transition-all duration-300"
                      >
                        {course.completed ? 'Review' : course.progress > 0 ? 'Continue' : 'Start'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* SEBI Resources Tab */}
        <TabsContent value="sebi" className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-[var(--brand-gold)] bg-clip-text text-transparent mb-4">
              Official SEBI Resources
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Access official educational content from the Securities and Exchange Board of India (SEBI) 
              to understand regulations, investor protection, and market mechanisms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sebiResources.map((resource, index) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="group h-full hover:shadow-2xl transition-all duration-300 bg-white/10 backdrop-blur-md border-white/20 hover:border-[var(--brand-gold)] hover:-translate-y-1">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(resource.type)}
                        <Badge className="bg-blue-100 text-blue-800 text-xs">
                          {resource.type}
                        </Badge>
                      </div>
                      {resource.duration && (
                        <div className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {resource.duration}
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-lg leading-tight text-white group-hover:text-[var(--brand-gold)] transition-colors">
                      {resource.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {resource.description}
                    </p>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <Badge className="bg-orange-100 text-orange-800 text-xs">
                        {resource.category}
                      </Badge>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-[var(--brand-gold)] text-[var(--brand-gold)] hover:bg-[var(--brand-gold)] hover:text-[var(--brand-navy)] transition-all duration-300"
                      >
                        {resource.type === 'Video' ? 'Watch' : 'View'}
                        <ChevronRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* SEBI Official Links */}
          <Card className="bg-gradient-to-r from-[var(--brand-navy)]/80 via-[var(--brand-light-navy)]/80 to-[var(--brand-navy)]/80 backdrop-blur-md border-[var(--brand-gold)]/30">
            <CardContent className="p-6">
              <div className="text-center">
                <Shield className="w-12 h-12 text-[var(--brand-gold)] mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Official SEBI Portal</h3>
                <p className="text-gray-300 mb-4">
                  Visit the official SEBI website for the latest regulations, investor alerts, and educational materials.
                </p>
                <Button 
                  className="bg-gradient-to-r from-[var(--brand-gold)] to-[var(--brand-dark-gold)] text-[var(--brand-navy)] hover:shadow-xl transition-all duration-300"
                >
                  Visit SEBI.gov.in
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tools Tab */}
        <TabsContent value="tools" className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-[var(--brand-gold)] bg-clip-text text-transparent mb-4">
              Investment Tools & Calculators
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Use our comprehensive suite of financial tools to plan your investments, 
              assess risks, and calculate potential returns.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tools.map((tool, index) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="group h-full hover:shadow-2xl transition-all duration-300 bg-white/10 backdrop-blur-md border-white/20 hover:border-[var(--brand-gold)] hover:-translate-y-1 text-center">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-[var(--brand-gold)] to-[var(--brand-dark-gold)] rounded-2xl flex items-center justify-center mx-auto mb-6 text-[var(--brand-navy)]">
                      {tool.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-[var(--brand-gold)] transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-gray-300 mb-6 leading-relaxed">
                      {tool.description}
                    </p>
                    <Button 
                      className="w-full bg-gradient-to-r from-[var(--brand-gold)] to-[var(--brand-dark-gold)] text-[var(--brand-navy)] hover:shadow-lg transition-all duration-300"
                    >
                      {tool.action}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Additional Tools */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-[var(--brand-gold)]" />
                  Investment Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-gray-300 text-sm space-y-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <span>Start with small amounts and increase gradually</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <span>Diversify your portfolio across asset classes</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <span>Invest for long-term wealth creation</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <span>Review and rebalance periodically</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-[var(--brand-gold)]" />
                  Success Milestones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-gray-300 text-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Complete first course</span>
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Open investment account</span>
                    <div className="w-4 h-4 border-2 border-gray-400 rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Make first investment</span>
                    <div className="w-4 h-4 border-2 border-gray-400 rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Build diversified portfolio</span>
                    <div className="w-4 h-4 border-2 border-gray-400 rounded" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Progress Tab */}
        <TabsContent value="progress" className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-[var(--brand-gold)] bg-clip-text text-transparent mb-4">
              Your Learning Progress
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Track your educational journey and celebrate your achievements in stock market learning.
            </p>
          </div>

          {/* Overall Progress */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[var(--brand-gold)]" />
                Overall Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Learning Progress</span>
                  <span className="text-white">65%</span>
                </div>
                <Progress value={65} className="h-3" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--brand-gold)] mb-1">12</div>
                  <div className="text-gray-300 text-sm">Courses Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--brand-gold)] mb-1">45h</div>
                  <div className="text-gray-300 text-sm">Learning Hours</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--brand-gold)] mb-1">8</div>
                  <div className="text-gray-300 text-sm">Certificates Earned</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course Progress */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Course Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {courses.filter(course => course.progress > 0).map((course) => (
                <div key={course.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-white font-medium">{course.title}</div>
                      <div className="text-gray-400 text-sm">{course.instructor}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[var(--brand-gold)] font-bold">{course.progress}%</div>
                      {course.completed && (
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          <Award className="w-3 h-3 mr-1" />
                          Certified
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="bg-gradient-to-r from-[var(--brand-navy)]/80 via-[var(--brand-light-navy)]/80 to-[var(--brand-navy)]/80 backdrop-blur-md border-[var(--brand-gold)]/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[var(--brand-gold)]" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                <div className="w-12 h-12 bg-[var(--brand-gold)] rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-[var(--brand-navy)]" />
                </div>
                <div>
                  <div className="text-white font-medium">Portfolio Management Certificate</div>
                  <div className="text-gray-400 text-sm">Completed advanced portfolio management course</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-white font-medium">First Investment Milestone</div>
                  <div className="text-gray-400 text-sm">Successfully made your first stock investment</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}