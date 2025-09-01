// Perplexity API integration for live stock market data
interface PerplexityResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: string;
  lastUpdated: string;
}

interface MarketOverview {
  indices: {
    name: string;
    value: number;
    change: number;
    changePercent: number;
  }[];
  topGainers: StockData[];
  topLosers: StockData[];
  mostActive: StockData[];
}

class PerplexityAPI {
  private apiKey: string;
  private baseUrl = 'https://api.perplexity.ai/chat/completions';

  constructor() {
    this.apiKey = process.env.PERPLEXITY_API_KEY || '';
  }

  private async makeRequest(prompt: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Perplexity API key not configured');
    }

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: 'You are a financial data expert. Provide accurate, real-time stock market data in the exact JSON format requested. Always return valid JSON without any additional text or formatting.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.1,
        top_p: 1,
        return_citations: false,
        search_domain_filter: ['finance.yahoo.com', 'moneycontrol.com', 'nseindia.com', 'bseindia.com', 'bloomberg.com', 'reuters.com'],
        return_images: false,
        return_related_questions: false,
        search_recency_filter: 'hour',
        top_k: 0,
        stream: false,
        presence_penalty: 0,
        frequency_penalty: 1
      })
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.status} ${response.statusText}`);
    }

    const data: PerplexityResponse = await response.json();
    return data.choices[0]?.message?.content || '';
  }

  async getStockPrice(symbol: string): Promise<StockData> {
    const prompt = `Get the current live stock price for ${symbol} from Indian stock market (NSE/BSE). Return the data in this exact JSON format:
    {
      "symbol": "${symbol}",
      "name": "Company Name",
      "price": 123.45,
      "change": 1.23,
      "changePercent": 1.01,
      "volume": 1234567,
      "marketCap": "₹12,345 Cr",
      "lastUpdated": "2024-01-20T15:30:00Z"
    }`;

    try {
      const response = await this.makeRequest(prompt);
      const cleanResponse = response.replace(/```json\n?|```\n?/g, '').trim();
      return JSON.parse(cleanResponse);
    } catch (error) {
      console.error('Error fetching stock price:', error);
      throw new Error(`Failed to fetch stock price for ${symbol}`);
    }
  }

  async getMultipleStocks(symbols: string[]): Promise<StockData[]> {
    const symbolList = symbols.join(', ');
    const prompt = `Get current live stock prices for these Indian stocks: ${symbolList}. Return data in this exact JSON array format:
    [
      {
        "symbol": "RELIANCE",
        "name": "Reliance Industries",
        "price": 2345.67,
        "change": 12.34,
        "changePercent": 0.53,
        "volume": 1234567,
        "marketCap": "₹15,87,234 Cr",
        "lastUpdated": "2024-01-20T15:30:00Z"
      }
    ]`;

    try {
      const response = await this.makeRequest(prompt);
      const cleanResponse = response.replace(/```json\n?|```\n?/g, '').trim();
      return JSON.parse(cleanResponse);
    } catch (error) {
      console.error('Error fetching multiple stocks:', error);
      throw new Error('Failed to fetch stock prices');
    }
  }

  async getMarketOverview(): Promise<MarketOverview> {
    const prompt = `Get current Indian stock market overview including major indices (NIFTY 50, SENSEX, BANK NIFTY), top 5 gainers, top 5 losers, and most active stocks. Return in this exact JSON format:
    {
      "indices": [
        {
          "name": "NIFTY 50",
          "value": 19567.85,
          "change": 123.45,
          "changePercent": 0.63
        },
        {
          "name": "SENSEX",
          "value": 65432.10,
          "change": 234.56,
          "changePercent": 0.36
        },
        {
          "name": "BANK NIFTY",
          "value": 43210.98,
          "change": -123.45,
          "changePercent": -0.28
        }
      ],
      "topGainers": [
        {
          "symbol": "EXAMPLE",
          "name": "Example Company",
          "price": 123.45,
          "change": 12.34,
          "changePercent": 11.11,
          "volume": 1234567,
          "lastUpdated": "2024-01-20T15:30:00Z"
        }
      ],
      "topLosers": [
        {
          "symbol": "EXAMPLE2",
          "name": "Example Company 2",
          "price": 987.65,
          "change": -98.76,
          "changePercent": -9.09,
          "volume": 987654,
          "lastUpdated": "2024-01-20T15:30:00Z"
        }
      ],
      "mostActive": [
        {
          "symbol": "EXAMPLE3",
          "name": "Example Company 3",
          "price": 456.78,
          "change": 4.56,
          "changePercent": 1.01,
          "volume": 9876543,
          "lastUpdated": "2024-01-20T15:30:00Z"
        }
      ]
    }`;

    try {
      const response = await this.makeRequest(prompt);
      const cleanResponse = response.replace(/```json\n?|```\n?/g, '').trim();
      return JSON.parse(cleanResponse);
    } catch (error) {
      console.error('Error fetching market overview:', error);
      throw new Error('Failed to fetch market overview');
    }
  }

  async searchStocks(query: string): Promise<StockData[]> {
    const prompt = `Search for Indian stocks matching "${query}". Return up to 10 results in this exact JSON array format:
    [
      {
        "symbol": "STOCK_SYMBOL",
        "name": "Company Name",
        "price": 123.45,
        "change": 1.23,
        "changePercent": 1.01,
        "volume": 1234567,
        "marketCap": "₹12,345 Cr",
        "lastUpdated": "2024-01-20T15:30:00Z"
      }
    ]`;

    try {
      const response = await this.makeRequest(prompt);
      const cleanResponse = response.replace(/```json\n?|```\n?/g, '').trim();
      return JSON.parse(cleanResponse);
    } catch (error) {
      console.error('Error searching stocks:', error);
      throw new Error('Failed to search stocks');
    }
  }

  async getSectorPerformance(): Promise<{name: string, change: number, changePercent: number}[]> {
    const prompt = `Get current Indian stock market sector performance for major sectors like IT, Banking, Pharma, Auto, FMCG, etc. Return in this exact JSON array format:
    [
      {
        "name": "Information Technology",
        "change": 123.45,
        "changePercent": 1.23
      },
      {
        "name": "Banking",
        "change": -45.67,
        "changePercent": -0.89
      }
    ]`;

    try {
      const response = await this.makeRequest(prompt);
      const cleanResponse = response.replace(/```json\n?|```\n?/g, '').trim();
      return JSON.parse(cleanResponse);
    } catch (error) {
      console.error('Error fetching sector performance:', error);
      throw new Error('Failed to fetch sector performance');
    }
  }

  async getStockNews(symbol?: string): Promise<{title: string, summary: string, url: string, timestamp: string}[]> {
    const prompt = symbol 
      ? `Get latest news for ${symbol} stock. Return top 5 news items in this exact JSON array format:`
      : `Get latest Indian stock market news. Return top 10 news items in this exact JSON array format:`;
    
    const format = `
    [
      {
        "title": "News Headline",
        "summary": "Brief summary of the news",
        "url": "https://example.com/news",
        "timestamp": "2024-01-20T15:30:00Z"
      }
    ]`;

    try {
      const response = await this.makeRequest(prompt + format);
      const cleanResponse = response.replace(/```json\n?|```\n?/g, '').trim();
      return JSON.parse(cleanResponse);
    } catch (error) {
      console.error('Error fetching stock news:', error);
      throw new Error('Failed to fetch stock news');
    }
  }
}

export const perplexityAPI = new PerplexityAPI();
export type { StockData, MarketOverview };