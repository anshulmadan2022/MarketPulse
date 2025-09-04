import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Slider } from './ui/slider';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Building, 
  Users, 
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Target,
  Brain,
  BarChart3,
  Shield,
  Star,
  Award,
  Calculator,
  PieChart,
  LineChart,
  Gauge,
  Zap,
  AlertTriangle,
  Info,
  ThumbsUp,
  ThumbsDown,
  Activity,
  Download
} from 'lucide-react';
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  PieChart as RechartsPieChart,
  Pie
} from 'recharts';
import { motion } from 'framer-motion';
import rawIpoData from '../data/ipo.json'; // Import the JSON data

// --- Interfaces (kept as in original file) ---
interface IPO {
  id: string;
  companyName: string;
  sector: string;
  priceRange: [number, number];
  lotSize: number;
  openDate: string;
  closeDate: string;
  listingDate: string;
  status: 'upcoming' |  'listed';
  subscriptionRatio?: number;
  listingGains?: number;
  marketCap: number;
  issueSize: number;
  description: string;
  financialScore: number;
  valuationScore: number;
  managementScore: number;
  marketPositionScore: number;
  demandScore: number;
  marketSentimentScore: number;
  businessModelScore: number;
  overallPrediction: 'positive' | 'neutral' | 'negative';
  predictionConfidence: number;
  keyStrengths: string[];
  keyRisks: string[];
  analystRating: 'buy' | 'hold' | 'avoid';
}

interface IPOPredictionInput {
  companyName: string;
  sector: string;
  issueSize: number;
  priceRange: [number, number];
  revenueGrowth: number;
  profitMargin: number;
  debtToEquity: number;
  peRatio: number;
  marketShare: number;
  competitiveAdvantage: number;
  managementExperience: number;
  pastPerformance: number;
  useOfProceeds: 'expansion' | 'debt_repayment' | 'ofs' | 'mixed';
  marketConditions: number;
  sectorGrowth: number;
  institutionalInterest: number;
}


// --- Data Transformation and Utility Functions ---
const parseNumeric = (text: string | undefined): number | null => {
  if (!text) return null;
  const match = text.match(/[\d,.]+/);
  return match ? parseFloat(match[0].replace(/,/g, '')) : null;
};

const getSector = (description: string): string => {
  const sectorMap: { [key: string]: string } = {
    'pharma': 'Healthcare', 'healthcare': 'Healthcare',
    'solar': 'Renewable Energy', 'power': 'Renewable Energy',
    'epc': 'Infrastructure', 'infra': 'Infrastructure', 'engineering': 'Infrastructure', 'cement': 'Infrastructure',
    'retail': 'Retail', 'supermarket': 'Retail', 'jewellery': 'Retail',
    'financial': 'Financial Services', 'depository': 'Financial Services',
    'shipping': 'Logistics', 'logistics': 'Logistics',
    'software': 'Technology', 'tech': 'Technology',
    'chemicals': 'Chemicals',
    'realty': 'Real Estate',
  };
  const descLower = description.toLowerCase();
  for (const key in sectorMap) {
    if (descLower.includes(key)) return sectorMap[key];
  }
  return 'Diversified';
};

