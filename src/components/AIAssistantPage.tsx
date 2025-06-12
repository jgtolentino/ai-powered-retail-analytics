import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, RefreshCw, Download, Minimize2, Maximize2 } from 'lucide-react';
import PageLayout from './PageLayout';

const AIAssistantPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Welcome to the AI Assistant Console! I\'m your dedicated retail analytics companion for comprehensive data exploration. Unlike the floating Scout AI panel, I provide detailed analysis sessions with full conversation history and export capabilities. I can deep-dive into your 18K+ Philippine retail transactions. How can I assist you today?',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Comprehensive responses for different queries - More detailed than floating panel
  const getAIResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('sales') || input.includes('revenue')) {
      return `**COMPREHENSIVE SALES ANALYSIS**

      📊 **Revenue Overview**: Total sales of ₱4,713,281 across 18,000+ transactions
      💰 **Average Order Value**: ₱262 per transaction
      📈 **Peak Performance**: Saturday afternoons generate highest revenue (18.5% of weekly sales)
      🏆 **Top Categories**: Personal Care (28.5%, ₱1.34M) and Food & Beverages (24.8%, ₱1.17M)
      
      **Detailed Breakdown**:
      • Morning sales (6-10 AM): ₱892K (18.9%)
      • Afternoon peak (2-6 PM): ₱1.45M (30.8%)
      • Evening sales (6-10 PM): ₱1.21M (25.7%)
      
      **Regional Performance**: Metro Manila leads with 45% of total revenue, followed by Central Luzon (18%) and Visayas (12%).`;
    }
    
    if (input.includes('customer') || input.includes('demographic')) {
      return `**DETAILED CUSTOMER DEMOGRAPHICS**

      👥 **Age Distribution** (18,000 customers):
      • 18-25: 3,960 customers (22%) - Digital natives, mobile-first shoppers
      • 26-35: 5,040 customers (28%) - Primary household buyers, highest spend
      • 36-45: 4,320 customers (24%) - Family-focused, bulk purchasers
      • 46-55: 2,880 customers (16%) - Brand loyal, quality-conscious
      • 55+: 1,800 customers (10%) - Traditional shopping patterns
      
      🏙️ **Geographic Spread**:
      • Metro Manila: 8,100 customers (45%) - Urban professionals
      • Central Luzon: 3,240 customers (18%) - Suburban families
      • Southern Luzon: 2,700 customers (15%) - Mixed demographics
      • Visayas: 2,160 customers (12%) - Island communities
      • Mindanao: 1,800 customers (10%) - Emerging market
      
      ⏰ **Shopping Patterns**: Weekend shoppers (Saturday-Sunday) represent 38% of customer activity with higher basket values.`;
    }
    
    if (input.includes('product') || input.includes('category')) {
      return `**COMPREHENSIVE PRODUCT CATEGORY ANALYSIS**

      🧴 **Personal Care** (28.5% - ₱1.34M):
      Top performers: Shampoo, soap, toothpaste, deodorant
      Growth: +12.4% vs previous period
      
      🍿 **Food & Beverages** (24.8% - ₱1.17M):
      Leading items: Instant noodles, soft drinks, coffee, biscuits
      Seasonal trends: +15% during summer months
      
      🏠 **Household Products** (18.2% - ₱857K):
      Key categories: Detergent, fabric softener, cleaning supplies
      Bulk purchase frequency: 65% buy monthly
      
      💊 **Health & Wellness** (12.4% - ₱584K):
      Fastest growing: +15.9% year-over-year
      Emerging: Vitamins, supplements, health drinks
      
      👶 **Baby Care** (8.7% - ₱410K):
      Explosive growth: +22.1%
      Premium segment expanding rapidly
      
      🐕 **Pet Care** (4.2% - ₱198K):
      Breakthrough category: +18.5% growth
      Urban market driver`;
    }
    
    if (input.includes('trend') || input.includes('growth')) {
      return `**COMPREHENSIVE GROWTH TRENDS ANALYSIS**

      📈 **Category Growth Rankings**:
      1. Baby Care: +22.1% (Fastest growing - premium baby products)
      2. Pet Care: +18.5% (Urban lifestyle shift)
      3. Health & Wellness: +15.9% (Post-pandemic awareness)
      4. Personal Care: +12.4% (Consistent performer)
      5. Food & Beverages: +8.7% (Stable demand)
      
      🌟 **Emerging Opportunities**:
      • Organic/Natural products: +35% in premium segments
      • Ready-to-eat meals: +28% among working professionals
      • Eco-friendly packaging: +31% preference increase
      
      📊 **Market Dynamics**:
      • Digital payment adoption: 67% of transactions
      • Mobile commerce: 45% growth in app-based orders
      • Subscription models: 23% interest in regular delivery
      
      🎯 **Philippine Market Specific**:
      • Sari-sari store modernization driving 15% of growth
      • Regional expansion beyond Metro Manila: +19%
      • Local brand preference increasing: +12%`;
    }
    
    if (input.includes('recommendation') || input.includes('suggest')) {
      return `**STRATEGIC BUSINESS RECOMMENDATIONS**

      🎯 **Immediate Actions** (Next 30 days):
      1. **Target 26-35 Age Group**: Focus 60% of marketing budget on this highest-value segment
      2. **Weekend Optimization**: Increase staff by 25% on Saturdays, extend hours
      3. **Inventory Expansion**: Stock Baby Care (+40%) and Pet Care (+30%) products
      
      📈 **Growth Strategies** (Next 90 days):
      1. **Cross-Promotion Programs**: 
         • Personal Care + Health & Wellness bundles
         • Food & Beverage + Household product combos
      2. **Regional Expansion**: 
         • Open 3 new locations in Central Luzon
         • Partner with 50 sari-sari stores in Visayas
      
      💡 **Innovation Opportunities**:
      • Launch subscription service for repeat purchases
      • Develop private label products in fast-growing categories
      • Implement AI-powered inventory prediction
      
      🎪 **Marketing Focus**:
      • Mobile-first campaigns for 18-35 demographics
      • Community events in high-growth regions
      • Influencer partnerships for premium categories
      
      📊 **Expected Impact**: 15-20% revenue increase within 6 months based on market analysis.`;
    }
    
    return `**AI ASSISTANT CONSOLE CAPABILITIES**

    I provide comprehensive, detailed analysis unlike the quick insights from the floating Scout AI panel. I can help with:
    
    🔍 **Deep Analytics**: 
    • "sales performance" - Detailed revenue breakdowns
    • "customer insights" - Complete demographic analysis
    • "product categories" - Category performance deep-dives
    • "growth trends" - Market dynamics and forecasts
    • "recommendations" - Strategic business guidance
    
    📊 **Advanced Features**:
    • Multi-dimensional data analysis
    • Historical trend comparisons
    • Predictive insights
    • Export-ready reports
    • Session-based conversation history
    
    Ask me anything about your 18,000+ Philippine retail transactions!`;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI processing delay
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        type: 'bot',
        content: getAIResponse(inputMessage),
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{
      id: 1,
      type: 'bot',
      content: 'Console cleared! Ready for a new comprehensive analytics session. I can provide detailed insights, historical analysis, and export-ready reports.',
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const exportChat = () => {
    const chatData = messages.map(msg => 
      `[${msg.timestamp}] ${msg.type === 'bot' ? 'AI Assistant Console' : 'You'}: ${msg.content}`
    ).join('\n\n');
    
    const blob = new Blob([chatData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'scout-ai-conversation.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const quickQuestions = [
    "Provide comprehensive sales analysis with regional breakdown",
    "Show detailed customer demographics and shopping patterns", 
    "Analyze growth trends and emerging market opportunities",
    "Give strategic business recommendations with timeline",
    "Compare weekend vs weekday performance with insights"
  ];

  return (
    <PageLayout 
      title={
        <div className="flex items-center">
          <Bot className="w-6 h-6 mr-2 text-blue-600" />
          AI Assistant
          <span className="ml-3 text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
            Console
          </span>
        </div>
      }
      description="Comprehensive retail analytics workspace with detailed conversation history"
      actions={
        <div className="flex items-center space-x-3">
          <button
            onClick={clearChat}
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            title="Clear Chat"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Clear
          </button>
          <button
            onClick={exportChat}
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            title="Export Chat"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            title={isMinimized ? "Maximize" : "Minimize"}
          >
            {isMinimized ? <Maximize2 className="w-4 h-4 mr-2" /> : <Minimize2 className="w-4 h-4 mr-2" />}
            {isMinimized ? "Expand" : "Minimize"}
          </button>
        </div>
      }
    >

        {!isMinimized && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Quick Questions Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <h3 className="font-semibold text-gray-800 mb-4">Quick Questions</h3>
                <div className="space-y-2">
                  {quickQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => setInputMessage(question)}
                      className="w-full text-left p-3 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
                
                {/* AI Stats */}
                <div className="mt-6 pt-4 border-t">
                  <h4 className="font-medium text-gray-700 mb-3">Console Features</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Analysis Depth</span>
                      <span className="font-medium">Comprehensive</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Data Points</span>
                      <span className="font-medium">18,000+</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Export Format</span>
                      <span className="font-medium">Full Reports</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Session Type</span>
                      <span className="font-medium">Extended</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-700">
                      💡 <strong>Pro Tip</strong>: This console provides detailed analysis unlike the floating Scout AI panel which gives quick insights.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Interface */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm border flex flex-col h-[600px]">
                {/* Chat Messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start space-x-3 max-w-3xl ${
                        message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.type === 'bot' 
                            ? 'bg-blue-500' 
                            : 'bg-gray-500'
                        }`}>
                          {message.type === 'bot' ? (
                            <Bot className="w-4 h-4 text-white" />
                          ) : (
                            <User className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <div className={`rounded-lg p-4 ${
                          message.type === 'bot'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-blue-500 text-white'
                        }`}>
                          <p className="text-sm leading-relaxed">{message.content}</p>
                          <p className={`text-xs mt-2 ${
                            message.type === 'bot' ? 'text-gray-500' : 'text-blue-100'
                          }`}>
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-gray-100 rounded-lg p-4">
                          <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            </div>
                            <span className="text-sm text-gray-600">Scout AI is thinking...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="border-t p-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 relative">
                      <textarea
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask Scout AI about your retail data..."
                        className="w-full p-3 pr-12 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="2"
                        disabled={isLoading}
                      />
                    </div>
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isLoading}
                      className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Press Enter to send, Shift+Enter for new line
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {isMinimized && (
          <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
            <Bot className="w-12 h-12 text-blue-500 mx-auto mb-2" />
            <p className="text-gray-600">Scout AI is minimized. Click maximize to continue chatting.</p>
          </div>
        )}
    </PageLayout>
  );
};

export default AIAssistantPage;