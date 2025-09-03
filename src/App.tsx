import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
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
import Chatbot from './components/Chatbot';
import { Toaster } from './components/ui/sonner';

// Wrapper component to handle navigation
function AppContent() {
  const navigate = useNavigate();   

  const handleNavigation = (page: string) => {
    navigate(`/${page === 'home' ? '' : page}`);
  };

  const handleStockSelect = (symbol: string) => {
    navigate(`/stock-analysis/${symbol}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Live Market Ticker */}
      <LiveTicker />
      
      {/* Main Header */}
      <Header onNavigate={handleNavigation} />
      
      {/* Main Content */}
      <main>
        <Routes>
          <Route path="/" element={<HomePage onNavigate={handleNavigation} />} />
          <Route path="/screener" element={
            <div className="min-h-screen bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <StockScreener onStockSelect={handleStockSelect} />
              </div>
            </div>
          } />
          <Route path="/stock-analysis/:symbol" element={<StockAnalysisPage />} />
          <Route path="/ipo" element={
            <div className="min-h-screen bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <IPOCenter />
              </div>
            </div>
          } />
          <Route path="/news" element={
            <div className="min-h-screen bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <NewsSection />
              </div>
            </div>
          } />
          <Route path="/portfolio" element={
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
          } />
          <Route path="/education" element={
            <div className="min-h-screen bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <EducationSection />
              </div>
            </div>
          } />
          <Route path="/sebi-compliance" element={<SEBICompliance />} />
          <Route path="/live-market" element={
            <div className="min-h-screen bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <LiveMarketDashboard />
              </div>
            </div>
          } />
          <Route path="/investor-test" element={
            <div className="min-h-screen bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <InvestorAwarenessTestPage />
              </div>
            </div>
          } />
        </Routes>
      </main>
      
      {/* Floating Chatbot */}
      <Chatbot />
      
      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}

// Component for stock analysis with URL parameter
function StockAnalysisPage() {
  const { symbol } = useParams();
  const navigate = useNavigate();

  const handleBackToScreener = () => {
    navigate('/screener');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StockAnalysis symbol={symbol || ''} onBack={handleBackToScreener} />
      </div>
    </div>
  );
}

// Component for investor test with back button
function InvestorAwarenessTestPage() {
  const navigate = useNavigate();

  const handleNavigation = (page: string) => {
    navigate(`/${page === 'home' ? '' : page}`);
  };

  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => handleNavigation('home')}
          className="px-4 py-2 border border-[#0F9D58] text-[#0F9D58] rounded-lg hover:bg-[#0F9D58] hover:text-white transition-all duration-300 font-medium"
        >
          ← Back to Home
        </button>
      </div>
      <InvestorAwarenessTest />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}