import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';
import newsApp from './news.tsx';

const app = new Hono();

// Middleware
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization']
}));
app.use('*', logger(console.log));

// Mount news routes
app.route('/make-server-0475480f/api', newsApp);

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Perplexity API helper function with updated model
const makePerplexityRequest = async (prompt: string): Promise<string> => {
  const apiKey = Deno.env.get('PERPLEXITY_API_KEY');
  
  if (!apiKey) {
    throw new Error('Perplexity API key not configured');
  }

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online', // Current valid Perplexity model name
        messages: [
          {
            role: 'system',
            content: 'You are a financial data expert. Provide accurate, real-time Indian stock market data in the exact JSON format requested. Always return valid JSON without any additional text or formatting. Use reliable financial sources like NSE, BSE, MoneyControl, and Yahoo Finance India.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.1,
        top_p: 1,
        return_citations: false,
        return_images: false,
        return_related_questions: false,
        top_k: 0,
        stream: false,
        presence_penalty: 0,
        frequency_penalty: 1
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Perplexity API error: ${response.status} ${response.statusText}`, errorText);
      
      // Enhanced error message parsing
      let errorMessage = `Perplexity API error: ${response.status} ${response.statusText}`;
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.error && errorData.error.message) {
          errorMessage = `Perplexity API: ${errorData.error.message}`;
          console.error('Detailed Perplexity error:', errorData);
        }
      } catch (parseError) {
        console.error('Raw error response:', errorText.substring(0, 200));
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';
    console.log('Perplexity API Response:', content);
    return content;
  } catch (error) {
    console.error('Perplexity API request failed:', error);
    throw error;
  }
};

// Test endpoint to verify Perplexity API configuration
app.get('/make-server-0475480f/test-perplexity', async (c) => {
  try {
    const apiKey = Deno.env.get('PERPLEXITY_API_KEY');
    
    if (!apiKey) {
      return c.json({ 
        success: false, 
        error: 'Perplexity API key not configured',
        configured: false
      });
    }

    // Simple test query to verify API connectivity
    const prompt = 'What is the current price of NIFTY 50 index? Return just a simple JSON with {"test": "success", "message": "API working"}';
    
    const response = await makePerplexityRequest(prompt);
    
    return c.json({ 
      success: true, 
      configured: true,
      message: 'Perplexity API is configured and working',
      testResponse: response.substring(0, 200) // Show first 200 chars of response
    });
  } catch (error) {
    console.error('Perplexity API test failed:', error);
    return c.json({ 
      success: false, 
      configured: true,
      error: 'Perplexity API configured but not working',
      details: error.message 
    }, 500);
  }
});

// Simple test endpoint
app.get('/make-server-0475480f/test', (c) => {
  return c.json({ 
    message: 'Server is working!', 
    timestamp: new Date().toISOString(),
    path: c.req.path,
    method: c.req.method
  });
});

// Enhanced health check with Perplexity status
app.get('/make-server-0475480f/health', (c) => {
  const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY');
  const newsApiKey = Deno.env.get('NEWS_API_KEY');
  
  return c.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    services: {
      server: 'healthy',
      database: 'healthy',
      perplexity: perplexityApiKey ? 'configured' : 'not_configured',
      newsapi: newsApiKey ? 'configured' : 'not_configured'
    }
  });
});

// Authentication routes
app.post('/make-server-0475480f/auth/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log(`Signup error: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ user: data.user });
  } catch (error) {
    console.log(`Signup server error: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Mock data endpoints that don't require Perplexity API
app.get('/make-server-0475480f/mock-market-overview', (c) => {
  const mockData = {
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
      },
      {
        symbol: "INFY",
        name: "Infosys Limited",
        price: 1890 + Math.random() * 100,
        change: 45 + Math.random() * 60,
        changePercent: 2.2 + Math.random() * 2,
        volume: 1200000 + Math.random() * 1000000,
        lastUpdated: new Date().toISOString()
      },
      {
        symbol: "HDFCBANK",
        name: "HDFC Bank",
        price: 1650 + Math.random() * 80,
        change: 35 + Math.random() * 50,
        changePercent: 2.0 + Math.random() * 1.5,
        volume: 950000 + Math.random() * 800000,
        lastUpdated: new Date().toISOString()
      },
      {
        symbol: "ICICIBANK",
        name: "ICICI Bank",
        price: 1120 + Math.random() * 60,
        change: 25 + Math.random() * 40,
        changePercent: 1.8 + Math.random() * 1.5,
        volume: 1100000 + Math.random() * 900000,
        lastUpdated: new Date().toISOString()
      }
    ],
    topLosers: [
      {
        symbol: "ADANIPORTS",
        name: "Adani Ports",
        price: 890 + Math.random() * 50,
        change: -(30 + Math.random() * 50),
        changePercent: -(2.5 + Math.random() * 2),
        volume: 1300000 + Math.random() * 1000000,
        lastUpdated: new Date().toISOString()
      },
      {
        symbol: "BAJFINANCE",
        name: "Bajaj Finance",
        price: 6800 + Math.random() * 200,
        change: -(120 + Math.random() * 150),
        changePercent: -(1.8 + Math.random() * 1.5),
        volume: 600000 + Math.random() * 400000,
        lastUpdated: new Date().toISOString()
      },
      {
        symbol: "MARUTI",
        name: "Maruti Suzuki",
        price: 11200 + Math.random() * 300,
        change: -(180 + Math.random() * 200),
        changePercent: -(1.6 + Math.random() * 1.2),
        volume: 450000 + Math.random() * 350000,
        lastUpdated: new Date().toISOString()
      },
      {
        symbol: "COALINDIA",
        name: "Coal India",
        price: 420 + Math.random() * 30,
        change: -(8 + Math.random() * 15),
        changePercent: -(1.9 + Math.random() * 1.5),
        volume: 2200000 + Math.random() * 1500000,
        lastUpdated: new Date().toISOString()
      },
      {
        symbol: "ONGC",
        name: "Oil & Natural Gas Corporation",
        price: 285 + Math.random() * 20,
        change: -(5 + Math.random() * 10),
        changePercent: -(1.7 + Math.random() * 1.3),
        volume: 3500000 + Math.random() * 2000000,
        lastUpdated: new Date().toISOString()
      }
    ],
    mostActive: [
      {
        symbol: "SBIN",
        name: "State Bank of India",
        price: 820 + Math.random() * 40,
        change: (Math.random() - 0.5) * 20,
        changePercent: (Math.random() - 0.5) * 2.5,
        volume: 15000000 + Math.random() * 5000000,
        lastUpdated: new Date().toISOString()
      },
      {
        symbol: "AXISBANK",
        name: "Axis Bank",
        price: 1150 + Math.random() * 60,
        change: (Math.random() - 0.5) * 25,
        changePercent: (Math.random() - 0.5) * 2.2,
        volume: 12000000 + Math.random() * 4000000,
        lastUpdated: new Date().toISOString()
      },
      {
        symbol: "KOTAKBANK",
        name: "Kotak Mahindra Bank",
        price: 1780 + Math.random() * 80,
        change: (Math.random() - 0.5) * 30,
        changePercent: (Math.random() - 0.5) * 1.8,
        volume: 8000000 + Math.random() * 3000000,
        lastUpdated: new Date().toISOString()
      },
      {
        symbol: "LT",
        name: "Larsen & Toubro",
        price: 3200 + Math.random() * 150,
        change: (Math.random() - 0.5) * 60,
        changePercent: (Math.random() - 0.5) * 2.0,
        volume: 1800000 + Math.random() * 1200000,
        lastUpdated: new Date().toISOString()
      },
      {
        symbol: "WIPRO",
        name: "Wipro Limited",
        price: 560 + Math.random() * 30,
        change: (Math.random() - 0.5) * 15,
        changePercent: (Math.random() - 0.5) * 2.5,
        volume: 6000000 + Math.random() * 2500000,
        lastUpdated: new Date().toISOString()
      }
    ]
  };

  return c.json({ success: true, data: mockData, mock: true });
});

app.get('/make-server-0475480f/mock-stock-news', (c) => {
  const mockNews = [
    {
      title: "Indian Stock Markets Hit Fresh Record Highs Amid Strong FII Inflows",
      summary: "Benchmark indices NIFTY 50 and SENSEX continue their upward trajectory as foreign institutional investors pour billions into Indian equities, driven by positive economic indicators.",
      url: "#",
      timestamp: new Date().toISOString()
    },
    {
      title: "RBI Monetary Policy Committee Keeps Repo Rate Unchanged at 6.5%",
      summary: "The Reserve Bank of India maintains status quo on policy rates while shifting focus to inflation management and supporting economic growth in the festive season.",
      url: "#",
      timestamp: new Date(Date.now() - 3600000).toISOString()
    },
    {
      title: "IT Sector Outperforms as Global Demand for Digital Services Grows",
      summary: "Technology giants TCS, Infosys, and Wipro post strong quarterly results as enterprises accelerate digital transformation initiatives worldwide.",
      url: "#",
      timestamp: new Date(Date.now() - 7200000).toISOString()
    },
    {
      title: "Banking Stocks Rally on Improved Asset Quality and Credit Growth",
      summary: "Private sector banks lead the charge with HDFC Bank, ICICI Bank, and Axis Bank reporting robust loan growth and declining NPAs in Q3 results.",
      url: "#",
      timestamp: new Date(Date.now() - 10800000).toISOString()
    },
    {
      title: "Adani Group Stocks Recover as Fundamentals Show Improvement",
      summary: "Adani portfolio companies regain investor confidence with strong operational performance and debt reduction strategies showing positive results.",
      url: "#",
      timestamp: new Date(Date.now() - 14400000).toISOString()
    },
    {
      title: "Auto Sector Faces Headwinds Amid Rising Raw Material Costs",
      summary: "Automobile manufacturers including Maruti Suzuki and Tata Motors grapple with supply chain pressures and increasing steel and aluminum prices.",
      url: "#",
      timestamp: new Date(Date.now() - 18000000).toISOString()
    },
    {
      title: "Pharmaceutical Companies Benefit from Strong Export Demand",
      summary: "Indian pharma majors Dr. Reddy's and Cipla report healthy growth in international markets as global healthcare demand remains robust.",
      url: "#",
      timestamp: new Date(Date.now() - 21600000).toISOString()
    },
    {
      title: "Energy Sector Mixed as Renewable Transition Accelerates",
      summary: "Traditional energy companies face pressure while renewable energy stocks surge on government policy support and increasing corporate adoption.",
      url: "#",
      timestamp: new Date(Date.now() - 25200000).toISOString()
    }
  ];

  return c.json({ success: true, data: mockNews, mock: true });
});

// Enhanced Perplexity-powered stock data endpoints with better error handling
app.get('/make-server-0475480f/live-stock/:symbol', async (c) => {
  try {
    const symbol = c.req.param('symbol');
    
    // First try Perplexity API
    try {
      const prompt = `Get the current real-time stock price and data for ${symbol} from Indian stock market (NSE/BSE). Return the data in this exact JSON format:
      {
        "symbol": "${symbol}",
        "name": "Company Name",
        "price": 123.45,
        "change": 1.23,
        "changePercent": 1.01,
        "volume": 1234567,
        "marketCap": "₹12,345 Cr",
        "lastUpdated": "${new Date().toISOString()}"
      }`;

      const response = await makePerplexityRequest(prompt);
      let cleanResponse = response.replace(/```json\n?|```\n?/g, '').trim();
      
      // Handle potential markdown formatting and extract JSON
      const jsonStart = cleanResponse.indexOf('{');
      const jsonEnd = cleanResponse.lastIndexOf('}') + 1;
      if (jsonStart !== -1 && jsonEnd !== -1) {
        cleanResponse = cleanResponse.substring(jsonStart, jsonEnd);
      }
      
      const stockData = JSON.parse(cleanResponse);

      // Validate the response structure
      if (!stockData.symbol || !stockData.name || typeof stockData.price !== 'number') {
        throw new Error('Invalid stock data structure received from API');
      }

      return c.json({ success: true, data: stockData });
    } catch (perplexityError) {
      console.error('Perplexity API failed, using mock data:', perplexityError);
      
      // Fallback to mock data
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

      return c.json({ success: true, data: mockData, fallback: true });
    }
  } catch (error) {
    console.error('Error fetching live stock price:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to fetch live stock price',
      details: error.message 
    }, 500);
  }
});

// Enhanced Live market overview with fallback
app.get('/make-server-0475480f/live-market-overview', async (c) => {
  try {
    // First try Perplexity API
    try {
      const prompt = `Get the current real-time Indian stock market data. Include major indices (NIFTY 50, SENSEX, BANK NIFTY), top 5 gaining stocks, top 5 losing stocks, and 5 most actively traded stocks. Return the data in this exact JSON format:
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
            "symbol": "RELIANCE",
            "name": "Reliance Industries",
            "price": 2850.45,
            "change": 120.34,
            "changePercent": 4.41,
            "volume": 1234567,
            "lastUpdated": "${new Date().toISOString()}"
          }
        ],
        "topLosers": [
          {
            "symbol": "TCS",
            "name": "Tata Consultancy Services",
            "price": 3987.65,
            "change": -98.76,
            "changePercent": -2.42,
            "volume": 987654,
            "lastUpdated": "${new Date().toISOString()}"
          }
        ],
        "mostActive": [
          {
            "symbol": "HDFC",
            "name": "HDFC Bank",
            "price": 1456.78,
            "change": 24.56,
            "changePercent": 1.71,
            "volume": 9876543,
            "lastUpdated": "${new Date().toISOString()}"
          }
        ]
      }`;

      const response = await makePerplexityRequest(prompt);
      let cleanResponse = response.replace(/```json\n?|```\n?/g, '').trim();
      
      // Handle potential markdown formatting and extract JSON
      const jsonStart = cleanResponse.indexOf('{');
      const jsonEnd = cleanResponse.lastIndexOf('}') + 1;
      if (jsonStart !== -1 && jsonEnd !== -1) {
        cleanResponse = cleanResponse.substring(jsonStart, jsonEnd);
      }
      
      const marketData = JSON.parse(cleanResponse);

      // Validate the response structure
      if (!marketData.indices || !marketData.topGainers || !marketData.topLosers || !marketData.mostActive) {
        throw new Error('Invalid market data structure received from API');
      }

      return c.json({ success: true, data: marketData });
    } catch (perplexityError) {
      console.error('Perplexity API failed, using mock data:', perplexityError);
      
      // Fallback to realistic mock data
      const mockData = {
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

      return c.json({ success: true, data: mockData, fallback: true });
    }
  } catch (error) {
    console.error('Error fetching live market overview:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to fetch live market overview',
      details: error.message 
    }, 500);
  }
});

// Stock search with live data and fallback
app.get('/make-server-0475480f/search-stocks/:query', async (c) => {
  try {
    const query = c.req.param('query');
    
    try {
      const prompt = `Search for Indian stocks matching "${query}" on NSE/BSE exchanges. Return up to 10 real companies with current market data in this exact JSON array format:
      [
        {
          "symbol": "STOCK_SYMBOL",
          "name": "Company Name",
          "price": 123.45,
          "change": 1.23,
          "changePercent": 1.01,
          "volume": 1234567,
          "marketCap": "₹12,345 Cr",
          "lastUpdated": "${new Date().toISOString()}"
        }
      ]`;

      const response = await makePerplexityRequest(prompt);
      let cleanResponse = response.replace(/```json\n?|```\n?/g, '').trim();
      
      // Handle potential markdown formatting and extract JSON array
      const jsonStart = cleanResponse.indexOf('[');
      const jsonEnd = cleanResponse.lastIndexOf(']') + 1;
      if (jsonStart !== -1 && jsonEnd !== -1) {
        cleanResponse = cleanResponse.substring(jsonStart, jsonEnd);
      }
      
      const searchResults = JSON.parse(cleanResponse);

      // Validate that we have an array
      if (!Array.isArray(searchResults)) {
        throw new Error('Invalid search results format - expected array');
      }

      return c.json({ success: true, data: searchResults });
    } catch (perplexityError) {
      console.error('Perplexity search failed, using mock results:', perplexityError);
      
      // Fallback mock search results
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
        }
      ];

      return c.json({ success: true, data: mockResults, fallback: true });
    }
  } catch (error) {
    console.error('Error searching stocks:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to search stocks',
      details: error.message 
    }, 500);
  }
});

// Stock news with fallback
app.get('/make-server-0475480f/stock-news/:symbol?', async (c) => {
  try {
    const symbol = c.req.param('symbol');
    
    try {
      const prompt = symbol 
        ? `Get the latest news for ${symbol} stock from Indian financial sources. Return top 5 recent news items in this exact JSON array format:`
        : `Get the latest Indian stock market news from reliable financial sources. Return top 10 recent news items in this exact JSON array format:`;
      
      const format = `
      [
        {
          "title": "News Headline",
          "summary": "Brief summary of the news in 1-2 sentences",
          "url": "https://example.com/news",
          "timestamp": "${new Date().toISOString()}"
        }
      ]`;

      const response = await makePerplexityRequest(prompt + format);
      let cleanResponse = response.replace(/```json\n?|```\n?/g, '').trim();
      
      // Handle potential markdown formatting and extract JSON array
      const jsonStart = cleanResponse.indexOf('[');
      const jsonEnd = cleanResponse.lastIndexOf(']') + 1;
      if (jsonStart !== -1 && jsonEnd !== -1) {
        cleanResponse = cleanResponse.substring(jsonStart, jsonEnd);
      }
      
      const newsData = JSON.parse(cleanResponse);

      // Validate that we have an array
      if (!Array.isArray(newsData)) {
        throw new Error('Invalid news data format - expected array');
      }

      return c.json({ success: true, data: newsData });
    } catch (perplexityError) {
      console.error('Perplexity news failed, using mock news:', perplexityError);
      
      // Fallback mock news
      const mockNews = [
        {
          title: "Indian Markets Hit Fresh Record Highs Amid Strong FII Inflows",
          summary: "Benchmark indices continue their upward trajectory as foreign institutional investors pour money into Indian equities.",
          url: "#",
          timestamp: new Date().toISOString()
        },
        {
          title: "RBI Monetary Policy: Key Rates Remain Unchanged",
          summary: "The Reserve Bank of India maintains status quo on policy rates while focusing on inflation management.",
          url: "#",
          timestamp: new Date(Date.now() - 3600000).toISOString()
        }
      ];

      return c.json({ success: true, data: mockNews, fallback: true });
    }
  } catch (error) {
    console.error('Error fetching stock news:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to fetch stock news',
      details: error.message 
    }, 500);
  }
});

// Market data endpoints
app.get('/make-server-0475480f/market/indices', async (c) => {
  try {
    // Generate mock real-time market data
    const indices = [
      {
        symbol: 'NIFTY50',
        name: 'NIFTY 50',
        price: 21650.75 + (Math.random() - 0.5) * 100,
        change: (Math.random() - 0.5) * 200,
        volume: 2450000 + Math.random() * 1000000,
        timestamp: new Date().toISOString()
      },
      {
        symbol: 'SENSEX',
        name: 'SENSEX',
        price: 71483.25 + (Math.random() - 0.5) * 300,
        change: (Math.random() - 0.5) * 500,
        volume: 1890000 + Math.random() * 800000,
        timestamp: new Date().toISOString()
      },
      {
        symbol: 'BANKNIFTY',
        name: 'BANK NIFTY',
        price: 46850.50 + (Math.random() - 0.5) * 200,
        change: (Math.random() - 0.5) * 400,
        volume: 980000 + Math.random() * 600000,
        timestamp: new Date().toISOString()
      }
    ];

    return c.json({ success: true, data: indices });
  } catch (error) {
    console.error('Error fetching market indices:', error);
    return c.json({ error: 'Failed to fetch market indices' }, 500);
  }
});

// Stock data endpoint
app.get('/make-server-0475480f/stocks/:symbol', async (c) => {
  try {
    const symbol = c.req.param('symbol');
    
    // Generate mock stock data
    const stockData = {
      symbol,
      name: `${symbol} Limited`,
      price: 1000 + Math.random() * 3000,
      change: (Math.random() - 0.5) * 100,
      changePercent: (Math.random() - 0.5) * 10,
      volume: 1000000 + Math.random() * 5000000,
      marketCap: `₹${Math.floor(50000 + Math.random() * 200000)} Cr`,
      lastUpdated: new Date().toISOString()
    };

    return c.json({ success: true, data: stockData });
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return c.json({ error: 'Failed to fetch stock data' }, 500);
  }
});

// Watchlist endpoints
app.get('/make-server-0475480f/watchlist', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const watchlist = await kv.get(`watchlist:${user.id}`) || [];
    return c.json({ success: true, data: watchlist });
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    return c.json({ error: 'Failed to fetch watchlist' }, 500);
  }
});

app.post('/make-server-0475480f/watchlist/add', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { symbol } = await c.req.json();
    const watchlist = await kv.get(`watchlist:${user.id}`) || [];
    
    if (!watchlist.includes(symbol)) {
      watchlist.push(symbol);
      await kv.set(`watchlist:${user.id}`, watchlist);
    }

    return c.json({ success: true, data: watchlist });
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    return c.json({ error: 'Failed to add to watchlist' }, 500);
  }
});

app.delete('/make-server-0475480f/watchlist/remove/:symbol', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const symbol = c.req.param('symbol');
    const watchlist = await kv.get(`watchlist:${user.id}`) || [];
    const updatedWatchlist = watchlist.filter((s: string) => s !== symbol);
    
    await kv.set(`watchlist:${user.id}`, updatedWatchlist);
    return c.json({ success: true, data: updatedWatchlist });
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    return c.json({ error: 'Failed to remove from watchlist' }, 500);
  }
});

// Portfolio endpoints
app.get('/make-server-0475480f/portfolio', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const portfolio = await kv.get(`portfolio:${user.id}`) || [];
    return c.json({ success: true, data: portfolio });
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return c.json({ error: 'Failed to fetch portfolio' }, 500);
  }
});

app.post('/make-server-0475480f/portfolio/add', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const holding = await c.req.json();
    const portfolio = await kv.get(`portfolio:${user.id}`) || [];
    
    portfolio.push({
      ...holding,
      id: `${user.id}_${holding.symbol}_${Date.now()}`,
      addedAt: new Date().toISOString()
    });
    
    await kv.set(`portfolio:${user.id}`, portfolio);
    return c.json({ success: true, data: portfolio });
  } catch (error) {
    console.error('Error adding to portfolio:', error);
    return c.json({ error: 'Failed to add to portfolio' }, 500);
  }
});

// Alerts endpoints
app.get('/make-server-0475480f/alerts', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const alerts = await kv.get(`alerts:${user.id}`) || [];
    return c.json({ success: true, data: alerts });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return c.json({ error: 'Failed to fetch alerts' }, 500);
  }
});

app.post('/make-server-0475480f/alerts/create', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const alert = await c.req.json();
    const alerts = await kv.get(`alerts:${user.id}`) || [];
    
    alerts.push({
      ...alert,
      id: `${user.id}_${alert.symbol}_${Date.now()}`,
      createdAt: new Date().toISOString(),
      active: true
    });
    
    await kv.set(`alerts:${user.id}`, alerts);
    return c.json({ success: true, data: alerts });
  } catch (error) {
    console.error('Error creating alert:', error);
    return c.json({ error: 'Failed to create alert' }, 500);
  }
});

// Screener endpoints
app.post('/make-server-0475480f/screener/results', async (c) => {
  try {
    const { filters, results } = await c.req.json();
    
    // Cache the screener results for future reference
    const cacheKey = `screener:${JSON.stringify(filters)}`;
    await kv.set(cacheKey, {
      filters,
      results,
      timestamp: new Date().toISOString()
    });
    
    return c.json({ success: true, cached: true });
  } catch (error) {
    console.error('Error caching screener results:', error);
    return c.json({ error: 'Failed to cache screener results' }, 500);
  }
});

// Catch-all route for debugging 404s (must be last)
app.all('*', (c) => {
  const path = c.req.path;
  console.log(`404 - Requested path: ${path}, method: ${c.req.method}`);
  return c.json({ 
    error: 'Endpoint not found', 
    requestedPath: path,
    method: c.req.method,
    availableEndpoints: [
      'GET /make-server-0475480f/health',
      'GET /make-server-0475480f/test-perplexity',
      'GET /make-server-0475480f/mock-market-overview',
      'GET /make-server-0475480f/mock-stock-news',
      'GET /make-server-0475480f/live-market-overview',
      'GET /make-server-0475480f/live-stock/:symbol',
      'GET /make-server-0475480f/search-stocks/:query',
      'GET /make-server-0475480f/stock-news/:symbol?',
      'POST /make-server-0475480f/auth/signup',
      'GET /make-server-0475480f/market/indices',
      'GET /make-server-0475480f/watchlist',
      'POST /make-server-0475480f/watchlist/add',
      'DELETE /make-server-0475480f/watchlist/remove/:symbol',
      'GET /make-server-0475480f/portfolio',
      'POST /make-server-0475480f/portfolio/add',
      'GET /make-server-0475480f/alerts',
      'POST /make-server-0475480f/alerts/create',
      'POST /make-server-0475480f/screener/results'
    ]
  }, 404);
});

Deno.serve(app.fetch);