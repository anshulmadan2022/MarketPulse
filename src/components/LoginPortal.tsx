import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { 
  Shield, 
  Users, 
  Building2, 
  Mail, 
  Phone, 
  ArrowRight, 
  CheckCircle, 
  AlertTriangle,
  UserCheck,
  Briefcase,
  Gavel,
  Eye,
  Star,
  Lock,
  Globe,
  FileText,
  Award,
  ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoginPortalProps {
  onClose: () => void;
  onLogin: (userType: 'user' | 'sebi-entity' | 'sebi-authority') => void;
}

type LoginMethod = 'email' | 'phone';
type UserType = 'user' | 'sebi-entity' | 'sebi-authority';

export function LoginPortal({ onClose, onLogin }: LoginPortalProps) {
  const [selectedUserType, setSelectedUserType] = useState<UserType>('user');
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'select' | 'credentials' | 'otp' | 'register'>('select');
  const [isLoading, setIsLoading] = useState(false);

  const userTypes = [
    {
      id: 'user' as UserType,
      title: 'Individual Investor',
      description: 'Personal investment and portfolio management',
      icon: <Users className="w-8 h-8" />,
      color: 'emerald',
      features: ['Portfolio Tracking', 'Investment Analysis', 'Financial Planning', 'Market Research']
    },
    {
      id: 'sebi-entity' as UserType,
      title: 'SEBI Registered Entity',
      description: 'Registered investment professionals and advisors',
      icon: <Building2 className="w-8 h-8" />,
      color: 'cyan',
      features: ['Client Management', 'Advisory Tools', 'Compliance Tracking', 'Research Publishing']
    },
    {
      id: 'sebi-authority' as UserType,
      title: 'SEBI Authority',
      description: 'Regulatory oversight and compliance monitoring',
      icon: <Shield className="w-8 h-8" />,
      color: 'purple',
      features: ['Entity Verification', 'Compliance Monitoring', 'Regulatory Tools', 'Market Surveillance']
    }
  ];

  const sebiEntityTypes = [
    {
      type: 'Investment Adviser (IA)',
      description: 'Can provide personalized financial advice after proper risk assessment',
      requirements: ['SEBI IA Registration', 'Valid License', 'Compliance Certificate'],
      icon: <UserCheck className="w-6 h-6" />
    },
    {
      type: 'Research Analyst (RA)',
      description: 'Can publish research reports and stock recommendations',
      requirements: ['SEBI RA Registration', 'Research Credentials', 'Publishing License'],
      icon: <FileText className="w-6 h-6" />
    },
    {
      type: 'Portfolio Manager',
      description: 'Can manage client investments on their behalf',
      requirements: ['SEBI PM Registration', 'Fund Management License', 'AUM Compliance'],
      icon: <Briefcase className="w-6 h-6" />
    },
    {
      type: 'Stock Broker/Sub-broker',
      description: 'Can provide execution-related trading advice',
      requirements: ['SEBI Broker Registration', 'Trading License', 'Member of Exchange'],
      icon: <Award className="w-6 h-6" />
    }
  ];

  const handleSendOTP = async () => {
    setIsLoading(true);
    // Simulate OTP sending
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
    }, 2000);
  };

  const handleVerifyOTP = async () => {
    setIsLoading(true);
    // Simulate OTP verification
    setTimeout(() => {
      setIsLoading(false);
      onLogin(selectedUserType);
    }, 1500);
  };

  const handleRegisterSEBIEntity = () => {
    setStep('register');
  };

  const renderUserTypeSelection = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Access MarketPulse Platform
        </h2>
        <p className="text-gray-600 text-lg">
          Choose your access level to continue with secure authentication
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {userTypes.map((type, index) => (
          <motion.div
            key={type.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card 
              className={`border-gray-200 hover:shadow-lg cursor-pointer transition-all duration-300 ${
                selectedUserType === type.id 
                  ? 'ring-2 ring-[#0F9D58] border-[#0F9D58] bg-[#0F9D58]/5' 
                  : 'hover:border-[#0F9D58]'
              }`}
              onClick={() => setSelectedUserType(type.id)}
            >
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#0F9D58]/10 flex items-center justify-center text-[#0F9D58]`}>
                  {type.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{type.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{type.description}</p>
                <div className="space-y-2">
                  {type.features.map((feature, i) => (
                    <div key={i} className="flex items-center justify-center gap-2 text-xs text-gray-600">
                      <CheckCircle className="w-3 h-3 text-[#0F9D58]" />
                      {feature}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="text-center">
        <Button 
          onClick={() => setStep('credentials')}
          className="bg-[#0F9D58] text-white hover:bg-[#0e8a4f] px-8 py-3 font-semibold"
          disabled={!selectedUserType}
        >
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  );

  const renderCredentialsForm = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          onClick={() => setStep('select')}
          className="text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {userTypes.find(t => t.id === selectedUserType)?.title}
          </h2>
          <p className="text-gray-600">Secure authentication via OTP</p>
        </div>
      </div>

      <Card className="border-gray-200 bg-white">
        <CardContent className="p-6">
          <Tabs value={loginMethod} onValueChange={(value) => setLoginMethod(value as LoginMethod)}>
            <TabsList className="grid w-full grid-cols-2 bg-gray-100">
              <TabsTrigger value="email" className="data-[state=active]:bg-[#0F9D58] data-[state=active]:text-white">
                <Mail className="w-4 h-4 mr-2" />
                Email
              </TabsTrigger>
              <TabsTrigger value="phone" className="data-[state=active]:bg-[#0F9D58] data-[state=active]:text-white">
                <Phone className="w-4 h-4 mr-2" />
                Phone
              </TabsTrigger>
            </TabsList>

            <TabsContent value="email" className="space-y-4 mt-6">
              <div>
                <Label htmlFor="email" className="text-gray-700">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500"
                />
              </div>
            </TabsContent>

            <TabsContent value="phone" className="space-y-4 mt-6">
              <div>
                <Label htmlFor="phone" className="text-gray-700">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-2 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500"
                />
              </div>
            </TabsContent>
          </Tabs>

          <Button 
            onClick={handleSendOTP}
            disabled={isLoading || (!email && !phone)}
            className="w-full mt-6 bg-[#0F9D58] text-white hover:bg-[#0e8a4f]"
          >
            {isLoading ? 'Sending OTP...' : 'Send OTP'}
          </Button>
        </CardContent>
      </Card>

      {selectedUserType === 'sebi-entity' && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-amber-800 mb-2">
                  SEBI Registration Required
                </h3>
                <p className="text-amber-700 text-sm mb-4">
                  Only SEBI-registered entities can provide financial advice. Your registration will be verified by SEBI authorities.
                </p>
                <Button
                  variant="outline"
                  onClick={handleRegisterSEBIEntity}
                  className="border-amber-600 text-amber-700 hover:bg-amber-100"
                >
                  Register as SEBI Entity
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );

  const renderOTPForm = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          onClick={() => setStep('credentials')}
          className="text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Enter OTP</h2>
          <p className="text-gray-600">
            Code sent to {loginMethod === 'email' ? email : phone}
          </p>
        </div>
      </div>

      <Card className="border-gray-200 bg-white">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[#0F9D58]/10 flex items-center justify-center">
            <Lock className="w-8 h-8 text-[#0F9D58]" />
          </div>
          
          <div className="mb-6">
            <Label htmlFor="otp" className="text-gray-700">6-Digit OTP</Label>
            <Input
              id="otp"
              type="text"
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="mt-2 text-center text-2xl tracking-widest bg-gray-50 border-gray-200 text-gray-900"
              maxLength={6}
            />
          </div>

          <Button 
            onClick={handleVerifyOTP}
            disabled={isLoading || otp.length !== 6}
            className="w-full bg-[#0F9D58] text-white hover:bg-[#0e8a4f]"
          >
            {isLoading ? 'Verifying...' : 'Verify & Login'}
          </Button>

          <Button 
            variant="ghost"
            onClick={handleSendOTP}
            className="w-full mt-3 text-gray-600 hover:text-gray-900"
          >
            Resend OTP
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderRegistrationForm = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          onClick={() => setStep('credentials')}
          className="text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">SEBI Entity Registration</h2>
          <p className="text-gray-600">Register as a SEBI-compliant financial advisor</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sebiEntityTypes.map((entity, index) => (
          <Card key={index} className="border-gray-200 bg-white hover:border-[#0F9D58] hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#0F9D58]/10 flex items-center justify-center text-[#0F9D58]">
                  {entity.icon}
                </div>
                <h3 className="font-semibold text-gray-900">{entity.type}</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">{entity.description}</p>
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Requirements:</p>
                {entity.requirements.map((req, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                    <CheckCircle className="w-3 h-3 text-[#0F9D58]" />
                    {req}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-orange-800 mb-2">
                Verification Process
              </h3>
              <p className="text-orange-700 text-sm mb-4">
                Your application will be reviewed by SEBI authorities. The verification process typically takes 3-5 business days. 
                You'll receive a confirmation email once your registration is approved.
              </p>
              <div className="space-y-2 text-sm text-orange-700">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-600" />
                  Submit required documentation
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-blue-600" />
                  SEBI authority review
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#0F9D58]" />
                  Registration confirmation
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button className="bg-[#0F9D58] text-white hover:bg-[#0e8a4f] px-8 py-3">
          Submit Application for Review
        </Button>
      </div>
    </motion.div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <Card className="bg-white border-gray-200 shadow-xl">
          <CardHeader className="relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#0F9D58]/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-[#0F9D58]" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-gray-900">MarketPulse Login</CardTitle>
                  <p className="text-gray-600">Secure access to financial markets</p>
                </div>
              </div>
              <Button
                variant="ghost"
                onClick={onClose}
                className="text-gray-600 hover:text-gray-900"
              >
                ✕
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <AnimatePresence mode="wait">
              {step === 'select' && renderUserTypeSelection()}
              {step === 'credentials' && renderCredentialsForm()}
              {step === 'otp' && renderOTPForm()}
              {step === 'register' && renderRegistrationForm()}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}