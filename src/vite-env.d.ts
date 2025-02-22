
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ELEVENLABS_API_KEY: string
  readonly VITE_SUPABASE_PROJECT_REF: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
