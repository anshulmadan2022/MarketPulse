import React, { useState } from 'react';
import { Header } from './components/Header';
import { LiveTicker } from './components/LiveTicker';
import { HomePage } from './components/HomePage';
import { StockScreener } from './components/StockScreener';
import { StockAnalysis } from './components/StockAnalysis';
import { IPOCenter } from './components/IPOCenter';
import { NewsSection } from './components/NewsSection';
import { EducationSection } from './components/EducationSection';
import { SEBICompliance } from './components/SEBICompliance';
import { LiveMarketDashboard } from './components/LiveMarketDashboard';
import { InvestorAwarenessTest } from './components/InvestorAwarenessTest';
import { Chatbot } from './components/Chatbot';
import { Toaster } from './components/ui/sonner';

type Page = 'home' | 'screener' | 'ipo' | 'portfolio' | 'stock-analysis' | 'news' | 'education' | 'sebi-compliance' | 'live-market' | 'investor-test';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedStock, setSelectedStock] = useState<string>('');

  const handleNavigation = (page: string) => {
    if (page === 'home' || page === 'screener' || page === 'ipo' || page === 'portfolio' || page === 'news' || page === 'education' || page === 'sebi-compliance' || page === 'live-market' || page === 'investor-test') {
      setCurrentPage(page as Page);
    }
  };

  const handleStockSelect = (symbol: string) => {
    setSelectedStock(symbol);
    setCurrentPage('stock-analysis');
  };

  const handleBackToScreener = () => {
    setCurrentPage('screener');
    setSelectedStock('');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigation} />;
      case 'screener':
        return (
          <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <StockScreener onStockSelect={handleStockSelect} />
            </div>
          </div>
        );
      case 'stock-analysis':
        return (
          <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <StockAnalysis symbol={selectedStock} onBack={handleBackToScreener} />
            </div>
          </div>
        );
      case 'ipo':
        return (
          <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <IPOCenter />
            </div>
          </div>
        );
      case 'news':
        return (
          <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <NewsSection />
            </div>
          </div>
        );
      case 'portfolio':
        return (
          <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="text-center py-16">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Portfolio Management
                </h1>
                <p className="text-gray-600 text-lg mb-8">
                  Track your investments, analyze performance, and manage your stock portfolio.
                </p>
                <p className="text-gray-500">
                  This feature would include portfolio tracking, performance analytics, and investment insights.
                </p>
              </div>
            </div>
          </div>
        );
      case 'education':
        return (
          <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <EducationSection />
            </div>
          </div>
        );
      case 'sebi-compliance':
        return <SEBICompliance />;
      case 'live-market':
        return (
          <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <LiveMarketDashboard />
            </div>
          </div>
        );
      case 'investor-test':
        return (
          <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex items-center gap-4 mb-6">
                <button 
                  onClick={() => handleNavigation('home')}
                  className="px-4 py-2 border border-[#0F9D58] text-[#0F9D58] rounded-lg hover:bg-[#0F9D58] hover:text-white transition-all duration-300 font-medium"
                >
                  ← Back to Home
                </button>
              </div>
              <InvestorAwarenessTest />
            </div>
          </div>
        );
      default:
        return <HomePage onNavigate={handleNavigation} />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Live Market Ticker */}
      <LiveTicker />
      
      {/* Main Header */}
      <Header currentPage={currentPage} onNavigate={handleNavigation} />
      
      {/* Main Content */}
      <main>
        {renderCurrentPage()}
      </main>
      
      {/* Floating Chatbot */}
      <Chatbot 
        onNavigate={handleNavigation}
        onStockSelect={handleStockSelect}
      />
      
      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}