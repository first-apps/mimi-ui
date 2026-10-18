# Internal Architecture

> Design-system internals for maintainers. Component-level conventions live
> in [COMPONENT_STANDARDS.md](./COMPONENT_STANDARDS.md); the completion
> checklist is in [DEFINITION_OF_DONE.md](./DEFINITION_OF_DONE.md).

---

## Styling

How a primitive design value reaches a rendered component, and how a
consumer rethemes it without touching component source.

```
                     DESIGN SYSTEM: BUILD TIME & RUNTIME

       BUILD TIME                                      RUNTIME
  ────────────────────────                 ──────────────────────────

  ┌───────────────────┐
  │   Primitives      │
  │                   │
  │  _tokens.scss     │
  │  _mixins.scss     │
  │                   │
  │  Source of Truth  │
  └─────────┬─────────┘
            │
            │ @use
            ▼
  ┌───────────────────┐
  │ Component SCSS    │
  │                   │
  │  3-layer alias    │
  │  chain            │
  │                   │
  │  Component styles │
  └─────────┬─────────┘
            │
            │ Vite
            │ ?inline
            ▼
  ┌───────────────────┐
  │ Component TS      │
  │                   │
  │  unsafeCSS()      │
  │       ↓           │
  │  CSSResult        │
  └─────────┬─────────┘
            │
            │ Lit applies styles
            | ___________________________________
                                                |
                                                ▼
                                      ┌──────────────────────┐
                                      │      Shadow DOM      │
                                      │                      │
                                      │  Component styles    │
                                      │                      │
                                      │  Internal aliases    │
                                      │         ↓ maps to    │
                                      │  Public CSS property │
                                      └──────────▲───────────┘
                                                 │
                              CSS custom property│
                                   inheritance   │
                                                 │
                                      ┌──────────┴───────────┐
                                      │      Consumer        │
                                      │                      │
                                      │  Sets --m-* on       │
                                      │  an ancestor         │
                                      │                      │
                                      │  Rethemes at runtime │
                                      │  No source edit      │
                                      │  No rebuild          │
                                      └──────────────────────┘
```

**Build time.** Primitives (`_tokens.scss`, `_mixins.scss`) are the single
source of design values. The component SCSS `@use`s them and declares a
three-layer alias chain on `:host` — an internal alias (`--_alias`) that
resolves through a public custom property (`--m-public`) with a SASS-token
fallback. Vite compiles the SCSS to a CSS string via `?inline`; the
component TS wraps it in `unsafeCSS`; Lit applies the result inside the
shadow root.

**Runtime.** The internal alias resolves at the element, walking
consumer-override → public-property → SASS-token. A consumer retheme is
just setting `--m-public` on any ancestor — CSS custom-property inheritance
carries the value into the shadow root, the alias re-resolves, and every
rule referencing it updates. No source edit, no rebuild.

## Linting

How a source file gets validated against project rules and reformatted to
the project style — in a single pass.

```
                         LINT PIPELINE

  SOURCE                  BIOME                       OUTPUT
 ───────                ─────────                   ─────────

 ┌────────────────┐      ┌─────────────┐        ┌───────────────┐
 │                │      │             │        │               │
 │  src/**/*.ts   │      │  scope per  │        │  exit code    │
 │  .storybook/   │─────▶│  files      │───────▶│  0 / 1        │
 │  *.ts *.json   │      │  .includes  │        │               │
 │                │      │             │        │  --write      │
 │                │      │  preset     │        │  rewrites     │
 │                │      │  rules      │        │  in place     │
 │                │      │             │        │               │
 │                │      │  project    │        │               │
 │                │      │  overrides  │        │               │
 └────────────────┘      └─────────────┘        └───────────────┘
                                  │
                                  │ npm run
                                  ▼
                            ┌──────────────┐
                            │  scripts     │
                            │              │
                            │  lint        │
                            │  lint:fix    │
                            │  format      │
                            │  format:fix  │
                            └──────────────┘
```

**Scope.** Biome walks the tree under the `files.includes` patterns in
`biome.json` — `src/**/*.ts`, `.storybook/**/*.ts`, and root-level
`*.ts` / `*.json`. SCSS, `node_modules`, and build outputs are excluded;
Biome doesn't lint SCSS.

**Pipeline.** Each match is run against the `preset: recommended` rules
plus project-specific overrides (`style`, `suspicious`, `correctness`).
Either Biome reports violations and exits non-zero, or — with `--write`
— applies safe auto-fixes in place and reports anything that couldn't be
fixed safely.

## npm publish

How a working tree becomes a versioned, publicly-installable package on
the npm registry.

```
                    npm publish PIPELINE

  AUTHOR                     REGISTRY                   CONSUMER
 ───────                   ──────────                 ──────────

 ┌──────────────┐
 │ source code  │
 └─────┬────────┘
       │
       │
       │ prepublishOnly
       │
       ▼
 ┌────────────────┐
 │  npm run lint  │
 │     + test     │
 │     + build    │
 └──┬─────────────┘
    │
    │ npm publish
    │      --access public
    ▼
 ┌──────────────────────┐
 │  file to be uploaded │
 │                      │
 │  dist/*.d.ts,        │
 │  README.npm.md       │
 │  LICENSE             │
 └──┬───────────────────┘
    │
    │ Upload
    ──────────────────────────────┐
                                  ▼
                    ┌──────────────────────┐
                    │       npmjs.com      │
                    │                      │ `npm i`  ┌───────────────────────────────────────────────┐
                    │  @first-apps/mimi-ui │───────→  |  import {} from '@first-apps/mimi-ui/react'   |
                    │  readme = README.npm │          |  import {} from '@first-apps/mimi-ui/angular' |
                    └──────────────────────┘          |  import {} from '@first-apps/mimi-ui/vue'     |
                                                      └───────────────────────────────────────────────┘
```

