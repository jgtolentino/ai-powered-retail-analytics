import { useState, useRef, useEffect } from 'react'
import { Button } from '../ui/button'
import { Bot, Send, Loader2, X, Maximize2, Minimize2 } from 'lucide-react'
import { callAzureOpenAI } from '@/lib/azure-openai/client'

interface ScoutAIPanelProps {
  data: {
    transactions: any[]
    brands: any[]
    products: any[]
    transactionItems: any[]
  } | null
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function ScoutAIPanel({ data }: ScoutAIPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m Scout AI, your Philippine retail intelligence assistant. I can analyze your 18K+ transactions and provide insights about brands, consumer behavior, and market opportunities. What would you like to explore?',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Generate context from current data
  const generateContext = () => {
    if (!data) return ''

    const totalTransactions = data.transactions?.length || 0
    const totalRevenue = data.transactions?.reduce((sum, t) => sum + (t.total_amount || 0), 0) || 0
    const uniqueCustomers = new Set(data.transactions?.map(t => t.device_id)).size
    const topRegions = [...new Set(data.transactions?.map(t => t.store_location?.split(',')[0]).filter(Boolean))].slice(0, 5)
    const tbwaBrands = data.brands?.filter(b => b.is_tbwa).map(b => b.name) || []
    const topCategories = [...new Set(data.brands?.map(b => b.category).filter(Boolean))].slice(0, 5)

    return `Current dataset: ${totalTransactions.toLocaleString()} transactions, ₱${totalRevenue.toLocaleString()} revenue, ${uniqueCustomers} unique customers. Top regions: ${topRegions.join(', ')}. TBWA brands: ${tbwaBrands.join(', ')}. Categories: ${topCategories.join(', ')}.`
  }

  const quickInsights = [
    {
      title: "Top Brand Performance",
      query: "Which brands are performing best in terms of revenue and why?"
    },
    {
      title: "Consumer Behavior Trends",
      query: "What are the key consumer behavior patterns in our data?"
    },
    {
      title: "Regional Opportunities",
      query: "Which regions show the most growth potential?"
    },
    {
      title: "TBWA vs Competitors",
      query: "How are TBWA brands performing compared to competitors?"
    }
  ]

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const context = generateContext()
      
      const response = await callAzureOpenAI([
        {
          role: 'system',
          content: `You are Scout AI, a Philippine retail intelligence assistant specializing in data analysis and market insights.
          
          Context: ${context}
          
          You have access to comprehensive retail data including:
          - 18,000+ transaction records from Philippine retail stores
          - Brand performance data (including TBWA clients vs competitors)
          - Consumer demographics (age, gender, device tracking)
          - Geographic data (regions, cities, store locations)
          - Product categories and SKU performance
          - Payment methods and purchase patterns
          - Audio transcription data from voice orders
          
          Provide specific, actionable insights with numbers and percentages when possible. Focus on:
          1. Brand performance and market share
          2. Consumer behavior patterns
          3. Geographic opportunities
          4. Competitive intelligence
          5. Growth recommendations
          
          Use Philippine peso (₱) for currency. Reference specific data points from the context when possible.
          Keep responses concise but informative (2-3 paragraphs max).`
        },
        ...messages.map(m => ({
          role: m.role,
          content: m.content
        })),
        {
          role: 'user',
          content: input
        }
      ])

      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: response.choices[0].message.content,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Scout AI error:', error)
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error while analyzing the data. Please try again or rephrase your question.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleQuickInsight = (query: string) => {
    setInput(query)
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          className="bg-black hover:bg-gray-800 text-white rounded-full w-14 h-14 shadow-lg"
        >
          <Bot className="h-6 w-6" />
        </Button>
      </div>
    )
  }

  return (
    <div className={`fixed ${isExpanded ? 'inset-4' : 'top-4 right-4 w-80 h-96'} z-50 bg-black text-white rounded-lg shadow-2xl border border-gray-800 flex flex-col`}>
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center">
          <Bot className="h-5 w-5 mr-2 text-blue-400" />
          <h3 className="font-semibold">Scout AI</h3>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-white hover:bg-gray-800 p-1"
          >
            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(true)}
            className="text-white hover:bg-gray-800 p-1"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`${message.role === 'user' ? 'text-right' : 'text-left'}`}
          >
            <div
              className={`inline-block max-w-[85%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-100'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="flex items-center mb-1">
                  <Bot className="h-3 w-3 mr-1 text-blue-400" />
                  <span className="text-xs font-medium text-blue-400">Scout AI</span>
                </div>
              )}
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p className="text-xs mt-1 opacity-70">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="text-left">
            <div className="inline-block bg-gray-800 rounded-lg p-3">
              <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Insights */}
      {messages.length === 1 && !isExpanded && (
        <div className="p-3 border-t border-gray-800 bg-gray-900">
          <p className="text-xs text-gray-400 mb-2">Quick Insights:</p>
          <div className="space-y-1">
            {quickInsights.slice(0, 2).map((insight, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start text-left text-xs text-gray-300 hover:bg-gray-800 hover:text-white p-2 h-auto"
                onClick={() => handleQuickInsight(insight.query)}
              >
                {insight.title}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Expanded Quick Insights */}
      {messages.length === 1 && isExpanded && (
        <div className="p-4 border-t border-gray-800 bg-gray-900">
          <p className="text-sm text-gray-400 mb-3">Quick Insights:</p>
          <div className="grid grid-cols-2 gap-2">
            {quickInsights.map((insight, index) => (
              <Button
                key={index}
                variant="ghost"
                className="justify-start text-left text-xs text-gray-300 hover:bg-gray-800 hover:text-white p-3 h-auto"
                onClick={() => handleQuickInsight(insight.query)}
              >
                <div>
                  <div className="font-medium">{insight.title}</div>
                  <div className="text-xs text-gray-500 mt-1">{insight.query}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about retail insights..."
            className="flex-1 bg-gray-800 text-white placeholder-gray-400 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSend} 
            disabled={!input.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

    </div>
  )
}