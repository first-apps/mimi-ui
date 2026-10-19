<div align="center">

  <img
    src="https://raw.githubusercontent.com/first-apps/mimi-ui/refs/heads/assets/images/mimi-ui-banner.png"
    alt="mimi-ui banner"
    width="100%"
  />

  <h3>Mimi UI</h3>

  <p>Reusable web components across any JavaScript framework.</p>

  <p>
    A lightweight, customizable, and accessible component library
    powered by <a href="https://lit.dev">Lit</a>.
  </p>

  <p>
    <a href="https://lit.dev/" target="_blank">
      <img src="https://img.shields.io/badge/Lit-Web%20Components-324FFF?style=flat-square" alt="Lit" />
    </a>&nbsp;
    <a href="https://github.com/first-apps/mimi-ui/blob/master/LICENSE" target="_blank">
      <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="MIT License" />
    </a>&nbsp;
    <a href="https://first-apps.github.io/mimi-ui/" target="_blank">
      <img
        src="https://img.shields.io/badge/Explore-Storybook-FF4785?style=flat-square"
        alt="Explore Mimi UI Storybook"
      />
    </a>

  </p>

</div>

## Documentation

Five documents in `docs/`:

- **[Component standards](./docs/COMPONENT_STANDARDS.md)** — engineering fundamentals: reactive state, form-association internals, theming, a11y, events, performance, testing, Storybook.
- **[Definition of done](./docs/DEFINITION_OF_DONE.md)** — the checklist that gates "this component is ready to ship."
- **[Internal architecture](./docs/INTERNAL_ARCHITECTURE.md)** — design-system internals for maintainers (styling flow, etc.).
- **[Multi-Framework Integration plan](./docs/INTEGRATION.md)** — how mimi-ui ships to React, Angular, and Vue consumers.
- **[Plain usage](./docs/PLAIN_USAGE.md)** — how to use mimi-ui today via native custom elements (no wrappers required).

The rest of this README is project-level orientation: structure, scripts, setup, architectural overview, scope.

---

## Usage

`@first-apps/mimi-ui` exposes typed framework entrypoints. Pick the subpath that matches
your stack — every entrypoint is a regular import, no bundler plugin needed.

### Detailed Usage Examples
<div align="left">
  <p align="left">
    <a href="https://first-apps.github.io/mimi-ui/" target="_blank">
      <img
        src="https://img.shields.io/badge/Explore-Storybook-FF4785?style=for-the-badge"
        alt="Explore Mimi UI Storybook"
      />
    </a>
  </p>
</div>

> Currently shipping: vanilla web-components (`@first-apps/mimi-ui`). For
> today's React/Vue/Angular usage with native custom elements, see
> [Plain usage](./docs/PLAIN_USAGE.md).

### Plain HTML

```html
<script type="module">
  import '@first-apps/mimi-ui'; // registers <m-button>
</script>

<m-button variant="primary" size="md">Save changes</m-button>
```

### React 18+

```tsx
import { MButton } from '@first-apps/mimi-ui/react';

export function SaveButton() {
  const onClick = () => {
    // …
  };

  return (
    <MButton variant="primary" onClick={onClick}>
      Save
    </MButton>
  );
}
```

### Vue 3.4+

```vue
<script setup lang="ts">
import { MButton } from '@first-apps/mimi-ui/vue';

function onSave() {
  // …
}
</script>

<template>
  <MButton variant="primary" @click="onSave">Save</MButton>
</template>
```

### Angular 18+

```ts
import { Component } from '@angular/core';
import { MButton } from '@first-apps/mimi-ui/angular';

@Component({
  selector: 'app-save',
  standalone: true,
  template: `<m-button variant="primary" (click)="onSave()">Save</m-button>`,
})
export class SaveComponent {
  onSave() {
    // …
  }
}
```

---

## Project structure

