import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
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
});
