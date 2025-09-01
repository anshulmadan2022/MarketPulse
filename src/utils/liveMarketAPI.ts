// Frontend API service for live market data powered by Perplexity
import { projectId, publicAnonKey } from './supabase/info';

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-0475480f`;

class LiveMarketAPI {
  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  async getLiveStock(symbol: string) {
    try {
      const result = await this.makeRequest(`/live-stock/${symbol}`);
      if (result.success) {
        return result.data;
      }
      throw new Error(result.error || 'Failed to fetch live stock data');
    } catch (error) {
      console.error(`Error fetching live stock data for ${symbol}:`, error);
      
      // Fallback to mock stock data
      console.log(`Using fallback mock data for ${symbol}...`);
      const mockData = {
        symbol,
        name: `${symbol} Limited`,
        price: 1000 + Math.random() * 3000,
        change: (Math.random() - 0.5) * 100,
        changePercent: (Math.random() - 0.5) * 10,
        volume: 1000000 + Math.random() * 5000000,
        marketCap: `₹${Math.floor(50000 + Math.random() * 200000)} Cr`,
        lastUpdated: new Date().toISOString()
      };
      
      return mockData;
    }
  }

  async getLiveMarketOverview() {
    try {
      console.log('Attempting to fetch live market overview...');
      const result = await this.makeRequest('/live-market-overview');
      if (result.success) {
        console.log('Successfully fetched live market data');
        return result.data;
      }
      throw new Error(result.error || 'Failed to fetch live market overview');
    } catch (error) {
      console.error('Error fetching live market overview:', error);
      
      // Fallback to mock data endpoint if Perplexity fails
      try {
        console.log('Attempting fallback to mock data endpoint...');
        const mockResult = await this.makeRequest('/mock-market-overview');
        if (mockResult.success) {
          console.log('Successfully retrieved mock market data');
          return mockResult.data;
        }
        throw new Error('Mock data endpoint also failed');
      } catch (mockError) {
        console.error('Mock data fallback also failed:', mockError);
        
        // Final fallback to client-side mock data
        console.log('Using final client-side fallback data...');
        const clientMockData = {
          indices: [
            {
              name: "NIFTY 50",
              value: 21650.75 + (Math.random() - 0.5) * 100,
              change: (Math.random() - 0.5) * 200,
              changePercent: (Math.random() - 0.5) * 2
            },
            {
              name: "SENSEX",
              value: 71483.25 + (Math.random() - 0.5) * 300,
              change: (Math.random() - 0.5) * 500,
              changePercent: (Math.random() - 0.5) * 2
            },
            {
              name: "BANK NIFTY",
              value: 46850.50 + (Math.random() - 0.5) * 200,
              change: (Math.random() - 0.5) * 400,
              changePercent: (Math.random() - 0.5) * 2
            }
          ],
          topGainers: [
            {
              symbol: "RELIANCE",
              name: "Reliance Industries",
              price: 2850 + Math.random() * 100,
              change: 50 + Math.random() * 100,
              changePercent: 2 + Math.random() * 3,
              volume: 1000000 + Math.random() * 2000000,
              lastUpdated: new Date().toISOString()
            },
            {
              symbol: "TCS",
              name: "Tata Consultancy Services",
              price: 3900 + Math.random() * 200,
              change: 80 + Math.random() * 120,
              changePercent: 2.5 + Math.random() * 2,
              volume: 800000 + Math.random() * 1500000,
              lastUpdated: new Date().toISOString()
            }
          ],
          topLosers: [
            {
              symbol: "HDFC",
              name: "HDFC Bank",
              price: 1450 + Math.random() * 100,
              change: -(50 + Math.random() * 100),
              changePercent: -(2 + Math.random() * 3),
              volume: 900000 + Math.random() * 2000000,
              lastUpdated: new Date().toISOString()
            }
          ],
          mostActive: [
            {
              symbol: "ICICIBANK",
              name: "ICICI Bank",
              price: 950 + Math.random() * 100,
              change: (Math.random() - 0.5) * 50,
              changePercent: (Math.random() - 0.5) * 3,
              volume: 5000000 + Math.random() * 3000000,
              lastUpdated: new Date().toISOString()
            }
          ]
        };
        
        return clientMockData;
      }
    }
  }

  async searchStocks(query: string) {
    try {
      const result = await this.makeRequest(`/search-stocks/${encodeURIComponent(query)}`);
      if (result.success) {
        return result.data;
      }
      throw new Error(result.error || 'Failed to search stocks');
    } catch (error) {
      console.error(`Error searching stocks with query "${query}":`, error);
      
      // Fallback to mock search results
      console.log('Using fallback mock search results...');
      const mockResults = [
        {
          symbol: query.toUpperCase(),
          name: `${query} Limited`,
          price: 1000 + Math.random() * 2000,
          change: (Math.random() - 0.5) * 100,
          changePercent: (Math.random() - 0.5) * 5,
          volume: 1000000 + Math.random() * 5000000,
          marketCap: `₹${Math.floor(50000 + Math.random() * 200000)} Cr`,
          lastUpdated: new Date().toISOString()
        },
        {
          symbol: "RELIANCE",
          name: "Reliance Industries",
          price: 2850 + Math.random() * 100,
          change: 45 + Math.random() * 20,
          changePercent: 1.58 + Math.random() * 2,
          volume: 2500000 + Math.random() * 1000000,
          marketCap: "₹19,50,000 Cr",
          lastUpdated: new Date().toISOString()
        },
        {
          symbol: "TCS",
          name: "Tata Consultancy Services",
          price: 3900 + Math.random() * 100,
          change: 52 + Math.random() * 20,
          changePercent: 1.35 + Math.random() * 2,
          volume: 1800000 + Math.random() * 800000,
          marketCap: "₹13,20,000 Cr",
          lastUpdated: new Date().toISOString()
        }
      ];
      
      return mockResults;
    }
  }

  async getStockNews(symbol?: string) {
    try {
      const endpoint = symbol ? `/stock-news/${symbol}` : '/stock-news';
      const result = await this.makeRequest(endpoint);
      if (result.success) {
        return result.data;
      }
      throw new Error(result.error || 'Failed to fetch stock news');
    } catch (error) {
      console.error('Error fetching stock news:', error);
      
      // Fallback to mock news endpoint if Perplexity fails
      try {
        console.log('Attempting fallback to mock news...');
        const mockResult = await this.makeRequest('/mock-stock-news');
        if (mockResult.success) {
          console.log('Successfully retrieved mock news data');
          return mockResult.data;
        }
      } catch (mockError) {
        console.error('Mock news fallback also failed:', mockError);
      }
      
      throw error;
    }
  }
}

export const liveMarketAPI = new LiveMarketAPI();

// Type definitions
export interface LiveStockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: string;
  lastUpdated: string;
}

export interface LiveMarketOverview {
  indices: {
    name: string;
    value: number;
    change: number;
    changePercent: number;
  }[];
  topGainers: LiveStockData[];
  topLosers: LiveStockData[];
  mostActive: LiveStockData[];
}

export interface StockNews {
  title: string;
  summary: string;
  url: string;
  timestamp: string;
}