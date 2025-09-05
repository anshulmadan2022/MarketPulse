import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Menu, X, Search, User, LogOut, Sparkles } from 'lucide-react';
import { Input } from './ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { AuthModal } from './AuthModal';
import { authAPI } from '../utils/api';
import { toast } from 'sonner@2.0.3';
import { motion } from 'framer-motion';
import { LoginPortal } from './LoginPortal';

interface HeaderProps {
  onNavigate: (page: string) => void;
}

export function Header({ onNavigate }: HeaderProps) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showLoginPortal, setShowLoginPortal] = useState(false);

  // Determine current page from URL
  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === '/') return 'home';
    return path.substring(1).split('/')[0]; // Remove leading slash and get first segment
  };

  const currentPage = getCurrentPage();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await authAPI.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.log('No authenticated user');
    } finally {
      setLoading(false);
    }
  };
  const handleLogin = (userType: 'user' | 'sebi-entity' | 'sebi-authority') => {
    console.log('Login successful for:', userType);
    setShowLoginPortal(false);
  };

  const handleSignOut = async () => {
    try {
      await authAPI.signOut();
      setUser(null);
      toast.success('Signed out successfully');
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  const handleAuthSuccess = () => {
    checkAuth();
  };

  const navigationItems = [
    { id: 'home', label: 'Home', active: currentPage === 'home' },
    { id: 'live-market', label: 'Live Market', active: currentPage === 'live-market' },
    { id: 'screener', label: 'Screener', active: currentPage === 'screener' },
    { id: 'ipo', label: 'IPO', active: currentPage === 'ipo' },
    { id: 'sebi-compliance', label: 'SEBI', active: currentPage === 'sebi-compliance' },
  ];

  return (
    <motion.header 
      className="bg-white text-gray-900 shadow-lg relative z-50 border-b border-gray-200"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section - Click to go home */}
          <motion.div 
            className="flex items-center space-x-4 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            onClick={() => onNavigate('home')}
          >
            {/* MarketPulse Logo/Brand */}
            <div className="relative group">
              <motion.div
                className="w-14 h-14 rounded-xl overflow-hidden shadow-lg border-2 border-[#0F9D58]/20 bg-[#0F9D58]/10 flex items-center justify-center"
                whileHover={{ rotateY: 10 }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-xl font-bold text-[#0F9D58]">MP</span>
              </motion.div>
            </div>
            
            {/* Brand Text */}
            <div className="space-y-1">
              <motion.h1 
                className="text-3xl font-bold text-gray-900"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                MarketPulse
              </motion.h1>
              <motion.p 
                className="text-sm text-[#0F9D58] font-medium flex items-center"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Sparkles className="w-3 h-3 mr-1" />
                Financial Analytics Platform
              </motion.p>
            </div>
          </motion.div>

          {/* Enhanced Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item, index) => (
              <motion.button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-5 py-3 rounded-xl transition-all duration-300 font-medium relative overflow-hidden group ${
                  item.active
                    ? 'bg-[#0F9D58] text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-[#0F9D58]'
                }`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                {/* Enhanced active indicator */}
                {item.active && (
                  <motion.div
                    className="absolute inset-0 bg-[#0F9D58] rounded-xl"
                    layoutId="activeTab"
                    transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                
                {/* Hover effect */}
                <div className="absolute inset-0 bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                
                <span className="relative z-10 text-sm font-semibold">{item.label}</span>
              </motion.button>
            ))}
          </nav>

          {/* Enhanced Search and Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search stocks, companies..."
                className="pl-12 pr-4 py-3 w-80 bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#0F9D58] focus:ring-[#0F9D58]/20 transition-all duration-300 rounded-xl"
              />
            </motion.div>
            
            {/* Enhanced User Menu */}
            {user ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-gray-700 hover:bg-gray-100 transition-all duration-300 rounded-xl px-4 py-3"
                    >
                      <User className="w-4 h-4 mr-2" />
                      {user.user_metadata?.name || user.email}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className="w-64 bg-white border-gray-200 text-gray-900 rounded-xl shadow-lg"
                  >
                    <DropdownMenuLabel className="text-[#0F9D58] font-semibold">My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-gray-200" />
                    <DropdownMenuItem 
                      onClick={() => onNavigate('portfolio')}
                      className="hover:bg-gray-100 focus:bg-gray-100 text-gray-900 rounded-lg m-1 transition-all duration-200"
                    >
                      Portfolio
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-gray-100 focus:bg-gray-100 text-gray-900 rounded-lg m-1 transition-all duration-200">
                      Watchlist
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-gray-100 focus:bg-gray-100 text-gray-900 rounded-lg m-1 transition-all duration-200">
                      Alerts
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-200" />
                    <DropdownMenuItem 
                      onClick={handleSignOut} 
                      className="text-red-600 hover:bg-red-50 focus:bg-red-50 rounded-lg m-1 transition-all duration-200"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => setShowLoginPortal(true)}
                  className="bg-[#0F9D58] text-white hover:bg-[#0e8a4f] transition-all duration-300 rounded-xl px-6 py-3 font-semibold"
                  disabled={loading}
                >
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </motion.div>
            )}
          </div>

          {/* Enhanced Mobile menu button */}
          <motion.button
            className="md:hidden p-3 rounded-xl hover:bg-gray-100 transition-all duration-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
          </motion.button>
        </div>

        {/* Enhanced Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div 
            className="md:hidden py-6 border-t border-gray-200"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col space-y-3">
              {navigationItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`px-6 py-4 rounded-xl text-left transition-all duration-300 font-medium ${
                    item.active
                      ? 'bg-[#0F9D58] text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-[#0F9D58]'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  {item.label}
                </motion.button>
              ))}
              
              <motion.div 
                className="pt-4 border-t border-gray-200 px-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <Input
                  placeholder="Search stocks, companies..."
                  className="bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#0F9D58] transition-all duration-300 rounded-xl py-4"
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Auth Modal */}
      {/* Login Portal Modal */}
              {showLoginPortal && (
                <LoginPortal
                  onClose={() => setShowLoginPortal(false)}
                  onLogin={handleLogin}
                />
              )}
    </motion.header>
  );
}