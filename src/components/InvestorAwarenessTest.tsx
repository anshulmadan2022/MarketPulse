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
  Wallet,
  Brain,
  Heart,
  Eye,
  RefreshCw,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Interfaces remain the same ---
interface Question {
  id: number;
  question: string;
  options: string[];
  scores: number[];
  category: 'budgeting' | 'saving' | 'investment' | 'risk' | 'knowledge' | 'behavior';
  isKnowledgeBased?: boolean;
  correctAnswer?: number;
  explanation?: string;
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

// Renamed component for clarity
export function InvestorAwarenessTest() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | undefined)[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [results, setResults] = useState<AssessmentResults | null>(null);

  // --- Questions data remains the same ---
  const questions: Question[] = [
    { id: 1, question: "Do you maintain a record of your monthly expenses?", options: ["Yes, in detail (app/spreadsheet)", "Rough notes of major expenses", "Sometimes, when I feel the need", "No, I don't track expenses"], scores: [4, 3, 2, 1], category: 'budgeting' },
    { id: 2, question: "How do you handle unexpected expenses (like medical or sudden travel)?", options: ["Use emergency savings", "Cut down on other spending", "Use credit cards/loans", "I usually struggle with such cases"], scores: [4, 3, 2, 1], category: 'budgeting' },
    { id: 3, question: "Do you have an emergency fund (3–6 months of expenses)?", options: ["Yes, well planned", "Some savings, not enough", "Very little", "None"], scores: [4, 3, 2, 1], category: 'budgeting' },
    { id: 4, question: "What percentage of your income do you save/invest monthly?", options: ["More than 40%", "20–40%", "10–20%", "Less than 10%"], scores: [4, 3, 2, 1], category: 'saving' },
    { id: 5, question: "Do you follow a budget plan (like 50-30-20 rule)?", options: ["Yes, strictly", "Somewhat, not consistent", "Rarely", "Not at all"], scores: [4, 3, 2, 1], category: 'saving' },
    { id: 6, question: "Which type of investment do you prefer most?", options: ["Stocks / Crypto / High-risk assets", "Mutual funds / SIPs", "Gold/Real estate", "Bank deposits (FDs, savings accounts)"], scores: [4, 3, 2, 1], category: 'investment' },
    { id: 7, question: "How often do you review or rebalance your investments?", options: ["Monthly/Quarterly", "Once a year", "Rarely", "Never"], scores: [4, 3, 2, 1], category: 'investment' },
    { id: 8, question: "How long do you usually hold your investments?", options: ["More than 7 years", "3–7 years", "1–3 years", "Less than 1 year"], scores: [4, 3, 2, 1], category: 'investment' },
    { id: 9, question: "If your investment loses 20% value in a month, what will you do?", options: ["Buy more at lower prices", "Hold and wait for recovery", "Sell immediately to avoid further losses", "Stop investing completely"], scores: [4, 3, 2, 1], category: 'risk' },
    { id: 10, question: "What return on investment (ROI) do you expect ideally?", options: ["15%+ per year (high-risk, high-return)", "11–15% per year (growth-oriented)", "7–10% per year (moderate)", "4–6% per year (safe returns)"], scores: [4, 3, 2, 1], category: 'risk' },
    { id: 11, question: "Which of the following best describes inflation?", options: ["General increase in prices, reducing money's value", "Interest paid by banks on deposits", "Increase in government spending", "Prices of goods going down over time"], scores: [4, 0, 0, 0], category: 'knowledge', isKnowledgeBased: true, correctAnswer: 0, explanation: "Inflation is the rate at which the general level of prices for goods and services is rising, and subsequently, purchasing power of currency is falling." },
    { id: 12, question: "What does diversification mean in investing?", options: ["Investing across different assets to reduce risk", "Investing only in safe government securities", "Selling investments quickly when markets move", "Putting all money in one stock for bigger returns"], scores: [4, 0, 0, 0], category: 'knowledge', isKnowledgeBased: true, correctAnswer: 0, explanation: "Diversification is a risk management strategy that mixes a wide variety of investments within a portfolio to minimize the impact of any single asset's performance." },
    { id: 13, question: "Do you understand the difference between debt and equity investments?", options: ["Yes, clearly", "Somewhat", "Heard about it, not sure", "Not at all"], scores: [4, 3, 2, 1], category: 'knowledge' },
    { id: 14, question: "What's your primary reason for investing?", options: ["Wealth creation over time", "Saving for specific goals (house, education, etc.)", "Security & safety of money", "Quick profits & high returns"], scores: [4, 3, 2, 1], category: 'behavior' },
    { id: 15, question: "If you suddenly received ₹10,00,000 today, what would you do?", options: ["Invest most of it for future growth", "Invest part and save part for emergencies", "Keep it in a bank account for safety", "Spend on lifestyle needs (car, travel, etc.)"], scores: [4, 3, 2, 1], category: 'behavior' },
    { id: 16, question: "How do you usually make financial decisions?", options: ["Through research and planning", "By consulting family/friends", "By following trends/news", "Impulsively, without much thought"], scores: [4, 3, 2, 1], category: 'behavior' },
    { id: 17, question: "What does SEBI stand for?", options: ["Securities and Exchange Board of India", "Stock Exchange Board of India", "Securities and Economic Board of India", "Securities Exchange Banking Institute"], scores: [4, 0, 0, 0], category: 'knowledge', isKnowledgeBased: true, correctAnswer: 0, explanation: "SEBI stands for Securities and Exchange Board of India, the regulatory body for the securities market in India." },
    { id: 18, question: "What is a P/E ratio?", options: ["Price to Equity ratio", "Profit to Expense ratio", "Price to Earnings ratio", "Performance to Efficiency ratio"], scores: [0, 0, 4, 0], category: 'knowledge', isKnowledgeBased: true, correctAnswer: 2, explanation: "P/E ratio (Price to Earnings ratio) measures a company's share price relative to its per-share earnings, indicating valuation." },
    { id: 19, question: "What is the lock-in period for ELSS mutual funds?", options: ["1 year", "2 years", "3 years", "5 years"], scores: [0, 0, 4, 0], category: 'knowledge', isKnowledgeBased: true, correctAnswer: 2, explanation: "ELSS (Equity Linked Savings Scheme) funds have a mandatory lock-in period of 3 years, the shortest among tax-saving investments under Section 80C." },
    { id: 20, question: "What does Beta measure in stock analysis?", options: ["Company's profitability", "Stock's volatility relative to the market", "Dividend yield", "Book value"], scores: [0, 4, 0, 0], category: 'knowledge', isKnowledgeBased: true, correctAnswer: 1, explanation: "Beta measures a stock's volatility in relation to the overall market. A beta > 1 is more volatile; < 1 is less volatile." },
    { id: 21, question: "What is the maximum investment limit in PPF per financial year?", options: ["₹1 lakh", "₹1.5 lakh", "₹2 lakh", "₹2.5 lakh"], scores: [0, 4, 0, 0], category: 'knowledge', isKnowledgeBased: true, correctAnswer: 1, explanation: "The maximum investment in a Public Provident Fund (PPF) account is ₹1.5 lakh in a single financial year." },
    { id: 22, question: "What is a derivative instrument?", options: ["A primary security", "A financial contract whose value depends on underlying assets", "A type of mutual fund", "A government bond"], scores: [0, 4, 0, 0], category: 'knowledge', isKnowledgeBased: true, correctAnswer: 1, explanation: "A derivative's value is derived from an underlying asset or benchmark. Common derivatives include futures, options, and swaps." },
    { id: 23, question: "Which document contains detailed information about a mutual fund?", options: ["Annual Report", "Scheme Information Document (SID)", "Balance Sheet", "Prospectus"], scores: [0, 4, 0, 0], category: 'knowledge', isKnowledgeBased: true, correctAnswer: 1, explanation: "The Scheme Information Document (SID) is the primary document providing comprehensive details about a mutual fund scheme." },
    { id: 24, question: "What is a 'Blue-Chip' stock?", options: ["A stock priced under ₹10", "A stock of a new, high-growth company", "A stock of a large, well-established, and financially sound company", "A stock that has recently gone through an IPO"], scores: [0, 0, 4, 0], category: 'knowledge', isKnowledgeBased: true, correctAnswer: 2, explanation: "Blue-chip stocks represent large, reputable companies with a history of reliable performance and stable earnings." },
    { id: 25, question: "What does 'SIP' stand for in the context of mutual funds?", options: ["Standard Investment Plan", "Systematic Investment Plan", "Secure Investment Portfolio", "Single Investment Product"], scores: [0, 4, 0, 0], category: 'knowledge', isKnowledgeBased: true, correctAnswer: 1, explanation: "SIP stands for Systematic Investment Plan, an investment method where one invests a fixed amount at regular intervals in a mutual fund." },
    { id: 26, question: "What is the role of a credit score?", options: ["To measure your investment returns", "To assess your knowledge of the stock market", "To determine your creditworthiness for loans and credit cards", "To calculate your annual income tax"], scores: [0, 0, 4, 0], category: 'knowledge', isKnowledgeBased: true, correctAnswer: 2, explanation: "A credit score (like CIBIL) is a numerical expression that represents a person's creditworthiness, used by lenders to evaluate the risk of lending money." }
  ];

  // --- All calculation and handler functions remain the same ---
  const startAssessment = () => { setTestStarted(true); setCurrentQuestion(0); setSelectedAnswers(new Array(questions.length).fill(undefined)); setShowResults(false); setResults(null); };
  const handleAnswerSelect = (answerIndex: number) => { const newAnswers = [...selectedAnswers]; newAnswers[currentQuestion] = answerIndex; setSelectedAnswers(newAnswers); };
  const nextQuestion = () => { if (currentQuestion < questions.length - 1) { setCurrentQuestion(currentQuestion + 1); } else { calculateResults(); } };
  const prevQuestion = () => { if (currentQuestion > 0) { setCurrentQuestion(currentQuestion - 1); } };
  const calculateResults = () => {
    const categoryScores = { budgeting: { score: 0, max: 0, percentage: 0 }, saving: { score: 0, max: 0, percentage: 0 }, investment: { score: 0, max: 0, percentage: 0 }, risk: { score: 0, max: 0, percentage: 0 }, knowledge: { score: 0, max: 0, percentage: 0 }, behavior: { score: 0, max: 0, percentage: 0 } };
    let totalScore = 0, maxScore = 0;
    questions.forEach((q, i) => {
      const userAnswer = selectedAnswers[i];
      if (userAnswer === undefined) return;
      const score = q.scores[userAnswer] || 0;
      const maxQScore = Math.max(...q.scores);
      categoryScores[q.category].score += score;
      categoryScores[q.category].max += maxQScore;
      totalScore += score;
      maxScore += maxQScore;
    });
    Object.keys(categoryScores).forEach(cat => { const c = cat as keyof typeof categoryScores; categoryScores[c].percentage = categoryScores[c].max > 0 ? (categoryScores[c].score / categoryScores[c].max) * 100 : 0; });
    const overallPercentage = (totalScore / maxScore) * 100;
    let overallLevel: 'Beginner' | 'Intermediate' | 'Advanced' = overallPercentage >= 75 ? 'Advanced' : overallPercentage >= 45 ? 'Intermediate' : 'Beginner';
    let riskProfile: 'Conservative' | 'Balanced' | 'Aggressive' = categoryScores.risk.percentage >= 70 ? 'Aggressive' : categoryScores.risk.percentage >= 40 ? 'Balanced' : 'Conservative';
    const horizonAnswer = selectedAnswers[7];
    let investmentHorizon: 'Short-term' | 'Medium-term' | 'Long-term' = (horizonAnswer === 0 || horizonAnswer === 1) ? 'Long-term' : horizonAnswer === 2 ? 'Medium-term' : 'Short-term';
    const strengths: string[] = []; const weaknesses: string[] = [];
    if (categoryScores.budgeting.percentage >= 75) strengths.push("Excellent budgeting and expense tracking habits."); else if (categoryScores.budgeting.percentage < 50) weaknesses.push("Need to improve budgeting and emergency fund planning.");
    if (categoryScores.saving.percentage >= 75) strengths.push("Strong savings discipline and income management."); else if (categoryScores.saving.percentage < 50) weaknesses.push("Low savings rate; consider increasing monthly savings.");
    if (categoryScores.investment.percentage >= 75) strengths.push("Good investment habits and portfolio management."); else if (categoryScores.investment.percentage < 50) weaknesses.push("Limited investment experience; start with basic products.");
    if (categoryScores.knowledge.percentage >= 75) strengths.push("Strong financial knowledge and market understanding."); else if (categoryScores.knowledge.percentage < 50) weaknesses.push("Basic financial concepts need improvement.");
    if (categoryScores.risk.percentage >= 75) strengths.push("High risk tolerance for potential higher returns."); else if (categoryScores.risk.percentage < 50) weaknesses.push("Conservative approach may limit growth potential.");
    if (categoryScores.behavior.percentage >= 75) strengths.push("Rational and planned approach to financial decisions."); else if (categoryScores.behavior.percentage < 50) weaknesses.push("Impulsive financial behavior; develop systematic decision-making.");
    let recommendations: string[] = []; let educationPath: string[] = [];
    if (overallLevel === 'Beginner') { recommendations = ["Start with creating a monthly budget.", "Build an emergency fund covering 3-6 months of expenses.", "Begin with safe investments like FDs and debt mutual funds.", "Learn basic financial concepts.", "Consult SEBI registered advisors.", "Start small SIPs in large-cap funds."]; educationPath = ["Financial Planning Basics", "Investment Options", "Risk vs Return", "Tax Saving", "Emergency Funds"]; }
    else if (overallLevel === 'Intermediate') { recommendations = ["Diversify investments across asset classes.", "Increase SIP amounts gradually.", "Learn about asset allocation.", "Consider ELSS funds for tax saving.", "Start learning about direct equity.", "Review portfolio annually."]; educationPath = ["Asset Allocation", "Mutual Fund Selection", "Stock Market Basics", "Portfolio Rebalancing", "Tax Efficiency"]; }
    else { recommendations = ["Consider direct equity with research.", "Explore international diversification.", "Learn about derivatives for hedging (with caution).", "Optimize tax efficiency.", "Consider alternative investments like REITs.", "Develop sector-wise investment themes."]; educationPath = ["Advanced Portfolio Management", "International Investing", "Thematic Investing", "Derivatives for Hedging", "Alternative Investments"]; }
    setResults({ totalScore, maxScore, categoryScores, overallLevel, riskProfile, investmentHorizon, strengths, weaknesses, recommendations, educationPath }); setShowResults(true);
  };
  const handleDownloadReport = () => { if (!results) return; let report = `FINANCIAL LITERACY REPORT\n=====================\n\nOVERALL SCORE: ${results.totalScore}/${results.maxScore} (${((results.totalScore / results.maxScore) * 100).toFixed(0)}%)\nLEVEL: ${results.overallLevel}\nRISK PROFILE: ${results.riskProfile}\n\nSTRENGTHS:\n${results.strengths.map(s => `- ${s}`).join('\n')}\n\nIMPROVEMENT AREAS:\n${results.weaknesses.map(w => `- ${w}`).join('\n')}\n\nRECOMMENDATIONS:\n${results.recommendations.map(r => `- ${r}`).join('\n')}`; const blob = new Blob([report], { type: 'text/plain;charset=utf-8' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'Financial_Report.txt'; a.click(); URL.revokeObjectURL(url); };
  const handleShareResults = () => { if (!results) return; const pct = ((results.totalScore / results.maxScore) * 100).toFixed(0); const text = `I just scored ${pct}% on my Financial Literacy Assessment! My investor profile is: ${results.overallLevel} | ${results.riskProfile}. Find out yours!`; const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`; window.open(url, '_blank'); };
  
  // --- UI Helper Functions ---
  const getScoreColor = (percentage: number) => { if (percentage >= 75) return 'text-green-500'; if (percentage >= 45) return 'text-yellow-500'; return 'text-red-500'; };
  const getLevelColor = (level: string) => { switch (level) { case 'Advanced': return 'bg-green-100 text-green-700 border-green-200'; case 'Intermediate': return 'bg-yellow-100 text-yellow-700 border-yellow-200'; default: return 'bg-blue-100 text-blue-700 border-blue-200'; } };
  const getRiskProfileColor = (profile: string) => { switch (profile) { case 'Aggressive': return 'bg-red-100 text-red-700 border-red-200'; case 'Balanced': return 'bg-yellow-100 text-yellow-700 border-yellow-200'; default: return 'bg-green-100 text-green-700 border-green-200'; } };
  const getCategoryIcon = (category: string) => { switch (category) { case 'budgeting': return <Calculator className="w-6 h-6" />; case 'saving': return <Wallet className="w-6 h-6" />; case 'investment': return <TrendingUp className="w-6 h-6" />; case 'risk': return <Shield className="w-6 h-6" />; case 'knowledge': return <Brain className="w-6 h-6" />; case 'behavior': return <Heart className="w-6 h-6" />; default: return <Star className="w-6 h-6" />; } };

  if (!testStarted) {
    return (
      <div className="bg-gray-50 min-h-screen p-4 sm:p-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto space-y-8 w-full"
        >
          <div className="absolute top-6 left-6">
              <Button variant="outline" className="bg-white">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
              </Button>
          </div>
          <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-yellow-400 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <Brain className="w-12 h-12 text-gray-900" />
            </div>
            <p className="text-gray-500 text-lg leading-relaxed max-w-3xl mx-auto">
              A comprehensive evaluation of your financial habits and knowledge. Get a personalized report to
              guide your financial journey.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-4">
              <BookOpen className="w-10 h-10 text-blue-500 mx-auto mb-3" />
              <p className="text-gray-700 font-medium">Covering 6 key areas of financial literacy</p>
            </div>
            <div className="p-4">
              <Clock className="w-10 h-10 text-green-500 mx-auto mb-3" />
              <p className="text-gray-700 font-medium">Comprehensive assessment at your own pace</p>
            </div>
            <div className="p-4">
              <Target className="w-10 h-10 text-purple-500 mx-auto mb-3" />
              <p className="text-gray-700 font-medium">Personalized analysis and education path</p>
            </div>
          </div>
          <div className="text-center">
            <Button 
              onClick={startAssessment}
              className="bg-yellow-400 text-gray-900 hover:bg-yellow-500 transition-all duration-300 transform hover:scale-105 rounded-xl px-8 py-6 text-lg font-bold shadow-md"
            >
              <Star className="w-5 h-5 mr-2" />
              Start Assessment
            </Button>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <Info className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-2">About This Assessment</h3>
                <p className="text-blue-700 text-sm leading-relaxed">
                  This comprehensive assessment evaluates your financial literacy across multiple dimensions. Based on your responses, you'll receive a detailed analysis of your financial profile, risk appetite, and personalized recommendations for improving your financial well-being. All recommendations are aligned with SEBI guidelines and best practices.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (showResults && results) {
    const overallPercentage = (results.totalScore / results.maxScore) * 100;
    
    return (
        <div className="bg-gray-50 min-h-screen p-4 sm:p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-6xl mx-auto space-y-8"
            >
                <Card className="bg-white shadow-lg">
                    <CardHeader className="text-center">
                        <Award className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                        <CardTitle className="text-3xl text-gray-900 mb-2">Your Financial Literacy Report</CardTitle>
                        <div className={`text-6xl font-bold mb-2 ${getScoreColor(overallPercentage)}`}>{Math.round(overallPercentage)}%</div>
                        <p className="text-gray-600">Overall Score: {results.totalScore}/{results.maxScore}</p>
                        <div className="flex flex-wrap justify-center gap-4 mt-4">
                            <Badge className={`text-base px-4 py-1 ${getLevelColor(results.overallLevel)}`}>{results.overallLevel} Level</Badge>
                            <Badge className={`text-base px-4 py-1 ${getRiskProfileColor(results.riskProfile)}`}>{results.riskProfile} Risk Profile</Badge>
                            <Badge className="text-base px-4 py-1 bg-purple-100 text-purple-700 border-purple-200">{results.investmentHorizon} Horizon</Badge>
                        </div>
                    </CardHeader>
                </Card>

                <Card className="bg-white shadow-lg"><CardHeader><CardTitle className="text-2xl text-gray-800 flex items-center"><Eye className="w-6 h-6 mr-3 text-blue-500" />Category Analysis</CardTitle></CardHeader><CardContent><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{Object.entries(results.categoryScores).map(([category, scores]) => (<div key={category} className="text-center p-6 bg-gray-50 rounded-xl border"><div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3 text-blue-600">{getCategoryIcon(category)}</div><h3 className="text-gray-800 font-semibold mb-2 capitalize">{category}</h3><div className={`text-3xl font-bold ${getScoreColor(scores.percentage)}`}>{scores.score}/{scores.max}</div><Progress value={scores.percentage} className="my-2" /><p className="text-gray-500 text-sm">{Math.round(scores.percentage)}%</p></div>))}</div></CardContent></Card>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="bg-white shadow-lg"><CardHeader><CardTitle className="text-xl text-gray-800 flex items-center"><TrendingUp className="w-5 h-5 mr-2 text-green-500" />Your Strengths</CardTitle></CardHeader><CardContent><div className="space-y-3">{results.strengths.map((s, i) => <div key={i} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200"><CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" /><p className="text-gray-700 text-sm">{s}</p></div>)}</div></CardContent></Card>
                    <Card className="bg-white shadow-lg"><CardHeader><CardTitle className="text-xl text-gray-800 flex items-center"><TrendingDown className="w-5 h-5 mr-2 text-orange-500" />Areas for Improvement</CardTitle></CardHeader><CardContent><div className="space-y-3">{results.weaknesses.map((w, i) => <div key={i} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200"><AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" /><p className="text-gray-700 text-sm">{w}</p></div>)}</div></CardContent></Card>
                </div>
                <Card className="bg-white shadow-lg"><CardHeader><CardTitle className="text-2xl text-gray-800 flex items-center"><Target className="w-6 h-6 mr-3 text-blue-500" />Personalized Recommendations</CardTitle></CardHeader><CardContent><div className="space-y-3">{results.recommendations.map((rec, i) => <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"><div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{i + 1}</div><p className="text-gray-700 text-sm">{rec}</p></div>)}</div></CardContent></Card>
                <Card className="bg-white shadow-lg"><CardHeader><CardTitle className="text-2xl text-gray-800 flex items-center"><BookOpen className="w-6 h-6 mr-3 text-blue-500" />Your Learning Path</CardTitle></CardHeader><CardContent><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{results.educationPath.map((topic, i) => <div key={i} className="p-3 bg-blue-50 rounded-lg border border-blue-200"><div className="flex items-center gap-3"><div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center text-blue-600 font-bold">{i + 1}</div><h3 className="text-gray-800 font-medium text-sm">{topic}</h3></div></div>)}</div></CardContent></Card>
                <Card className="bg-white shadow-lg"><CardHeader><CardTitle className="text-2xl text-gray-800 flex items-center"><RefreshCw className="w-6 h-6 mr-3 text-blue-500" />Review Your Answers</CardTitle></CardHeader><CardContent className="space-y-4">{questions.filter(q=>q.isKnowledgeBased).map(q => { const qIdx = questions.findIndex(item=>item.id===q.id); const userAnswerIdx = selectedAnswers[qIdx]; const isCorrect = userAnswerIdx === q.correctAnswer; if (isCorrect) return null; return (<div key={q.id} className="p-4 bg-red-50 rounded-lg border border-red-200"><p className="font-semibold mb-2">Q: {q.question}</p><p className="text-red-600 text-sm mb-1 flex items-center"><XCircle className="w-4 h-4 mr-2" />Your Answer: {userAnswerIdx !== undefined ? q.options[userAnswerIdx] : 'Not Answered'}</p><p className="text-green-600 text-sm mb-2 flex items-center"><CheckCircle className="w-4 h-4 mr-2" />Correct Answer: {q.options[q.correctAnswer!]}</p><p className="text-gray-600 text-xs italic">Explanation: {q.explanation}</p></div>);})}{questions.filter(q=>q.isKnowledgeBased).every((q,i)=>selectedAnswers[questions.findIndex(item=>item.id===q.id)]===q.correctAnswer) && <div className="p-4 bg-green-50 rounded-lg border border-green-200 text-center"><CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2"/><p className="text-green-700 font-semibold">Excellent! You answered all knowledge questions correctly.</p></div>}</CardContent></Card>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button onClick={startAssessment} variant="outline"><RefreshCw className="w-4 h-4 mr-2" />Retake Assessment</Button>
                    <Button onClick={handleDownloadReport} className="bg-blue-600 hover:bg-blue-700 text-white"><Download className="w-4 h-4 mr-2" />Download Report</Button>
                    <Button onClick={handleShareResults} variant="secondary"><Share2 className="w-4 h-4 mr-2" />Share Results</Button>
                </div>
            </motion.div>
        </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  
  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-8 flex items-center">
        <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto space-y-8 w-full"
        >
        <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2 bg-gray-200" />
        </div>

        <AnimatePresence mode="wait">
            <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            >
            <Card className="bg-white shadow-xl">
                <CardHeader>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">{getCategoryIcon(currentQ.category)}</div>
                        <Badge className="capitalize bg-purple-100 text-purple-700">{currentQ.category}</Badge>
                    </div>
                    <span className="text-gray-500 text-sm">Question {currentQ.id}</span>
                </div>
                <CardTitle className="text-2xl text-gray-900 leading-relaxed">{currentQ.question}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                <div className="space-y-3">
                    {currentQ.options.map((option, index) => (
                    <motion.button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-300 flex items-center ${
                        selectedAnswers[currentQuestion] === index
                            ? 'bg-blue-50 border-blue-500 text-blue-800'
                            : 'bg-gray-50 border-gray-200 text-gray-800 hover:bg-blue-50 hover:border-blue-300'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-4 text-sm font-semibold flex-shrink-0 ${ selectedAnswers[currentQuestion] === index ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-300 text-gray-500'}`}>{String.fromCharCode(65 + index)}</span>
                        {option}
                    </motion.button>
                    ))}
                </div>
                <div className="flex justify-between pt-6">
                    <Button onClick={prevQuestion} disabled={currentQuestion === 0} variant="outline">Previous</Button>
                    <Button onClick={nextQuestion} disabled={selectedAnswers[currentQuestion] === undefined} className="bg-blue-600 hover:bg-blue-700 text-white">
                    {currentQuestion === questions.length - 1 ? 'Complete Assessment' : 'Next Question'}
                    </Button>
                </div>
                </CardContent>
            </Card>
            </motion.div>
        </AnimatePresence>
        </motion.div>
    </div>
  );
}