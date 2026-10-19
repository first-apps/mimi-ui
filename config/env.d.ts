type BuildEnv = 'development' | 'production';
type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export declare const env: Readonly<{
    readonly mode: BuildEnv;
    readonly isDev: boolean;
    readonly isProd: boolean;
    readonly buildEnv: BuildEnv;
    readonly logLevel: LogLevel;
    readonly showDevWarnings: boolean;
    readonly demoUrl: string;
}>;
export type Env = typeof env;
export {};
