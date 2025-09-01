import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Shield, 
  Award, 
  Users, 
  CheckCircle, 
  Star, 
  FileText, 
  Phone, 
  Mail,
  CreditCard,
  Search,
  ExternalLink,
  Building2,
  MessageSquare,
  Calendar,
  Globe,
  BookOpen,
  TrendingUp,
  DollarSign,
  PieChart,
  BarChart3,
  Gavel,
  Eye,
  BookMarked,
  AlertCircle,
  Info,
  ChevronRight,
  Clock,
  UserCheck,
  Lock,
  Zap,
  Smartphone,
  QrCode,
  UserSquare ,
  Fingerprint,
  Check
} from 'lucide-react';
import { motion } from 'framer-motion';
import { FinancialLiteracyAssessment } from './FinancialLiteracyAssessment';
import { LoginPortal } from './LoginPortal';

interface WhatsNewItem {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'event' | 'announcement' | 'update' | 'awareness';
  priority: 'high' | 'medium' | 'low';
  link: string;
}

export function SEBICompliance() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showFinancialAssessment, setShowFinancialAssessment] = useState(false);
  const [showLoginPortal, setShowLoginPortal] = useState(false);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [showKYCVerification, setShowKYCVerification] = useState(false);

  // Security features
  const securityFeatures = [
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: '2FA Authentication',
      description: 'SMS OTP and Authenticator app support',
      status: 'available',
      action: () => setShow2FASetup(true)
    },
    {
      icon: <UserSquare  className="w-6 h-6" />,
      title: 'PAN Verification',
      description: 'Instant PAN card validation',
      status: 'available',
      action: () => setShowKYCVerification(true)
    },
    {
      icon: <Fingerprint className="w-6 h-6" />,
      title: 'Aadhaar Verification',
      description: 'Biometric identity verification',
      status: 'available',
      action: () => setShowKYCVerification(true)
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: 'SSL Encryption',
      description: 'End-to-end data protection',
      status: 'active',
      action: null
    }
  ];

  // What's New / Dynamic Updates
  const whatsNewItems: WhatsNewItem[] = [
    {
      id: '1',
      title: 'T+1 Settlement Cycle Implementation',
      description: 'All equity transactions now settle on T+1 basis, reducing settlement risk significantly',
      date: '2024-12-20',
      type: 'announcement',
      priority: 'high',
      link: 'https://www.sebi.gov.in/legal/circulars/dec-2024/circular-on-t1-settlement.html'
    },
    {
      id: '2',
      title: 'Enhanced KYC Requirements',
      description: 'New KYC guidelines for mutual fund investments above ₹2 lakh implemented',
      date: '2024-12-18',
      type: 'announcement',
      priority: 'high',
      link: 'https://www.sebi.gov.in/legal/circulars/dec-2024/enhanced-kyc-mutual-funds.html'
    },
    {
      id: '3',
      title: 'Market Data Standardization',
      description: 'New framework for standardized market data dissemination across exchanges',
      date: '2024-12-15',
      type: 'update',
      priority: 'medium',
      link: 'https://www.sebi.gov.in/reports-and-statistics/market-data-standards.html'
    },
    {
      id: '4',
      title: 'Green Finance Framework',
      description: 'Comprehensive guidelines for green bonds and sustainable finance launched',
      date: '2024-12-10',
      type: 'update',
      priority: 'medium',
      link: 'https://www.sebi.gov.in/legal/master-circulars/green-finance-framework.html'
    }
  ];

  // SEBI Portal Links
  const sebiPortalLinks = [
    { id: 'about', label: 'About SEBI', icon: <Info className="w-5 h-5" />, url: 'https://www.sebi.gov.in/about.html' },
    { id: 'mf', label: 'Mutual Funds', icon: <PieChart className="w-5 h-5" />, url: 'https://www.sebi.gov.in/filings/mutual-funds.html' },
    { id: 'fpi-investment', label: 'FPI Investment Data', icon: <TrendingUp className="w-5 h-5" />, url: 'https://www.sebi.gov.in/statistics/fpi-investment.html' },
    { id: 'aif', label: 'Alternative Investment Fund', icon: <BarChart3 className="w-5 h-5" />, url: 'https://www.sebi.gov.in/statistics/1392982252002.html' },
    { id: 'fpi', label: 'Foreign Portfolio Investors', icon: <Globe className="w-5 h-5" />, url: 'https://www.sebi.gov.in/fpi' },
    { id: 'ipo', label: 'Public Issues', icon: <DollarSign className="w-5 h-5" />, url: 'https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=3&ssid=19&smid=0' },
    { id: 'research', label: 'Research', icon: <BookOpen className="w-5 h-5" />, url: 'https://www.sebi.gov.in/reports-and-statistics/research.html' },
    { id: 'legal', label: 'Legal Framework', icon: <Gavel className="w-5 h-5" />, url: 'https://www.sebi.gov.in/legal.html' },
    { id: 'enforcement', label: 'Enforcement Actions', icon: <Shield className="w-5 h-5" />, url: 'https://www.sebi.gov.in/enforcement.html' },
    { id: 'filings', label: 'Document Filings', icon: <FileText className="w-5 h-5" />, url: 'https://www.sebi.gov.in/filings.html' },
    { id: 'status', label: 'Application Status', icon: <Clock className="w-5 h-5" />, url: 'https://www.sebi.gov.in/status.html' },
    { id: 'entities', label: 'Registered Entities', icon: <Users className="w-5 h-5" />, url: 'https://www.sebi.gov.in/sebiweb/other/OtherAction.do?doRecognisedFpiFilter=yes' }
  ];

  const handleExternalLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleLogin = (userType: 'user' | 'sebi-entity' | 'sebi-authority') => {
    console.log('Login successful for:', userType);
    setShowLoginPortal(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-50 text-red-600 border-red-200';
      case 'medium': return 'bg-orange-50 text-orange-600 border-orange-200';
      case 'low': return 'bg-green-50 text-green-600 border-green-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'event': return <Calendar className="w-4 h-4" />;
      case 'announcement': return <AlertCircle className="w-4 h-4" />;
      case 'update': return <Zap className="w-4 h-4" />;
      case 'awareness': return <BookMarked className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  if (showFinancialAssessment) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              onClick={() => setShowFinancialAssessment(false)}
              variant="outline"
              className="border-[#0F9D58] text-[#0F9D58] hover:bg-[#0F9D58] hover:text-white"
            >
              ← Back to SEBI Portal
            </Button>
          </div>
          <FinancialLiteracyAssessment />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-[#0F9D58] rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Securities and Exchange Board of India
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto">
            Protecting investor interests and promoting market development through comprehensive regulatory oversight
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              onClick={() => handleExternalLink('https://www.sebi.gov.in')}
              variant="outline"
              className="border-[#0F9D58] text-[#0F9D58] hover:bg-[#0F9D58] hover:text-white px-8 py-3"
            >
              <Globe className="w-4 h-4 mr-2" />
              Official SEBI Portal
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
            <Button 
              onClick={() => setShowLoginPortal(true)}
              className="bg-[#0F9D58] text-white hover:bg-[#0e8a4f] px-8 py-3"
            >
              <Lock className="w-4 h-4 mr-2" />
              Secure Login
            </Button>
          </div>
        </motion.div>

        {/* Security & Compliance Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
            Security & Compliance
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Advanced security measures to protect your data and investments
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {securityFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full border-gray-200 hover:border-[#0F9D58] hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-[#0F9D58]/10 rounded-xl flex items-center justify-center mx-auto mb-4 text-[#0F9D58]">
                      {feature.icon}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{feature.description}</p>
                    
                    {feature.status === 'active' ? (
                      <div className="flex items-center justify-center text-[#0F9D58]">
                        <Check className="w-4 h-4 mr-1" />
                        <span className="text-sm font-medium">Active</span>
                      </div>
                    ) : (
                      <Button
                        onClick={feature.action}
                        size="sm"
                        className="bg-[#0F9D58] text-white hover:bg-[#0e8a4f]"
                      >
                        Set Up
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Quick Access Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
            Quick Access
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Direct access to important SEBI services and resources
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {sebiPortalLinks.map((link, index) => (
              <motion.div
                key={link.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Card 
                  className="cursor-pointer border-gray-200 hover:border-[#0F9D58] hover:shadow-lg transition-all duration-300 group"
                  onClick={() => handleExternalLink(link.url)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="w-10 h-10 bg-[#0F9D58]/10 rounded-lg flex items-center justify-center mx-auto mb-3 text-[#0F9D58] group-hover:bg-[#0F9D58] group-hover:text-white transition-all duration-300">
                      {link.icon}
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 group-hover:text-[#0F9D58] transition-colors leading-tight">
                      {link.label}
                    </h3>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="flex justify-center">
            <TabsList className="bg-gray-100 p-1 rounded-lg">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-[#0F9D58] data-[state=active]:text-white"
              >
                <Shield className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="whats-new" 
                className="data-[state=active]:bg-[#0F9D58] data-[state=active]:text-white"
              >
                <Zap className="w-4 h-4 mr-2" />
                Updates
              </TabsTrigger>
              <TabsTrigger 
                value="services" 
                className="data-[state=active]:bg-[#0F9D58] data-[state=active]:text-white"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Services
              </TabsTrigger>
              <TabsTrigger 
                value="entities" 
                className="data-[state=active]:bg-[#0F9D58] data-[state=active]:text-white"
              >
                <Users className="w-4 h-4 mr-2" />
                Entities
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: <Shield className="w-6 h-6" />, title: 'Regulatory Authority', description: 'Comprehensive market oversight and investor protection' },
                { icon: <Users className="w-6 h-6" />, title: 'Entity Registration', description: 'SEBI-registered advisors and intermediaries verification' },
                { icon: <FileText className="w-6 h-6" />, title: 'Compliance Framework', description: 'Advanced regulatory compliance and monitoring systems' },
                { icon: <Gavel className="w-6 h-6" />, title: 'Legal Protection', description: 'Investor rights protection under securities regulations' },
                { icon: <Eye className="w-6 h-6" />, title: 'Market Surveillance', description: 'Real-time monitoring of market activities and transactions' },
                { icon: <BookOpen className="w-6 h-6" />, title: 'Education Hub', description: 'Comprehensive investor education and awareness programs' }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full border-gray-200 hover:border-[#0F9D58] hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-[#0F9D58]/10 rounded-xl flex items-center justify-center mx-auto mb-4 text-[#0F9D58]">
                        {feature.icon}
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* What's New Tab */}
          <TabsContent value="whats-new" className="space-y-6">
            <div className="space-y-4">
              {whatsNewItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card 
                    className="border-gray-200 hover:border-[#0F9D58] hover:shadow-lg transition-all duration-300 group cursor-pointer"
                    onClick={() => handleExternalLink(item.link)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 bg-[#0F9D58]/10 rounded-lg flex items-center justify-center text-[#0F9D58]">
                              {getTypeIcon(item.type)}
                            </div>
                            <Badge className={getPriorityColor(item.priority)}>
                              {item.priority.toUpperCase()}
                            </Badge>
                            <span className="text-xs text-gray-500 flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {new Date(item.date).toLocaleDateString()}
                            </span>
                          </div>
                          <h3 className="font-semibold text-gray-900 group-hover:text-[#0F9D58] transition-colors mb-2">
                            {item.title}
                          </h3>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#0F9D58] transition-colors flex-shrink-0 ml-4" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: 'Investor Awareness Test',
                  description: 'Comprehensive assessment of financial literacy and investment knowledge',
                  icon: <Award className="w-6 h-6" />,
                  action: () => setShowFinancialAssessment(true),
                  isInternal: true
                },
                {
                  title: 'Fee Payment Portal',
                  description: 'Secure payment gateway for SEBI services and fees',
                  icon: <CreditCard className="w-6 h-6" />,
                  link: 'https://www.sebi.gov.in/sebiweb/other/OtherAction.do?doRecognised=yes&intmId=30'
                },
                {
                  title: 'Document Authentication',
                  description: 'Verify authenticity of SEBI documents and certificates',
                  icon: <FileText className="w-6 h-6" />,
                  link: 'https://www.sebi.gov.in/sebiweb/other/OtherAction.do?doRecognised=yes&intmId=9'
                },
                {
                  title: 'SCORES Portal',
                  description: 'Centralized grievance redressal system for investors',
                  icon: <MessageSquare className="w-6 h-6" />,
                  link: 'https://scores.sebi.gov.in/scores-home'
                },
                {
                  title: 'Research Hub',
                  description: 'Access comprehensive market research and analysis',
                  icon: <BookMarked className="w-6 h-6" />,
                  link: 'https://www.sebi.gov.in/reports-and-statistics/research.html'
                },
                {
                  title: 'Educational Resources',
                  description: 'Interactive learning modules and video content',
                  icon: <BookOpen className="w-6 h-6" />,
                  link: 'https://www.sebi.gov.in/media/video1.html'
                }
              ].map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card 
                    className="h-full border-gray-200 hover:border-[#0F9D58] hover:shadow-lg transition-all duration-300 group cursor-pointer"
                    onClick={() => service.isInternal ? service.action() : handleExternalLink(service.link)}
                  >
                    <CardContent className="p-6">
                      <div className="w-12 h-12 bg-[#0F9D58]/10 rounded-xl flex items-center justify-center mx-auto mb-4 text-[#0F9D58]">
                        {service.icon}
                      </div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-[#0F9D58] transition-colors mb-2 text-center">
                        {service.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed text-center mb-4">
                        {service.description}
                      </p>
                      <div className="text-center">
                        <Button 
                          size="sm"
                          className="bg-[#0F9D58] text-white hover:bg-[#0e8a4f]"
                        >
                          {service.isInternal ? (
                            <>
                              <Star className="w-4 h-4 mr-2" />
                              Take Test
                            </>
                          ) : (
                            <>
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Access
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Entities Tab */}
          <TabsContent value="entities" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Registered Entities Database',
                  description: 'Search and verify SEBI registered brokers, advisors, and intermediaries',
                  type: 'Database Access',
                  link: 'https://www.sebi.gov.in/sebiweb/other/OtherAction.do?doRecognisedFpiFilter=yes'
                },
                {
                  title: 'Investment Advisors',
                  description: 'Find certified investment advisors with valid SEBI registration',
                  type: 'Advisory Services',
                  link: 'https://www.sebi.gov.in/sebiweb/other/OtherAction.do?doRecognisedFpiFilter=yes'
                },
                {
                  title: 'Market Intermediaries',
                  description: 'Complete registry of authorized market participants and sub-brokers',
                  type: 'Market Access',
                  link: 'https://www.sebi.gov.in/sebiweb/other/OtherAction.do?doRecognisedFpiFilter=yes'
                }
              ].map((resource, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card 
                    className="h-full border-gray-200 hover:border-[#0F9D58] hover:shadow-lg transition-all duration-300 group cursor-pointer"
                    onClick={() => handleExternalLink(resource.link)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-[#0F9D58]/10 rounded-xl flex items-center justify-center mx-auto mb-4 text-[#0F9D58]">
                        <Users className="w-8 h-8" />
                      </div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-[#0F9D58] transition-colors mb-2">
                        {resource.title}
                      </h3>
                      <Badge className="bg-[#0F9D58]/10 text-[#0F9D58] border-[#0F9D58]/20 mb-3">
                        {resource.type}
                      </Badge>
                      <p className="text-sm text-gray-600 leading-relaxed mb-4">
                        {resource.description}
                      </p>
                      <Button 
                        size="sm"
                        variant="outline"
                        className="border-[#0F9D58] text-[#0F9D58] hover:bg-[#0F9D58] hover:text-white"
                      >
                        <Search className="w-4 h-4 mr-2" />
                        Search Database
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Legal Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12"
        >
          <Card className="border-[#0F9D58]/20 bg-[#0F9D58]/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Info className="w-6 h-6 text-[#0F9D58] flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-[#0F9D58] mb-2">Regulatory Compliance</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Only SEBI-registered entities can provide financial advice. All investment decisions should be made after 
                    careful consideration of your financial goals and risk tolerance. MarketPulse operates under strict 
                    SEBI guidelines to ensure investor protection and market integrity.
                  </p>
                  <div className="mt-4 text-xs text-gray-500">
                    <p>Official SEBI Website: 
                      <button 
                        onClick={() => handleExternalLink('https://www.sebi.gov.in')}
                        className="text-[#0F9D58] hover:underline ml-1 font-medium"
                      >
                        www.sebi.gov.in
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Login Portal Modal */}
        {showLoginPortal && (
          <LoginPortal
            onClose={() => setShowLoginPortal(false)}
            onLogin={handleLogin}
          />
        )}

        {/* 2FA Setup Modal */}
        {show2FASetup && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg p-6 max-w-md w-full"
            >
              <h3 className="text-lg font-semibold mb-4">Setup 2FA Authentication</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <Smartphone className="w-5 h-5 text-[#0F9D58]" />
                  <div>
                    <div className="font-medium">SMS OTP</div>
                    <div className="text-sm text-gray-600">Receive codes via SMS</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <QrCode className="w-5 h-5 text-[#0F9D58]" />
                  <div>
                    <div className="font-medium">Authenticator App</div>
                    <div className="text-sm text-gray-600">Use Google Authenticator or similar</div>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button
                  onClick={() => setShow2FASetup(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => setShow2FASetup(false)}
                  className="flex-1 bg-[#0F9D58] hover:bg-[#0e8a4f]"
                >
                  Continue
                </Button>
              </div>
            </motion.div>
          </div>
        )}

        {/* KYC Verification Modal */}
        {showKYCVerification && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg p-6 max-w-md w-full"
            >
              <h3 className="text-lg font-semibold mb-4">KYC Verification</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">PAN Number</label>
                  <Input placeholder="Enter your PAN number" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Aadhaar Number</label>
                  <Input placeholder="Enter your Aadhaar number" />
                </div>
                <div className="text-xs text-gray-500">
                  Your data is encrypted and processed securely in compliance with SEBI guidelines.
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button
                  onClick={() => setShowKYCVerification(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => setShowKYCVerification(false)}
                  className="flex-1 bg-[#0F9D58] hover:bg-[#0e8a4f]"
                >
                  Verify
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}