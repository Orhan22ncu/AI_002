/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_KEY: string
  readonly VITE_API_SECRET: string
  readonly VITE_SYMBOL: string
  readonly VITE_INTERVAL: string
  readonly VITE_LEVERAGE: string
  readonly VITE_STOP_LOSS: string
  readonly VITE_TAKE_PROFIT: string
  readonly VITE_DEV_TRAINING_DAYS: string
  readonly VITE_PROD_TRAINING_DAYS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}