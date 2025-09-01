import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { 
  Filter, 
  Download, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  RotateCcw,
  Eye,
  BarChart3,
  Building2,
  Users,
  Calculator,
  PieChart,
  LineChart,
  DollarSign,
  Percent,
  Target,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  BookOpen,
  FileText,
  Activity,
  Zap,
  Shield,
  TrendingFlat,
  Play,
  Settings,
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Table as TableIcon
} from 'lucide-react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { motion } from  'framer-motion';
import { 
  ComposedChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  Cell,
  PieChart as RechartsPieChart,
  Pie
} from 'recharts';

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
  pe: number;
  pb: number;
  dividend: number;
  volume: number;
  sector: string;
  roe: number;
  debt: number;
  revenue: number;
  netProfit: number;
  eps: number;
  bookValue: number;
  faceValue: number;
  operatingMargin: number;
  netMargin: number;
  debtToEquity: number;
  currentRatio: number;
  quickRatio: number;
  assetTurnover: number;
  inventoryTurnover: number;
  receivablesTurnover: number;
  interestCoverage: number;
  priceToSales: number;
  evEbitda: number;
  pegRatio: number;
  dividendPayout: number;
  returnOnAssets: number;
  returnOnCapital: number;
  freeCashFlow: number;
  workingCapital: number;
  grossMargin: number;
  ebitdaMargin: number;
  avgRoe5y: number;
  avgNetMargin5y: number;
  avgRevGrowth5y: number;
  avgNetProfitGrowth5y: number;
  qualityScore: number;
  valuationScore: number;
  financialScore: number;
  growthScore: number;
  qRevGrowth: number;
  qNetProfitGrowth: number;
  qOperatingMargin: number;
  sectorPeAvg: number;
  sectorPbAvg: number;
  sectorRoeAvg: number;
  week52High: number;
  week52Low: number;
  priceToHigh: number;
  priceToLow: number;
  beta: number;
}

interface Filters {
  marketCapMin: number;
  marketCapMax: number;
  peMin: number;
  peMax: number;
  priceMin: number;
  priceMax: number;
  dividendMin: number;
  roeMin: number;
  roeMax: number;
  debtToEquityMax: number;
  netMarginMin: number;
  revenueGrowthMin: number;
  qualityScoreMin: number;
  sector: string;
  searchTerm: string;
}

