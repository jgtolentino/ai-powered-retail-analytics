/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly AZURE_OPENAI_API_KEY: string
  readonly AZURE_RESOURCE_NAME: string
  readonly AZURE_DEPLOYMENT_NAME: string
  readonly AZURE_ENDPOINT: string
  readonly AZURE_API_VERSION: string
  readonly VITE_ENABLE_AI_GENIE: string
  readonly VITE_ENABLE_ANIMATIONS: string
  readonly VITE_ENABLE_HEATMAPS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}