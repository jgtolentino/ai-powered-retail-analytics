#!/bin/bash

# Azure OpenAI Setup Script for AI-Powered Retail Analytics
# This script sets up Azure OpenAI integration following the master deployment plan

set -e

echo "🚀 Starting Azure OpenAI Setup for AI-Powered Retail Analytics"
echo "================================================================"

# Check if required environment variables are set
if [ -z "$AZURE_RESOURCE_NAME" ] || [ -z "$AZURE_OPENAI_API_KEY" ]; then
    echo "❌ Error: Required environment variables not set"
    echo "Please set AZURE_RESOURCE_NAME and AZURE_OPENAI_API_KEY in your .env file"
    exit 1
fi

echo "✅ Environment variables validated"

# Install Azure OpenAI dependencies
echo "📦 Installing Azure OpenAI dependencies..."
npm install @azure/openai openai

# Create Azure OpenAI client configuration
echo "🔧 Creating Azure OpenAI client configuration..."
mkdir -p src/lib/azure-openai

cat > src/lib/azure-openai/client.ts << 'EOF'
import { OpenAIApi, Configuration } from 'openai'

const configuration = new Configuration({
  apiKey: import.meta.env.AZURE_OPENAI_API_KEY,
  basePath: `https://${import.meta.env.AZURE_RESOURCE_NAME}.openai.azure.com/openai/deployments/${import.meta.env.AZURE_DEPLOYMENT_NAME}`,
  baseOptions: {
    headers: {
      'api-key': import.meta.env.AZURE_OPENAI_API_KEY,
    },
    params: {
      'api-version': import.meta.env.AZURE_API_VERSION || '2024-02-01',
    },
  },
})

export const openai = new OpenAIApi(configuration)

export async function testAzureConnection() {
  try {
    const response = await openai.createChatCompletion({
      model: import.meta.env.AZURE_DEPLOYMENT_NAME || 'gpt-4',
      messages: [
        {
          role: 'user',
          content: 'Hello! This is a test of the Azure OpenAI connection.'
        }
      ],
      max_tokens: 50
    })
    
    console.log('✅ Azure OpenAI connection successful')
    return response.data
  } catch (error) {
    console.error('❌ Azure OpenAI connection failed:', error)
    throw error
  }
}
EOF

# Create test script
echo "🧪 Creating test script..."
cat > scripts/test-azure-openai.js << 'EOF'
import { testAzureConnection } from '../src/lib/azure-openai/client.js'

async function runTest() {
  console.log('🧪 Testing Azure OpenAI connection...')
  
  try {
    const result = await testAzureConnection()
    console.log('✅ Test completed successfully!')
    console.log('Response:', result.choices[0]?.message?.content)
  } catch (error) {
    console.error('❌ Test failed:', error.message)
    process.exit(1)
  }
}

runTest()
EOF

echo "✅ Azure OpenAI setup completed!"
echo ""
echo "📋 Next Steps:"
echo "1. Copy .env.example to .env and fill in your Azure credentials"
echo "2. Run: npm run test:azure"
echo "3. If tests pass, proceed with UI integration"
echo ""
echo "🔗 Useful commands:"
echo "  npm run test:azure  - Test Azure OpenAI connection"
echo "  npm run dev         - Start development server"
echo ""