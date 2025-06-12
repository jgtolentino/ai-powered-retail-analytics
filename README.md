# RetailBot - AI-Powered Retail Analytics Platform

> Enterprise-grade retail analytics with AI-powered insights for the Philippine market

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://vercel.com) [![TypeScript](https://img.shields.io/badge/TypeScript-4.x-blue)](https://www.typescriptlang.org/) [![React](https://img.shields.io/badge/React-18.x-blue)](https://reactjs.org/) [![Azure OpenAI](https://img.shields.io/badge/Azure_OpenAI-integrated-orange)](https://azure.microsoft.com/en-us/products/cognitive-services/openai-service)

## 🎯 Overview

RetailBot is a comprehensive analytics platform designed for Philippine sari-sari stores and retail operations. It provides AI-powered insights, real-time transaction analysis, and competitive intelligence through an intuitive dashboard interface.

### Key Features

- **📊 Real-time Analytics** - Live dashboard with 18K+ transaction insights
- **🤖 AI Assistant Console** - Natural language queries with Azure OpenAI
- **🏪 Brand Performance** - TBWA vs competitor analysis
- **📱 Mobile-Optimized** - Responsive design for all devices
- **🌏 Philippine Market** - Localized for sari-sari store operations

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/jgtolentino/ai-powered-retail-analytics.git
cd ai-powered-retail-analytics

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the application.

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── Layout.tsx      # Main layout with sidebar navigation
│   ├── PageLayout.tsx  # Consistent page header component
│   ├── ai/            # AI-related components
│   └── shared/        # Reusable UI components
├── hooks/             # Custom React hooks
├── services/          # API and data services
├── config/            # Configuration files
└── styles/           # CSS and styling
```

## 📚 Documentation

- [Architecture Overview](docs/ARCHITECTURE.md)
- [Development Guide](docs/DEVELOPMENT.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [API Reference](docs/API.md)

## 🔧 Development

### Prerequisites

- Node.js 18+ 
- npm 8+
- Azure OpenAI access (optional for AI features)
- Supabase account (for data storage)

### Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
npm run test       # Run tests
npm run verify     # Run all checks (lint + test + build)
```

### Environment Variables

Required environment variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
VITE_AZURE_OPENAI_ENDPOINT=your_azure_endpoint
VITE_AZURE_OPENAI_API_KEY=your_azure_key
```

## 🎨 UI Components

The application uses a unified layout system:

- **Layout Component**: Provides sidebar navigation and main content area
- **PageLayout Component**: Standardized page headers with title/description/actions
- **Consistent Navigation**: Grouped sections (Analytics, Administration)

## 🤖 AI Features

- **AI Console**: Comprehensive analytics workspace with conversation history
- **Natural Language Queries**: Ask questions about sales, customers, and trends
- **Predictive Insights**: ML-powered recommendations and forecasts
- **Export Capabilities**: Download analysis results and conversation logs

## 🚀 Deployment

The application is configured for Vercel deployment:

```bash
# Deploy to production
npm run build
vercel --prod
```

See [Deployment Guide](docs/DEPLOYMENT.md) for detailed instructions.

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run with coverage
npm run test:coverage

# Run end-to-end tests
npm run test:e2e
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- [Documentation](docs/)
- [Issues](https://github.com/jgtolentino/ai-powered-retail-analytics/issues)
- [Discussions](https://github.com/jgtolentino/ai-powered-retail-analytics/discussions)

---

Built with ❤️ for the Philippine retail market