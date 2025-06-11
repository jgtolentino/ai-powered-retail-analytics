// Direct Azure OpenAI API implementation
const AZURE_ENDPOINT = import.meta.env.VITE_AZURE_ENDPOINT || 'https://eastus.api.cognitive.microsoft.com/'
const AZURE_API_KEY = import.meta.env.VITE_AZURE_OPENAI_API_KEY || '31119320b14e4ff4bccefa768f4adaa8'
const AZURE_DEPLOYMENT = import.meta.env.VITE_AZURE_DEPLOYMENT_NAME || 'gpt-4o-deployment'
const API_VERSION = import.meta.env.VITE_AZURE_API_VERSION || '2024-02-01'

// Helper function to call Azure OpenAI with proper endpoint
export async function callAzureOpenAI(messages: any[]) {
  const endpoint = `${AZURE_ENDPOINT}openai/deployments/${AZURE_DEPLOYMENT}/chat/completions?api-version=${API_VERSION}`;
  
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': AZURE_API_KEY,
    },
    body: JSON.stringify({
      messages,
      max_tokens: 1000,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`Azure OpenAI API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function testAzureConnection() {
  try {
    const result = await callAzureOpenAI([
      {
        role: 'system',
        content: 'You are an AI assistant for retail analytics.',
      },
      {
        role: 'user',
        content: 'Hello! This is a test of the Azure OpenAI connection. Please respond with a brief confirmation.',
      },
    ]);
    
    console.log('✅ Azure OpenAI connection successful');
    console.log('Response:', result.choices?.[0]?.message?.content);
    return result;
  } catch (error) {
    console.error('❌ Azure OpenAI connection failed:', error);
    throw error;
  }
}