**Author side.** A working tree passes the `prepublishOnly` gate
(lint → test → build). `npm publish --access public` packages the
`files` allowlist (`dist`, `README.npm.md`, `LICENSE`) plus the
auto-included `package.json` into a tarball.

**Registry side.** npm stores the tarball under the scoped name
`@first-apps/mimi-ui`. The `readme` field points at `README.npm.md` —
that's what npmjs.com renders.

**Consumer side.** `npm install @first-apps/mimi-ui` resolves the
`exports` map to the matching ESM or CJS bundle, depending on whether
the consumer uses `import` or `require`. TypeScript picks up the `.d.ts`
files through the `types` condition.

## Build Architecture

How a single TS source produces a framework-agnostic artifact that
consumers can import from any framework that supports Custom Elements.

```
                  MIMI-UI — BUILD ARCHITECTURE
══════════════════════════════════════════════════════════════════════════

  1. SOURCE
  ─────────
  src/
  ├── components/
  │   ├── m-*/
      |     ├── m-*.ts
  │   |     ├── m-*.scss
  |   |     ├── m-*.test.ts
  |   |     ├── m-*.stories.ts
  │   |     └── ...
  |   └── ...
  └── index.ts
            │
            ▼
  2. VALIDATION GATE
  ──────────────────
  ┌───────────────────────────┐
  │ TypeScript Compiler (tsc) │
  │                           │
  │ • Type checking           │
  │ • --noEmit                │
  │ • No JavaScript output    │
  └─────────────┬─────────────┘
                │
          ┌─────┴─────┐
          │           │
       Failure       Pass
          │           │
          ▼           ▼
       STOP       3. BUILD
                  ─────────
                  ┌────────────────────────────┐
                  │ Vite — Library Mode        │
                  │                            │
                  │ Entry: src/index.ts        │
                  │                            │
                  │ Transforms:                │
                  │ • TypeScript → JavaScript  │
                  │ • SCSS → CSS               │
                  │ • Bundles modules          │
                  │                            │
                  │ Output formats:            │
                  │ • ES Modules (ESM)         │
                  │ • CommonJS (CJS)           │
                  │                            │
                  │ External dependencies:     │
                  │ • /^lit/                   │
                  └──────────────┬─────────────┘
                                 │
                   ┌─────────────┴─────────────┐
                   ▼                           ▼

  4A. JAVASCRIPT & CSS                 4B. TYPE DECLARATIONS
  ───────────────────                 ─────────────────────
  ┌─────────────────────┐             ┌──────────────────────┐
  │ Vite output         │             │ unplugin-dts         │
  │                     │             │                      │
  │ • ESM bundle        │             │ • Generates .d.ts    │
  │ • CJS bundle        │             │ • Preserves public   │
  │                     │             │   TypeScript types   │
  └──────────┬──────────┘             └──────────┬───────────┘
             │                                   │
             └─────────────────┬─────────────────┘
                               ▼

  5. DISTRIBUTION ARTIFACTS — dist/
  ─────────────────────────────────
  dist/
  ├── mimi-ui.es.js
  ├── mimi-ui.cjs.js
  ├── style.css* 
  ├── index.d.ts
  └── components/
      ├── m-*/
      |     ├── m-*.d.ts
      └── ...

                  │
                  ▼

  6. PACKAGE & PUBLISH
  ────────────────────
  ┌─────────────────────────────────────┐
  │ package.json                        │
  │                                     │
  │ • main     → CJS entry              │
  │ • module   → ESM entry              │
  │ • types    → declaration entry      │
  │ • exports  → public entry points    │
  │ • peerDependencies → lit            │
  │ • files    → dist/                  │
  └──────────────────┬──────────────────┘
                     │
                     ▼
             ┌──────────────────┐
             │ npm pack         │
             │ npm publish      │
             └────────┬─────────┘
                      │
                      ▼

  7. CONSUMER APPLICATIONS
  ────────────────────────
  Install: mimi-ui + compatible Lit peer dependency

  ┌──────────────────────┬───────────────────────────┬────────────────────────────┐
  │ Plain HTML/JS        │ React 18+                 │ Vue 3.4+                   │
  │                      │                           │                            │
  │ @first-apps/mimi-ui  │ @first-apps/mimi-ui/react | @first-apps/mimi-ui/vue    │
  └──────────────────────┴───────────────────────────┴────────────────────────────┘

  All consumers use the same underlying Web Components.
══════════════════════════════════════════════════════════════════════════
```

**Toolchain.** `tsc` type-checks the source (no emit). Vite library
mode bundles the entry (`src/index.ts`) into ES + CJS, externalising
`lit` so consumers supply it as a peer dependency. `vite-plugin-dts`
(via `unplugin-dts`) emits TypeScript declarations alongside the JS
bundles, preserving the source module structure.

**Output.** `dist/` contains the two JS bundles plus `index.d.ts` and
`components/m-button/m-button.d.ts`. The `package.json` `exports` map
routes `import` and `require` to the right bundle; `types` points at
the declaration entry.

**Consumers.** Because every output is a vanilla Custom Element, the
same `dist/` works in plain HTML, React 18+, Vue 3.4+, Angular 18+ (with
`CUSTOM_ELEMENTS_SCHEMA`), and Svelte 5 — no per-framework build
artifacts. Per-framework wrappers (`@first-apps/mimi-ui/react`, `/vue`,
`/angular`) are tracked in [`INTEGRATION.md`](./INTEGRATION.md) and will
add idiomatic JSX and event-binding DX without changing this build.
