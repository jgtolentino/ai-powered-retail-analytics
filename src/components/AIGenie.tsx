import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Bot, Send, Loader2, Sparkles, TrendingUp, Users, Package } from 'lucide-react'
import { callAzureOpenAI } from '@/lib/azure-openai/client'
import { supabase } from '@/lib/supabase/client'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function AIGenie() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI retail analytics assistant. I can help you understand sales trends, customer behavior, and provide insights about your retail data. What would you like to know?',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const suggestedQuestions = [
    { icon: TrendingUp, text: "What are our top selling products this week?" },
    { icon: Users, text: "Show me customer demographics breakdown" },
    { icon: Package, text: "Which brands are performing best?" },
    { icon: Sparkles, text: "Predict next month's sales trends" }
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
      // Fetch relevant data based on the query
      let contextData = ''
      
      if (input.toLowerCase().includes('brand') || input.toLowerCase().includes('product')) {
        const { data: brands } = await supabase
          .from('brands')
          .select('name')
          .limit(10)
        
        if (brands) {
          contextData = `Available brands: ${brands.map(b => b.name).join(', ')}. `
        }
      }

      if (input.toLowerCase().includes('sales') || input.toLowerCase().includes('revenue')) {
        const { data: transactions } = await supabase
          .from('transactions')
          .select('total_amount')
          .order('created_at', { ascending: false })
          .limit(100)
        
        if (transactions) {
          const totalRecent = transactions.reduce((sum, t) => sum + (t.total_amount || 0), 0)
          contextData += `Recent sales data: ₱${totalRecent.toLocaleString()} from last 100 transactions. `
        }
      }

      // Call Azure OpenAI
      const response = await callAzureOpenAI([
        {
          role: 'system',
          content: `You are an AI assistant specialized in retail analytics for the Philippine market. 
          You have access to a database with brands, stores, products, customers, and transactions data.
          ${contextData}
          Provide insights in a clear, actionable format. Use Philippine peso (₱) for currency.
          Be specific with numbers and percentages when possible.`
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
      console.error('AI Genie error:', error)
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error while processing your request. Please try again or rephrase your question.',
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

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
          <CardTitle className="flex items-center text-xl">
            <Bot className="h-6 w-6 mr-2 text-blue-600" />
            AI Retail Analytics Assistant
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex items-center mb-2">
                      <Bot className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">AI Assistant</span>
                    </div>
                  )}
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-xs mt-2 ${
                    message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-4">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length === 1 && (
            <div className="p-4 border-t bg-gray-50">
              <p className="text-sm text-gray-600 mb-2">Try asking:</p>
              <div className="grid grid-cols-2 gap-2">
                {suggestedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start text-left text-sm"
                    onClick={() => setInput(question.text)}
                  >
                    <question.icon className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{question.text}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about sales, customers, trends..."
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <Button 
                onClick={handleSend} 
                disabled={!input.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}