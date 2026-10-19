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
 ┌──────────────────────────────────┐
 │  scripts/sync-readme.mjs         │
 │    README.npm.md → README.md     │
 │  ──────────────────────────────  │
 │  npm run lint                    │
 │  + test                          │
 │  + build                         │
 └──┬───────────────────────────────┘
    │
    │ npm publish
    │      --access public
    ▼
 ┌──────────────────────┐
 │  file to be uploaded │
 │                      │
 │  dist/*.d.ts,        │
 │  README.md (==       │
 │    README.npm.md at  │
 │    publish time),    │
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
                    │  readme = README.md  │          |  import {} from '@first-apps/mimi-ui/angular' |
                    │  (= README.npm.md    │          |  import {} from '@first-apps/mimi-ui/vue'     |
                    │   at publish)        │          └───────────────────────────────────────────────┘
                    └──────────────────────┘
```

**Author side.** A working tree passes the `prepublishOnly` gate
(`node scripts/sync-readme.mjs` → lint → test → build). The sync step
overwrites the local `README.md` with `README.npm.md`'s content so the
tarball npm assembles carries the consumer-facing README. The
modification is transient — neither local `npm publish` nor CI
publish commits it back to the repo. After the publish, the maintainer
restores `README.md` from git (`git checkout -- README.md`) as the
GitHub-facing orientation doc. `npm publish --access public` packages
the `files` allowlist (`dist`, `LICENSE`) plus the auto-included
`package.json` into a tarball; `README.md` is included by npm's default
behaviour and matches `README.npm.md` at the moment of upload.

**Registry side.** npm stores the tarball under the scoped name
`@first-apps/mimi-ui`. The published `README.md` is the tarball's
README — i.e. `README.npm.md`'s content at publish time, never the
GitHub-facing orientation copy. The `package.json#readme` field is
left in place pointing at `README.npm.md` for tooling that does
honour it, but it is non-load-bearing (per the AGENTS.md
2026-10-19 entry — do not "fix" the field).

**Consumer side.** `npm install @first-apps/mimi-ui` resolves the
`exports` map to the matching ESM or CJS bundle, depending on whether
the consumer uses `import` or `require`. TypeScript picks up the `.d.ts`
files through the `types` condition.

**CI side.** On a push to `master`, the master job of
`.github/workflows/ci.yml` runs lint → format → test → `npm publish` →
`npm run build:storybook` → `peaceiris/actions-gh-pages@v4`. The
`npm publish` step's `prepublishOnly` performs the same swap
automatically; no human action is required. `NPM_TOKEN` (granular or
classic token) is the publish credential, exported as
`NODE_AUTH_TOKEN`; OIDC Trusted Publishing is deferred until the
project moves to Node ≥ 22.14. The storybook step pushes
`storybook-static/` to the `storybook` branch via
`peaceiris/actions-gh-pages@v4` using the v4 input
`publish_branch: storybook` (not the v3 `destination_branch`).

## Storybook deploy

How `master` reaches the public Storybook at
`https://first-apps.github.io/mimi-ui/`.

```
                       STORYBOOK DEPLOY PIPELINE

  AUTHOR                       CI (GitHub Actions)                  GITHUB PAGES
  ──────                       ───────────────────                  ────────────
                                                                 ┌────────────────────┐
  ┌────────────────┐   push     ┌───────────────────────────┐    │  Settings → Pages  │
  │  src/ + .story │ ─────────▶ │  workflow: ci.yml         │    │  Source: storybook │
  │  book/main.ts  │            │  (job: pipeline, master   │    │  Branch: /(root)   │
  │                │  workflow  │   -only steps)            │    └─────────┬──────────┘
  │                │  _dispatch │  checkout                 │              │
  │                │ ─────────▶ │  setup-node (Node 20)     │              │
  └────────────────┘            │  npm ci                   │              │
                                │  npm run lint             │              │
                                │  npm run format           │              │
                                │  npm run test             │              │
                                │  npm publish              │              │
                                │  npm run build:storybook  │              │
                                │                           │              │
                                │  peaceiris/               │              │
                                │    actions-gh-pages@v4    │              │
                                │    (push ./storybook-     │              │
                                │    static → storybook)    │              │
                                └────────────┬──────────────┘              │
                                             │                             │
                                             ▼                             ▼
                                    ┌─────────────────┐         ┌──────────────────────┐
                                    │  storybook      │         │  first-apps.github.io│
                                    │  branch         │ ──────▶ │  /mimi-ui/           │
                                    └─────────────────┘         └──────────────────────┘
```

**Author side.** A push to `master` (or a manual `workflow_dispatch`)
fires `.github/workflows/ci.yml`. The job's master-only tail handles
`npm publish` (with the automated README swap via `prepublishOnly`),
then `npm run build:storybook`, then the Storybook deploy. The
pre-PR gate (lint → format → test) runs on every PR and on every
push to any branch. `contents: write` is the only elevated scope; the
runner uses `GITHUB_TOKEN` for the storybook branch push and the
`NPM_TOKEN` secret for `npm publish`.

**CI side.** The storybook-only steps (`npm run build:storybook` then
`peaceiris/actions-gh-pages@v4`) are gated on
`github.event_name == 'push' && github.ref == 'refs/heads/master'`, so
PR runs and `workflow_dispatch` on non-master branches skip them.
Storybook failures do not roll back a successful npm publish.

**Pages side.** GitHub Pages serves `storybook` / `(root)` over HTTPS.
The repo admin sets this once under Settings → Pages; the workflow
itself doesn't touch Pages settings. If Pages is not yet enabled, the
push to `storybook` still succeeds but the public URL 404s until the
admin step is done.

**Consumer side.** A consumer opening
`https://first-apps.github.io/mimi-ui/` sees the Storybook shell and
all stories for `m-button` (Variants · primary / secondary / danger,
Sizes · sm / md / lg, States · disabled / loading, Slots · default /
icon / both, Form · submit, Theming · custom palette, Event ·
m-button-click) as they exist at the latest green build of `master`.

**Drift note.** The storybook deploy is now a master-only step inside
the combined `ci.yml` workflow; there is no longer a standalone
`.github/workflows/deploy-storybook.yml`. The `peaceiris` recipe and
the v4-specific `publish_branch: storybook` input (not the v3
`destination_branch`) are unchanged.

## Project Build Architecture

How a single TS source produces a framework-agnostic artifact that
consumers can import from any framework that supports Custom Elements.

```
               MIMI-UI — PROJECT BUILD ARCHITECTURE
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

## CI/CD pipeline

The single GitHub Actions workflow that gates every PR and ships every
master push to the npm registry and GitHub Pages.

```
                            CI/CD PIPELINE
              ═════════════════════════════════════════

  TRIGGERS                    PIPELINE                       OUTPUTS
  ────────                    ─────────                       ───────

  ┌──────────────────┐    ┌──────────────────────┐     ┌─────────────────┐
  │                  │    │                      │     │                 │
  │  pull_request    │    │  ubuntu-latest       │     │  PR: red/green  │
  │  push → master   │───▶│  Node 24, 15 min     │     │                 │
  │  workflow_       │    │  job: pipeline       │     │  Master push:   │
  │    dispatch      │    │                      │     │   npm publish   │
  │                  │    │  1. npm ci           │     │   (OIDC)        │
  └──────────────────┘    │  2. lint             │     │                 │
                          │  3. format           │     │   storybook     │
                          │  4. test             │ ───▶│   branch        │
                          │                      │     │   → GitHub      │
                          │  ── if master push ──│     │      Pages      │
                          │                      │     │                 │
                          │  5. npm publish      │     │                 │
                          │  6. build:storybook  │     │                 │
                          │  7. push storybook-  │     │                 │
                          │     static → branch  │     │                 │
                          │     (gh-pages@v4)    │     │                 │
                          └──────────────────────┘     └─────────────────┘
```

**Triggers.** `pull_request`, `push` to `master`, and
`workflow_dispatch` (manual). Every PR runs the cheap gate; only
master pushes (and manual master runs) ship.

**Steps.** A single job (`pipeline`) on `ubuntu-latest`, Node 24, 15
min timeout. Every run executes `npm ci` → `lint` → `format` → `test`.
Master pushes add the tail: `npm publish` (via OIDC Trusted
Publishing) → `build:storybook` → push `storybook-static/` to the
`storybook` branch via `peaceiris/actions-gh-pages@v4`. The master
tail is gated on `github.event_name == 'push' && github.ref ==
'refs/heads/master'`; PR runs and non-master dispatches skip it.

**Credentials & concurrency.** `contents: write` for the storybook
push, `id-token: write` for npm Trusted Publishing (no `NPM_TOKEN`
secret — the runner exchanges the OIDC token for an npm auth token at
publish time). PR runs share a concurrency group keyed by
`ci-${{ github.ref }}` and can be cancelled when superseded; master
pushes are **never** cancelled — a half-finished `npm publish` cannot
be rolled back at the registry. The job runs in the `production`
GitHub Deployment environment so any reviewer rules or
environment-scoped secrets apply automatically.
