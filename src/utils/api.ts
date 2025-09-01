import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './supabase/info';

// Create Supabase client for frontend
export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-0475480f`;

// Generic API request function
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  const accessToken = session?.access_token || publicAnonKey;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

// Auth API
export const authAPI = {
  signUp: async (email: string, password: string, name: string) => {
    return apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      throw new Error(`Sign in error: ${error.message}`);
    }
    
    return data;
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(`Sign out error: ${error.message}`);
    }
  },

  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      throw new Error(`Get user error: ${error.message}`);
    }
    return user;
  },

  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      throw new Error(`Get session error: ${error.message}`);
    }
    return session;
  },
};

// Market data API
export const marketAPI = {
  getIndices: async () => {
    return apiRequest('/market/indices');
  },

  getStock: async (symbol: string) => {
    return apiRequest(`/stocks/${symbol}`);
  },
};

// Watchlist API
export const watchlistAPI = {
  get: async () => {
    return apiRequest('/watchlist');
  },

  add: async (symbol: string) => {
    return apiRequest('/watchlist/add', {
      method: 'POST',
      body: JSON.stringify({ symbol }),
    });
  },

  remove: async (symbol: string) => {
    return apiRequest(`/watchlist/remove/${symbol}`, {
      method: 'DELETE',
    });
  },
};

// Portfolio API
export const portfolioAPI = {
  get: async () => {
    return apiRequest('/portfolio');
  },

  add: async (holding: {
    symbol: string;
    quantity: number;
    avgPrice: number;
    purchaseDate?: string;
  }) => {
    return apiRequest('/portfolio/add', {
      method: 'POST',
      body: JSON.stringify(holding),
    });
  },
};

// Alerts API
export const alertsAPI = {
  get: async () => {
    return apiRequest('/alerts');
  },

  create: async (alert: {
    symbol: string;
    targetPrice: number;
    alertType: string;
    condition?: string;
  }) => {
    return apiRequest('/alerts/create', {
      method: 'POST',
      body: JSON.stringify(alert),
    });
  },
};

// Screener API
export const screenerAPI = {
  cacheResults: async (filters: any, results: any) => {
    return apiRequest('/screener/results', {
      method: 'POST',
      body: JSON.stringify({ filters, results }),
    });
  },
};