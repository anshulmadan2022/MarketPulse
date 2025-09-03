import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { liveMarketAPI } from '../utils/liveMarketAPI';

interface TickerItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export function LiveTicker() {
  const [tickerData, setTickerData] = useState<TickerItem[]>([
    { symbol: 'NIFTY 50', name: 'NIFTY 50', price: 21650.75, change: 125.30, changePercent: 0.58 },
    { symbol: 'SENSEX', name: 'SENSEX', price: 71483.25, change: -89.45, changePercent: -0.13 },
    { symbol: 'BANKNIFTY', name: 'BANK NIFTY', price: 46850.50, change: 234.80, changePercent: 0.50 },
    { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2845.60, change: 15.20, changePercent: 0.54 },
    { symbol: 'TCS', name: 'Tata Consultancy Services', price: 3890.75, change: -12.45, changePercent: -0.32 },
    { symbol: 'HDFCBANK', name: 'HDFC Bank', price: 1658.90, change: 8.75, changePercent: 0.53 },
    { symbol: 'INFY', name: 'Infosys', price: 1456.30, change: -5.60, changePercent: -0.38 },
    { symbol: 'ICICIBANK', name: 'ICICI Bank', price: 1089.25, change: 12.80, changePercent: 1.19 },
  ]);
  const [isLiveData, setIsLiveData] = useState(false);

  // Load live market data for ticker
  const loadLiveTickerData = async () => {
    try {
      const marketData = await liveMarketAPI.getLiveMarketOverview();
      
      // Combine indices and top stocks for ticker
      const tickerItems: TickerItem[] = [
        ...marketData.indices.map(index => ({
          symbol: index.name,
          name: index.name,
          price: index.value,
          change: index.change,
          changePercent: index.changePercent
        })),
        ...marketData.topGainers.slice(0, 3).map(stock => ({
          symbol: stock.symbol,
          name: stock.name,
          price: stock.price,
          change: stock.change,
          changePercent: stock.changePercent
        })),
        ...marketData.topLosers.slice(0, 2).map(stock => ({
          symbol: stock.symbol,
          name: stock.name,
          price: stock.price,
          change: stock.change,
          changePercent: stock.changePercent
        }))
      ];
      
      setTickerData(tickerItems);
      setIsLiveData(true);
    } catch (error) {
      console.error('Error loading live ticker data:', error);
      // Keep using mock data when API fails
      setIsLiveData(false);
      
      // Add some variation to mock data to simulate live updates
      setTickerData(prev => 
        prev.map(item => {
          const randomChange = (Math.random() - 0.5) * 10;
          const newPrice = Math.max(item.price + randomChange, item.price * 0.95);
          const change = newPrice - item.price;
          const changePercent = (change / item.price) * 100;
          
          return {
            ...item,
            price: newPrice,
            change,
            changePercent
          };
        })
      );
    }
  };

  useEffect(() => {
    // Initial load
    loadLiveTickerData();
    
    // Set up intervals for updates
    const liveDataInterval = setInterval(() => {
      loadLiveTickerData();
    }, 30000); // Try to get live data every 30 seconds

    const mockUpdateInterval = setInterval(() => {
      // If not using live data, simulate updates with mock data
      if (!isLiveData) {
        setTickerData(prev => 
          prev.map(item => {
            const randomChange = (Math.random() - 0.5) * 5;
            const newPrice = Math.max(item.price + randomChange, item.price * 0.98);
            const change = newPrice - item.price;
            const changePercent = (change / item.price) * 100;
            
            return {
              ...item,
              price: newPrice,
              change,
              changePercent
            };
          })
        );
      }
    }, 5000); // Update mock data every 5 seconds

    return () => {
      clearInterval(liveDataInterval);
      clearInterval(mockUpdateInterval);
    };
  }, [isLiveData]);

  return (
    <div className="relative bg-gray-50 text-gray-900 py-3 overflow-hidden border-b border-gray-200">      
      {/* Live indicator */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2 z-10">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className={`w-2 h-2 rounded-full ${isLiveData ? 'bg-green-500' : 'bg-red-500'}`}
        />
        <span className="text-[#0F9D58] font-semibold text-sm flex items-center">
          <Zap className="w-3 h-3 mr-1" />
          {isLiveData ? 'LIVE' : 'DEMO'}
        </span>
      </div>
      
      <div className="ml-20 animate-scroll flex space-x-8 whitespace-nowrap">
        {/* Duplicate the items for seamless scrolling */}
        {[...tickerData, ...tickerData].map((item, index) => (
          <motion.div 
            key={`${item.symbol}-${index}`} 
            className="flex items-center space-x-3 px-6 py-1 bg-white rounded-full border border-gray-200 hover:border-[#0F9D58]/30 hover:shadow-md transition-all duration-300 group"
            whileHover={{ scale: 1.05 }}
          >
            <span className="font-bold text-[#0F9D58] group-hover:text-gray-900 transition-colors">{item.symbol}</span>
            <span className="text-gray-900 font-medium">₹{item.price.toFixed(2)}</span>
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${ 
              item.change >= 0 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'bg-red-100 text-red-700 border border-red-200'
            }`}>
              {item.change >= 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span className="text-xs font-medium">
                {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)} ({item.changePercent.toFixed(2)}%)
              </span>
            </div>
          </motion.div>
        ))}
      </div>
      
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll 60s linear infinite;
        }
      `}</style>
    </div>
  );
}