```
mimi-ui/
├── .env.development             # Dev defaults baked into the dev bundle (committed)
├── .env.production              # Prod defaults baked into the prod bundle (committed)
├── .env.example                 # Template — copy to .env.local to override
├── .storybook/
│   └── main.ts                  # Storybook config (web-components-vite, a11y + docs addons)
├── AGENTS.md                    # Project memory for AI agents
├── biome.json                   # Lint/format config (Biome 2)
├── docs/
│   ├── COMPONENT_STANDARDS.md   # Engineering fundamentals — the *why*
│   ├── DEFINITION_OF_DONE.md    # Component-completion checklist — the gate
│   ├── INTERNAL_ARCHITECTURE.md # Design-system internals for maintainers
│   ├── INTEGRATION.md           # Cross-framework distribution roadmap
│   └── PLAIN_USAGE.md           # Today's working code (native custom elements)
├── LICENSE                      # MIT
├── README.md                    # GitHub-rendered repo orientation (this file)
├── README.npm.md                # npm-rendered readme (set via package.json `readme`)
├── package.json
├── src/
│   ├── components/
│   │   └── m-button/              # Production template: SASS, theming,
│   │       │                       #   form-association, slots, a11y
│   │       ├── m-button.ts
│   │       ├── m-button.scss
│   │       ├── m-button.test.ts
│   │       └── m-button.stories.ts
│   ├── config/
│   │   ├── env.ts                 # Single env accessor (only place components read env)
│   │   └── index.ts               # Re-exports
│   ├── styles/
│   │   ├── _tokens.scss           # Design tokens (color, space, radius, motion)
│   │   └── _mixins.scss           # Reusable SASS mixins
│   ├── index.ts                   # Public package entry — re-exports all components
│   └── vite-env.d.ts              # ImportMetaEnv augmentation
├── tsconfig.json
├── vite.config.ts
└── vitest.setup.ts
```

