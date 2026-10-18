import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';

  return {
    build: {
      lib: {
        entry: resolve(import.meta.dirname, 'src/index.ts'),
        formats: ['es', 'cjs'],
        fileName: (format) => `mimi-ui.${format}.js`,
      },
      rollupOptions: {
        output: { exports: 'named' },
        external: /^lit/,
      },
      sourcemap: isProd ? 'hidden' : true,
      minify: isProd ? 'esbuild' : false,
      emptyOutDir: true,
    },
    define: {
      __MIMI_BUILD_ENV__: JSON.stringify(mode),
      __MIMI_LOG_LEVEL__: JSON.stringify(isProd ? 'error' : 'debug'),
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
        },
      },
    },
    plugins: [
      dts({
        tsconfigPath: './tsconfig.json',
        include: ['src/**/*.ts'],
        exclude: ['**/*.test.ts', '**/*.stories.ts', '**/__tests__/**'],
        insertTypesEntry: true,
        rollupTypes: false,
      }),
    ],
    test: {
      environment: 'happy-dom',
      globals: true,
      setupFiles: ['./vitest.setup.ts'],
    },
  };
});
