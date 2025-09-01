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
  Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: 'basic' | 'intermediate' | 'advanced';
}

interface TestResults {
  score: number;
  totalQuestions: number;
  categoryScores: {
    basic: { correct: number; total: number };
    intermediate: { correct: number; total: number };
    advanced: { correct: number; total: number };
  };
  recommendations: string[];
  riskProfile: 'Conservative' | 'Moderate' | 'Aggressive';
}

export function InvestorAwarenessTest() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [results, setResults] = useState<TestResults | null>(null);

  const questions: Question[] = [
    {
      id: 1,
      question: "What does SEBI stand for?",
      options: [
        "Securities and Exchange Board of India",
        "Stock Exchange Board of India", 
        "Securities and Economic Board of India",
        "Securities Exchange Banking Institute"
      ],
      correctAnswer: 0,
      explanation: "SEBI stands for Securities and Exchange Board of India, which is the regulatory body for the securities market in India.",
      category: 'basic'
    },
    {
      id: 2,
      question: "What is the primary purpose of diversification in investment?",
      options: [
        "To maximize returns",
        "To reduce risk",
        "To minimize taxes",
        "To increase liquidity"
      ],
      correctAnswer: 1,
      explanation: "Diversification helps reduce risk by spreading investments across different assets, sectors, or securities.",
      category: 'basic'
    },
    {
      id: 3,
      question: "What is a P/E ratio?",
      options: [
        "Price to Equity ratio",
        "Profit to Expense ratio",
        "Price to Earnings ratio",
        "Performance to Efficiency ratio"
      ],
      correctAnswer: 2,
      explanation: "P/E ratio stands for Price to Earnings ratio, which measures a company's current share price relative to its earnings per share.",
      category: 'intermediate'
    },
    {
      id: 4,
      question: "Which of the following is NOT a type of mutual fund?",
      options: [
        "Equity Fund",
        "Debt Fund",
        "Hybrid Fund",
        "Commodity Fund"
      ],
      correctAnswer: 3,
      explanation: "While equity, debt, and hybrid funds are common types of mutual funds, commodity funds are typically structured as ETFs or commodity pools rather than traditional mutual funds.",
      category: 'intermediate'
    },
    {
      id: 5,
      question: "What is the lock-in period for ELSS mutual funds?",
      options: [
        "1 year",
        "2 years",
        "3 years",
        "5 years"
      ],
      correctAnswer: 2,
      explanation: "ELSS (Equity Linked Savings Scheme) mutual funds have a mandatory lock-in period of 3 years, making them the shortest lock-in tax-saving investment.",
      category: 'intermediate'
    },
    {
      id: 6,
      question: "What does Beta measure in stock analysis?",
      options: [
        "Company's profitability",
        "Stock's volatility relative to market",
        "Dividend yield",
        "Book value"
      ],
      correctAnswer: 1,
      explanation: "Beta measures a stock's volatility relative to the overall market. A beta of 1 means the stock moves with the market, >1 means more volatile, <1 means less volatile.",
      category: 'advanced'
    },
    {
      id: 7,
      question: "What is the maximum investment limit in PPF per financial year?",
      options: [
        "₹1 lakh",
        "₹1.5 lakh",
        "₹2 lakh",
        "₹2.5 lakh"
      ],
      correctAnswer: 1,
      explanation: "The maximum investment limit in Public Provident Fund (PPF) is ₹1.5 lakh per financial year.",
      category: 'basic'
    },
    {
      id: 8,
      question: "What is a derivative instrument?",
      options: [
        "A primary security",
        "A financial contract whose value depends on underlying assets",
        "A type of mutual fund",
        "A government bond"
      ],
      correctAnswer: 1,
      explanation: "A derivative is a financial contract whose value is derived from the performance of underlying assets, indices, or other financial instruments.",
      category: 'advanced'
    },
    {
      id: 9,
      question: "Which document contains detailed information about a mutual fund?",
      options: [
        "Annual Report",
        "Scheme Information Document (SID)",
        "Balance Sheet",
        "Prospectus"
      ],
      correctAnswer: 1,
      explanation: "The Scheme Information Document (SID) contains comprehensive information about a mutual fund including its investment objective, strategy, risks, and costs.",
      category: 'intermediate'
    },
    {
      id: 10,
      question: "What is the current securities transaction tax (STT) rate for equity delivery trades?",
      options: [
        "0.1%",
        "0.25%",
        "0.025%",
        "0.0125%"
      ],
      correctAnswer: 0,
      explanation: "The Securities Transaction Tax (STT) for equity delivery trades is 0.1% on both buy and sell transactions.",
      category: 'advanced'
    }
  ];

  const startTest = () => {
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
    const categoryScores = {
      basic: { correct: 0, total: 0 },
      intermediate: { correct: 0, total: 0 },
      advanced: { correct: 0, total: 0 }
    };

    let totalCorrect = 0;

    questions.forEach((question, index) => {
      categoryScores[question.category].total++;
      if (selectedAnswers[index] === question.correctAnswer) {
        totalCorrect++;
        categoryScores[question.category].correct++;
      }
    });

    const scorePercentage = (totalCorrect / questions.length) * 100;
    let riskProfile: 'Conservative' | 'Moderate' | 'Aggressive' = 'Conservative';
    let recommendations: string[] = [];

    if (scorePercentage >= 80) {
      riskProfile = 'Aggressive';
      recommendations = [
        'You have strong investment knowledge and can consider advanced investment products',
        'Consider diversified equity investments and growth-oriented mutual funds',
        'You may explore derivatives and structured products with proper risk management',
        'Regular portfolio review and rebalancing recommended'
      ];
    } else if (scorePercentage >= 60) {
      riskProfile = 'Moderate';
      recommendations = [
        'You have good basic knowledge but should continue learning',
        'Consider balanced mutual funds and SIPs for regular investment',
        'Focus on long-term wealth creation through equity and debt mix',
        'Seek professional advice for complex investment decisions'
      ];
    } else {
      riskProfile = 'Conservative';
      recommendations = [
        'Focus on building basic investment knowledge before investing',
        'Start with conservative instruments like FDs, PPF, and debt mutual funds',
        'Consider taking investor education courses',
        'Always consult SEBI registered investment advisors'
      ];
    }

    const testResults: TestResults = {
      score: totalCorrect,
      totalQuestions: questions.length,
      categoryScores,
      recommendations,
      riskProfile
    };

    setResults(testResults);
    setShowResults(true);
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-[#0F9D58]';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskProfileColor = (profile: string) => {
    switch (profile) {
      case 'Aggressive': return 'bg-red-100 text-red-700 border-red-300';
      case 'Moderate': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Conservative': return 'bg-green-100 text-green-700 border-green-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  if (!testStarted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        <Card className="bg-white border border-gray-200 shadow-xl">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-[var(--brand-navy)] to-[var(--brand-deep-navy)] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Award className="w-10 h-10 text-[var(--brand-gold)]" />
            </div>
            <CardTitle className="text-3xl text-gray-900 mb-4">
              Investor Awareness Test
            </CardTitle>
            <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
              Test your investment knowledge with our comprehensive SEBI-aligned awareness test. 
              Get personalized recommendations based on your knowledge level.
            </p>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-blue-50 rounded-2xl border border-blue-200">
                <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="text-gray-900 font-semibold mb-2">10 Questions</h3>
                <p className="text-gray-600 text-sm">Covering basic to advanced investment concepts</p>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-2xl border border-green-200">
                <Clock className="w-8 h-8 text-[#0F9D58] mx-auto mb-3" />
                <h3 className="text-gray-900 font-semibold mb-2">15 Minutes</h3>
                <p className="text-gray-600 text-sm">Take your time to think through each question</p>
              </div>
              <div className="text-center p-6 bg-purple-50 rounded-2xl border border-purple-200">
                <Target className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <h3 className="text-gray-900 font-semibold mb-2">Personalized Report</h3>
                <p className="text-gray-600 text-sm">Get tailored investment recommendations</p>
              </div>
            </div>

            <div className="text-center">
              <Button 
                onClick={startTest}
                className="bg-gradient-to-r from-[var(--brand-navy)] to-[var(--brand-deep-navy)] text-white hover:shadow-xl hover:shadow-[var(--brand-navy)]/40 transition-all duration-300 transform hover:scale-105 rounded-2xl px-8 py-4 text-lg font-semibold"
              >
                <Star className="w-5 h-5 mr-2" />
                Take Investor Test
              </Button>
            </div>

            <div className="bg-[var(--brand-gold)]/10 border border-[var(--brand-gold)]/30 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <Info className="w-6 h-6 text-[var(--brand-navy)] flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-[var(--brand-navy)] mb-2">Important Note</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    This test is designed for educational purposes and to assess your investment knowledge. 
                    The results will help you understand your risk profile and provide suitable investment recommendations. 
                    Always consult SEBI registered investment advisors for personalized advice.
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
    const scorePercentage = (results.score / results.totalQuestions) * 100;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        <Card className="bg-white border border-gray-200 shadow-xl">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-[var(--brand-gold)] to-[var(--brand-dark-gold)] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Trophy className="w-10 h-10 text-[var(--brand-navy)]" />
            </div>
            <CardTitle className="text-3xl text-gray-900 mb-4">
              Test Results
            </CardTitle>
            <div className={`text-6xl font-bold mb-4 ${getScoreColor(scorePercentage)}`}>
              {Math.round(scorePercentage)}%
            </div>
            <p className="text-gray-600 text-lg">
              You scored {results.score} out of {results.totalQuestions} questions correctly
            </p>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Category Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(results.categoryScores).map(([category, scores]) => {
                const categoryPercentage = (scores.correct / scores.total) * 100;
                return (
                  <div key={category} className="text-center p-6 bg-gray-50 rounded-2xl border border-gray-200">
                    <h3 className="text-gray-900 font-semibold mb-3 capitalize">{category}</h3>
                    <div className={`text-3xl font-bold mb-2 ${getScoreColor(categoryPercentage)}`}>
                      {scores.correct}/{scores.total}
                    </div>
                    <Progress value={categoryPercentage} className="mb-2" />
                    <p className="text-gray-600 text-sm">{Math.round(categoryPercentage)}% correct</p>
                  </div>
                );
              })}
            </div>

            {/* Risk Profile */}
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Risk Profile</h3>
              <Badge className={`text-lg px-6 py-2 ${getRiskProfileColor(results.riskProfile)}`}>
                {results.riskProfile} Investor
              </Badge>
            </div>

            {/* Recommendations */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Personalized Recommendations</h3>
              <div className="space-y-3">
                {results.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
                    <CheckCircle className="w-5 h-5 text-[#0F9D58] flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700 text-sm leading-relaxed">{recommendation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => {
                  setTestStarted(false);
                  setShowResults(false);
                }}
                className="bg-gradient-to-r from-[var(--brand-navy)] to-[var(--brand-deep-navy)] text-white hover:shadow-lg"
              >
                <Star className="w-4 h-4 mr-2" />
                Retake Test
              </Button>
              <Button 
                variant="outline"
                className="border-[#0F9D58] text-[#0F9D58] hover:bg-[#0F9D58] hover:text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
              <Button 
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Results
              </Button>
            </div>
          </CardContent>
        </Card>
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
        <div className="flex justify-between text-sm text-gray-600">
          <span>Question {currentQuestion + 1} of {questions.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
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
          <Card className="bg-white border border-gray-200 shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <Badge className={`px-3 py-1 ${
                  currentQ.category === 'basic' ? 'bg-green-100 text-green-700 border-green-300' :
                  currentQ.category === 'intermediate' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' :
                  'bg-red-100 text-red-700 border-red-300'
                }`}>
                  {currentQ.category.charAt(0).toUpperCase() + currentQ.category.slice(1)}
                </Badge>
                <span className="text-gray-500 text-sm">Question {currentQ.id}</span>
              </div>
              <CardTitle className="text-2xl text-gray-900 leading-relaxed">
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
                        ? 'bg-[var(--brand-navy)]/10 border-[var(--brand-navy)] text-[var(--brand-navy)] shadow-md'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-[var(--brand-navy)]/30'
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
                  className="border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Previous
                </Button>
                <Button 
                  onClick={nextQuestion}
                  disabled={selectedAnswers[currentQuestion] === undefined}
                  className="bg-gradient-to-r from-[var(--brand-navy)] to-[var(--brand-deep-navy)] text-white hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {currentQuestion === questions.length - 1 ? 'Finish Test' : 'Next Question'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

// Trophy icon component (since it's not in lucide-react)
const Trophy = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M6 2h12v6.5c0 2.485-2.015 4.5-4.5 4.5S9 10.985 9 8.5V2z"/>
    <path d="M6 7H4c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h2v-6zM20 7h-2v6h2c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2z"/>
    <path d="M8 18h8v2H8z"/>
    <path d="M6 20h12v2H6z"/>
  </svg>
);