**Component folder is portable.** Each `m-<name>/` folder is self-contained: logic, styles, tests, and stories live together. Tokens and mixins are global; components `@use` them by path. See
[Section 1 File structure](./docs/COMPONENT_STANDARDS.md#1-file-structure) and
[Section 5 Theming](./docs/COMPONENT_STANDARDS.md#5-theming-public-internal-scss-fallback) for the conventions.

---

## Architecture

### Component model

Every component is a single class extending `LitElement` registered with `@customElement('m-…')`. Three primitives define the contract:

| Layer | Mechanism | Purpose |
|---|---|---|
| **Inputs** | `@property` decorated fields | Reactive public API; reflected to HTML attributes where the standard requires (see [Section 4 Variants](./docs/COMPONENT_STANDARDS.md#4-variants-on-the-host-not-inner-classes)) |
| **Outputs** | `CustomEvent` with `composed: true, bubbles: true` | Cross Shadow DOM boundaries; consumable from any framework (see [Section 7 Events](./docs/COMPONENT_STANDARDS.md#7-events)) |
| **Composition** | Named + default slots | Light-DOM children projected into the Shadow DOM |

### Cross-framework consumption

- **React 18+**: works directly. For idiomatic JSX with typed props and synthetic events, wrap each component using `@lit/react`'s `createComponent`.
- **Angular 18+**: declare `CUSTOM_ELEMENTS_SCHEMA` in the consuming module, or register via `@angular/elements`. Form-association hooks into `NgModel` automatically.
- **Vue 3.4+**: works without config. v-model on form-associated elements is built-in.

The `composed: true` flag on every dispatched event is what makes this work — it lets the event cross the Shadow DOM boundary so framework event systems can hear it.

---

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Storybook dev server with HMR on port `6006`. Runs `build:storybook` first, then `storybook dev -p 6006`. |
| `npm run build` | Type-check (`tsc`) + production bundle to `dist/` as ES + CJS. |
| `npm run build:dev` | Type-check + dev bundle to `dist-dev/`. Unminified, full sourcemaps. |
| `npm run build:prod` | Alias for `build`. Use when you want the script name to read "prod" instead of "build". |
| `npm run preview` | Builds Storybook static and serves it on `http://localhost:6007` for review. |
| `npm run test` | Run the full Vitest suite once. |
| `npm run test:watch` | Re-run tests on file change. Use during development. |
| `npm run build:storybook` | Static Storybook build. Output: `storybook-static/`. Pushed to GitHub Pages via `.github/workflows/deploy-storybook.yml` on every push to `master`. |
| `npm run lint` | Check for lint errors (Biome). |
| `npm run lint:fix` | Fix lint errors (Biome). |
| `npm run format` | Check for code formatting errors (Biome). |
| `npm run format:fix` | Fix code formatting errors (Biome). |
| `npm run clean` | Remove `dist/`, `dist-dev/`, `storybook-static/`. |

---

## Local setup

**Prerequisites**

- Node.js ≥ 20

**From scratch**

```bash
git clone <repo-url> mimi-ui
cd mimi-ui
npm install
```

**Run the dev server**

```bash
npm run dev
```

Open the printed URL. Edit any component under `src/components/` — Vite hot-reloads.

**Run tests**

```bash
npm run test          # one-shot
npm run test:watch    # watch mode
```

**Run Storybook**

```bash
npm run dev
```

Open `http://localhost:6006`. The a11y tab in each story's panel runs axe-core against the rendered component and surfaces violations.

The published Storybook lives at **https://first-apps.github.io/mimi-ui/**.
It rebuilds on every push to `master` via
`.github/workflows/deploy-storybook.yml`; see `docs/INTERNAL_ARCHITECTURE.md`
§"Storybook deploy" for the flow.

**Build for production**

```bash
npm run build         # emits dist/mimi-ui.es.js + dist/mimi-ui.cjs.js
```

The bundle is tree-shakeable — consumers only ship the components they import.

---

## Environments

This package is built in two environments. Both are **author-side** — the
files described here are bundled into the published library at build time
and never reach consumers at runtime.

| Environment | Purpose | Output | Minified | Sourcemaps |
|---|---|---|---|---|
| `dev` | Smoke-test the package output locally | `dist-dev/` | no | full |
| `prod` | Publish to npm (default for `npm run build`) | `dist/` | yes | hidden |

### Files

- `.env.development` — defaults baked into the dev bundle (committed).
- `.env.production` — defaults baked into the prod bundle (committed).
- `.env.example` — template. Copy to `.env.local` to override for your machine.
- `.env.local` / `.env.*.local` — personal overrides; ignored by git.
- `src/config/env.ts` — the only place components read env values. Imports
  the typed `import.meta.env` augmentation from `src/vite-env.d.ts`.

### Goto Commands

```bash
npm run dev          # Storybook dev server with HMR on port 6006
npm run build        # prod build → dist/
npm run build:dev    # dev build → dist-dev/  (unminified, full sourcemaps)
npm run preview      # Storybook static + serve on http://localhost:6007
npm run clean        # remove dist/, dist-dev/, storybook-static/
```

`prepublishOnly` runs `lint && test && build` (the prod build), so a
mistaken `npm publish` while in `dev` mode is gated correctly.

### Switching environments

Override any value for a single command without editing files:

```bash
VITE_BUILD_ENV=production VITE_SHOW_DEV_WARNINGS=false npm run build:dev
```

Vite also reads mode from the `--mode` flag, which the scripts above set
explicitly — the value in `.env.<mode>` is the default, not the
authoritative source. To change defaults, edit the `.env.<mode>` file
or add a personal `.env.local`.

### Library-consumer note

Consumers of `@first-apps/mimi-ui` do **not** ship these env files.
Whatever value these files hold at our `npm run build` time is frozen
into the bundle they import. If you ever need per-app configuration,
expose a component `prop` instead of reaching for a `VITE_*` variable.

---

## Adding a new component

The fastest path: open **[DEFINITION_OF_DONE.md](./docs/DEFINITION_OF_DONE.md)** and run the checklist. Every box needs to be checked before merging. For the "why" behind each item, see **[COMPONENT_STANDARDS.md](./docs/COMPONENT_STANDARDS.md)**.

Use `m-button` as the working template — it implements every convention in the checklist and the standards doc.

---

## What's intentionally not here

- **No CSS-in-JS.** SASS + CSS custom properties handle theming with zero runtime cost.
- **No state management.** Components are stateless inputs → events. Consumers own state.
- **No build-time framework wrappers yet.** The path is documented in [Multi-Framework Integration plan](./docs/INTEGRATION.md): multi-entry Vite library build + `@lit/react` for React + Angular type augmentation + Vue `defineCustomElement`. Track progress there.
- **No monorepo.** Single package until a second consumer (React app, Angular app, Vue app) lives in the same repo. Split then with npm workspaces.
