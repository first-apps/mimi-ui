/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BUILD_ENV: 'development' | 'production';
  readonly VITE_LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error';
  readonly VITE_SHOW_DEV_WARNINGS: 'true' | 'false';
  readonly VITE_DEMO_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
