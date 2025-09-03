import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  TrendingUp,
  BarChart3,
  PieChart,
  Sparkles,
  AlertTriangle,
  Minimize2,
  Maximize2,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Activity
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// --- REMOVED GEMINI SERVICE IMPORT FOR DUMMY CHATBOT ---

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  suggestions?: string[];
  type?: 'analysis' | 'ipo' | 'portfolio' | 'general' | 'data_fetch';
  isLoading?: boolean;
  error?: boolean;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Hardcoded Q&A for demo purposes
  const hardcodedResponses: { [key: string]: { text: string; type: Message['type']; suggestions?: string[] } } = {
    "hello": {
      text: "Hello! How can I assist you with the Indian stock market today?",
      type: "general",
      suggestions: ['📊 Analyze RELIANCE.BSE stock', '🎯 Today\'s IPO opportunities']
    },
    "hi": {
      text: "Hi there! I'm ready to help with your market queries. What's on your mind?",
      type: "general",
      suggestions: ['📈 Market sentiment analysis', '💎 Show value stocks under ₹500']
    },
    "analyze reliance.bse stock": {
      text: `**Reliance Industries Ltd (RELIANCE.BSE) Analysis:**

📊 **Current Market Snapshot (Dummy Data):**
*   **Price:** ₹2,458.90
*   **Change:** +15.50 (+0.63%)
*   **Volume:** 1,250,000 shares

📈 **Key Insights:**
*   Reliance continues to show **strong performance** in its diversified sectors including energy, retail, and telecom.
*   Recent expansion in its **green energy initiatives** presents long-term growth potential.
*   Technically, the stock is trading above its 50-day moving average, indicating **positive momentum**.
*   **Support Level:** ₹2,430, **Resistance Level:** ₹2,480.

🎯 **Recommendation:** Given its robust fundamentals and strategic growth areas, a **"Hold with positive bias"** is advised for long-term investors. Consider buying on dips.

⚠️ **Risk Factors:** Global crude oil price volatility, increased competition in retail/telecom, and regulatory changes.

Would you like a deeper dive into its financials or technical indicators?`,
      type: "analysis",
      suggestions: ['📈 Price targets', '⚠️ Risk factors', '💡 Similar stocks']
    },
    "show value stocks under ₹500": {
      text: `🔍 **Value Stocks Under ₹500 (Dummy List):**

Here are a few potential value stocks currently trading below ₹500, based on fundamental screening:

1.  **ABC Corp (ABC.BSE)** - Approx. ₹320
    *   **P/E Ratio:** 12x (vs. sector average 18x)
    *   **ROE:** 18%
    *   **Notes:** Strong balance sheet, consistent dividend payer in the manufacturing sector.

2.  **XYZ Tech (XYZ.BSE)** - Approx. ₹480
    *   **P/E Ratio:** 15x (vs. sector average 25x)
    *   **ROE:** 22%
    *   **Notes:** Mid-cap IT company with growing order book and good management.

3.  **PQR Foods (PQR.BSE)** - Approx. ₹210
    *   **P/E Ratio:** 10x (vs. sector average 16x)
    *   **ROE:** 15%
    *   **Notes:** Established FMCG player, defensive stock with stable cash flows.

Remember to conduct your own due diligence before investing. These are illustrative examples.`,
      type: "portfolio",
      suggestions: ['🎯 Find more stocks', '📊 Compare these stocks', '📈 Small-cap opportunities']
    },
    "today's ipo opportunities": {
      text: `🎯 **Today's IPO Opportunities (Dummy Data):**

Currently, there are no *new* IPOs opening today. However, here's an update on ongoing/recently closed IPOs:

*   **Tech Innovations IPO (TI.BSE)**
    *   **Status:** Subscription closed (Oversubscribed 50x)
    *   **Expected Listing:** Next week
    *   **GMP (Grey Market Premium):** ₹80-90 (indicating strong demand)
    *   **Notes:** Specializes in AI-driven solutions. High growth potential.

*   **Green Energy Solutions IPO (GES.BSE)**
    *   **Status:** Open for subscription (Ends tomorrow)
    *   **Subscription So Far:** Retail 5x, HNI 3x, QIB 2x
    *   **Price Band:** ₹180-190 per share
    *   **Notes:** Focus on renewable energy projects.

Consider applying for GES.BSE if it aligns with your risk appetite.`,
      type: "ipo",
      suggestions: ['📊 Subscription status', '💰 Grey market premium', '📈 Listing performance']
    },
    "market sentiment analysis": {
      text: `📈 **Indian Market Sentiment (Dummy Analysis):**

Current market sentiment appears to be **cautiously optimistic**.

*   **NIFTY 50:** Trading near all-time highs, indicating underlying strength.
*   **FII/DII Flows:** Foreign Institutional Investors (FIIs) have shown net buying this week, supported by consistent Domestic Institutional Investor (DII) inflows.
*   **VIX India:** Remains at moderate levels (around 12-14), suggesting limited immediate fear.
*   **Sectoral Performance:** IT and Banking sectors are showing leadership, while pharma and FMCG are consolidating.

Overall, the sentiment is positive but requires vigilance due to global macroeconomic factors.`,
      type: "market_trends",
      suggestions: ['📉 What are the risks?', '⚖️ Diversify portfolio', '📊 Top performing sectors']
    },
    "help me with portfolio diversification": {
      text: `⚖️ **Portfolio Diversification Strategies (General Advice):**

Diversification is key to managing risk and enhancing returns. Here are some strategies:

1.  **Asset Class Diversification:** Allocate across equities, debt, gold, and real estate.
2.  **Sectoral Diversification:** Avoid over-exposure to a single sector. Aim for a mix of cyclical (e.g., auto, banking) and defensive (e.g., FMCG, pharma) sectors.
3.  **Market Cap Diversification:** Include a mix of large-cap, mid-cap, and small-cap stocks based on your risk profile.
4.  **Geographic Diversification:** While focused on Indian markets, consider international exposure through Indian mutual funds/ETFs for broader global opportunities.

Would you like me to discuss specific ratios or allocation percentages?`,
      type: "portfolio",
      suggestions: ['🎯 Asset allocation', '📊 Risk assessment', '💡 New additions']
    },
    "thank you": {
      text: "You're most welcome! Is there anything else I can help you with today regarding the Indian stock market?",
      type: "general",
      suggestions: ['🔄 Start a new query', '❌ Close chat'] // '❌ Close chat' is here
    },
    "how are you": {
      text: "As an AI, I don't have feelings, but I'm operating perfectly and ready to assist you!",
      type: "general",
      suggestions: ['📊 Analyze a stock', '🎯 IPO insights']
    },
  };

  // Initialize welcome message only once
  useEffect(() => {
    if (!initialized && isOpen) {
      setMessages([{
        id: 'welcome-1',
        text: 'Welcome to MarketPulse AI! I\'m your advanced Indian stock market analyst specializing in BSE markets.\n\nI can help you with:\n📊 Real-time stock analysis\n💼 Portfolio optimization\n🎯 Technical & fundamental analysis\n🔍 IPO insights & valuations\n⚠️ Risk management strategies\n📈 Market trends & opportunities',
        sender: 'bot',
        timestamp: new Date(),
        type: 'general',
        suggestions: [
          '📊 Analyze RELIANCE.BSE stock',
          '💎 Show value stocks under ₹500',
          '🎯 Today\'s IPO opportunities',
          '📈 Market sentiment analysis',
          '🔍 Open stock screener'
        ]
      }]);
      setInitialized(true);
    }
  }, [initialized, isOpen]);

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end'
      });
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages, scrollToBottom]);

  const generateBotResponse = async (userMessage: string): Promise<Message> => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate AI processing time

    const cleanedUserMessage = userMessage.toLowerCase().trim();
    let response = hardcodedResponses[cleanedUserMessage];

    if (!response) {
      // Fuzzy matching or general fallback if exact match not found
      if (cleanedUserMessage.includes("reliance") || cleanedUserMessage.includes("r.bse")) {
        response = hardcodedResponses["analyze reliance.bse stock"];
      } else if (cleanedUserMessage.includes("ipo")) {
        response = hardcodedResponses["today's ipo opportunities"];
      } else if (cleanedUserMessage.includes("value stocks") || cleanedUserMessage.includes("under 500")) {
        response = hardcodedResponses["show value stocks under ₹500"];
      } else if (cleanedUserMessage.includes("market sentiment") || cleanedUserMessage.includes("market trends")) {
        response = hardcodedResponses["market sentiment analysis"];
      } else if (cleanedUserMessage.includes("portfolio") || cleanedUserMessage.includes("diversify")) {
        response = hardcodedResponses["help me with portfolio diversification"];
      } else if (cleanedUserMessage.includes("thank you")) {
        response = hardcodedResponses["thank you"];
      } else if (cleanedUserMessage.includes("close chat")) { // Handle "Close chat" suggestion
        setIsOpen(false);
        setIsDismissed(true);
        response = {
          text: "Closing the chat now. Feel free to open me again if you need assistance!",
          type: "general"
        };
      }
      else {
        response = {
          text: `I'm sorry, I don't have a specific answer for "${userMessage}" in my demo data. Try asking about "Reliance stock" or "IPO opportunities".`,
          type: "general",
          suggestions: ['📊 Analyze RELIANCE.BSE stock', '🎯 Today\'s IPO opportunities', '📈 Market sentiment analysis']
        };
      }
    }

    setIsTyping(false);

    return {
      id: `bot-${Date.now()}`,
      text: response.text,
      sender: 'bot',
      timestamp: new Date(),
      type: response.type,
      suggestions: response.suggestions
    };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputValue.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    const currentInput = inputValue.trim();
    setInputValue('');

    // Clear welcome message and add user message
    setMessages(prevMessages => {
      const withoutWelcome = prevMessages.filter(m => !m.id.startsWith('welcome'));
      return [...withoutWelcome, userMessage];
    });

    // Check for "close chat" input directly
    if (currentInput.toLowerCase().includes('close chat')) {
      setIsOpen(false);
      setIsDismissed(true);
      // Optionally add a bot message about closing if you want
      setMessages(prevMessages => [...prevMessages, {
        id: `bot-${Date.now()}`,
        text: "Closing the chat now. Feel free to open me again if you need assistance!",
        sender: 'bot',
        timestamp: new Date(),
        type: "general"
      }]);
      return; // Stop further processing if closing
    }

    try {
      const botResponse = await generateBotResponse(currentInput);
      setMessages(prevMessages => [...prevMessages, botResponse]);
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        text: 'I apologize, but I\'m experiencing an unexpected error. Please try again in a moment.',
        sender: 'bot',
        timestamp: new Date(),
        error: true,
        suggestions: ['🔄 Try again', '📊 Stock analysis', '🎯 IPO insights']
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };


  const handleSuggestionClick = (suggestion: string) => {
    const cleanSuggestion = suggestion.replace(/[📊💎🎯📈🔍⚖️💡❓🔄❌]/g, '').trim(); // Added ❌ to clean
    setInputValue(cleanSuggestion);

    // If "Close chat" suggestion is clicked, close the chat directly
    if (cleanSuggestion.toLowerCase() === 'close chat') {
      setIsOpen(false);
      setIsDismissed(true);
      // Also send a message to reflect this action
      setMessages(prevMessages => [...prevMessages, {
        id: `user-${Date.now()}-close`,
        text: "Close chat",
        sender: 'user',
        timestamp: new Date()
      }, {
        id: `bot-${Date.now()}-closed`,
        text: "Closing the chat now. Feel free to open me again if you need assistance!",
        sender: 'bot',
        timestamp: new Date(),
        type: "general"
      }]);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMessageTypeIcon = (type?: string) => {
    switch (type) {
      case 'analysis': return <BarChart3 className="w-4 h-4 text-blue-500" />;
      case 'ipo': return <TrendingUp className="w-4 h-4 text-purple-500" />;
      case 'portfolio': return <PieChart className="w-4 h-4 text-green-500" />;
      case 'data_fetch': return <Activity className="w-4 h-4 text-orange-500" />;
      default: return <Sparkles className="w-4 h-4 text-green-600" />;
    }
  };

  const copyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Button - Fixed positioning and better visibility */}
      {!isOpen && !isDismissed && (
        <div className="relative">
          <button
            onClick={() => setIsOpen(true)}
            className="rounded-full w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center border-4 border-white"
            title="Open MarketPulse AI"
          >
            <div className="relative">
              <MessageCircle className="w-7 h-7" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-2 h-2 text-white" />
              </div>
            </div>
          </button>
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
            MarketPulse AI Assistant
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}

      {/* Chat Window - Fixed size and positioning */}
      {isOpen && (
        <div className={`bg-gray-100 rounded-2xl shadow-2xl border border-gray-300 transition-all duration-300 ${
          isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]' // This line defines the fixed size
        }`}>
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                  <Bot className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-lg font-bold">MarketPulse AI</div>
                  <div className="flex items-center space-x-2 text-green-100 text-xs">
                    <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                    <span>AI Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
                  title={isMinimized ? "Expand" : "Minimize"}
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setIsDismissed(true);
                  }}
                  className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
                  title="Close" // This is the close button
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Chat Content */}
          {!isMinimized && (
            <div className="flex flex-col flex-1"> {/* Removed fixed height, using flex-1 */}
              {/* Messages Area with proper scrolling */}
              <div
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50" // `flex-1` here is already correct
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#CBD5E0 transparent'
                }}
              >
                {messages.map((message, index) => (
                  <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl shadow-sm ${
                      message.sender === 'user'
                        ? 'bg-green-600 text-white'
                        : message.error
                        ? 'bg-red-50 text-red-800 border border-red-200'
                        : 'bg-white text-gray-800 border border-gray-100'
                    }`}>
                      <div className="p-4">
                        <div className="flex items-start space-x-3">
                          {message.sender === 'bot' && (
                            <div className="flex-shrink-0 mt-1">
                              {message.error ? (
                                <AlertTriangle className="w-4 h-4 text-red-500" />
                              ) : (
                                getMessageTypeIcon(message.type)
                              )}
                            </div>
                          )}
                          {message.sender === 'user' && (
                            <User className="w-4 h-4 mt-1 flex-shrink-0 opacity-80" />
                          )}
                          <div className="flex-1 min-w-0">
                            {message.sender === 'bot' ? (
                              // Removed className prop directly from ReactMarkdown
                              <div className="markdown-body whitespace-pre-wrap text-sm leading-relaxed">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                  {message.text}
                                </ReactMarkdown>
                              </div>
                            ) : (
                              <div className="whitespace-pre-line text-sm leading-relaxed">
                                {message.text}
                              </div>
                            )}
                            <div className="flex items-center justify-between mt-3">
                              <span className={`text-xs ${
                                message.sender === 'user' ? 'text-green-100' : message.error ? 'text-red-500' : 'text-gray-500'
                              }`}>
                                {formatTime(message.timestamp)}
                                {message.error && ' • Error'}
                              </span>
                              {message.sender === 'bot' && (
                                <div className="flex items-center space-x-1 opacity-60 hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => copyMessage(message.text)}
                                    className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
                                    title="Copy message"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </button>
                                  <button
                                    className="text-gray-400 hover:text-green-500 p-1 rounded transition-colors"
                                    title="Helpful"
                                  >
                                    <ThumbsUp className="w-3 h-3" />
                                  </button>
                                  <button
                                    className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors"
                                    title="Not helpful"
                                  >
                                    <ThumbsDown className="w-3 h-3" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                       
                        {/* Suggestions - Only show for last bot message */}
                        {message.suggestions &&
                         message.suggestions.length > 0 &&
                         message.sender === 'bot' &&
                         index === messages.length - 1 &&
                         inputValue.trim() === '' && (
                          <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-100">
                            {message.suggestions.map((suggestion, suggestionIndex) => (
                              <button
                                key={suggestionIndex}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="text-xs bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-3 py-2 rounded-full border border-blue-200 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 transition-all duration-200 transform hover:scale-105"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
               
                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 max-w-[85%]">
                      <div className="flex items-center space-x-3">
                        <Sparkles className="w-4 h-4 text-green-600 animate-pulse" />
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">MarketPulse AI is analyzing</span>
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-200 p-4 bg-white rounded-b-2xl">
                <div className="flex items-end space-x-3">
                  <div className="flex-1">
                    <div className="relative">
                      <input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Ask about stocks, IPOs, market trends..."
                        onKeyPress={handleKeyPress}
                        className="w-full rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 pr-12 py-3 text-sm focus:outline-none transition-colors"
                        disabled={isTyping}
                      />
                      {inputValue && (
                        <button
                          onClick={() => setInputValue('')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Clear"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                   
                    {/* Quick Actions */}
                    <div className="flex items-center space-x-2 mt-2">
                      <button
                        onClick={() => handleSuggestionClick('Analyze RELIANCE.BSE stock')} // Changed to use handleSuggestionClick
                        className="text-xs text-green-600 hover:text-green-800 flex items-center space-x-1 px-2 py-1 rounded-lg hover:bg-green-50 transition-colors"
                      >
                        <BarChart3 className="w-3 h-3" />
                        <span>Quick Analysis</span>
                      </button>
                      <button
                        onClick={() => handleSuggestionClick('Show current IPO opportunities')} // Changed to use handleSuggestionClick
                        className="text-xs text-green-600 hover:text-green-800 flex items-center space-x-1 px-2 py-1 rounded-lg hover:bg-green-50 transition-colors"
                      >
                        <TrendingUp className="w-3 h-3" />
                        <span>IPOs</span>
                      </button>
                      <button
                        onClick={() => handleSuggestionClick('Help me with portfolio diversification')} // Changed to use handleSuggestionClick
                        className="text-xs text-green-600 hover:text-green-800 flex items-center space-x-1 px-2 py-1 rounded-lg hover:bg-green-50 transition-colors"
                      >
                        <PieChart className="w-3 h-3" />
                        <span>Portfolio</span>
                      </button>
                    </div>
                  </div>
                 
                  <button
                    onClick={handleSendMessage}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-xl px-6 py-3 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!inputValue.trim() || isTyping}
                  >
                    {isTyping ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
               
                {/* Status Bar */}
                <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>AI Online</span>
                    <div className="flex items-center space-x-1">
                      <Activity className="w-3 h-3" />
                      <span>Dummy Data</span> {/* Changed from Real-time Data */}
                    </div>
                  </div>
                  <div className="text-right">
                    <div>Powered by Dummy AI</div> {/* Changed from Powered by AI */}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 