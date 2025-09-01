import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Award, 
  CheckCircle, 
  XCircle, 
  Star, 
  TrendingUp, 
  TrendingDown, 
  Shield, 
  Clock,
  BookOpen,
  Target,
  AlertTriangle,
  Info,
  Download,
  Share2,
  Calculator,
  PieChart,
  DollarSign,
  Wallet,
  CreditCard,
  TrendingUpIcon,
  Brain,
  Heart,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
interface Question {
  id: number;
  question: string;
  options: string[];
  scores: number[];
  category: 'budgeting' | 'saving' | 'investment' | 'risk' | 'knowledge' | 'behavior';
  isKnowledgeBased?: boolean;
  correctAnswer?: number;
}

interface AssessmentResults {
  totalScore: number;
  maxScore: number;
  categoryScores: {
    budgeting: { score: number; max: number; percentage: number };
    saving: { score: number; max: number; percentage: number };
    investment: { score: number; max: number; percentage: number };
    risk: { score: number; max: number; percentage: number };
    knowledge: { score: number; max: number; percentage: number };
    behavior: { score: number; max: number; percentage: number };
  };
  overallLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  riskProfile: 'Conservative' | 'Balanced' | 'Aggressive';
  investmentHorizon: 'Short-term' | 'Medium-term' | 'Long-term';
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  educationPath: string[];
}