const transformRawData = (data: any[]): IPO[] => {
    return data.map((item, index) => {
        // Basic Info
        const companyName = item.company_name;
        const description = item.company_fundamentals.business_model_and_competitive_advantage;
        const sector = getSector(description);
        const issueSize = parseNumeric(item.ipo_specific_factors.ipo_size) || 0;

        // Dates & Status
        let listingDateStr = item.post_ipo_performance.listing_day_performance;
        let listingDateObj: Date;
        let status: IPO['status'];
        if (listingDateStr.includes("scheduled for")) {
            status = 'upcoming';
            listingDateObj = new Date(listingDateStr.split(' for ')[1]);
        } else if (listingDateStr.includes("Listed")) {
            status = 'listed';
            listingDateObj = new Date(listingDateStr.split('Listed ')[1].split('.')[0]);
        } else {
            status = 'listed'; // Default for past dates
            listingDateObj = new Date(); // fallback
        }

        const closeDateObj = new Date(listingDateObj);
        closeDateObj.setDate(listingDateObj.getDate() - 4);
        const openDateObj = new Date(closeDateObj);
        openDateObj.setDate(closeDateObj.getDate() - 2);
        
        // Price & Valuation
        const priceStr = item.ipo_specific_factors.issue_price_vs_valuation;
        const prices = (priceStr.match(/(\d[\d,.]*)/g) || []).map(Number);
        const priceRange: [number, number] = prices.length > 1 ? [prices[0], prices[1]] : [prices[0] || 0, prices[0] || 0];
        const lotSize = Math.round(15000 / (priceRange[1] || 1));
        const peRatio = parseNumeric(priceStr.split('P/E')[1] || '');

        // Scores and Predictions
        const debtToEquity = item.company_fundamentals.debt_to_equity_ratio;
        const financialScore = Math.min(10, ((parseNumeric(item.company_fundamentals.revenue_growth_and_profitability.split('PAT up ')[1]) || 5) / 10) + (item.company_fundamentals.pat_margin / 5) + Math.max(0, 3 - debtToEquity) * 1.5);
        const valuationScore = Math.max(0, 10 - (peRatio || 50) / 8);
        const managementScore = 7.5 + (item.company_fundamentals.promoter_reputation_and_track_record.includes("Established") ? 1 : 0);
        const marketPositionScore = 7 + (description.includes("leading") || description.includes("largest") ? 1.5 : 0);
        const subscription = parseNumeric(item.investor_market_sentiment.subscription_rate.analysis.retail_investors) || 1;
        const demandScore = Math.min(10, 5 + Math.log(subscription) * 1.5);
        const marketSentimentScore = item.investor_market_sentiment.media_coverage_and_hype.includes("High") ? 8.5 : 6.5;
        const businessModelScore = 7.5 + (description.includes("unique") || description.includes("integrated") ? 1 : 0);

        const overallScore = (financialScore + valuationScore + managementScore + marketPositionScore + demandScore + marketSentimentScore + businessModelScore) / 7;
        let overallPrediction: IPO['overallPrediction'] = 'neutral';
        if (overallScore > 7.8) overallPrediction = 'positive';
        if (overallScore < 6.5) overallPrediction = 'negative';

        const predictionConfidence = Math.min(95, 65 + (overallScore - 6.5) * 5 + Math.log(subscription) * 3);

        // Listing Gains & Subscription
        let listingGains: number | undefined;
        if (status === 'listed') {
            const openPrice = parseNumeric(item.post_ipo_performance.listing_day_performance.split('Open: ')[1]);
            if (openPrice && priceRange[1]) {
                listingGains = ((openPrice - priceRange[1]) / priceRange[1]) * 100;
            }
        }

        // Key Takeaways
        const positiveTakeaway = item.key_takeaway.positive || "";
        const negativeTakeaway = item.key_takeaway.negative || "";

        return {
            id: String(index + 1),
            companyName,
            sector,
            priceRange,
            lotSize,
            openDate: openDateObj.toISOString().split('T')[0],
            closeDate: closeDateObj.toISOString().split('T')[0],
            listingDate: listingDateObj.toISOString().split('T')[0],
            status,
            subscriptionRatio: subscription,
            listingGains,
            marketCap: parseNumeric(priceStr.split('Market cap: ')[1]) || (peRatio || 30) * (parseNumeric(item.company_fundamentals.eps_trends.split('FY25: ')[1]) || 10),
            issueSize,
            description,
            financialScore,
            valuationScore,
            managementScore,
            marketPositionScore,
            demandScore,
            marketSentimentScore,
            businessModelScore,
            overallPrediction,
            predictionConfidence,
            keyStrengths: positiveTakeaway.split(/[+→•,]/).map((s:string) => s.trim()).filter(Boolean),
            keyRisks: negativeTakeaway.split(/[+→•,]/).map((s:string) => s.trim()).filter(Boolean),
            analystRating: overallPrediction === 'positive' ? 'buy' : overallPrediction === 'neutral' ? 'hold' : 'avoid',
        };
    });
};


