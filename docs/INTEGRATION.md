# Consumer Integration Plan

> How mimi-ui ships to React, Angular, and Vue consumers. The build,
> packaging, and typing groundwork is in place; the framework wrappers are
> what remains. This plan is the roadmap to a publishable, multi-framework
> distribution.

---

## Goals

- **One install, multiple subpath imports.** Consumers `npm install @first-apps/mimi-ui` once and pick the framework entry they need.
- **Idiomatic DX per framework.** Typed JSX props/events for React; declarative templates for Angular; native slots for Vue. Consumers never write `<m-button>` and a manual `customElements.define`.
- **Tree-shakeable.** Consumers ship only the components they import.
- **Zero config for the typical consumer.** Targeted, minimal setup per framework; no bundler plugin required for the default case.

---

## Current state

- Source exports `MButton` from `src/index.ts` (vanilla only). `MCounter` and
  `MClock` were mentioned in earlier revisions of this plan but were never
  built.
- `vite build` runs in library mode and emits ES + CJS to `dist/`
  (5.01 kB ES / 4.71 kB CJS).
- `package.json` is publishable: `main` / `module` / `types` / `exports` /
  `files` / `sideEffects` / `customElements` are all declared. Published as
  `@first-apps/mimi-ui` v1.0.7 via npm Trusted Publishing (OIDC).
- `custom-elements.json` is generated at build time by
  `@custom-elements-manifest/analyzer` and shipped at the package root.
- Type declarations are published (`dist/index.d.ts` plus per-component files).
- Storybook covers a11y + variants in isolation; no cross-framework smoke tests.