export function FinancialLiteracyAssessment() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [results, setResults] = useState<AssessmentResults | null>(null);

  const questions: Question[] = [
    // Budgeting & Awareness (Q1-Q3)
    {
      id: 1,
      question: "Do you maintain a record of your monthly expenses?",
      options: [
        "Yes, in detail (app/spreadsheet)",
        "Rough notes of major expenses", 
        "Sometimes, when I feel the need",
        "No, I don't track expenses"
      ],
      scores: [4, 3, 2, 1],
      category: 'budgeting'
    },
    {
      id: 2,
      question: "How do you handle unexpected expenses (like medical or sudden travel)?",
      options: [
        "Use emergency savings",
        "Cut down on other spending",
        "Use credit cards/loans",
        "I usually struggle with such cases"
      ],
      scores: [4, 3, 2, 1],
      category: 'budgeting'
    },
    {
      id: 3,
      question: "Do you have an emergency fund (3–6 months of expenses)?",
      options: [
        "Yes, well planned",
        "Some savings, not enough",
        "Very little",
        "None"
      ],
      scores: [4, 3, 2, 1],
      category: 'budgeting'
    },
    
    // Saving & Income Management (Q4-Q5)
    {
      id: 4,
      question: "What percentage of your income do you save/invest monthly?",
      options: [
        "More than 40%",
        "20–40%",
        "10–20%",
        "Less than 10%"
      ],
      scores: [4, 3, 2, 1],
      category: 'saving'
    },
    {
      id: 5,
      question: "Do you follow a budget plan (like 50-30-20 rule)?",
      options: [
        "Yes, strictly",
        "Somewhat, not consistent",
        "Rarely",
        "Not at all"
      ],
      scores: [4, 3, 2, 1],
      category: 'saving'
    },
    
    // Investment Habits (Q6-Q8)
    {
      id: 6,
      question: "Which type of investment do you prefer most?",
      options: [
        "Stocks / Crypto / High-risk assets",
        "Mutual funds / SIPs",
        "Gold/Real estate",
        "Bank deposits (FDs, savings accounts)"
      ],
      scores: [4, 3, 2, 1],
      category: 'investment'
    },
    {
      id: 7,
      question: "How often do you review or rebalance your investments?",
      options: [
        "Monthly/Quarterly",
        "Once a year",
        "Rarely",
        "Never"
      ],
      scores: [4, 3, 2, 1],
      category: 'investment'
    },
    {
      id: 8,
      question: "How long do you usually hold your investments?",
      options: [
        "More than 7 years",
        "3–7 years",
        "1–3 years",
        "Less than 1 year"
      ],
      scores: [4, 3, 2, 1],
      category: 'investment'
    },
    
    // Risk Appetite (Q9-Q10)
    {
      id: 9,
      question: "If your investment loses 20% value in a month, what will you do?",
      options: [
        "Buy more at lower prices",
        "Hold and wait for recovery",
        "Sell immediately to avoid further losses",
        "Stop investing completely"
      ],
      scores: [4, 3, 2, 1],
      category: 'risk'
    },
    {
      id: 10,
      question: "What return on investment (ROI) do you expect ideally?",
      options: [
        "15%+ per year (high-risk, high-return)",
        "11–15% per year (growth-oriented)",
        "7–10% per year (moderate)",
        "4–6% per year (safe returns)"
      ],
      scores: [4, 3, 2, 1],
      category: 'risk'
    },
    
    // Financial Knowledge (Q11-Q13)
    {
      id: 11,
      question: "Which of the following best describes inflation?",
      options: [
        "General increase in prices, reducing money's value",
        "Interest paid by banks on deposits",
        "Increase in government spending",
        "Prices of goods going down over time"
      ],
      scores: [4, 0, 0, 0],
      category: 'knowledge',
      isKnowledgeBased: true,
      correctAnswer: 0
    },
    {
      id: 12,
      question: "What does diversification mean in investing?",
      options: [
        "Investing across different assets to reduce risk",
        "Investing only in safe government securities",
        "Selling investments quickly when markets move",
        "Putting all money in one stock for bigger returns"
      ],
      scores: [4, 0, 0, 0],
      category: 'knowledge',
      isKnowledgeBased: true,
      correctAnswer: 0
    },
    {
      id: 13,
      question: "Do you understand the difference between debt and equity investments?",
      options: [
        "Yes, clearly",
        "Somewhat",
        "Heard about it, not sure",
        "Not at all"
      ],
      scores: [4, 3, 2, 1],
      category: 'knowledge'
    },
    
    // Behavioral & Attitude (Q14-Q16)
    {
      id: 14,
      question: "What's your primary reason for investing?",
      options: [
        "Wealth creation over time",
        "Saving for specific goals (house, education, etc.)",
        "Security & safety of money",
        "Quick profits & high returns"
      ],
      scores: [4, 3, 2, 1],
      category: 'behavior'
    },
    {
      id: 15,
      question: "If you suddenly received ₹10,00,000 today, what would you do?",
      options: [
        "Invest most of it for future growth",
        "Invest part and save part for emergencies",
        "Keep it in a bank account for safety",
        "Spend on lifestyle needs (car, travel, etc.)"
      ],
      scores: [4, 3, 2, 1],
      category: 'behavior'
    },
    {
      id: 16,
      question: "How do you usually make financial decisions?",
      options: [
        "Through research and planning",
        "By consulting family/friends",
        "By following trends/news",
        "Impulsively, without much thought"
      ],
      scores: [4, 3, 2, 1],
      category: 'behavior'
    }
  ];

  const startAssessment = () => {
    setTestStarted(true);
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setResults(null);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResults = () => {
    // Initialize category scores
    const categoryScores = {
      budgeting: { score: 0, max: 0, percentage: 0 },
      saving: { score: 0, max: 0, percentage: 0 },
      investment: { score: 0, max: 0, percentage: 0 },
      risk: { score: 0, max: 0, percentage: 0 },
      knowledge: { score: 0, max: 0, percentage: 0 },
      behavior: { score: 0, max: 0, percentage: 0 }
    };

    let totalScore = 0;
    let maxScore = 0;

    // Calculate scores for each category
    questions.forEach((question, index) => {
      const userAnswer = selectedAnswers[index];
      const score = question.scores[userAnswer] || 0;
      const maxQuestionScore = Math.max(...question.scores);
      
      categoryScores[question.category].score += score;
      categoryScores[question.category].max += maxQuestionScore;
      totalScore += score;
      maxScore += maxQuestionScore;
    });

    // Calculate percentages
    Object.keys(categoryScores).forEach(category => {
      const cat = category as keyof typeof categoryScores;
      categoryScores[cat].percentage = 
        categoryScores[cat].max > 0 ? 
        (categoryScores[cat].score / categoryScores[cat].max) * 100 : 0;
    });

    const overallPercentage = (totalScore / maxScore) * 100;

    // Determine overall level
    let overallLevel: 'Beginner' | 'Intermediate' | 'Advanced';
    if (overallPercentage >= 70) {
      overallLevel = 'Advanced';
    } else if (overallPercentage >= 45) {
      overallLevel = 'Intermediate';
    } else {
      overallLevel = 'Beginner';
    }

    // Determine risk profile
    const riskPercentage = categoryScores.risk.percentage;
    let riskProfile: 'Conservative' | 'Balanced' | 'Aggressive';
    if (riskPercentage >= 75) {
      riskProfile = 'Aggressive';
    } else if (riskPercentage >= 50) {
      riskProfile = 'Balanced';
    } else {
      riskProfile = 'Conservative';
    }

    // Determine investment horizon based on Q8 answer
    const horizonAnswer = selectedAnswers[7]; // Q8 (0-indexed)
    let investmentHorizon: 'Short-term' | 'Medium-term' | 'Long-term';
    if (horizonAnswer === 0) investmentHorizon = 'Long-term';
    else if (horizonAnswer === 1) investmentHorizon = 'Long-term';
    else if (horizonAnswer === 2) investmentHorizon = 'Medium-term';
    else investmentHorizon = 'Short-term';

    // Generate strengths and weaknesses
    const strengths: string[] = [];
    const weaknesses: string[] = [];

    if (categoryScores.budgeting.percentage >= 75) {
      strengths.push("Excellent budgeting and expense tracking habits");
    } else if (categoryScores.budgeting.percentage < 50) {
      weaknesses.push("Need to improve budgeting and emergency fund planning");
    }

    if (categoryScores.saving.percentage >= 75) {
      strengths.push("Strong savings discipline and income management");
    } else if (categoryScores.saving.percentage < 50) {
      weaknesses.push("Low savings rate - consider increasing monthly savings");
    }

    if (categoryScores.investment.percentage >= 75) {
      strengths.push("Good investment habits and portfolio management");
    } else if (categoryScores.investment.percentage < 50) {
      weaknesses.push("Limited investment experience - start with basic investment products");
    }

    if (categoryScores.knowledge.percentage >= 75) {
      strengths.push("Strong financial knowledge and market understanding");
    } else if (categoryScores.knowledge.percentage < 50) {
      weaknesses.push("Basic financial concepts need improvement");
    }

    if (categoryScores.risk.percentage >= 75) {
      strengths.push("High risk tolerance for potential higher returns");
    } else if (categoryScores.risk.percentage < 50) {
      weaknesses.push("Conservative approach may limit growth potential");
    }

    if (categoryScores.behavior.percentage >= 75) {
      strengths.push("Rational and planned approach to financial decisions");
    } else if (categoryScores.behavior.percentage < 50) {
      weaknesses.push("Impulsive financial behavior - develop systematic decision making");
    }

    // Generate recommendations based on level
    let recommendations: string[];
    let educationPath: string[];

    if (overallLevel === 'Beginner') {
      recommendations = [
        "Start with creating a monthly budget and tracking expenses",
        "Build an emergency fund covering 3-6 months of expenses",
        "Begin with safe investments like FDs and debt mutual funds",
        "Learn basic financial concepts through SEBI investor education programs",
        "Consult SEBI registered advisors for guidance",
        "Start small SIPs (₹1000-2000) in large-cap mutual funds"
      ];
      educationPath = [
        "Financial Planning Basics",
        "Understanding Different Investment Options",
        "Risk vs Return Concepts",
        "Tax Saving Investments",
        "Emergency Fund Planning"
      ];
    } else if (overallLevel === 'Intermediate') {
      recommendations = [
        "Diversify investments across debt and equity mutual funds",
        "Increase SIP amounts gradually (10-15% annually)",
        "Learn about asset allocation based on age and goals",
        "Consider ELSS funds for tax saving",
        "Start learning about direct equity investments",
        "Review and rebalance portfolio annually"
      ];
      educationPath = [
        "Asset Allocation Strategies", 
        "Mutual Fund Selection Criteria",
        "Direct Stock Market Basics",
        "Portfolio Rebalancing",
        "Tax Efficient Investing"
      ];
    } else {
      recommendations = [
        "Consider direct equity investments with proper research",
        "Explore international diversification options",
        "Learn about derivatives for hedging (with caution)",
        "Optimize tax efficiency through various instruments",
        "Consider alternative investments like REITs, gold ETFs",
        "Develop sector-wise investment themes"
      ];
      educationPath = [
        "Advanced Portfolio Management",
        "International Investment Options",
        "Sector and Thematic Investing",
        "Derivative Instruments for Hedging",
        "Alternative Investment Strategies"
      ];
    }

    const assessmentResults: AssessmentResults = {
      totalScore,
      maxScore,
      categoryScores,
      overallLevel,
      riskProfile,
      investmentHorizon,
      strengths,
      weaknesses,
      recommendations,
      educationPath
    };

    setResults(assessmentResults);
    setShowResults(true);
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 75) return 'text-green-400';
    if (percentage >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Advanced': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Intermediate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Beginner': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getRiskProfileColor = (profile: string) => {
    switch (profile) {
      case 'Aggressive': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Balanced': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Conservative': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'budgeting': return <Calculator className="w-5 h-5" />;
      case 'saving': return <Wallet className="w-5 h-5" />;
      case 'investment': return <TrendingUp className="w-5 h-5" />;
      case 'risk': return <Shield className="w-5 h-5" />;
      case 'knowledge': return <Brain className="w-5 h-5" />;
      case 'behavior': return <Heart className="w-5 h-5" />;
      default: return <Star className="w-5 h-5" />;
    }
  };

  if (!testStarted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto space-y-8"
      >
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-[var(--brand-gold)] to-[var(--brand-dark-gold)] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <PieChart className="w-12 h-12 text-[var(--brand-navy)]" />
            </div>
            <CardTitle className="text-4xl text-white mb-4">
              Financial Literacy Assessment
            </CardTitle>
            <p className="text-gray-300 text-lg leading-relaxed max-w-3xl mx-auto">
              Comprehensive evaluation of your financial knowledge, investment habits, and risk profile. 
              Get personalized recommendations for your financial journey.
            </p>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
                <BookOpen className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2">16 Questions</h3>
                <p className="text-gray-400 text-sm">Covering 6 key areas of financial literacy</p>
              </div>
              <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
                <Clock className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2">10-15 Minutes</h3>
                <p className="text-gray-400 text-sm">Comprehensive assessment at your own pace</p>
              </div>
              <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
                <Target className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2">Detailed Report</h3>
                <p className="text-gray-400 text-sm">Personalized analysis and education path</p>
              </div>
            </div>

            {/* Assessment Categories */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { category: 'Budgeting & Awareness', icon: <Calculator className="w-5 h-5" />, color: 'blue' },
                { category: 'Saving Habits', icon: <Wallet className="w-5 h-5" />, color: 'green' },
                { category: 'Investment Knowledge', icon: <TrendingUp className="w-5 h-5" />, color: 'purple' },
                { category: 'Risk Appetite', icon: <Shield className="w-5 h-5" />, color: 'red' },
                { category: 'Financial Knowledge', icon: <Brain className="w-5 h-5" />, color: 'indigo' },
                { category: 'Behavioral Traits', icon: <Heart className="w-5 h-5" />, color: 'pink' }
              ].map((item, index) => (
                <div key={index} className={`text-center p-4 bg-${item.color}-500/10 rounded-xl border border-${item.color}-500/20`}>
                  <div className={`w-10 h-10 bg-${item.color}-500/20 rounded-lg flex items-center justify-center mx-auto mb-2 text-${item.color}-400`}>
                    {item.icon}
                  </div>
                  <p className="text-white text-sm font-medium">{item.category}</p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Button 
                onClick={startAssessment}
                className="bg-gradient-to-r from-[var(--brand-gold)] to-[var(--brand-dark-gold)] text-[var(--brand-navy)] hover:shadow-xl hover:shadow-[var(--brand-gold)]/40 transition-all duration-300 transform hover:scale-105 rounded-2xl px-8 py-4 text-lg font-semibold"
              >
                <Star className="w-5 h-5 mr-2" />
                Start Assessment
              </Button>
            </div>

            <div className="bg-blue-500/10 backdrop-blur-md border border-blue-500/30 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <Info className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-400 mb-2">About This Assessment</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    This comprehensive assessment evaluates your financial literacy across multiple dimensions. 
                    Based on your responses, you'll receive a detailed analysis of your financial profile, 
                    risk appetite, and personalized recommendations for improving your financial well-being. 
                    All recommendations are aligned with SEBI guidelines and best practices.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (showResults && results) {
    const overallPercentage = (results.totalScore / results.maxScore) * 100;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto space-y-8"
      >
        {/* Header Results */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-[var(--brand-gold)] to-[var(--brand-dark-gold)] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Award className="w-12 h-12 text-[var(--brand-navy)]" />
            </div>
            <CardTitle className="text-3xl text-white mb-4">
              Your Financial Literacy Report
            </CardTitle>
            <div className={`text-6xl font-bold mb-4 ${getScoreColor(overallPercentage)}`}>
              {Math.round(overallPercentage)}%
            </div>
            <p className="text-gray-300 text-lg">
              Overall Score: {results.totalScore}/{results.maxScore}
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <Badge className={`text-lg px-6 py-2 ${getLevelColor(results.overallLevel)}`}>
                {results.overallLevel} Level
              </Badge>
              <Badge className={`text-lg px-6 py-2 ${getRiskProfileColor(results.riskProfile)}`}>
                {results.riskProfile} Risk Profile
              </Badge>
              <Badge className="text-lg px-6 py-2 bg-purple-500/20 text-purple-400 border-purple-500/30">
                {results.investmentHorizon} Horizon
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Category Breakdown */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center">
              <Eye className="w-6 h-6 mr-3 text-[var(--brand-gold)]" />
              Category Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(results.categoryScores).map(([category, scores]) => (
                <div key={category} className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
                  <div className="w-12 h-12 bg-[var(--brand-gold)]/20 rounded-xl flex items-center justify-center mx-auto mb-4 text-[var(--brand-gold)]">
                    {getCategoryIcon(category)}
                  </div>
                  <h3 className="text-white font-semibold mb-3 capitalize">{category}</h3>
                  <div className={`text-3xl font-bold mb-2 ${getScoreColor(scores.percentage)}`}>
                    {scores.score}/{scores.max}
                  </div>
                  <Progress value={scores.percentage} className="mb-2" />
                  <p className="text-gray-400 text-sm">{Math.round(scores.percentage)}%</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Strengths and Weaknesses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                Your Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {results.strengths.map((strength, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-green-500/10 rounded-xl border border-green-500/20">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-300 text-sm leading-relaxed">{strength}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center">
                <TrendingDown className="w-5 h-5 mr-2 text-orange-400" />
                Areas for Improvement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {results.weaknesses.map((weakness, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-orange-500/10 rounded-xl border border-orange-500/20">
                    <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-300 text-sm leading-relaxed">{weakness}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center">
              <Target className="w-6 h-6 mr-3 text-[var(--brand-gold)]" />
              Personalized Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="w-6 h-6 bg-[var(--brand-gold)] rounded-full flex items-center justify-center text-[var(--brand-navy)] font-bold text-sm flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{recommendation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Education Path */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center">
              <BookOpen className="w-6 h-6 mr-3 text-[var(--brand-gold)]" />
              Your Learning Path
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.educationPath.map((topic, index) => (
                <div key={index} className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 font-bold text-sm">
                      {index + 1}
                    </div>
                    <h3 className="text-white font-medium text-sm">{topic}</h3>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => {
              setTestStarted(false);
              setShowResults(false);
            }}
            className="bg-gradient-to-r from-[var(--brand-gold)] to-[var(--brand-dark-gold)] text-[var(--brand-navy)] hover:shadow-lg"
          >
            <Star className="w-4 h-4 mr-2" />
            Retake Assessment
          </Button>
          <Button 
            variant="outline"
            className="border-[var(--brand-gold)] text-[var(--brand-gold)] hover:bg-[var(--brand-gold)] hover:text-[var(--brand-navy)]"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
          <Button 
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-[var(--brand-navy)]"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Results
          </Button>
        </div>
      </motion.div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-400">
          <span>Question {currentQuestion + 1} of {questions.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-3" />
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[var(--brand-gold)]/20 rounded-xl flex items-center justify-center text-[var(--brand-gold)]">
                    {getCategoryIcon(currentQ.category)}
                  </div>
                  <Badge className={`px-3 py-1 capitalize bg-purple-500/20 text-purple-400 border-purple-500/30`}>
                    {currentQ.category}
                  </Badge>
                </div>
                <span className="text-gray-400 text-sm">Q{currentQ.id}</span>
              </div>
              <CardTitle className="text-2xl text-white leading-relaxed">
                {currentQ.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                {currentQ.options.map((option, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full p-4 text-left rounded-xl border transition-all duration-300 ${
                      selectedAnswers[currentQuestion] === index
                        ? 'bg-[var(--brand-gold)]/20 border-[var(--brand-gold)] text-white'
                        : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10 hover:border-[var(--brand-gold)]/30'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center">
                      <span className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center mr-4 text-sm font-semibold">
                        {String.fromCharCode(65 + index)}
                      </span>
                      {option}
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <Button 
                  onClick={prevQuestion}
                  disabled={currentQuestion === 0}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Previous
                </Button>
                <Button 
                  onClick={nextQuestion}
                  disabled={selectedAnswers[currentQuestion] === undefined}
                  className="bg-gradient-to-r from-[var(--brand-gold)] to-[var(--brand-dark-gold)] text-[var(--brand-navy)] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {currentQuestion === questions.length - 1 ? 'Complete Assessment' : 'Next Question'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}