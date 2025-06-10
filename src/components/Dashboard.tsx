import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { BarChart3, Bot, Database, Zap } from 'lucide-react'

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(false)

  const features = [
    {
      icon: <BarChart3 className="h-8 w-8 text-blue-500" />,
      title: "Advanced Analytics",
      description: "Real-time retail insights and visualizations"
    },
    {
      icon: <Bot className="h-8 w-8 text-green-500" />,
      title: "AI Assistant",
      description: "Azure OpenAI powered conversational analytics"
    },
    {
      icon: <Database className="h-8 w-8 text-purple-500" />,
      title: "Data Integration",
      description: "Supabase backend with 18K+ records"
    },
    {
      icon: <Zap className="h-8 w-8 text-orange-500" />,
      title: "Enterprise Ready",
      description: "Production-grade deployment and scaling"
    }
  ]

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          AI-Powered Retail Analytics
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Enterprise-grade business intelligence platform with Azure OpenAI integration for the Philippine retail market
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            Get Started
          </Button>
          <Button variant="outline" size="lg">
            View Demo
          </Button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto mb-2">
                {feature.icon}
              </div>
              <CardTitle className="text-lg">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                {feature.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Status Section */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>Current deployment and integration status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Database Connection</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Ready</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Azure OpenAI Integration</span>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">Pending</span>
            </div>
            <div className="flex items-center justify-between">
              <span>UI Components</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Ready</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Production Deployment</span>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">In Progress</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Follow the master deployment plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-16 flex flex-col gap-2">
              <Database className="h-5 w-5" />
              Setup Database
            </Button>
            <Button variant="outline" className="h-16 flex flex-col gap-2">
              <Bot className="h-5 w-5" />
              Configure AI
            </Button>
            <Button variant="outline" className="h-16 flex flex-col gap-2">
              <Zap className="h-5 w-5" />
              Deploy Production
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}