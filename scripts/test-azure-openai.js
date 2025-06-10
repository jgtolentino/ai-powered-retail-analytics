// Test Azure OpenAI Connection
const AZURE_ENDPOINT = 'https://eastus.api.cognitive.microsoft.com/';
const AZURE_API_KEY = '31119320b14e4ff4bccefa768f4adaa8';
const AZURE_DEPLOYMENT = 'gpt-4o-deployment';
const API_VERSION = '2024-02-01';

async function testAzureOpenAI() {
  console.log('🧪 Testing Azure OpenAI connection...');
  console.log('📍 Endpoint:', AZURE_ENDPOINT);
  console.log('🤖 Deployment:', AZURE_DEPLOYMENT);
  
  const endpoint = `${AZURE_ENDPOINT}openai/deployments/${AZURE_DEPLOYMENT}/chat/completions?api-version=${API_VERSION}`;
  
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': AZURE_API_KEY,
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: 'You are an AI assistant for retail analytics in the Philippines.',
          },
          {
            role: 'user',
            content: 'Test connection: Please confirm you are ready to help with retail analytics.',
          },
        ],
        max_tokens: 100,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    
    console.log('\n✅ Azure OpenAI connection successful!');
    console.log('🤖 Model:', result.model);
    console.log('💬 Response:', result.choices[0].message.content);
    console.log('\n🎉 Azure OpenAI is ready for integration!');
    
  } catch (error) {
    console.error('\n❌ Connection failed:', error.message);
    console.error('Please check your API key and endpoint configuration.');
    process.exit(1);
  }
}

testAzureOpenAI();