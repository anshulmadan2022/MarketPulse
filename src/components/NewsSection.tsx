import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Search, 
  Clock, 
  Globe, 
  ExternalLink,
  RefreshCw,
  AlertCircle,
  Loader2,
  TrendingUp,
  CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    id: string;
    name: string;
  };
  author: string;
  content: string;
}

interface NewsAPIResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}

export function NewsSection() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('stock market');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isApiConfigured, setIsApiConfigured] = useState(false);

  const categories = [
    { value: 'stock market', label: 'Stock Market' },
    { value: 'Indian economy', label: 'Indian Economy' },
    { value: 'NSE BSE', label: 'NSE & BSE' },
    { value: 'RBI banking', label: 'RBI & Banking' },
    { value: 'IPO mutual funds', label: 'IPO & Mutual Funds' },
    { value: 'cryptocurrency bitcoin', label: 'Cryptocurrency' },
    { value: 'GDP inflation', label: 'GDP & Inflation' },
    { value: 'SEBI regulations', label: 'SEBI & Regulations' }
  ];

  const fetchNews = async (category: string = 'stock market', search: string = '') => {
    try {
      setLoading(true);
      setError(null);
      
      const query = search || category;
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-0475480f/api/news`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ 
          query,
          country: 'in',
          language: 'en',
          sortBy: 'publishedAt',
          pageSize: 20
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('News API response error:', response.status, errorText);
        throw new Error(`Failed to fetch news: ${response.status} ${response.statusText}`);
      }

      const data: NewsAPIResponse = await response.json();
      
      if (data.status === 'ok') {
        const filteredArticles = data.articles.filter(article => 
          article.title && 
          article.description && 
          article.url &&
          !article.title.includes('[Removed]')
        );
        
        setArticles(filteredArticles);
        setIsApiConfigured(true);
        
        // If we got articles, the API is working
        if (filteredArticles.length > 0) {
          setError(null);
        } else {
          setError('No news articles found for the selected category. Please try a different search.');
        }
      } else {
        throw new Error(data.message || 'Failed to fetch news from API');
      }
    } catch (err) {
      console.error('Error fetching news:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load news';
      setError(errorMessage);
      
      // Check if it's a configuration issue vs other errors
      if (errorMessage.includes('API key') || errorMessage.includes('401') || errorMessage.includes('403')) {
        setIsApiConfigured(false);
      }
      
      // Set fallback articles if we don't have any
      if (articles.length === 0) {
        setArticles([
          {
            title: 'Sensex, Nifty Hit Fresh Record Highs Led by Banking, IT Stocks',
            description: 'Indian benchmark indices continued their upward momentum with strong buying in banking and IT sectors amid positive global cues.',
            url: '#',
            urlToImage: '',
            publishedAt: new Date().toISOString(),
            source: { id: 'business-standard', name: 'Business Standard' },
            author: 'Market Reporter',
            content: 'The Indian stock markets reached new peaks today...'
          },
          {
            title: 'RBI Keeps Repo Rate Unchanged at 6.50%, Maintains Growth Outlook',
            description: 'The Reserve Bank of India maintained status quo on policy rates while keeping growth projections steady for the current fiscal year.',
            url: '#',
            urlToImage: '',
            publishedAt: new Date(Date.now() - 3600000).toISOString(),
            source: { id: 'economic-times', name: 'Economic Times' },
            author: 'Policy Reporter',
            content: 'In its latest monetary policy review...'
          },
          {
            title: 'Foreign Investors Pour ₹15,000 Crore into Indian Markets This Week',
            description: 'Strong FII inflows continue as global investors remain bullish on India growth story and upcoming festive season demand.',
            url: '#',
            urlToImage: '',
            publishedAt: new Date(Date.now() - 7200000).toISOString(),
            source: { id: 'moneycontrol', name: 'Moneycontrol' },
            author: 'Market Analyst',
            content: 'Foreign institutional investors have shown...'
          }
        ]);
      }
    } finally {
      setLoading(false);
      setLastUpdated(new Date());
    }
  };

  useEffect(() => {
    fetchNews(selectedCategory);
  }, [selectedCategory]);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      fetchNews('', searchTerm);
    } else {
      fetchNews(selectedCategory);
    }
  };

  const handleRefresh = () => {
    fetchNews(selectedCategory, searchTerm);
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - past.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const filteredArticles = articles.filter(article => 
    searchTerm === '' || 
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (article.description && article.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      {/* News Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#0F9D58] rounded-full animate-pulse"></div>
            <span className="text-[#0F9D58] font-semibold">LIVE</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900">
            Market News
          </h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            className="text-[#0F9D58] hover:bg-[#0F9D58]/10"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <p className="text-gray-600 mb-4">
          Real-time financial news {isApiConfigured ? 'powered by NewsAPI' : 'with sample content'}
        </p>
        <p className="text-sm text-gray-500">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </p>
      </motion.div>

      {/* Status Messages */}
      {!isApiConfigured && !loading && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-orange-50 border border-orange-200 rounded-2xl p-4"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            <div>
              <h3 className="font-semibold text-orange-600">News API Not Configured</h3>
              <p className="text-orange-600 text-sm">
                To get live news, please configure your NewsAPI key. Showing sample financial news below.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {error && isApiConfigured && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-red-50 border border-red-200 rounded-2xl p-4"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-600">Error Loading Live News</h3>
              <p className="text-red-600 text-sm">{error}</p>
              <p className="text-gray-600 text-xs mt-1">Showing sample content below</p>
            </div>
          </div>
        </motion.div>
      )}

      {isApiConfigured && !error && articles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-green-50 border border-green-200 rounded-2xl p-4"
        >
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-600">Live News Active</h3>
              <p className="text-green-600 text-sm">
                Displaying live financial news from NewsAPI • {articles.length} articles loaded
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-gray-50 rounded-2xl p-6 border border-gray-200"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            <Input
              placeholder="Search financial news..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10 bg-white border-gray-200"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="bg-white border-gray-200">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={handleSearch}
            className="bg-[#0F9D58] text-white hover:bg-[#0e8a4f]"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Search className="w-4 h-4 mr-2" />
            )}
            Search
          </Button>
        </div>
      </motion.div>

      {/* News Articles */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-[#0F9D58] animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading latest news...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredArticles.map((article, index) => (
            <motion.div
              key={`${article.url}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full border-gray-200 hover:border-[#0F9D58] hover:shadow-lg transition-all duration-300 group">
                {article.urlToImage && (
                  <div className="aspect-video overflow-hidden rounded-t-lg">
                    <img 
                      src={article.urlToImage} 
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Badge className="bg-blue-50 text-blue-600 border-blue-200 text-xs">
                      {article.source.name}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{getTimeAgo(article.publishedAt)}</span>
                    </div>
                  </div>
                  
                  <CardTitle className="text-lg leading-tight text-gray-900 group-hover:text-[#0F9D58] transition-colors line-clamp-2">
                    {article.title}
                  </CardTitle>
                  
                  {article.description && (
                    <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                      {article.description}
                    </p>
                  )}
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {article.author && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>By {article.author}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Globe className="w-3 h-3" />
                      <span>{article.source.name}</span>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => article.url !== '#' && window.open(article.url, '_blank')}
                      className="text-[#0F9D58] hover:bg-[#0F9D58]/10"
                      disabled={article.url === '#'}
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      {article.url === '#' ? 'Sample' : 'Read More'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {filteredArticles.length === 0 && !loading && (
        <div className="text-center py-16">
          <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No News Found</h3>
          <p className="text-gray-600">Try adjusting your search terms or category selection.</p>
        </div>
      )}
    </div>
  );
}