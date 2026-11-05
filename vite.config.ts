import { existsSync } from 'node:fs';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

// -----------------------------------------------------------------------------
// Library entry points
// -----------------------------------------------------------------------------
// `index` is the vanilla entry — the only one that ships today.
//
// The three framework entries are RESERVED: the `fileName` callback and the
// directory layout are fixed now so that adding a wrapper in steps 5-7 of
// docs/INTEGRATION.md never changes the published filename contract.
//
// They are included in the build ONLY when their source file exists. Vite
// hard-fails the whole build on an unresolved entry module, so a hard-coded
// entry for a not-yet-written wrapper breaks `npm run build`. Conditional
// inclusion keeps the reservation: the moment `src/react/index.ts` lands, the
// entry activates with the reserved name and needs no further config change.
//
// They are absent from the `exports` map in package.json until their source
// exists — Node's resolver hard-fails on a subpath whose target file is
// missing, so advertising an empty subpath would be worse than not
// advertising it at all.
//
// The `fileName` callback receives the entry KEY verbatim, slash included
// (Rolldown does not sanitise `/` in object-form input names), so returning
// 'react/index.es.js' writes dist/react/index.es.js — nested, not flattened.
// -----------------------------------------------------------------------------
const RESERVED_ENTRIES = {
  'react/index': 'src/react/index.ts',
  'vue/index': 'src/vue/index.ts',
  'angular/index': 'src/angular/index.ts',
} as const;

const entries: Record<string, string> = {
  index: resolve(import.meta.dirname, 'src/index.ts'),
};

for (const [name, relativePath] of Object.entries(RESERVED_ENTRIES)) {
  const absolutePath = resolve(import.meta.dirname, relativePath);
  if (existsSync(absolutePath)) {
    entries[name] = absolutePath;
  }
}

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';

  return {
    build: {
      lib: {
        entry: entries,
        formats: ['es', 'cjs'],
        fileName: (format, entryName) => {
          // 'index'      → mimi-ui.es.js  / mimi-ui.cjs   (stable public names)
          // 'react/index' → react/index.es.js / react/index.cjs
          const base = entryName === 'index' ? 'mimi-ui' : entryName;
          // The CJS bundle MUST use the `.cjs` extension. The package is
          // `"type": "module"`, so Node >= 22.12 parses any `.js` file as
          // ESM — a `.js` file containing `require()`/`exports` resolves to
          // an empty module instead of the real named exports.
          return format === 'es' ? `${base}.es.js` : `${base}.cjs`;
        },
      },
      rollupOptions: {
        // Load-bearing: without `exports: 'named'` the CJS bundle drops its
        // named exports and `require('@first-apps/mimi-ui')` returns `{}`.
        output: { exports: 'named' },
        // Peer dependencies stay external — they are the consumer's to
        // provide, and bundling them would duplicate the framework runtime.
        external: [/^lit/, /^@lit\//, 'react', 'react-dom', 'vue', /^@angular\//],
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
        // `bundleTypes: false` (the vite-plugin-dts v5 name) emits per-file
        // `.d.ts` mirroring the source tree. The v4 name for this option was
        // `rollupTypes` — setting that here was a silent no-op.
        bundleTypes: false,
      }),
    ],
    test: {
      environment: 'happy-dom',
      globals: true,
      setupFiles: ['./vitest.setup.ts'],
    },
  };
});
