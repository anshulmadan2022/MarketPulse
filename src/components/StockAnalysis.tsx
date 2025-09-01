import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Download, 
  TrendingUp, 
  TrendingDown, 
  ArrowLeft,
  Star,
  Share,
  Bell,
  BarChart3,
  DollarSign,
  Percent,
  Building,
  Calendar
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts';
import { watchlistAPI, authAPI } from '../utils/api';
import { toast } from 'sonner@2.0.3';

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  previousClose: number;
  volume: number;
  avgVolume: number;
  marketCap: number;
  pe: number;
  pb: number;
  eps: number;
  dividend: number;
  dividendYield: number;
  roe: number;
  roa: number;
  debtToEquity: number;
  currentRatio: number;
  quickRatio: number;
  sector: string;
  industry: string;
  employees: number;
  foundedYear: number;
  website: string;
  description: string;
}

interface ChartData {
  date: string;
  price: number;
  volume: number;
}

export function StockAnalysis({ 
  symbol, 
  onBack 
}: { 
  symbol: string; 
  onBack: () => void; 
}) {
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [chartPeriod, setChartPeriod] = useState('1Y');
  const [isLoading, setIsLoading] = useState(true);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);

  useEffect(() => {
    loadStockData();
    checkWatchlistStatus();
  }, [symbol]);

  const loadStockData = () => {
    // Simulate API call
    setTimeout(() => {
      const mockData: StockData = {
        symbol: symbol,
        name: symbol === 'RELIANCE' ? 'Reliance Industries Limited' : 
              symbol === 'TCS' ? 'Tata Consultancy Services' :
              symbol === 'HDFCBANK' ? 'HDFC Bank Limited' :
              `${symbol} Limited`,
        price: 2845.60 + Math.random() * 100,
        change: (Math.random() - 0.5) * 50,
        changePercent: (Math.random() - 0.5) * 3,
        open: 2830.20,
        high: 2867.45,
        low: 2821.30,
        previousClose: 2830.40,
        volume: 2450000,
        avgVolume: 2180000,
        marketCap: 192500,
        pe: 24.8,
        pb: 2.1,
        eps: 114.75,
        dividend: 8.0,
        dividendYield: 1.2,
        roe: 13.2,
        roa: 6.8,
        debtToEquity: 0.32,
        currentRatio: 1.45,
        quickRatio: 1.12,
        sector: 'Energy',
        industry: 'Oil & Gas Refining & Marketing',
        employees: 347000,
        foundedYear: 1966,
        website: 'www.ril.com',
        description: 'Reliance Industries Limited is an Indian multinational conglomerate company headquartered in Mumbai, Maharashtra, India. It is the largest private sector corporation in India.'
      };

      // Generate mock chart data
      const mockChartData: ChartData[] = [];
      const basePrice = mockData.price;
      for (let i = 365; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        mockChartData.push({
          date: date.toISOString().split('T')[0],
          price: basePrice + (Math.sin(i * 0.05) * 200) + (Math.random() - 0.5) * 100,
          volume: 1500000 + Math.random() * 2000000
        });
      }

      setStockData(mockData);
      setChartData(mockChartData);
      setIsLoading(false);
    }, 1000);
  };

  const checkWatchlistStatus = async () => {
    try {
      const user = await authAPI.getCurrentUser();
      if (user) {
        const { watchlist } = await watchlistAPI.get();
        setIsInWatchlist(watchlist.includes(symbol));
      }
    } catch (error) {
      console.log('User not authenticated or error checking watchlist');
    }
  };

  const toggleWatchlist = async () => {
    try {
      const user = await authAPI.getCurrentUser();
      if (!user) {
        toast.error('Please sign in to add stocks to your watchlist');
        return;
      }

      setWatchlistLoading(true);
      
      if (isInWatchlist) {
        await watchlistAPI.remove(symbol);
        setIsInWatchlist(false);
        toast.success(`${symbol} removed from watchlist`);
      } else {
        await watchlistAPI.add(symbol);
        setIsInWatchlist(true);
        toast.success(`${symbol} added to watchlist`);
      }
    } catch (error: any) {
      console.error('Watchlist error:', error);
      toast.error('Failed to update watchlist');
    } finally {
      setWatchlistLoading(false);
    }
  };

  const downloadReport = () => {
    // Mock PDF report generation
    alert('Professional stock analysis report would be generated and downloaded here.');
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!stockData) return null;

  const isPositive = stockData.change >= 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-[var(--brand-navy)]">{stockData.symbol}</h1>
            <p className="text-gray-600">{stockData.name}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={toggleWatchlist}
            disabled={watchlistLoading}
            className={isInWatchlist ? 'bg-yellow-50 border-yellow-300 text-yellow-700' : ''}
          >
            <Star className={`w-4 h-4 mr-2 ${isInWatchlist ? 'fill-current' : ''}`} />
            {isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
          </Button>
          <Button variant="outline" size="sm">
            <Bell className="w-4 h-4 mr-2" />
            Alert
          </Button>
          <Button variant="outline" size="sm">
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button onClick={downloadReport} className="bg-[var(--brand-navy)] hover:bg-[var(--brand-light-navy)]">
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
        </div>
      </div>

      {/* Price Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-4 mb-2">
                  <span className="text-4xl font-bold text-[var(--brand-navy)]">
                    ₹{stockData.price.toFixed(2)}
                  </span>
                  <div className={`flex items-center space-x-2 ${
                    isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {isPositive ? (
                      <TrendingUp className="w-6 h-6" />
                    ) : (
                      <TrendingDown className="w-6 h-6" />
                    )}
                    <div className="text-xl font-semibold">
                      {stockData.change >= 0 ? '+' : ''}{stockData.change.toFixed(2)} 
                      ({stockData.changePercent.toFixed(2)}%)
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  Previous Close: ₹{stockData.previousClose.toFixed(2)}
                </div>
              </div>
              <Badge variant="secondary" className="text-sm">
                {stockData.sector}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Open</span>
                <span className="font-medium">₹{stockData.open.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">High</span>
                <span className="font-medium text-green-600">₹{stockData.high.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Low</span>
                <span className="font-medium text-red-600">₹{stockData.low.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Volume</span>
                <span className="font-medium">{(stockData.volume / 1000000).toFixed(1)}M</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="fundamentals">Fundamentals</TabsTrigger>
          <TabsTrigger value="technicals">Technicals</TabsTrigger>
          <TabsTrigger value="financials">Financials</TabsTrigger>
          <TabsTrigger value="news">News</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Chart */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-[var(--brand-navy)]">Price Chart</CardTitle>
                <div className="flex space-x-2">
                  {['1D', '1W', '1M', '3M', '6M', '1Y'].map(period => (
                    <Button
                      key={period}
                      variant={chartPeriod === period ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setChartPeriod(period)}
                      className={chartPeriod === period ? 'bg-[var(--brand-navy)]' : ''}
                    >
                      {period}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <YAxis 
                      domain={['dataMin - 100', 'dataMax + 100']}
                      tickFormatter={(value) => `₹${value}`}
                    />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Price']}
                    />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke="#0f1935"
                      fill="#0f1935"
                      fillOpacity={0.1}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <DollarSign className="w-5 h-5 text-[var(--brand-gold)]" />
                  <span className="text-sm text-gray-600">Market Cap</span>
                </div>
                <div className="text-2xl font-bold text-[var(--brand-navy)]">
                  ₹{stockData.marketCap.toLocaleString()} Cr
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <BarChart3 className="w-5 h-5 text-[var(--brand-gold)]" />
                  <span className="text-sm text-gray-600">P/E Ratio</span>
                </div>
                <div className="text-2xl font-bold text-[var(--brand-navy)]">
                  {stockData.pe.toFixed(1)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Percent className="w-5 h-5 text-[var(--brand-gold)]" />
                  <span className="text-sm text-gray-600">Dividend Yield</span>
                </div>
                <div className="text-2xl font-bold text-[var(--brand-navy)]">
                  {stockData.dividendYield.toFixed(1)}%
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Building className="w-5 h-5 text-[var(--brand-gold)]" />
                  <span className="text-sm text-gray-600">ROE</span>
                </div>
                <div className="text-2xl font-bold text-[var(--brand-navy)]">
                  {stockData.roe.toFixed(1)}%
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Company Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[var(--brand-navy)]">Company Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">About</h4>
                  <p className="text-gray-600 text-sm">{stockData.description}</p>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Industry</span>
                    <span className="font-medium">{stockData.industry}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Employees</span>
                    <span className="font-medium">{stockData.employees.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Founded</span>
                    <span className="font-medium">{stockData.foundedYear}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Website</span>
                    <span className="font-medium text-blue-600">{stockData.website}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fundamentals" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-[var(--brand-navy)]">Valuation Ratios</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">P/E Ratio</span>
                  <span className="font-medium">{stockData.pe.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">P/B Ratio</span>
                  <span className="font-medium">{stockData.pb.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">EPS (₹)</span>
                  <span className="font-medium">{stockData.eps.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Dividend (₹)</span>
                  <span className="font-medium">{stockData.dividend.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-[var(--brand-navy)]">Financial Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">ROE (%)</span>
                  <span className="font-medium">{stockData.roe.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ROA (%)</span>
                  <span className="font-medium">{stockData.roa.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Debt/Equity</span>
                  <span className="font-medium">{stockData.debtToEquity.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Ratio</span>
                  <span className="font-medium">{stockData.currentRatio.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="technicals">
          <Card>
            <CardHeader>
              <CardTitle className="text-[var(--brand-navy)]">Technical Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Technical analysis charts and indicators would be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financials">
          <Card>
            <CardHeader>
              <CardTitle className="text-[var(--brand-navy)]">Financial Statements</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Detailed financial statements and analysis would be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="news">
          <Card>
            <CardHeader>
              <CardTitle className="text-[var(--brand-navy)]">Latest News & Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Recent news articles and company updates would be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}