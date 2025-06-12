import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, RefreshCw, Download, Minimize2, Maximize2 } from 'lucide-react';

const AIAssistantPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m Scout AI, your retail analytics assistant. I can help you analyze your 18K+ transactions, understand customer behavior, and get insights about your Philippine retail data. What would you like to explore?',
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

  // Sample responses for different queries
  const getAIResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('sales') || input.includes('revenue')) {
      return 'Based on your data, total sales are ₱4,713,281 from 18,000 orders. Your average order value is ₱262. Sales peak during weekends, particularly Saturday afternoons. Personal Care (28.5%) and Food & Beverages (24.8%) are your top categories.';
    }
    
    if (input.includes('customer') || input.includes('demographic')) {
      return 'Your customer base shows interesting patterns: 35% are aged 26-35, 58% female, 40% male. Metro Manila represents 45% of customers, followed by Cebu (18%). Weekend shoppers make up 38% of your customer behavior patterns.';
    }
    
    if (input.includes('product') || input.includes('category')) {
      return 'Your FMCG categories perform as follows: Personal Care leads at 28.5% (₱1.34M), Food & Beverages at 24.8% (₱1.17M), and Household Products at 18.2% (₱857K). Health & Wellness shows strong growth at +15.9%.';
    }
    
    if (input.includes('trend') || input.includes('growth')) {
      return 'Growth trends show Baby Care leading at +22.1%, Pet Care at +18.5%, and Health & Wellness at +15.9%. These categories represent emerging opportunities in the Philippine market.';
    }
    
    if (input.includes('recommendation') || input.includes('suggest')) {
      return 'Based on your data, I recommend: 1) Focus marketing on 26-35 age group, 2) Expand Baby Care and Pet Care inventory, 3) Optimize weekend staffing, 4) Consider cross-promotions between Personal Care and Health & Wellness products.';
    }
    
    return 'I can help you analyze sales data, customer demographics, product performance, growth trends, and provide recommendations. Try asking about "sales performance", "customer insights", "product categories", or "growth trends".';
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
      content: 'Chat cleared! I\'m ready to help you with new retail analytics questions.',
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const exportChat = () => {
    const chatData = messages.map(msg => 
      `[${msg.timestamp}] ${msg.type === 'bot' ? 'Scout AI' : 'You'}: ${msg.content}`
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
    "What are my top selling categories?",
    "Show me customer demographics",
    "What are the growth trends?",
    "Give me sales recommendations",
    "Analyze weekend vs weekday sales"
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Scout AI Assistant</h1>
                <p className="text-gray-600">Your intelligent retail analytics companion</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={clearChat}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                title="Clear Chat"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button
                onClick={exportChat}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                title="Export Chat"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                title={isMinimized ? "Maximize" : "Minimize"}
              >
                {isMinimized ? <Maximize2 className="w-5 h-5" /> : <Minimize2 className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

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
                  <h4 className="font-medium text-gray-700 mb-3">AI Capabilities</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Data Points</span>
                      <span className="font-medium">18,000+</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Categories</span>
                      <span className="font-medium">7 FMCG</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Regions</span>
                      <span className="font-medium">Philippines</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Analysis Type</span>
                      <span className="font-medium">Real-time</span>
                    </div>
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
      </div>
    </div>
  );
};

export default AIAssistantPage;