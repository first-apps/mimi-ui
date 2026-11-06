import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

// -----------------------------------------------------------------------------
// Library entry points
// -----------------------------------------------------------------------------
// `index` is the vanilla entry. The three framework entries are RESERVED:
// the `fileName` callback and the directory layout are fixed now so that
// adding a wrapper in steps 5-7 of docs/INTEGRATION.md never changes the
// published filename contract.
//
// They are included in the build ONLY when their source file exists. Vite
// hard-fails the whole build on an unresolved entry module, so a hard-coded
// entry for a not-yet-written wrapper breaks `npm run build`. Conditional
// inclusion keeps the reservation: the moment `src/react/index.ts` lands, the
// entry activates with the reserved name and needs no further config change.
//
// DO NOT disable code splitting. Rolldown's `codeSplitting: false` maps to
// `inlineDynamicImports: true`, which it rejects for multi-input builds
// ("multiple inputs are not supported when output.inlineDynamicImports is
// true"). Splitting is also what keeps `customElements.define` in ONE shared
// chunk: a module imported by two or more entries lands in a common chunk
// that is evaluated once, so the vanilla entry and the framework entries
// cannot double-register <m-button> and throw `NotSupportedError`.
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
    // Resolve the BROWSER build of `@lit/react` in tests.
    //
    // `@lit/react` publishes two builds behind conditional exports:
    //
    //   "browser" → the DOM build. It assigns props to the element inside a
    //                `useLayoutEffect`. This is what every consumer gets.
    //   "node"    → the SSR build. `NODE_MODE` is compiled to `true`, so the
    //                entire `useLayoutEffect` block is DEAD-CODE-ELIMINATED
    //                and props are handed to `@lit/ssr-react` via a
    //                `_$litProps$` bag instead.
    //
    // Vitest's native module runner resolves with a HARDCODED condition set
    // of `['node', 'import']` (vitest/dist/chunks/nativeModuleRunner*.js —
    // `getConditionsSet()` ignores its argument). So the `node` build is
    // always the one that loads, and in a DOM test the element silently
    // keeps its DEFAULT props: `variant="danger"` never arrives, and
    // `disabled` stays false.
    //
    // `ssr.resolve.conditions` does not help — it only feeds Node's
    // `--conditions` CLI flag, which the native module runner ignores for
    // resolution. The alias below is the reliable fix: it points at the
    // browser build explicitly.
    resolve: {
      alias: {
        '@lit/react': fileURLToPath(new URL('./node_modules/@lit/react/index.js', import.meta.url)),
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
