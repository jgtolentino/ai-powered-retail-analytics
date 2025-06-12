#!/bin/bash

# Vercel Environment Variables Setup Script
# Run this script to set up all required environment variables

echo "🔧 Setting up Vercel Environment Variables..."
echo "This script will prompt you for each environment variable."
echo ""

echo "📋 You'll need to provide:"
echo "  - VITE_SUPABASE_URL (e.g., https://your-project.supabase.co)"
echo "  - VITE_SUPABASE_ANON_KEY (your Supabase anon key)"
echo "  - VITE_AZURE_OPENAI_API_KEY (your Azure OpenAI API key)"
echo "  - VITE_AZURE_ENDPOINT (e.g., https://your-resource.openai.azure.com/)"
echo "  - VITE_AZURE_DEPLOYMENT_NAME (e.g., gpt-4o-deployment)"
echo ""

# Function to add environment variable
add_env_var() {
    local var_name=$1
    local description=$2
    
    echo "🔑 Adding $var_name ($description)..."
    vercel env add $var_name production
    echo ""
}

# Add each environment variable
add_env_var "VITE_SUPABASE_URL" "Supabase project URL"
add_env_var "VITE_SUPABASE_ANON_KEY" "Supabase anonymous key"
add_env_var "VITE_AZURE_OPENAI_API_KEY" "Azure OpenAI API key"
add_env_var "VITE_AZURE_ENDPOINT" "Azure OpenAI endpoint URL"
add_env_var "VITE_AZURE_DEPLOYMENT_NAME" "Azure OpenAI deployment name"

echo "✅ All environment variables have been configured!"
echo ""
echo "🚀 To redeploy with new environment variables:"
echo "   vercel --prod --yes"
echo ""
echo "🔍 To list all environment variables:"
echo "   vercel env ls"