**Steps 1-4 below are complete.** Steps 5-7 (React, Angular, Vue wrappers) are
not started. The build already reserves their entry slots and output paths — see
[Distribution shape](#distribution-shape).

---

## Distribution shape

Single npm package, subpath exports:

| Subpath | Contents | Use when | Status |
|---|---|---|---|
| `@first-apps/mimi-ui` | Vanilla LitElement classes | Plain HTML, native web-component projects | **Shipped** |
| `@first-apps/mimi-ui/react` | `createComponent`-based React wrappers | React 18+ | **Shipped** |
| `@first-apps/mimi-ui/angular` | Type declarations (no runtime import) | Angular 18+ | **Shipped** |
| `@first-apps/mimi-ui/vue` | Vue component wrappers | Vue 3.4+ | **Shipped** |
| `@first-apps/mimi-ui/custom-elements.json` | The Custom Elements Manifest | IDE tooling, doc generators, wrapper codegen | **Shipped** |

The consumer's bundler resolves each subpath to its own ESM/CJS/types entry,
declared via the `exports` map in `package.json`.

**A subpath is added to the `exports` map only when its source exists.** Node
resolves `exports` targets strictly — a subpath pointing at a missing file is a
hard `ERR_MODULE_NOT_FOUND`, and a package with an `exports` map blocks all
undeclared deep imports. So the manifest gets an explicit
`"./custom-elements.json"` entry, and the framework subpaths stay undeclared
until their implementation lands.

**Output paths are fixed now.** The build reserves
`dist/react/index.*`, `dist/vue/index.*`, and `dist/angular/index.*` so that
Steps 5-7 never change the published filename contract:

```
dist/
├── mimi-ui.es.js          # vanilla ESM
├── mimi-ui.cjs            # vanilla CJS  (".cjs" — see Build-level changes)
├── index.d.ts             # vanilla types
├── components/m-button/m-button.d.ts
└── react|vue|angular/    # reserved for Steps 5-7
```

---

## Build-level changes to mimi-ui

Steps 1-4 are implemented. This section describes the as-built shape.

### 1. Multi-entry Vite library build

`vite.config.ts` declares an object-form `lib.entry`. The vanilla entry always
exists; the three framework entries activate only when their source file is
present:

```ts
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
```

**Why the conditional.** Vite fails the whole build with `UNRESOLVED_ENTRY` when
an entry module does not exist. A hard-coded entry for a not-yet-written
wrapper would break `npm run build` on every run until Step 5 lands. The
conditional keeps the reservation: the moment `src/react/index.ts` is written,
the entry activates under the reserved name with no further config change.

**The `fileName` callback.** Vite passes the entry **key** through verbatim —
slash included, because Rolldown does not sanitise `/` in object-form input
names. Returning a path with a slash therefore writes a nested directory:

```ts
fileName: (format, entryName) => {
  const base = entryName === 'index' ? 'mimi-ui' : entryName;
  return format === 'es' ? `${base}.es.js` : `${base}.cjs`;
},
```

`index` → `mimi-ui.es.js` / `mimi-ui.cjs`. `react/index` →
`react/index.es.js` / `react/index.cjs`.

**Why the CJS bundle uses `.cjs`, not `.cjs.js`.** The package is
`"type": "module"`, so Node ≥ 22.12 parses any `.js` file as ESM. A `.js` file
containing `require()` and `exports` then resolves to an empty module rather
than the real named exports — a silent failure where `require()` returns `{}`.
The `.cjs` extension is the standard fix.

### 2. Custom Elements Manifest

`@custom-elements-manifest/analyzer` (v0.11.0) runs as a prebuild step
(`npm run analyze`, wired into `npm run build`). Configuration lives in
`custom-elements-manifest.config.mjs`:

```js
export default {
  globs: ['src/components/**/m-*.ts'],
  exclude: ['**/*.test.ts', '**/*.stories.ts'],
  outdir: '.',
  litelement: true,
  packagejson: false,
};
```

- `litelement: true` is mandatory. Without it the analyzer emits no
  `tagName`, no `customElement: true`, and no `attributes[]` / `reflects`
  metadata for `@property` decorators.
- `packagejson: false` stops the analyzer from rewriting `package.json` as a
  side effect of the run.
- The `exclude` list is needed because the analyzer auto-ignores `*.test.ts` and
  `*.d.ts` but **not** `*.stories.ts`.

**Events require an explicit class-level `@fires` tag.** The analyzer's event
visitor only inspects method declarations, so an event dispatched from an
arrow-function property is invisible to it. Each component documents its events
in JSDoc directly above the class:

```ts
/**
 * @fires m-button-click - Fires when the inner `<button>` is activated …
 */
@customElement('m-button')
export class MButton extends LitElement {
```

The tag must be class-level — a `@fires` tag on a member is not read.

**The manifest is a build artifact.** It is generated by `npm run build` and
gitignored, so it cannot drift from the component source. `npm run build` must
run before a manual `npm pack`; the `prepublishOnly` chain guarantees it for
publishes.

### 3. TypeScript declaration generation

`vite-plugin-dts` (v5.1.2) emits per-file `.d.ts` mirroring the source tree
inside the Vite library build. The v5 option is `bundleTypes: false` — the
earlier `rollupTypes` name is a silent no-op.

Because TypeScript 7 dropped the JavaScript Compiler API that the plugin
depends on, `@typescript/typescript6` is installed side-by-side as a
devDependency. Do not remove it.

### 4. `package.json` publishing surface

```jsonc
{
  "main": "./dist/mimi-ui.cjs",
  "module": "./dist/mimi-ui.es.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/mimi-ui.es.js",
      "require": "./dist/mimi-ui.cjs",
      "default": "./dist/mimi-ui.es.js"
    },
    "./custom-elements.json": "./custom-elements.json",
    "./package.json": "./package.json"
  },
  "files": ["dist", "custom-elements.json", "LICENSE"],
  "sideEffects": ["**/*.scss", "**/m-*.ts"],
  "customElements": "./custom-elements.json"
}
```

`types` comes first and `default` last in every condition object — Node
evaluates conditional-export keys in order.

**`sideEffects` is the array form, not bare `false`.** A bare `false` tells
bundlers that no module in the package has side effects, which tree-shakes away
the `@customElement('m-button')` registration call and leaves consumers with an
unupgraded, unstyled tag. The array form marks the SCSS imports and the
component modules as side-effectful.

---

## Per-framework integration recipe

### React

**Wrapper generation: manual, one wrapper per component**, using `@lit/react`'s `createComponent` (v1.0.8). Rationale: at the current surface (1 component) manual wrappers keep types tight, the diff between vanilla and React intentional, and the dependency on a CEM-analyzer → wrapper codegen tool unnecessary. Re-evaluate auto-generation once component count crosses ~10.

Wrapper file pattern (`src/react/m-button.ts`):

```ts
import * as React from 'react';
import { createComponent, type EventName } from '@lit/react';

import { MButton as MButtonElement } from '../components/m-button/m-button';
import type { MButtonClickDetail } from '../index';

export const MButton = createComponent({
  react: React,
  tagName: 'm-button',
  elementClass: MButtonElement,
  events: {
    onMButtonClick: 'm-button-click' as EventName<CustomEvent<MButtonClickDetail>>,
  },
});
```

**Two event props, two independent sources.**

| Prop | Source | Payload |
|---|---|---|
| `onClick` | React's native synthetic-event path (NOT in the `events` map) | React `SyntheticEvent` |
| `onMButtonClick` | `@lit/react` listener bound to the `m-button-click` event | `CustomEvent<MButtonClickDetail>` |

**Why `onClick` is deliberately NOT mapped.** `@lit/react` keys its listener
registry by **event name** in a `WeakMap<Element, Map<eventName, handler>>`.
A second prop mapping to the same event name executes
`handler.handleEvent = listener`, silently **overwriting** the first
handler. Verified against `@lit/react@1.0.8`:

```
setting onClick -> event "m-button-click"
setting onMButtonClick -> event "m-button-click"
listeners registered on node: 1
dispatching m-button-click...
  onMButtonClick fired        ← onClick was SILENTLY DROPPED
```

Mapping `onClick` to `m-button-click` would therefore hand the prop to
`@lit/react` instead of React, and React would never install it — the
consumer's `onClick` would be dead. Leaving it unmapped keeps it an ordinary
React synthetic handler: the component's inner `<button>` click is
`composed`, escapes the shadow root, and the browser retargets it to the
`<m-button>` host, where React's delegated listener finds it.

**The `react` option is required.** `@lit/react@1.x` imports nothing itself
and expects the consumer's React module. The wrapper passes
`import * as React from 'react'`.

**Consumer-side**: zero config. Vite, Next.js, CRA, Remix — all work out of the box once `@lit/react` is on the consumer's dep tree (peer of mimi-ui). The wrapper exposes the element class as a JSX component with typed props, refs, and event handlers.

**Required consumer deps**: `@lit/react` (peer of mimi-ui), `react` ≥ 18, `react-dom` ≥ 18. React 18 and 19 are both supported.

**Ref forwarding.** `ref={useRef<MButton>(null)}` resolves to the `MButton`
element instance.

**Type inference.** `ElementProps<I> = Partial<Omit<I, keyof HTMLElement>>`
— `variant` is typed as the `MButtonVariant` union, and every prop is
optional.

### Angular

Angular's first-class path for custom elements is `CUSTOM_ELEMENTS_SCHEMA`.
mimi-ui ships:

1. `.d.ts` files for every component (props, events, slots).
2. An `angular/index.ts` that re-exports the type declarations.

**Scope decision: no `@angular/elements` runtime, and the subpath is
type-only.** mimi-ui does not ship Angular components. The `angular/index.ts`
module has **no runtime import** of `@angular/core`, so `@angular/core` is a
devDependency (for `tsc`) rather than a peer — the Angular path stays a
zero-install experience.

**The `CUSTOM_ELEMENTS_SCHEMA` helper is a type re-export, not a schema
constant.** Angular's AOT compiler validates the `schemas` array
*structurally, by symbol identity*: `extractSchemas` requires each entry to
be a reference whose `ownedByModuleGuess === '@angular/core'` and whose
identifier is named `CUSTOM_ELEMENTS_SCHEMA` / `NO_ERRORS_SCHEMA`. A wrapper
constant (e.g. `export const MIMI_UI_SCHEMA = [CUSTOM_ELEMENTS_SCHEMA]`)
fails with *"Component.schemas must be an array"*, and a nested array
(`schemas: [[CUSTOM_ELEMENTS_SCHEMA]]`) is a compile error — `schemas` is
not flattened the way `imports` is.

So consumers import the schema from `@angular/core` directly:

```ts
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  /* ... */
})
export class FeatureComponent {}
```

**Angular does not type-check custom elements.** Under
`CUSTOM_ELEMENTS_SCHEMA`, the schema registry accepts *any* dash-containing
tag. Angular never reads the component's `.d.ts`, so a typo like
`<m-buton>` — or a bogus `[notAProp]` binding — compiles silently. The
exported types help your IDE, not the Angular compiler.

**Property vs attribute binding.** `[variant]="x"` goes through
`ɵɵdomProperty` → `el[name] = value`, so it sets the DOM **property** —
which is what Lit reads. A static `variant="x"` takes the attribute path.
There is no boolean trap here: `[disabled]="false"` sets the property to
`false` and Lit removes the attribute.

**Forms: what is and is not true.** `attachInternals()` makes the element
participate in **native** `<form>` submission and `new FormData(form)`.
Angular's `ngModel` / `formControl` are a different mechanism — they
require a `ControlValueAccessor` adapter and throw
`NG_MISSING_VALUE_ACCESSOR` without one. Angular's forms API never reads
`ElementInternals`. A CVA adapter is a runtime Angular artifact and is out
of scope for this subpath.

**No compiler-side support.** Angular's `angularElements` transform and its
`experimental-full` compilation mode are gone in Angular 22, and lit-element
compiler support was never shipped. Template type-checking of `<m-*>` props
is not available.


**Consumer-side setup** (one line per module that uses `<m-*>`):

```ts
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({ schemas: [CUSTOM_ELEMENTS_SCHEMA], /* ... */ })
export class FeatureModule {}
```

**Build plugin (if consumer publishes a library)**: `ng-packagr` with `customElements: 'valid'` so its template schema check accepts `<m-*>` tags. Documented in the consumer's `ng-package.json` snippet, not mimi-ui's.

### Vue

Vue 3.4+ has first-class custom element support, so the *baseline* case needs
no plugin — a consumer can use `<m-button>` directly today.

**Scope decision: the `/vue` subpath ships a real Vue component**, not a
`defineCustomElement` plugin. Vue's `defineCustomElement` wraps a Vue
component *into* a custom element — the inverse of what's needed here. The
wrapper takes camelCase props and exposes a native `@click`, so the README's
Usage block (`<MButton variant="primary" @click="onSave">`) is accurate
rather than aspirational:

```vue
<script setup lang="ts">
import { MButton } from '@first-apps/mimi-ui/vue';
</script>

<template>
  <MButton variant="primary" @click="onSave">Save</MButton>
</template>
```

**How props reach the element.** Vue's `shouldSetAsProp()` (runtime-dom)
decides between property and attribute with `return key in el`. Lit's
`@property` defines accessors on the **prototype**, so for an upgraded
element `'variant' in el` is true and Vue assigns the DOM **property** —
exactly what Lit reads. The wrapper therefore uses camelCase prop keys
matching the Lit property names. Kebab-case keys would fail the `in` check
and fall back to `setAttribute()`.

**The boolean trap, and the guard.** If the element is *not* upgraded when
Vue creates it, `'disabled' in el` is false, Vue takes the attribute path,
and `disabled: false` becomes the attribute `disabled="false"`. Lit's
Boolean converter is `value !== null`, so it reads that as **TRUE** — a
silently broken button. The wrapper's side-effect import of the component
module guarantees `<m-button>` is registered before Vue creates one.

Plain prop keys (not Vue's `.prop` modifier) are used deliberately: `.prop`
forces the property path unconditionally, and on an un-upgraded element that
would create an *own* property shadowing Lit's prototype accessor on
upgrade, so the setter would never run.

**Slots.** The wrapper forwards both the default slot and the named `icon`
slot. The icon content is rendered as a **child vnode** carrying
`slot: 'icon'` — Vue's `normalizeChildren()` flattens a slots object to its
`default` key for ELEMENT vnodes, so passing `{ default, icon }` would
silently drop the icon.

```vue
<MButton variant="primary">
  <template #icon><span aria-hidden="true">★</span></template>
  Add to favorites
</MButton>
```

**Events.** `@click` maps to the native click; `m-button-click` is emitted
as its own event with the typed detail. Both have identical firing
conditions — a disabled or loading button produces neither.

**Consumer-side**: zero config. **TypeScript**: Volar picks up the `.d.ts`
from the subpath's `types` condition automatically.

**`v-model` caveat**: `v-model` works on native `<form>` submission for
form-associated elements, but Vue's `v-model` on a custom element requires
the component to implement Vue's `defineModel` contract. It does not read
`ElementInternals`.


---

## Plugin inventory

| Plugin | Role | Why |
|---|---|---|
| `@custom-elements-manifest/analyzer` (dev) | Generate `custom-elements.json` | Source of truth for types and future auto-generation |
| `vite-plugin-dts` (dev) | Emit `.d.ts` per entry during library build | Consumer-side type safety without `tsc` |
| `@lit/react` (peerDep, Step 5) | `createComponent` for React wrappers | Lit team's official React binding |
| `vue` (peerDep, Step 7) | Runtime for the Vue component wrappers | Vue's own runtime |

**Future candidates** (when component count or consumer needs grow):
- CEM → framework-wrapper auto-generation (eliminate the per-component React wrapper file).
- `@lit/task` for async state inside components.
- `lit-ssr` for server-side rendering of web components.

---

## Modularization strategy (src layout)

```
src/
├── index.ts                    # Vanilla public entry (existing)
├── react/
│   ├── index.ts                # Re-exports all React wrappers
│   └── m-button.ts             # One wrapper per component
├── angular/
│   ├── index.ts                # Type re-exports + CUSTOM_ELEMENTS_SCHEMA helper
│   └── m-button.ts             # Optional: per-component type re-exports
├── vue/
│   ├── index.ts                # Vue component wrappers
│   └── m-button.ts
├── components/                 # Source (unchanged)
│   └── m-<name>/
│       ├── m-<name>.ts
│       ├── m-<name>.scss
│       ├── m-<name>.test.ts
│       └── m-<name>.stories.ts
└── styles/
    ├── _tokens.scss
    └── _mixins.scss
```

Each framework folder maps to one entry in Vite's library build. The current `src/index.ts` continues to be the vanilla entry — framework folders are purely additive. A framework folder activates its build entry the moment its `index.ts` is created; see [Build-level changes](#build-level-changes-to-mimi-ui).

---

## Cross-framework testing

Three layers, increasing in scope:

1. **Component-level** (existing) — Vitest + happy-dom. Covers Lit behavior in isolation: registration, props, events, slots, a11y, form-association lifecycle.
2. **Visual regression** — Chromatic. The existing Storybook is the source of truth; Chromatic diffs per `.storybook` configuration. Catches unintended style changes across components.
3. **Cross-framework smoke** — Playwright. A minimal test app per framework (React, Angular, Vue) renders a few stories and asserts that the custom element upgrades and the framework event hookups work. Run on CI; not a unit test.

The third layer catches regressions like "Lit works but the React wrapper lost the event name" — class of bug that doesn't show up in either Vitest or Chromatic.

---

## Staging

Smallest surface to largest:

1. **Vite library mode + multi-entry build** — vanilla works as a real package. **Done.**
2. **`custom-elements.json` via the analyzer** — unblocks types for steps 3-6. **Done.**
3. **`vite-plugin-dts` + `.d.ts` outputs** — all framework consumers get typed props/events. **Done.**
4. **`package.json` publishing surface** — `exports` map, `files`, `sideEffects`, `customElements` field. **Done.**
5. **React wrappers** — biggest payoff (most React users; biggest DX gap vs raw custom elements). **Done.**
6. **Angular type re-exports** — small surface. **Done.**
7. **Vue component wrapper** — small surface, because Vue already supports custom elements natively. **Done.**
8. **Cross-framework Playwright tests** — once consumers are using the wrappers.

Steps 1-4 are prerequisites for any framework work, and they are complete. Steps 5-7 are parallelizable. Step 8 is a follow-up after at least one framework integration is in production.

**The framework subpaths are not independent.** They share one build, one
`custom-elements.json`, and — critically — one registration of `<m-button>`.
Vite's library mode emits a shared chunk for any module two or more entries
import, so `customElements.define` is evaluated once no matter how many
subpaths a consumer loads. Do not disable code splitting to "clean up" the
output: Rolldown rejects a multi-input build with `inlineDynamicImports`, and
per-entry builds would duplicate the component and throw
`NotSupportedError` at runtime.

---

## Out of scope (for this plan)

- **SSR / hydration.** Add `lit-ssr` when a consumer reports a real SSR need; the current SPA-only assumption is fine for v1.
- **Visual diffing between frameworks.** Same component rendered in React vs Vue should look identical; Chromatic's per-story snapshot covers this implicitly, but no cross-framework diff is set up.
- **Monorepo split.** Today this is a single package. Splitting the React wrappers into `@first-apps/mimi-ui-react` only pays off if consumers want to install React/Angular/Vue independently. Not now.
- **Auto-generated wrappers from CEM.** Manual wrappers are fine at this scale; revisit when count crosses ~10. The class-level `@fires` JSDoc tags added in Step 2 are the prerequisite — without them the manifest carries no `events[]` and codegen emits no event props.
