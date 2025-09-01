import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  TrendingUp,
  Search,
  Eye,
  HelpCircle
} from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  suggestions?: string[];
}

interface ChatbotProps {
  onNavigate?: (page: string) => void;
  onStockSelect?: (symbol: string) => void;
}

export function Chatbot({ onNavigate, onStockSelect }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your MarketPulse assistant. I can help you with stock analysis, market information, and navigation. What would you like to know?',
      sender: 'bot',
      timestamp: new Date(),
      suggestions: [
        'Analyze RELIANCE stock',
        'Show me value stocks',
        'What are today\'s top gainers?',
        'Open stock screener'
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (userMessage: string): Message => {
    const lowercaseMessage = userMessage.toLowerCase();
    let botText = '';
    let suggestions: string[] = [];

    // Intent recognition (simplified rule-based system)
    if (lowercaseMessage.includes('analyze') || lowercaseMessage.includes('analysis')) {
      if (lowercaseMessage.includes('reliance')) {
        botText = 'I can help you analyze RELIANCE stock. Let me take you to the detailed analysis page with charts, fundamentals, and key metrics.';
        onStockSelect?.('RELIANCE');
      } else if (lowercaseMessage.includes('tcs')) {
        botText = 'I can help you analyze TCS stock. Let me take you to the detailed analysis page.';
        onStockSelect?.('TCS');
      } else {
        botText = 'I can help you analyze specific stocks. Please mention a stock symbol like RELIANCE, TCS, HDFCBANK, or use our stock screener to find stocks based on your criteria.';
        suggestions = ['Analyze RELIANCE', 'Analyze TCS', 'Open screener', 'Show popular stocks'];
      }
    } else if (lowercaseMessage.includes('screener') || lowercaseMessage.includes('filter') || lowercaseMessage.includes('screen')) {
      botText = 'I\'ll take you to our advanced stock screener where you can filter stocks by market cap, P/E ratio, sector, and many other parameters.';
      onNavigate?.('screener');
      suggestions = ['Show value stocks', 'Find high dividend stocks', 'Filter by sector'];
    } else if (lowercaseMessage.includes('value stock') || lowercaseMessage.includes('undervalued')) {
      botText = 'For value stocks, I recommend using our screener with filters like low P/E ratio (< 15), low P/B ratio (< 2), and good ROE (> 15%). Let me open the screener for you.';
      onNavigate?.('screener');
    } else if (lowercaseMessage.includes('gainer') || lowercaseMessage.includes('top stock')) {
      botText = 'You can find today\'s top gainers and losers on our home page. I can also take you to the screener to find stocks with recent positive performance.';
      onNavigate?.('home');
      suggestions = ['Show top losers', 'Open screener', 'Analyze a specific stock'];
    } else if (lowercaseMessage.includes('ipo')) {
      botText = 'I can help you with IPO information. Let me take you to our IPO Center where you can see upcoming IPOs, current issues, and recent listings.';
      onNavigate?.('ipo');
    } else if (lowercaseMessage.includes('dividend')) {
      botText = 'For dividend-focused investing, you can use our screener to filter stocks by dividend yield. Stocks like ITC, HDFC Bank, and Hindustan Unilever are known for consistent dividends.';
      suggestions = ['Filter by dividend yield', 'Show dividend aristocrats', 'Analyze ITC'];
    } else if (lowercaseMessage.includes('sector') || lowercaseMessage.includes('industry')) {
      botText = 'You can filter stocks by sector in our screener. Popular sectors include IT (TCS, Infosys), Banking (HDFC, ICICI), Energy (Reliance), and FMCG (HUL, ITC).';
      suggestions = ['Show IT stocks', 'Show banking stocks', 'Open screener'];
    } else if (lowercaseMessage.includes('help') || lowercaseMessage.includes('how')) {
      botText = 'I can help you with:\n• Stock analysis and detailed reports\n• Finding stocks using our advanced screener\n• IPO information and tracking\n• Market insights and navigation\n\nWhat specific help do you need?';
      suggestions = ['Stock analysis', 'Use screener', 'IPO information', 'Market overview'];
    } else if (lowercaseMessage.includes('hello') || lowercaseMessage.includes('hi')) {
      botText = 'Hello! Welcome to MarketPulse India. I\'m here to help you with stock analysis, market data, and finding the right investments. What can I assist you with today?';
      suggestions = ['Analyze a stock', 'Find value stocks', 'Show IPOs', 'Market overview'];
    } else {
      botText = 'I understand you\'re looking for information. I can help with stock analysis, screener usage, IPO tracking, and market insights. Could you be more specific about what you need?';
      suggestions = [
        'Analyze RELIANCE stock',
        'Show me value stocks', 
        'Open stock screener',
        'What can you help with?'
      ];
    }

    return {
      id: Date.now().toString(),
      text: botText,
      sender: 'bot',
      timestamp: new Date(),
      suggestions
    };
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot thinking time
    setTimeout(() => {
      const botResponse = generateBotResponse(inputValue);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    handleSendMessage();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full w-14 h-14 bg-[#0F9D58] hover:bg-[#0e8a4f] shadow-lg"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="w-80 h-96 shadow-2xl border-2 border-gray-200">
          <CardHeader className="bg-[#0F9D58] text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-[#0F9D58]" />
                </div>
                <div>
                  <CardTitle className="text-sm">MarketPulse Assistant</CardTitle>
                  <p className="text-xs text-green-100">Always ready to help</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-[#0e8a4f] p-1"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex flex-col h-80 p-0">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'user' 
                      ? 'bg-[#0F9D58] text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <div className="flex items-start space-x-2">
                      {message.sender === 'bot' && (
                        <Bot className="w-4 h-4 mt-0.5 text-[#0F9D58]" />
                      )}
                      {message.sender === 'user' && (
                        <User className="w-4 h-4 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm whitespace-pre-line">{message.text}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'user' ? 'text-green-100' : 'text-gray-500'
                        }`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                    
                    {/* Suggestions */}
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="text-xs bg-white text-[#0F9D58] px-2 py-1 rounded border hover:bg-gray-50 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                    <div className="flex items-center space-x-2">
                      <Bot className="w-4 h-4 text-[#0F9D58]" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t p-4">
              <div className="flex space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask me about stocks..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage}
                  size="sm"
                  className="bg-[#0F9D58] hover:bg-[#0e8a4f]"
                  disabled={!inputValue.trim() || isTyping}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}