export function IPOCenter() {
  const [activeTab, setActiveTab] = useState('listings');
  
  // Use useMemo to transform data only once
  const ipoData: IPO[] = useMemo(() => transformRawData(rawIpoData), []);
  
  // Find the first upcoming IPO for the predictor
  const upcomingIpoForPredictor = ipoData.find(ipo => ipo.status === 'upcoming') || ipoData[0];
  
  const [predictionInput, setPredictionInput] = useState<IPOPredictionInput>({
    companyName: upcomingIpoForPredictor.companyName,
    sector: upcomingIpoForPredictor.sector,
    issueSize: upcomingIpoForPredictor.issueSize,
    priceRange: upcomingIpoForPredictor.priceRange,
    revenueGrowth: 15, // Default or parsed value
    profitMargin: 8, // Default or parsed value
    debtToEquity: 1.2, // Default or parsed value
    peRatio: 35, // Default or parsed value
    marketShare: 5,
    competitiveAdvantage: 7,
    managementExperience: 8,
    pastPerformance: 7,
    useOfProceeds: 'expansion',
    marketConditions: 7,
    sectorGrowth: 8,
    institutionalInterest: 6
  });

  const sectors = useMemo(() => Array.from(new Set(ipoData.map(ipo => ipo.sector))), [ipoData]);

  // --- Rest of the component logic (kept as in original file) ---
  const calculateIPOScore = (input: IPOPredictionInput) => {
    // Financial Performance Score (30%)
    const financialScore = (
      (input.revenueGrowth / 50) * 40 +
      (input.profitMargin / 20) * 30 +
      (Math.max(0, 10 - input.debtToEquity) / 10) * 30
    ) * 0.3;

    // Valuation Score (25%)
    const valuationScore = (
      (Math.max(0, 50 - input.peRatio) / 50) * 60 +
      (input.issueSize <= 2000 ? 8 : input.issueSize <= 5000 ? 6 : 4) * 5
    ) * 0.25;

    // Management & Business Score (20%)
    const managementScore = (
      input.managementExperience +
      input.pastPerformance +
      input.competitiveAdvantage
    ) / 3 * 0.2;

    // Market Position Score (15%)
    const marketPositionScore = (
      input.marketShare / 10 * 50 +
      input.sectorGrowth
    ) / 2 * 0.15;

    // Market Sentiment Score (10%)
    const sentimentScore = (
      input.marketConditions +
      input.institutionalInterest
    ) / 2 * 0.1;

    const totalScore = (financialScore + valuationScore + managementScore + marketPositionScore + sentimentScore) * 10;

    let prediction: 'positive' | 'neutral' | 'negative';
    let confidence: number;

    if (totalScore >= 8) {
      prediction = 'positive';
      confidence = Math.min(95, 75 + (totalScore - 8) * 10);
    } else if (totalScore >= 6) {
      prediction = 'neutral';
      confidence = Math.min(85, 60 + (totalScore - 6) * 12.5);
    } else {
      prediction = 'negative';
      confidence = Math.min(75, 40 + totalScore * 5);
    }

    return {
      totalScore,
      prediction,
      confidence,
      breakdown: {
        financial: financialScore * 10,
        valuation: valuationScore * 10,
        management: managementScore * 10,
        marketPosition: marketPositionScore * 10,
        sentiment: sentimentScore * 10
      }
    };
  };

  const predictionResult = calculateIPOScore(predictionInput);

  const getStatusColor = (status: IPO['status']) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'listed': return 'bg-gray-50 text-gray-600 border-gray-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const getStatusIcon = (status: IPO['status']) => {
    switch (status) {
      case 'upcoming': return <Clock className="w-4 h-4" />;
      case 'listed': return <TrendingUp className="w-4 h-4" />;
      default: return null;
    }
  };

  const getPredictionColor = (prediction: string) => {
    switch (prediction) {
      case 'positive': return '#0F9D58';
      case 'neutral': return '#FF9800';
      case 'negative': return '#F44336';
      default: return '#6c757d';
    }
  };

  const getPredictionIcon = (prediction: string) => {
    switch (prediction) {
      case 'positive': return <ThumbsUp className="w-5 h-5" />;
      case 'neutral': return <Activity className="w-5 h-5" />;
      case 'negative': return <ThumbsDown className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'buy': return 'bg-green-100 text-green-800';
      case 'hold': return 'bg-yellow-100 text-yellow-800';
      case 'avoid': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const [listingFilter, setListingFilter] = useState('upcoming');

  const filteredIPOs = ipoData.filter(ipo => {
    if (listingFilter === 'all') return true;
    return ipo.status === listingFilter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Chart data for IPO analysis
  const radarData = filteredIPOs.slice(0, 3).map(ipo => ({
    subject: ipo.companyName.split(' ')[0],
    financial: ipo.financialScore,
    valuation: ipo.valuationScore,
    management: ipo.managementScore,
    market: ipo.marketPositionScore,
    demand: ipo.demandScore,
    sentiment: ipo.marketSentimentScore
  }));

  const performanceData = ipoData.filter(ipo => ipo.listingGains !== undefined).map(ipo => ({
    name: ipo.companyName.split(' ')[0],
    gains: ipo.listingGains,
    subscription: ipo.subscriptionRatio,
    prediction: ipo.predictionConfidence
  }));

  const sectorData = sectors.map(sector => ({
    name: sector,
    value: ipoData.filter(ipo => ipo.sector === sector).length,
    avgScore: ipoData.filter(ipo => ipo.sector === sector).reduce((acc, ipo) => acc + ipo.predictionConfidence, 0) / ipoData.filter(ipo => ipo.sector === sector).length || 0
  }));

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">IPO Center</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Track upcoming IPOs and predict success with advanced AI analysis
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-gray-200 hover:border-[#0F9D58] hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-600">Upcoming IPOs</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {ipoData.filter(ipo => ipo.status === 'upcoming').length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 hover:border-[#0F9D58] hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="w-5 h-5 text-[#0F9D58]" />
              <span className="text-sm text-gray-600">Open for Bidding</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {ipoData.filter(ipo => ipo.status === 'open').length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 hover:border-[#0F9D58] hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-gray-600">Avg Prediction Score</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {Math.round(ipoData.reduce((acc, ipo) => acc + ipo.predictionConfidence, 0) / ipoData.length)}%
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 hover:border-[#0F9D58] hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-gray-600">Total Issue Size</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              ₹{ipoData.reduce((sum, ipo) => sum + ipo.issueSize, 0).toLocaleString()} Cr
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100">
          <TabsTrigger value="listings" className="data-[state=active]:bg-[#0F9D58] data-[state=active]:text-white">
            <Building className="w-4 h-4 mr-2" />
            IPO Listings
          </TabsTrigger>
          <TabsTrigger value="predictor" className="data-[state=active]:bg-[#0F9D58] data-[state=active]:text-white">
            <Brain className="w-4 h-4 mr-2" />
            IPO Predictor
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-[#0F9D58] data-[state=active]:text-white">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* IPO Listings Tab */}
        <TabsContent value="listings" className="space-y-6">
          <Card className="border-gray-200">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-gray-900">IPO Listings with AI Predictions</CardTitle>
                <Tabs value={listingFilter} onValueChange={setListingFilter} className="w-auto">
                  <TabsList className="bg-gray-100">
                    <TabsTrigger value="upcoming" className="data-[state=active]:bg-[#0F9D58] data-[state=active]:text-white">Upcoming</TabsTrigger>
                    <TabsTrigger value="listed" className="data-[state=active]:bg-[#0F9D58] data-[state=active]:text-white">Listed</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {filteredIPOs.map((ipo) => (
                  <Card key={ipo.id} className="border-l-4 border-l-[#0F9D58] border-gray-200 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Company Info */}
                        <div className="lg:col-span-2">
                          <div className="flex items-center space-x-3 mb-3">
                            <h3 className="text-xl font-semibold text-gray-900">
                              {ipo.companyName}
                            </h3>
                            <Badge className={getStatusColor(ipo.status)}>
                              <div className="flex items-center space-x-1">
                                {getStatusIcon(ipo.status)}
                                <span className="capitalize">{ipo.status}</span>
                              </div>
                            </Badge>
                            <Badge variant="outline" className="border-gray-300 text-gray-600">{ipo.sector}</Badge>
                            <Badge className={getRatingColor(ipo.analystRating)}>
                              {ipo.analystRating.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-gray-600 text-sm mb-4 max-w-2xl">{ipo.description}</p>
                          
                          {/* Basic Details */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                            <div>
                              <span className="text-gray-500">Price Range</span>
                              <div className="font-medium text-gray-900">₹{ipo.priceRange[0]} - ₹{ipo.priceRange[1]}</div>
                            </div>
                            <div>
                              <span className="text-gray-500">Lot Size</span>
                              <div className="font-medium text-gray-900">{ipo.lotSize} shares</div>
                            </div>
                            <div>
                              <span className="text-gray-500">Issue Size</span>
                              <div className="font-medium text-gray-900">₹{ipo.issueSize} Cr</div>
                            </div>
                            <div>
                              <span className="text-gray-500">Market Cap</span>
                              <div className="font-medium text-gray-900">₹{ipo.marketCap.toLocaleString()} Cr</div>
                            </div>
                          </div>

                          {/* AI Prediction Details */}
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-semibold text-gray-900 flex items-center">
                                <Brain className="w-4 h-4 mr-2 text-[#0F9D58]" />
                                AI Prediction Analysis
                              </h4>
                              <div className="flex items-center space-x-2">
                                <div 
                                  className="flex items-center space-x-1 px-2 py-1 rounded-full text-sm font-medium"
                                  style={{ 
                                    backgroundColor: getPredictionColor(ipo.overallPrediction) + '20',
                                    color: getPredictionColor(ipo.overallPrediction)
                                  }}
                                >
                                  {getPredictionIcon(ipo.overallPrediction)}
                                  <span className="capitalize">{ipo.overallPrediction}</span>
                                </div>
                                <Badge className="bg-blue-100 text-blue-800">
                                  {ipo.predictionConfidence.toFixed(0)}% Confidence
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h5 className="text-sm font-medium text-green-700 mb-2">Key Strengths</h5>
                                <ul className="text-xs text-gray-600 space-y-1">
                                  {ipo.keyStrengths.slice(0, 4).map((strength, index) => (
                                    <li key={index} className="flex items-center">
                                      <CheckCircle className="w-3 h-3 text-green-500 mr-1 flex-shrink-0" />
                                      {strength}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h5 className="text-sm font-medium text-red-700 mb-2">Key Risks</h5>
                                <ul className="text-xs text-gray-600 space-y-1">
                                  {ipo.keyRisks.slice(0, 4).map((risk, index) => (
                                    <li key={index} className="flex items-center">
                                      <AlertTriangle className="w-3 h-3 text-red-500 mr-1 flex-shrink-0" />
                                      {risk}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Timeline & Actions */}
                        <div className="space-y-4">
                          <div className="grid grid-cols-3 gap-2 text-xs text-center">
                            <div className="bg-gray-50 p-2 rounded border border-gray-200">
                              <div className="text-gray-500">Open</div>
                              <div className="font-medium text-gray-900">{formatDate(ipo.openDate)}</div>
                            </div>
                            <div className="bg-gray-50 p-2 rounded border border-gray-200">
                              <div className="text-gray-500">Close</div>
                              <div className="font-medium text-gray-900">{formatDate(ipo.closeDate)}</div>
                            </div>
                            <div className="bg-gray-50 p-2 rounded border border-gray-200">
                              <div className="text-gray-500">Listing</div>
                              <div className="font-medium text-gray-900">{formatDate(ipo.listingDate)}</div>
                            </div>
                          </div>

                          {/* Prediction Scores */}
                          <div className="bg-white rounded-lg border border-gray-200 p-3">
                            <h5 className="text-sm font-medium text-gray-900 mb-2">Prediction Scores</h5>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-600">Financial</span>
                                <span className="text-xs font-medium">{ipo.financialScore.toFixed(1)}/10</span>
                              </div>
                              <Progress value={ipo.financialScore * 10} className="h-1" />
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-600">Valuation</span>
                                <span className="text-xs font-medium">{ipo.valuationScore.toFixed(1)}/10</span>
                              </div>
                              <Progress value={ipo.valuationScore * 10} className="h-1" />
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-600">Management</span>
                                <span className="text-xs font-medium">{ipo.managementScore.toFixed(1)}/10</span>
                              </div>
                              <Progress value={ipo.managementScore * 10} className="h-1" />
                            </div>
                          </div>

                          {/* Status-specific info */}
                          {ipo.subscriptionRatio && (
                            <div className="text-center p-2 bg-blue-50 rounded border border-blue-200">
                              <div className="text-xs text-gray-500">Subscription Ratio</div>
                              <div className="font-bold text-blue-700">{ipo.subscriptionRatio}x</div>
                            </div>
                          )}

                          {ipo.listingGains !== undefined && (
                            <div className={`text-center p-2 rounded border ${
                              ipo.listingGains >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                            }`}>
                              <div className="text-xs text-gray-500">Listing Gains</div>
                              <div className={`font-bold flex items-center justify-center space-x-1 ${
                                ipo.listingGains >= 0 ? 'text-[#0F9D58]' : 'text-red-600'
                              }`}>
                                {ipo.listingGains >= 0 ? (
                                  <TrendingUp className="w-4 h-4" />
                                ) : (
                                  <TrendingDown className="w-4 h-4" />
                                )}
                                <span>{ipo.listingGains >= 0 ? '+' : ''}{ipo.listingGains.toFixed(1)}%</span>
                              </div>
                            </div>
                          )}

                          {/* Action Button */}
                          <div className="pt-2">
                            {ipo.status === 'upcoming' && (
                              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                Set Reminder
                              </Button>
                            )}
                            {ipo.status === 'open' && (
                              <Button className="w-full bg-[#0F9D58] hover:bg-[#0e8a4f] text-white">
                                Apply Now
                              </Button>
                            )}
                            {ipo.status === 'closed' && (
                              <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50">
                                Track Listing
                              </Button>
                            )}
                            {ipo.status === 'listed' && (
                              <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50">
                                View Analysis
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredIPOs.length === 0 && (
                <div className="text-center py-12">
                  <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No IPOs found</h3>
                  <p className="text-gray-500">There are no IPOs matching the current filter.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* IPO Predictor Tab */}
        <TabsContent value="predictor" className="space-y-6">
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-gray-900">
                <Brain className="w-6 h-6 text-[#0F9D58]" />
                <span>IPO Success Predictor</span>
              </CardTitle>
              <p className="text-gray-600">
                Enter company details to predict IPO success using advanced AI analysis
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Form */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block text-gray-700">Company Name</label>
                      <Input
                        placeholder="Enter company name"
                        value={predictionInput.companyName}
                        onChange={(e) => setPredictionInput({ ...predictionInput, companyName: e.target.value })}
                        className="bg-white border-gray-300"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block text-gray-700">Sector</label>
                      <Select 
                        value={predictionInput.sector} 
                        onValueChange={(value) => setPredictionInput({ ...predictionInput, sector: value })}
                      >
                        <SelectTrigger className="bg-white border-gray-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-300">
                          {sectors.map(sector => (
                            <SelectItem key={sector} value={sector}>
                              {sector}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-[#0F9D58]">Financial Metrics</h4>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block text-gray-700">
                        Revenue Growth (%): {predictionInput.revenueGrowth}
                      </label>
                      <Slider
                        value={[predictionInput.revenueGrowth]}
                        onValueChange={([value]) => setPredictionInput({ ...predictionInput, revenueGrowth: value })}
                        min={-20}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block text-gray-700">
                        Profit Margin (%): {predictionInput.profitMargin}
                      </label>
                      <Slider
                        value={[predictionInput.profitMargin]}
                        onValueChange={([value]) => setPredictionInput({ ...predictionInput, profitMargin: value })}
                        min={-10}
                        max={50}
                        step={0.5}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block text-gray-700">
                        Debt-to-Equity Ratio: {predictionInput.debtToEquity}
                      </label>
                      <Slider
                        value={[predictionInput.debtToEquity]}
                        onValueChange={([value]) => setPredictionInput({ ...predictionInput, debtToEquity: value })}
                        min={0}
                        max={5}
                        step={0.1}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block text-gray-700">
                        P/E Ratio: {predictionInput.peRatio}
                      </label>
                      <Slider
                        value={[predictionInput.peRatio]}
                        onValueChange={([value]) => setPredictionInput({ ...predictionInput, peRatio: value })}
                        min={5}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-[#0F9D58]">Market Position & Management</h4>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block text-gray-700">
                        Market Share (%): {predictionInput.marketShare}
                      </label>
                      <Slider
                        value={[predictionInput.marketShare]}
                        onValueChange={([value]) => setPredictionInput({ ...predictionInput, marketShare: value })}
                        min={0}
                        max={50}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block text-gray-700">
                        Competitive Advantage (1-10): {predictionInput.competitiveAdvantage}
                      </label>
                      <Slider
                        value={[predictionInput.competitiveAdvantage]}
                        onValueChange={([value]) => setPredictionInput({ ...predictionInput, competitiveAdvantage: value })}
                        min={1}
                        max={10}
                        step={0.5}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block text-gray-700">
                        Management Experience (1-10): {predictionInput.managementExperience}
                      </label>
                      <Slider
                        value={[predictionInput.managementExperience]}
                        onValueChange={([value]) => setPredictionInput({ ...predictionInput, managementExperience: value })}
                        min={1}
                        max={10}
                        step={0.5}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-[#0F9D58]">Market Conditions</h4>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block text-gray-700">
                        Overall Market Conditions (1-10): {predictionInput.marketConditions}
                      </label>
                      <Slider
                        value={[predictionInput.marketConditions]}
                        onValueChange={([value]) => setPredictionInput({ ...predictionInput, marketConditions: value })}
                        min={1}
                        max={10}
                        step={0.5}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block text-gray-700">
                        Sector Growth Potential (1-10): {predictionInput.sectorGrowth}
                      </label>
                      <Slider
                        value={[predictionInput.sectorGrowth]}
                        onValueChange={([value]) => setPredictionInput({ ...predictionInput, sectorGrowth: value })}
                        min={1}
                        max={10}
                        step={0.5}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block text-gray-700">
                        Institutional Interest (1-10): {predictionInput.institutionalInterest}
                      </label>
                      <Slider
                        value={[predictionInput.institutionalInterest]}
                        onValueChange={([value]) => setPredictionInput({ ...predictionInput, institutionalInterest: value })}
                        min={1}
                        max={10}
                        step={0.5}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Prediction Results */}
                <div className="space-y-6">
                  <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
                    <CardContent className="p-6">
                      <div className="text-center mb-6">
                        <div className="w-24 h-24 mx-auto mb-4 relative">
                          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              stroke="#e5e7eb"
                              strokeWidth="8"
                              fill="none"
                            />
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              stroke={getPredictionColor(predictionResult.prediction)}
                              strokeWidth="8"
                              fill="none"
                              strokeLinecap="round"
                              strokeDasharray={`${predictionResult.confidence * 2.51}, 251`}
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl font-bold text-gray-900">
                              {Math.round(predictionResult.confidence)}%
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-center space-x-2 mb-2">
                          <div style={{ color: getPredictionColor(predictionResult.prediction) }}>
                            {getPredictionIcon(predictionResult.prediction)}
                          </div>
                          <h3 
                            className="text-xl font-bold capitalize"
                            style={{ color: getPredictionColor(predictionResult.prediction) }}
                          >
                            {predictionResult.prediction} Outlook
                          </h3>
                        </div>
                        <p className="text-gray-600">
                          Overall IPO Success Score: {predictionResult.totalScore.toFixed(1)}/10
                        </p>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900">Score Breakdown</h4>
                        {Object.entries(predictionResult.breakdown).map(([key, value]) => (
                          <div key={key} className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 capitalize">
                              {key === 'marketPosition' ? 'Market Position' : key}
                            </span>
                            <div className="flex items-center space-x-2">
                              <Progress value={value * 10} className="w-20 h-2" />
                              <span className="text-sm font-medium w-8">{value.toFixed(1)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-200">
                    <CardContent className="p-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Key Factors Analysis</h4>
                      <div className="space-y-4">
                        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                          <h5 className="text-sm font-medium text-green-800 mb-2">Positive Factors</h5>
                          <ul className="text-xs text-green-700 space-y-1">
                            {predictionInput.revenueGrowth > 15 && <li>• Strong revenue growth trajectory</li>}
                            {predictionInput.profitMargin > 10 && <li>• Healthy profit margins</li>}
                            {predictionInput.debtToEquity < 1 && <li>• Conservative debt levels</li>}
                            {predictionInput.competitiveAdvantage > 7 && <li>• Strong competitive positioning</li>}
                            {predictionInput.managementExperience > 7 && <li>• Experienced management team</li>}
                            {predictionInput.sectorGrowth > 7 && <li>• Growing sector potential</li>}
                          </ul>
                        </div>
                        <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                          <h5 className="text-sm font-medium text-red-800 mb-2">Risk Factors</h5>
                          <ul className="text-xs text-red-700 space-y-1">
                            {predictionInput.peRatio > 40 && <li>• High valuation concerns</li>}
                            {predictionInput.debtToEquity > 2 && <li>• High debt levels</li>}
                            {predictionInput.profitMargin < 5 && <li>• Low profitability</li>}
                            {predictionInput.marketConditions < 6 && <li>• Challenging market conditions</li>}
                            {predictionInput.competitiveAdvantage < 5 && <li>• Weak competitive position</li>}
                            {predictionInput.institutionalInterest < 5 && <li>• Limited institutional interest</li>}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Button 
                    className="w-full bg-[#0F9D58] hover:bg-[#0e8a4f] text-white py-3"
                    onClick={() => {
                      // This would save the prediction or generate a detailed report
                      alert('Detailed IPO prediction report would be generated and saved.');
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Generate Detailed Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">IPO Performance Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="gains" fill="#0F9D58" name="Listing Gains %" />
                    <Line type="monotone" dataKey="prediction" stroke="#FF6B35" strokeWidth={3} name="Prediction Score" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Sector-wise IPO Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={sectorData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {sectorData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 50%)`} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Multi-Factor IPO Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={90} domain={[0, 10]} />
                  <Radar name="Financial" dataKey="financial" stroke="#0F9D58" fill="#0F9D58" fillOpacity={0.6} />
                  <Radar name="Valuation" dataKey="valuation" stroke="#FF6B35" fill="#FF6B35" fillOpacity={0.6} />
                  <Radar name="Management" dataKey="management" stroke="#4ECDC4" fill="#4ECDC4" fillOpacity={0.6} />
                  <Radar name="Market Position" dataKey="market" stroke="#45B7D1" fill="#45B7D1" fillOpacity={0.6} />
                  <Radar name="Demand" dataKey="demand" stroke="#96CEB4" fill="#96CEB4" fillOpacity={0.6} />
                  <Radar name="Sentiment" dataKey="sentiment" stroke="#FFEAA7" fill="#FFEAA7" fillOpacity={0.6} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Key Insights */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Market Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-[#0F9D58] mb-2">
                    {ipoData.filter(ipo => ipo.overallPrediction === 'positive').length}
                  </div>
                  <div className="text-sm text-gray-600">Positive Predictions</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600 mb-2">
                    {ipoData.filter(ipo => ipo.overallPrediction === 'neutral').length}
                  </div>
                  <div className="text-sm text-gray-600">Neutral Predictions</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600 mb-2">
                    {ipoData.filter(ipo => ipo.overallPrediction === 'negative').length}
                  </div>
                  <div className="text-sm text-gray-600">Negative Predictions</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}