export function StockScreener({ onStockSelect }: { onStockSelect?: (symbol: string) => void }) {
  const [filters, setFilters] = useState<Filters>({
    marketCapMin: 0,
    marketCapMax: 500000,
    peMin: 0,
    peMax: 100,
    priceMin: 0,
    priceMax: 10000,
    dividendMin: 0,
    roeMin: 0,
    roeMax: 100,
    debtToEquityMax: 5,
    netMarginMin: 0,
    revenueGrowthMin: -50,
    qualityScoreMin: 0,
    sector: 'all',
    searchTerm: ''
  });

  const [sortBy, setSortBy] = useState<keyof Stock>('marketCap');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [activeTab, setActiveTab] = useState('setup');
  const [selectedPreset, setSelectedPreset] = useState('custom');
  const [selectedStocks, setSelectedStocks] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [isScreeningStarted, setIsScreeningStarted] = useState(false);

  // Enhanced mock stock data with comprehensive financial metrics
  const allStocks: Stock[] = [
    {
      symbol: 'RELIANCE',
      name: 'Reliance Industries Limited',
      price: 2845.60,
      change: 15.20,
      changePercent: 0.54,
      marketCap: 192500,
      pe: 24.8,
      pb: 2.1,
      dividend: 1.2,
      volume: 2450000,
      sector: 'Energy',
      roe: 13.2,
      debt: 3.2,
      revenue: 875000,
      netProfit: 68000,
      eps: 101.2,
      bookValue: 1354.8,
      faceValue: 10,
      operatingMargin: 12.5,
      netMargin: 7.8,
      debtToEquity: 0.35,
      currentRatio: 1.2,
      quickRatio: 0.8,
      assetTurnover: 0.6,
      inventoryTurnover: 8.2,
      receivablesTurnover: 12.4,
      interestCoverage: 6.8,
      priceToSales: 2.2,
      evEbitda: 18.5,
      pegRatio: 1.8,
      dividendPayout: 30.2,
      returnOnAssets: 7.9,
      returnOnCapital: 15.2,
      freeCashFlow: 45000,
      workingCapital: 125000,
      grossMargin: 28.5,
      ebitdaMargin: 15.2,
      avgRoe5y: 12.8,
      avgNetMargin5y: 8.2,
      avgRevGrowth5y: 8.5,
      avgNetProfitGrowth5y: 12.3,
      qualityScore: 7.5,
      valuationScore: 6.8,
      financialScore: 8.2,
      growthScore: 7.1,
      qRevGrowth: 12.5,
      qNetProfitGrowth: 18.2,
      qOperatingMargin: 13.2,
      sectorPeAvg: 22.5,
      sectorPbAvg: 2.3,
      sectorRoeAvg: 14.5,
      week52High: 3024.90,
      week52Low: 2145.30,
      priceToHigh: -5.9,
      priceToLow: 32.6,
      beta: 1.15
    },
    {
      symbol: 'TCS',
      name: 'Tata Consultancy Services',
      price: 3890.75,
      change: -12.45,
      changePercent: -0.32,
      marketCap: 142300,
      pe: 28.5,
      pb: 12.4,
      dividend: 2.1,
      volume: 1890000,
      sector: 'IT',
      roe: 42.8,
      debt: 0.1,
      revenue: 258000,
      netProfit: 58500,
      eps: 160.2,
      bookValue: 313.8,
      faceValue: 1,
      operatingMargin: 26.5,
      netMargin: 22.7,
      debtToEquity: 0.02,
      currentRatio: 2.8,
      quickRatio: 2.6,
      assetTurnover: 1.8,
      inventoryTurnover: 45.2,
      receivablesTurnover: 6.4,
      interestCoverage: 125.8,
      priceToSales: 5.5,
      evEbitda: 24.2,
      pegRatio: 2.1,
      dividendPayout: 37.5,
      returnOnAssets: 38.5,
      returnOnCapital: 55.2,
      freeCashFlow: 52000,
      workingCapital: 85000,
      grossMargin: 48.5,
      ebitdaMargin: 28.2,
      avgRoe5y: 41.2,
      avgNetMargin5y: 21.8,
      avgRevGrowth5y: 11.5,
      avgNetProfitGrowth5y: 15.2,
      qualityScore: 9.2,
      valuationScore: 6.5,
      financialScore: 9.5,
      growthScore: 8.8,
      qRevGrowth: 15.2,
      qNetProfitGrowth: 22.5,
      qOperatingMargin: 27.2,
      sectorPeAvg: 26.8,
      sectorPbAvg: 9.5,
      sectorRoeAvg: 35.2,
      week52High: 4259.55,
      week52Low: 3145.20,
      priceToHigh: -8.7,
      priceToLow: 23.7,
      beta: 0.85
    },
    {
      symbol: 'HDFCBANK',
      name: 'HDFC Bank Limited',
      price: 1658.90,
      change: 8.75,
      changePercent: 0.53,
      marketCap: 126800,
      pe: 19.2,
      pb: 2.8,
      dividend: 1.8,
      volume: 3200000,
      sector: 'Banking',
      roe: 16.5,
      debt: 0.8,
      revenue: 198500,
      netProfit: 47500,
      eps: 86.4,
      bookValue: 592.5,
      faceValue: 1,
      operatingMargin: 35.2,
      netMargin: 23.9,
      debtToEquity: 0.0,
      currentRatio: 0.9,
      quickRatio: 0.9,
      assetTurnover: 0.08,
      inventoryTurnover: 0.0,
      receivablesTurnover: 0.0,
      interestCoverage: 8.5,
      priceToSales: 6.4,
      evEbitda: 12.5,
      pegRatio: 1.2,
      dividendPayout: 24.8,
      returnOnAssets: 1.8,
      returnOnCapital: 4.2,
      freeCashFlow: 35000,
      workingCapital: 125000,
      grossMargin: 89.5,
      ebitdaMargin: 0.0,
      avgRoe5y: 17.2,
      avgNetMargin5y: 24.5,
      avgRevGrowth5y: 18.5,
      avgNetProfitGrowth5y: 19.2,
      qualityScore: 8.8,
      valuationScore: 7.2,
      financialScore: 9.1,
      growthScore: 8.5,
      qRevGrowth: 22.5,
      qNetProfitGrowth: 25.8,
      qOperatingMargin: 36.2,
      sectorPeAvg: 17.5,
      sectorPbAvg: 2.5,
      sectorRoeAvg: 15.8,
      week52High: 1780.00,
      week52Low: 1363.55,
      priceToHigh: -6.8,
      priceToLow: 21.6,
      beta: 1.05
    },
    {
      symbol: 'INFY',
      name: 'Infosys Limited',
      price: 1892.45,
      change: 23.80,
      changePercent: 1.28,
      marketCap: 78900,
      pe: 26.8,
      pb: 8.9,
      dividend: 2.5,
      volume: 1560000,
      sector: 'IT',
      roe: 32.5,
      debt: 0.05,
      revenue: 165000,
      netProfit: 28500,
      eps: 46.2,
      bookValue: 212.5,
      faceValue: 5,
      operatingMargin: 24.8,
      netMargin: 17.3,
      debtToEquity: 0.01,
      currentRatio: 2.2,
      quickRatio: 2.1,
      assetTurnover: 1.5,
      inventoryTurnover: 0.0,
      receivablesTurnover: 5.8,
      interestCoverage: 98.5,
      priceToSales: 4.8,
      evEbitda: 19.8,
      pegRatio: 1.9,
      dividendPayout: 65.2,
      returnOnAssets: 28.5,
      returnOnCapital: 42.8,
      freeCashFlow: 26000,
      workingCapital: 48000,
      grossMargin: 42.8,
      ebitdaMargin: 26.5,
      avgRoe5y: 31.2,
      avgNetMargin5y: 16.8,
      avgRevGrowth5y: 9.8,
      avgNetProfitGrowth5y: 11.5,
      qualityScore: 8.8,
      valuationScore: 7.1,
      financialScore: 9.2,
      growthScore: 7.8,
      qRevGrowth: 13.8,
      qNetProfitGrowth: 19.5,
      qOperatingMargin: 25.2,
      sectorPeAvg: 26.8,
      sectorPbAvg: 9.5,
      sectorRoeAvg: 35.2,
      week52High: 1995.50,
      week52Low: 1455.80,
      priceToHigh: -5.2,
      priceToLow: 30.0,
      beta: 0.92
    },
    {
      symbol: 'WIPRO',
      name: 'Wipro Limited',
      price: 568.25,
      change: -4.15,
      changePercent: -0.72,
      marketCap: 31200,
      pe: 22.4,
      pb: 3.2,
      dividend: 2.8,
      volume: 890000,
      sector: 'IT',
      roe: 15.8,
      debt: 0.1,
      revenue: 95000,
      netProfit: 8500,
      eps: 15.4,
      bookValue: 177.8,
      faceValue: 2,
      operatingMargin: 18.5,
      netMargin: 8.9,
      debtToEquity: 0.02,
      currentRatio: 1.8,
      quickRatio: 1.7,
      assetTurnover: 0.8,
      inventoryTurnover: 0.0,
      receivablesTurnover: 4.2,
      interestCoverage: 45.8,
      priceToSales: 3.3,
      evEbitda: 18.5,
      pegRatio: 2.8,
      dividendPayout: 78.5,
      returnOnAssets: 12.5,
      returnOnCapital: 18.8,
      freeCashFlow: 7800,
      workingCapital: 22000,
      grossMargin: 28.5,
      ebitdaMargin: 19.8,
      avgRoe5y: 16.2,
      avgNetMargin5y: 9.5,
      avgRevGrowth5y: 3.8,
      avgNetProfitGrowth5y: 2.5,
      qualityScore: 7.2,
      valuationScore: 6.8,
      financialScore: 7.8,
      growthScore: 5.5,
      qRevGrowth: 5.8,
      qNetProfitGrowth: 8.2,
      qOperatingMargin: 19.2,
      sectorPeAvg: 26.8,
      sectorPbAvg: 9.5,
      sectorRoeAvg: 35.2,
      week52High: 658.50,
      week52Low: 385.20,
      priceToHigh: -13.7,
      priceToLow: 47.5,
      beta: 1.05
    }
  ];

  // Preset screening strategies
  const presetStrategies = [
    {
      id: 'custom',
      name: 'Custom Screening',
      description: 'Create your own filters',
      icon: Settings,
      filters: null
    },
    {
      id: 'quality',
      name: 'High Quality Stocks',
      description: 'ROE > 15%, Debt/Equity < 1, Quality Score > 7',
      icon: Star,
      filters: {
        roeMin: 15,
        debtToEquityMax: 1,
        qualityScoreMin: 7
      }
    },
    {
      id: 'value',
      name: 'Value Investing',
      description: 'PE < 20, PB < 3, Dividend > 2%',
      icon: DollarSign,
      filters: {
        peMax: 20,
        pbMax: 3,
        dividendMin: 2
      }
    },
    {
      id: 'growth',
      name: 'Growth Stocks',
      description: 'Revenue Growth > 15%, Profit Growth > 20%',
      icon: TrendingUp,
      filters: {
        revenueGrowthMin: 15,
        qNetProfitGrowthMin: 20
      }
    },
    {
      id: 'dividend',
      name: 'Dividend Aristocrats',
      description: 'Dividend Yield > 3%, Consistent Payout',
      icon: Percent,
      filters: {
        dividendMin: 3,
        dividendPayoutMax: 60
      }
    },
    {
      id: 'largecap',
      name: 'Large Cap Bluechips',
      description: 'Market Cap > ₹50,000 Cr, Quality Score > 8',
      icon: Building2,
      filters: {
        marketCapMin: 50000,
        qualityScoreMin: 8
      }
    }
  ];

  const filteredStocks = useMemo(() => {
    if (!isScreeningStarted) return [];
    
    return allStocks
      .filter(stock => {
        return (
          stock.marketCap >= filters.marketCapMin &&
          stock.marketCap <= filters.marketCapMax &&
          stock.pe >= filters.peMin &&
          stock.pe <= filters.peMax &&
          stock.price >= filters.priceMin &&
          stock.price <= filters.priceMax &&
          stock.dividend >= filters.dividendMin &&
          stock.roe >= filters.roeMin &&
          stock.roe <= filters.roeMax &&
          stock.debtToEquity <= filters.debtToEquityMax &&
          stock.netMargin >= filters.netMarginMin &&
          stock.avgRevGrowth5y >= filters.revenueGrowthMin &&
          stock.qualityScore >= filters.qualityScoreMin &&
          (filters.sector === 'all' || stock.sector === filters.sector) &&
          (filters.searchTerm === '' || 
           stock.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
           stock.symbol.toLowerCase().includes(filters.searchTerm.toLowerCase()))
        );
      })
      .sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];
        if (sortOrder === 'asc') {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      });
  }, [filters, sortBy, sortOrder, allStocks, isScreeningStarted]);

  const sectors = ['all', 'IT', 'Banking', 'Energy', 'FMCG', 'Telecom', 'Infrastructure', 'Pharma', 'Auto', 'Metals'];

  const resetFilters = () => {
    setFilters({
      marketCapMin: 0,
      marketCapMax: 500000,
      peMin: 0,
      peMax: 100,
      priceMin: 0,
      priceMax: 10000,
      dividendMin: 0,
      roeMin: 0,
      roeMax: 100,
      debtToEquityMax: 5,
      netMarginMin: 0,
      revenueGrowthMin: -50,
      qualityScoreMin: 0,
      sector: 'all',
      searchTerm: ''
    });
    setSelectedPreset('custom');
  };

  const applyPreset = (presetId: string) => {
    const preset = presetStrategies.find(p => p.id === presetId);
    if (preset && preset.filters) {
      setFilters(prev => ({ ...prev, ...preset.filters }));
    }
    setSelectedPreset(presetId);
  };

  const startScreening = () => {
    setIsScreeningStarted(true);
    setActiveTab('results');
  };

  const exportToPDF = () => {
    alert('PDF Export functionality would be implemented here. The filtered results would be exported as a professional report.');
  };

  const handleSort = (column: keyof Stock) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return '#0F9D58';
    if (score >= 6) return '#FF9800';
    return '#F44336';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 8) return <CheckCircle className="w-4 h-4" />;
    if (score >= 6) return <AlertTriangle className="w-4 h-4" />;
    return <XCircle className="w-4 h-4" />;
  };

  const toggleStockSelection = (symbol: string) => {
    setSelectedStocks(prev => 
      prev.includes(symbol) 
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol]
    );
  };

  // Chart data for comparison
  const comparisonData = filteredStocks.slice(0, 5).map(stock => ({
    name: stock.symbol,
    pe: stock.pe,
    pb: stock.pb,
    roe: stock.roe,
    marketCap: stock.marketCap / 1000,
    price: stock.price
  }));

  // Sector distribution data
  const sectorData = sectors.slice(1).map(sector => ({
    name: sector,
    value: filteredStocks.filter(s => s.sector === sector).length,
    fill: `hsl(${Math.random() * 360}, 70%, 50%)`
  }));

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Stock Screener
            </h1>
            <p className="text-gray-600 text-lg">
              Advanced screening with 50+ financial metrics
            </p>
          </div>

          {/* Quick Stats */}
          {isScreeningStarted && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-white border border-gray-200">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-[#0F9D58] mb-1">
                    {filteredStocks.length}
                  </div>
                  <div className="text-sm text-gray-600">Stocks Found</div>
                </CardContent>
              </Card>
              <Card className="bg-white border border-gray-200">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {filteredStocks.filter(s => s.changePercent > 0).length}
                  </div>
                  <div className="text-sm text-gray-600">Gainers</div>
                </CardContent>
              </Card>
              <Card className="bg-white border border-gray-200">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600 mb-1">
                    {filteredStocks.filter(s => s.changePercent < 0).length}
                  </div>
                  <div className="text-sm text-gray-600">Losers</div>
                </CardContent>
              </Card>
              <Card className="bg-white border border-gray-200">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-[#0F9D58] mb-1">
                    {Math.round(filteredStocks.reduce((acc, s) => acc + s.qualityScore, 0) / filteredStocks.length * 10) / 10 || 0}
                  </div>
                  <div className="text-sm text-gray-600">Avg Quality</div>
                </CardContent>
              </Card>
            </div>
          )}
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-100">
            <TabsTrigger value="setup" className="data-[state=active]:bg-[#0F9D58] data-[state=active]:text-white">
              <Settings className="w-4 h-4 mr-2" />
              Setup Filters
            </TabsTrigger>
            <TabsTrigger value="presets" className="data-[state=active]:bg-[#0F9D58] data-[state=active]:text-white">
              <Target className="w-4 h-4 mr-2" />
              Strategies
            </TabsTrigger>
            <TabsTrigger value="results" className="data-[state=active]:bg-[#0F9D58] data-[state=active]:text-white" disabled={!isScreeningStarted}>
              <BarChart3 className="w-4 h-4 mr-2" />
              Results
            </TabsTrigger>
            <TabsTrigger value="charts" className="data-[state=active]:bg-[#0F9D58] data-[state=active]:text-white" disabled={!isScreeningStarted}>
              <LineChart className="w-4 h-4 mr-2" />
              Charts
            </TabsTrigger>
          </TabsList>

          {/* Setup Filters Tab */}
          <TabsContent value="setup" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Filters Panel */}
              <div className="lg:col-span-3">
                <Card className="bg-white border border-gray-200">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2 text-gray-900">
                        <Filter className="w-5 h-5 text-[#0F9D58]" />
                        <span>Configure Your Screening Criteria</span>
                      </CardTitle>
                      <Button variant="ghost" size="sm" onClick={resetFilters} className="text-[#0F9D58] hover:bg-gray-100">
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Left Column */}
                      <div className="space-y-6">
                        {/* Search */}
                        <div>
                          <label className="text-sm font-medium mb-2 block text-gray-700">Search Company</label>
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                              placeholder="Company name or symbol..."
                              value={filters.searchTerm}
                              onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                              className="pl-10 bg-white border-gray-300"
                            />
                          </div>
                        </div>

                        {/* Sector */}
                        <div>
                          <label className="text-sm font-medium mb-2 block text-gray-700">Sector</label>
                          <Select 
                            value={filters.sector} 
                            onValueChange={(value) => setFilters({ ...filters, sector: value })}
                          >
                            <SelectTrigger className="bg-white border-gray-300">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-gray-300">
                              {sectors.map(sector => (
                                <SelectItem key={sector} value={sector}>
                                  {sector === 'all' ? 'All Sectors' : sector}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Market Cap */}
                        <div>
                          <label className="text-sm font-medium mb-2 block text-gray-700">
                            Market Cap (₹ Cr): {filters.marketCapMin.toLocaleString()} - {filters.marketCapMax.toLocaleString()}
                          </label>
                          <Slider
                            value={[filters.marketCapMin, filters.marketCapMax]}
                            onValueChange={([min, max]) => setFilters({ ...filters, marketCapMin: min, marketCapMax: max })}
                            max={500000}
                            step={5000}
                            className="w-full"
                          />
                        </div>

                        {/* P/E Ratio */}
                        <div>
                          <label className="text-sm font-medium mb-2 block text-gray-700">
                            P/E Ratio: {filters.peMin} - {filters.peMax}
                          </label>
                          <Slider
                            value={[filters.peMin, filters.peMax]}
                            onValueChange={([min, max]) => setFilters({ ...filters, peMin: min, peMax: max })}
                            max={100}
                            step={1}
                            className="w-full"
                          />
                        </div>

                        {/* Price Range */}
                        <div>
                          <label className="text-sm font-medium mb-2 block text-gray-700">
                            Price (₹): {filters.priceMin} - {filters.priceMax}
                          </label>
                          <Slider
                            value={[filters.priceMin, filters.priceMax]}
                            onValueChange={([min, max]) => setFilters({ ...filters, priceMin: min, priceMax: max })}
                            max={10000}
                            step={50}
                            className="w-full"
                          />
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-6">
                        {/* ROE */}
                        <div>
                          <label className="text-sm font-medium mb-2 block text-gray-700">
                            ROE (%): {filters.roeMin} - {filters.roeMax}
                          </label>
                          <Slider
                            value={[filters.roeMin, filters.roeMax]}
                            onValueChange={([min, max]) => setFilters({ ...filters, roeMin: min, roeMax: max })}
                            max={100}
                            step={1}
                            className="w-full"
                          />
                        </div>

                        {/* Net Margin */}
                        <div>
                          <label className="text-sm font-medium mb-2 block text-gray-700">
                            Min Net Margin (%): {filters.netMarginMin}
                          </label>
                          <Slider
                            value={[filters.netMarginMin]}
                            onValueChange={([min]) => setFilters({ ...filters, netMarginMin: min })}
                            max={50}
                            step={1}
                            className="w-full"
                          />
                        </div>

                        {/* Debt to Equity */}
                        <div>
                          <label className="text-sm font-medium mb-2 block text-gray-700">
                            Max Debt/Equity: {filters.debtToEquityMax}
                          </label>
                          <Slider
                            value={[filters.debtToEquityMax]}
                            onValueChange={([max]) => setFilters({ ...filters, debtToEquityMax: max })}
                            max={5}
                            step={0.1}
                            className="w-full"
                          />
                        </div>

                        {/* Quality Score */}
                        <div>
                          <label className="text-sm font-medium mb-2 block text-gray-700">
                            Min Quality Score: {filters.qualityScoreMin}
                          </label>
                          <Slider
                            value={[filters.qualityScoreMin]}
                            onValueChange={([min]) => setFilters({ ...filters, qualityScoreMin: min })}
                            max={10}
                            step={0.5}
                            className="w-full"
                          />
                        </div>

                        {/* Revenue Growth */}
                        <div>
                          <label className="text-sm font-medium mb-2 block text-gray-700">
                            Min Revenue Growth (5Y %): {filters.revenueGrowthMin}
                          </label>
                          <Slider
                            value={[filters.revenueGrowthMin]}
                            onValueChange={([min]) => setFilters({ ...filters, revenueGrowthMin: min })}
                            min={-50}
                            max={50}
                            step={1}
                            className="w-full"
                          />
                        </div>

                        {/* Dividend Yield */}
                        <div>
                          <label className="text-sm font-medium mb-2 block text-gray-700">
                            Min Dividend Yield (%): {filters.dividendMin}
                          </label>
                          <Slider
                            value={[filters.dividendMin]}
                            onValueChange={([min]) => setFilters({ ...filters, dividendMin: min })}
                            max={10}
                            step={0.1}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Action Panel */}
              <div className="lg:col-span-1">
                <Card className="sticky top-4 bg-gradient-to-br from-[var(--brand-navy)] to-[var(--brand-deep-navy)] text-white border-0 shadow-xl">
                  <CardContent className="p-6 text-center">
                    <div className="mb-6">
                      <div className="w-20 h-20 bg-[var(--brand-gold)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Play className="w-10 h-10 text-[var(--brand-gold)]" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Ready to Screen?</h3>
                      <p className="text-sm opacity-90 leading-relaxed">
                        Your filters are set. Start screening to discover investment opportunities with live market data.
                      </p>
                    </div>
                    <Button 
                      onClick={startScreening}
                      className="w-full bg-gradient-to-r from-[var(--brand-gold)] to-[var(--brand-light-gold)] text-[var(--brand-navy)] hover:shadow-xl hover:shadow-[var(--brand-gold)]/30 font-semibold py-3 transform hover:scale-105 transition-all duration-300"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Start Screening
                    </Button>
                    <div className="mt-4 pt-4 border-t border-[var(--brand-gold)]/20">
                      <div className="flex items-center justify-center space-x-4 text-xs text-[var(--brand-gold)]">
                        <div className="flex items-center">
                          <Activity className="w-3 h-3 mr-1" />
                          Live Data
                        </div>
                        <div className="flex items-center">
                          <Star className="w-3 h-3 mr-1" />
                          Real-time Analysis
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Preset Strategies Tab */}
          <TabsContent value="presets" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {presetStrategies.map((preset) => {
                const IconComponent = preset.icon;
                return (
                  <Card 
                    key={preset.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedPreset === preset.id ? 'ring-2 ring-[#0F9D58] bg-green-50' : 'bg-white'
                    }`}
                    onClick={() => applyPreset(preset.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-lg ${selectedPreset === preset.id ? 'bg-[#0F9D58] text-white' : 'bg-gray-100 text-gray-600'}`}>
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2">{preset.name}</h3>
                          <p className="text-sm text-gray-600 mb-3">{preset.description}</p>
                          {selectedPreset === preset.id && (
                            <Badge className="bg-[#0F9D58] text-white">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Active
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            <div className="text-center">
              <Button 
                onClick={startScreening}
                className="bg-gradient-to-r from-[var(--brand-navy)] to-[var(--brand-deep-navy)] text-white hover:shadow-xl hover:shadow-[var(--brand-navy)]/30 px-8 py-3 transform hover:scale-105 transition-all duration-300"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Screening with Selected Strategy
              </Button>
            </div>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-6">
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                  <div>
                    <CardTitle className="text-gray-900 text-xl">
                      Screening Results
                    </CardTitle>
                    <p className="text-gray-600 mt-1">
                      {filteredStocks.length} stocks match your criteria
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={viewMode === 'table' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('table')}
                      className={viewMode === 'table' ? 'bg-[#0F9D58] text-white' : ''}
                    >
                      <TableIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'cards' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('cards')}
                      className={viewMode === 'cards' ? 'bg-[#0F9D58] text-white' : ''}
                    >
                      <Building2 className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" onClick={exportToPDF} className="border-[#0F9D58] text-[#0F9D58] hover:bg-[#0F9D58] hover:text-white">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {viewMode === 'table' ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">
                            <input
                              type="checkbox"
                              className="rounded border-gray-300"
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedStocks(filteredStocks.map(s => s.symbol));
                                } else {
                                  setSelectedStocks([]);
                                }
                              }}
                            />
                          </TableHead>
                          <TableHead 
                            className="cursor-pointer hover:bg-gray-50"
                            onClick={() => handleSort('symbol')}
                          >
                            Company
                            {sortBy === 'symbol' && (
                              <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                            )}
                          </TableHead>
                          <TableHead 
                            className="cursor-pointer hover:bg-gray-50 text-right"
                            onClick={() => handleSort('price')}
                          >
                            Price
                            {sortBy === 'price' && (
                              <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                            )}
                          </TableHead>
                          <TableHead 
                            className="cursor-pointer hover:bg-gray-50 text-right"
                            onClick={() => handleSort('changePercent')}
                          >
                            Change %
                            {sortBy === 'changePercent' && (
                              <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                            )}
                          </TableHead>
                          <TableHead 
                            className="cursor-pointer hover:bg-gray-50 text-right"
                            onClick={() => handleSort('marketCap')}
                          >
                            Market Cap
                            {sortBy === 'marketCap' && (
                              <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                            )}
                          </TableHead>
                          <TableHead 
                            className="cursor-pointer hover:bg-gray-50 text-right"
                            onClick={() => handleSort('pe')}
                          >
                            P/E
                            {sortBy === 'pe' && (
                              <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                            )}
                          </TableHead>
                          <TableHead 
                            className="cursor-pointer hover:bg-gray-50 text-right"
                            onClick={() => handleSort('pb')}
                          >
                            P/B
                            {sortBy === 'pb' && (
                              <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                            )}
                          </TableHead>
                          <TableHead 
                            className="cursor-pointer hover:bg-gray-50 text-right"
                            onClick={() => handleSort('roe')}
                          >
                            ROE %
                            {sortBy === 'roe' && (
                              <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                            )}
                          </TableHead>
                          <TableHead 
                            className="cursor-pointer hover:bg-gray-50 text-center"
                            onClick={() => handleSort('qualityScore')}
                          >
                            Quality
                            {sortBy === 'qualityScore' && (
                              <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                            )}
                          </TableHead>
                          <TableHead className="text-center">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredStocks.map((stock) => (
                          <TableRow key={stock.symbol} className="hover:bg-gray-50">
                            <TableCell>
                              <input
                                type="checkbox"
                                className="rounded border-gray-300"
                                checked={selectedStocks.includes(stock.symbol)}
                                onChange={() => toggleStockSelection(stock.symbol)}
                              />
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium text-gray-900">{stock.symbol}</div>
                                <div className="text-sm text-gray-500 line-clamp-1">{stock.name}</div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="font-medium">₹{stock.price.toLocaleString()}</div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className={`font-medium ${stock.changePercent >= 0 ? 'text-[#0F9D58]' : 'text-red-600'}`}>
                                {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="font-medium">₹{(stock.marketCap / 1000).toFixed(1)}K Cr</div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="font-medium">{stock.pe.toFixed(1)}</div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="font-medium">{stock.pb.toFixed(1)}</div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="font-medium">{stock.roe.toFixed(1)}%</div>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center space-x-1">
                                <div
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: getScoreColor(stock.qualityScore) }}
                                />
                                <span className="font-medium">{stock.qualityScore.toFixed(1)}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onStockSelect?.(stock.symbol)}
                                className="text-[#0F9D58] hover:bg-gray-100"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredStocks.map((stock) => (
                      <Card key={stock.symbol} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-gray-900">{stock.symbol}</h3>
                              <p className="text-sm text-gray-500 line-clamp-2">{stock.name}</p>
                            </div>
                            <input
                              type="checkbox"
                              className="rounded border-gray-300"
                              checked={selectedStocks.includes(stock.symbol)}
                              onChange={() => toggleStockSelection(stock.symbol)}
                            />
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Price:</span>
                              <span className="font-medium">₹{stock.price.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Change:</span>
                              <span className={`font-medium ${stock.changePercent >= 0 ? 'text-[#0F9D58]' : 'text-red-600'}`}>
                                {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Market Cap:</span>
                              <span className="font-medium">₹{(stock.marketCap / 1000).toFixed(1)}K Cr</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">P/E:</span>
                              <span className="font-medium">{stock.pe.toFixed(1)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">ROE:</span>
                              <span className="font-medium">{stock.roe.toFixed(1)}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Quality Score:</span>
                              <div className="flex items-center space-x-1">
                                <div
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: getScoreColor(stock.qualityScore) }}
                                />
                                <span className="font-medium">{stock.qualityScore.toFixed(1)}</span>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onStockSelect?.(stock.symbol)}
                            className="w-full mt-3 border-[#0F9D58] text-[#0F9D58] hover:bg-[#0F9D58] hover:text-white"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Analyze
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Charts Tab */}
          <TabsContent value="charts" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="pe" fill="#0F9D58" name="P/E Ratio" />
                      <Line type="monotone" dataKey="roe" stroke="#FF6B35" strokeWidth={3} name="ROE %" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900">Sector Distribution</CardTitle>
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
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}