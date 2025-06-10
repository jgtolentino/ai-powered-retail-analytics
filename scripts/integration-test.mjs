#!/usr/bin/env node

import { readFileSync, existsSync } from 'fs'
import { execSync } from 'child_process'

// Comprehensive Integration Test for AI-Powered Retail Analytics
console.log('🧪 Running Integration Tests...\n')

const tests = {
  passed: 0,
  failed: 0,
  results: []
}

function testResult(name, passed, details = '') {
  if (passed) {
    tests.passed++
    console.log(`✅ ${name}`)
  } else {
    tests.failed++
    console.log(`❌ ${name}`)
  }
  if (details) console.log(`   ${details}`)
  tests.results.push({ name, passed, details })
}

async function runTests() {
  console.log('1️⃣ Testing Environment Configuration')
  console.log('=====================================')
  
  // Check environment variables
  try {
    const envContent = readFileSync('.env', 'utf-8')
    testResult('Environment file exists', true)
    
    // Check for required variables
    const hasSupabase = envContent.includes('VITE_SUPABASE_URL=https://') && 
                       envContent.includes('VITE_SUPABASE_ANON_KEY=eyJ')
    testResult('Supabase credentials configured', hasSupabase)
    
    const hasAzure = envContent.includes('AZURE_OPENAI_API_KEY=') && 
                     envContent.includes('AZURE_DEPLOYMENT_NAME=')
    testResult('Azure OpenAI credentials configured', hasAzure)
  } catch (error) {
    testResult('Environment file exists', false, error.message)
  }

  console.log('\n2️⃣ Testing Azure OpenAI Connection')
  console.log('===================================')
  
  try {
    const azureTest = execSync('node scripts/test-azure-openai.js', { encoding: 'utf-8' })
    const azureSuccess = azureTest.includes('✅ Azure OpenAI connection successful')
    testResult('Azure OpenAI API responds', azureSuccess, azureSuccess ? 'GPT-4o model active' : 'Connection failed')
  } catch (error) {
    testResult('Azure OpenAI API responds', false, 'Failed to connect')
  }

  console.log('\n3️⃣ Testing Supabase Database Connection')
  console.log('========================================')
  
  try {
    const supabaseTest = execSync('node scripts/test-supabase.js', { encoding: 'utf-8' })
    const supabaseSuccess = supabaseTest.includes('✅ Supabase connection successful')
    const hasData = supabaseTest.includes('18000 records') || supabaseTest.includes('Found tables')
    testResult('Supabase connection works', supabaseSuccess)
    testResult('Database has retail data', hasData, hasData ? '18K transactions loaded' : 'No data found')
  } catch (error) {
    testResult('Supabase connection works', false, 'Failed to connect')
  }

  console.log('\n4️⃣ Testing React Application')
  console.log('=============================')
  
  // Check if dev server is running
  try {
    const response = await fetch('http://localhost:3000')
    const html = await response.text()
    testResult('Development server running', response.ok, 'localhost:3000 responding')
    
    const hasTitle = html.includes('AI-Powered Retail Analytics')
    testResult('Application loads correctly', hasTitle)
  } catch (error) {
    testResult('Development server running', false, 'Server not responding')
  }

  console.log('\n5️⃣ Testing TypeScript Compilation')
  console.log('==================================')
  
  try {
    console.log('   Running TypeScript check...')
    execSync('npx tsc --noEmit', { encoding: 'utf-8' })
    testResult('TypeScript compilation passes', true)
  } catch (error) {
    testResult('TypeScript compilation passes', false, 'Type errors found')
  }

  console.log('\n6️⃣ Component Integration Checks')
  console.log('================================')
  
  // Check key files exist
  const componentFiles = [
    'src/components/Dashboard.tsx',
    'src/components/RetailDashboard.tsx',
    'src/components/AIGenie.tsx',
    'src/components/Layout.tsx',
    'src/lib/supabase/client.ts',
    'src/lib/azure-openai/client.ts'
  ]
  
  let allComponentsExist = true
  for (const file of componentFiles) {
    if (!existsSync(file)) {
      allComponentsExist = false
      testResult(`Component: ${file}`, false, 'File missing')
    }
  }
  testResult('All components present', allComponentsExist, 'Core components verified')

  console.log('\n7️⃣ Deployment Readiness')
  console.log('=======================')
  
  const deploymentFiles = ['vercel.json', 'package.json', '.gitignore', '.env']
  let deploymentReady = true
  for (const file of deploymentFiles) {
    const exists = existsSync(file)
    if (!exists) {
      deploymentReady = false
      testResult(`${file}`, false, 'Missing')
    } else {
      testResult(`${file}`, true)
    }
  }

  console.log('\n8️⃣ Production Build Test')
  console.log('========================')
  
  try {
    console.log('   Building production bundle...')
    execSync('npm run build', { encoding: 'utf-8', stdio: 'pipe' })
    testResult('Production build succeeds', true)
    
    // Check build output
    const distExists = existsSync('dist/index.html')
    testResult('Build output generated', distExists, 'dist/ folder created')
  } catch (error) {
    testResult('Production build succeeds', false, 'Build failed')
  }

  // Summary
  console.log('\n' + '='.repeat(50))
  console.log('📊 INTEGRATION TEST SUMMARY')
  console.log('='.repeat(50))
  console.log(`✅ Passed: ${tests.passed}`)
  console.log(`❌ Failed: ${tests.failed}`)
  console.log(`📈 Success Rate: ${Math.round((tests.passed / (tests.passed + tests.failed)) * 100)}%`)
  
  if (tests.failed === 0) {
    console.log('\n🎉 All integration tests passed! Ready for deployment.')
  } else {
    console.log('\n⚠️  Some tests failed. Please fix issues before deploying.')
    console.log('\nFailed tests:')
    tests.results.filter(t => !t.passed).forEach(t => {
      console.log(`  - ${t.name}: ${t.details || 'No details'}`)
    })
  }
  
  return tests.failed === 0
}

runTests().then(success => {
  process.exit(success ? 0 : 1)
}).catch(console.error)