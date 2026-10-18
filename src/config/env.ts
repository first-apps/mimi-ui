// =============================================================================
// mimi-ui environment config
// =============================================================================
// Single typed accessor over `import.meta.env`. Every build-toggle the
// library cares about goes through here; components must NOT read
// `import.meta.env` directly. Adding a new env value means: (1) add the key
// to ImportMetaEnv in src/vite-env.d.ts, (2) add a default + parser here,
// (3) add the variable to .env.example.
//
// Build-time only: these values are inlined into the published bundle by
// Vite. Library consumers never load these files.
// =============================================================================

type BuildEnv = 'development' | 'production';
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const DEFAULTS = {
  development: {
    VITE_BUILD_ENV: 'development' as BuildEnv,
    VITE_LOG_LEVEL: 'debug' as LogLevel,
    VITE_SHOW_DEV_WARNINGS: 'true',
    VITE_DEMO_URL: 'http://localhost:6006',
  },
  production: {
    VITE_BUILD_ENV: 'production' as BuildEnv,
    VITE_LOG_LEVEL: 'error' as LogLevel,
    VITE_SHOW_DEV_WARNINGS: 'false',
    VITE_DEMO_URL: 'YET_TO_ADD',
  },
} as const;

function coerceBuildEnv(v: string | undefined): BuildEnv {
  return v === 'production' ? 'production' : 'development';
}

function coerceLogLevel(v: string | undefined): LogLevel {
  return v === 'debug' || v === 'info' || v === 'warn' || v === 'error' ? v : 'error';
}

function coerceBool(v: string | undefined): boolean {
  return v === 'true';
}

const mode: BuildEnv = coerceBuildEnv(import.meta.env.MODE);
const defaults = DEFAULTS[mode];

export const env = Object.freeze({
  mode,
  isDev: mode === 'development',
  isProd: mode === 'production',
  buildEnv: coerceBuildEnv(import.meta.env.VITE_BUILD_ENV ?? defaults.VITE_BUILD_ENV),
  logLevel: coerceLogLevel(import.meta.env.VITE_LOG_LEVEL ?? defaults.VITE_LOG_LEVEL),
  showDevWarnings: coerceBool(
    import.meta.env.VITE_SHOW_DEV_WARNINGS ?? defaults.VITE_SHOW_DEV_WARNINGS
  ),
  demoUrl: import.meta.env.VITE_DEMO_URL ?? defaults.VITE_DEMO_URL,
} as const);

export type Env = typeof env;
