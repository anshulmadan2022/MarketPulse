import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  TrendingUp, 
  Shield, 
  Search, 
  BarChart3, 
  PieChart, 
  FileText, 
  Users, 
  Award,
  Zap,
  Target,
  Eye,
  Brain,
  CheckCircle,
  ArrowRight,
  Star,
  Globe,
  BookOpen,
  Building,
  Briefcase,
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';
import { NewsSection } from './NewsSection';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  // Services data
  const services = [
    {
      id: 'screener',
      title: 'Stock Screener',
      description: 'Advanced screening with 50+ financial metrics to find the perfect stocks for your portfolio',
      icon: <Search className="w-8 h-8" />,
      features: ['50+ Financial Ratios', 'Custom Filters', 'Real-time Data', 'Export Reports']
    },
    {
      id: 'analysis',
      title: 'Stock Analysis',
      description: 'Comprehensive analysis with interactive charts and detailed company fundamentals',
      icon: <BarChart3 className="w-8 h-8" />,
      features: ['Technical Charts', 'Fundamental Analysis', 'Peer Comparison', 'Price Targets']
    },
    {
      id: 'ipo',
      title: 'IPO Center',
      description: 'Complete IPO information, applications, and analysis for upcoming public offerings',
      icon: <TrendingUp className="w-8 h-8" />,
      features: ['IPO Calendar', 'Application Links', 'GMP Tracking', 'Analysis Reports']
    },
    {
      id: 'portfolio',
      title: 'Portfolio Management',
      description: 'Track your investments with advanced analytics and performance insights',
      icon: <PieChart className="w-8 h-8" />,
      features: ['Performance Tracking', 'Risk Analysis', 'Asset Allocation', 'Tax Optimization']
    }
  ];

  // About sections
  const aboutSections = [
    {
      title: 'Our Mission',
      description: 'To democratize financial markets by providing retail investors with institutional-grade analytics and research tools.',
      icon: <Target className="w-6 h-6" />
    },
    {
      title: 'Our Vision',
      description: 'To become India\'s most trusted platform for stock research, analysis, and investment decision-making.',
      icon: <Eye className="w-6 h-6" />
    },
    {
      title: 'Our Technology',
      description: 'Powered by advanced algorithms, real-time data feeds, and AI-driven insights for superior investment decisions.',
      icon: <Brain className="w-6 h-6" />
    }
  ];

  // Key features
  const keyFeatures = [
    'SEBI Registered Investment Advisors',
    'Real-time Market Data',
    '50+ Financial Screening Parameters',
    'Interactive Chart Analysis',
    'PDF Report Generation',
    'Mobile Responsive Design',
    'Secure Data Encryption',
    'Regular Market Updates'
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center py-16"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Financial Analytics
              <span className="block text-[#0F9D58]">Redefined</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              India's most comprehensive stock screening and analysis platform. Make informed investment decisions 
              with institutional-grade research tools and SEBI-compliant advisory services.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button 
                onClick={() => onNavigate('live-market')}
                className="bg-[#0F9D58] text-white hover:bg-[#0e8a4f] px-8 py-4 text-lg font-medium"
              >
                <Activity className="w-5 h-5 mr-2" />
                Live Market Data
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                onClick={() => onNavigate('screener')}
                className="bg-[var(--brand-gold)] text-[var(--brand-navy)] hover:bg-[var(--brand-dark-gold)] px-8 py-4 text-lg font-medium"
              >
                <Search className="w-5 h-5 mr-2" />
                Start Screening
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                onClick={() => onNavigate('investor-test')}
                className="bg-gradient-to-r from-[var(--brand-navy)] to-[var(--brand-deep-navy)] text-white hover:shadow-xl hover:shadow-[var(--brand-navy)]/30 px-8 py-4 text-lg font-medium transform hover:scale-105 transition-all duration-300"
              >
                <Award className="w-5 h-5 mr-2" />
                Take Investor Test
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-2 text-[#0F9D58]" />
                SEBI Registered
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2 text-[#0F9D58]" />
                10,000+ Active Users
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-[var(--brand-gold)]" />
                Grade A Certified
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* About Sections */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-4xl font-bold text-center mb-2 text-gray-900">
            About Our Platform
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Empowering retail investors with professional-grade market analysis tools
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {aboutSections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Card className="h-full border-gray-200 hover:border-[#0F9D58] hover:shadow-lg transition-all duration-300">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-[#0F9D58]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#0F9D58]">
                      {section.icon}
                    </div>
                    <CardTitle className="text-xl text-gray-900">{section.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-center leading-relaxed">
                      {section.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Services Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h2 className="text-4xl font-bold text-center mb-2 text-gray-900">
            Our Services
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Comprehensive tools for every aspect of your investment journey
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Card 
                  className="h-full border-gray-200 hover:border-[#0F9D58] hover:shadow-lg transition-all duration-300 group cursor-pointer"
                  onClick={() => onNavigate(service.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="w-16 h-16 bg-[#0F9D58]/10 rounded-2xl flex items-center justify-center mb-4 text-[#0F9D58] group-hover:bg-[#0F9D58] group-hover:text-white transition-all duration-300">
                          {service.icon}
                        </div>
                        <CardTitle className="text-xl text-gray-900 group-hover:text-[#0F9D58] transition-colors">
                          {service.title}
                        </CardTitle>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#0F9D58] transition-colors" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 leading-relaxed">
                      {service.description}
                    </p>
                    <div className="space-y-2">
                      {service.features.map((feature, i) => (
                        <div key={i} className="flex items-center text-sm text-gray-500">
                          <CheckCircle className="w-3 h-3 mr-2 text-[#0F9D58]" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Key Features */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-gray-50 rounded-3xl p-8"
        >
          <h2 className="text-4xl font-bold text-center mb-2 text-gray-900">
            Platform Features
          </h2>
          <p className="text-gray-600 text-center mb-8 max-w-3xl mx-auto">
            Everything you need for successful investing in one powerful platform
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {keyFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.05 * index }}
                className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-[#0F9D58] hover:shadow-md transition-all duration-300"
              >
                <Star className="w-4 h-4 text-[#0F9D58] flex-shrink-0" />
                <span className="text-gray-700 text-sm font-medium">{feature}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Compliance Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="bg-[#0F9D58]/5 rounded-3xl p-8 border border-[#0F9D58]/20"
        >
          <div className="text-center">
            <Shield className="w-16 h-16 text-[#0F9D58] mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">SEBI Compliant Platform</h2>
            <p className="text-gray-600 mb-6 max-w-3xl mx-auto leading-relaxed">
              We are a SEBI registered platform with Grade A certified investment advisors. All our services 
              comply with regulatory guidelines to ensure your investments are protected and our advice is trustworthy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => onNavigate('investor-test')}
                className="bg-gradient-to-r from-[var(--brand-navy)] to-[var(--brand-deep-navy)] text-white hover:shadow-xl hover:shadow-[var(--brand-navy)]/30 transform hover:scale-105 transition-all duration-300"
              >
                <Award className="w-4 h-4 mr-2" />
                Take Investor Awareness Test
              </Button>
              <Button 
                variant="outline"
                onClick={() => onNavigate('sebi-compliance')}
                className="border-[#0F9D58] text-[#0F9D58] hover:bg-[#0F9D58] hover:text-white"
              >
                <FileText className="w-4 h-4 mr-2" />
                View Compliance Details
              </Button>
            </div>
          </div>
        </motion.section>

        {/* Live News Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <h2 className="text-4xl font-bold text-center mb-2 text-gray-900">
            Live Market News
          </h2>
          <p className="text-gray-600 text-center mb-8 max-w-3xl mx-auto">
            Stay updated with the latest market developments and breaking news
          </p>
          <div className="bg-gray-50 rounded-3xl p-8 border border-gray-200">
            <NewsSection />
          </div>
        </motion.section>

      </div>
    </div>
  );
}