# Plain usage — using mimi-ui today via native custom elements

> **This is how to consume mimi-ui today**, before the per-framework
> wrapper subpaths land. Every example below works against the current
> `@first-apps/mimi-ui` package — no `react` / `vue` / `angular` subpath
> required, no bundler plugin needed.
>
> For the **target** DX (typed JSX in React, idiomatic `@click` in Vue,
> etc.), see the [README Usage section](../README.md#usage) and the
> [Multi-Framework Integration plan](./INTEGRATION.md).

---

## Why this file exists

`@first-apps/mimi-ui` is built on native Web Components (Custom Elements + Shadow DOM).
That means the published package already works in every framework that
supports Custom Elements — you just have to talk to the elements in the
host framework's native style for a custom element, not in the wrapper-DX
style shown in the README.

The README shows the *target* shape (`<MButton onClick={…} />`,
`@first-apps/mimi-ui/react`). The wrappers that produce that shape are
[Step 5–7 of the integration plan](./INTEGRATION.md). Until those land,
the snippets below are the working defaults.

### What changes without wrappers

| Framework       | Without wrappers                                                                       |
| --------------- | -------------------------------------------------------------------------------------- |
| Plain HTML      | Identical to README.                                                                   |
| React 18+       | Lowercase event names (`onm-button-click`), `<m-button>` not `<MButton>`.              |
| Vue 3.4+        | Native element auto-detected; event listeners use `@m-button-click`.                   |
| Angular 18+     | One-time `CUSTOM_ELEMENTS_SCHEMA` per component.                                       |
| Svelte 5        | Native element works; events use `onm-button-click={…}`.                               |

---

## Plain HTML

```html
<script type="module">
  import '@first-apps/mimi-ui'; // registers <m-button>
</script>

<m-button variant="primary" size="md">Save changes</m-button>
```

This is identical to the README — HTML doesn't need wrappers.

---

## React 18+

Use the elements directly. The included `.d.ts` files make the props
typecheck, but event names are vanilla `onm-button-click` (not `onClick`)
because React only synthesizes DOM events that exist on the element.

```tsx
import '@first-apps/mimi-ui';
import type { MButton } from '@first-apps/mimi-ui';

export function SaveButton() {
  const onClick = (e: CustomEvent<{ source: MButton }>) => {
    // …
  };

  return (
    <m-button
      variant="primary"
      onm-button-click={onClick}
    >
      Save
    </m-button>
  );
}
```

The React console will warn about unknown props (`variant`, `size`) on a
DOM element. To silence that, prefix the prop name with `$` (React 19 only)
or use `Object.assign` after a ref. For most apps the warning is harmless.

For idiomatic JSX (`<MButton onClick={…} />`), wait for the
`@first-apps/mimi-ui/react` entrypoint. See
[Integration plan §5](./INTEGRATION.md).

---

## Vue 3.4+

Vue auto-detects custom elements and uses them as native; no extra config.

```vue
<script setup lang="ts">
import '@first-apps/mimi-ui';

function onSave(e: CustomEvent) {
  // …
}
</script>

<template>
  <m-button variant="primary" @m-button-click="onSave">Save</m-button>
</template>
```

`v-model` does **not** work on a custom element without extra wiring. Vue's
`v-model` needs the component to implement Vue's own `defineModel` contract;
it does not read `ElementInternals`. A form-associated element does
participate in **native** `<form>` submission and `new FormData(form)`, but
that is the browser's mechanism, not Vue's.

For the typed Vue component, use
[`@first-apps/mimi-ui/vue`](./INTEGRATION.md#vue) instead — it accepts
camelCase props and exposes a native `@click`.

---

## Angular 18+

Standalone components need `CUSTOM_ELEMENTS_SCHEMA` added once per
component template that uses mimi-ui. NgModule-based apps add it to the
module.

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import '@first-apps/mimi-ui';

@Component({
  selector: 'app-save',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <m-button variant="primary" (m-button-click)="onSave()">Save</m-button>
  `,
})
export class SaveComponent {
  onSave() {
    // …
  }
}
```

For module-based apps:

```ts
@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  // …
})
class AppModule {}
```

**Import the schema from `@angular/core`, not from a mimi-ui helper.**
Angular's AOT compiler validates `schemas` structurally, by symbol identity —
a wrapper array constant breaks the build.

**Angular does not type-check custom elements.** Under
`CUSTOM_ELEMENTS_SCHEMA` any dash-containing tag is accepted, so `<m-buton>`
and `[notAProp]` compile silently. The `.d.ts` files help your editor, not
the compiler.

**`ngModel` / `formControl` need a `ControlValueAccessor`.** Angular's forms
API never reads `ElementInternals`. A form-associated element participates in
**native** `<form>` submission and `new FormData(form)`, but binding it to an
Angular form control requires an adapter directive that this library does not
ship.

**Property binding works.** `[variant]="x"` sets the DOM property (which is
what Lit reads); a static `variant="x"` sets the attribute.

---

## Svelte 5

Custom elements work natively in Svelte 5; events use the lowercase
custom-event form.

```svelte
<script lang="ts">
  import '@first-apps/mimi-ui';

  function onSave(e: CustomEvent) {
    // …
  }
</script>

<m-button variant="primary" onm-button-click={onSave}>Save</m-button>
```

In Svelte 4 the syntax is `on:m-button-click={onSave}` instead.

---

## Event payload

The `m-button-click` event carries a typed `detail` object:

```ts
interface MButtonClickDetail {
  source: MButton;        // The originating <m-button> instance
  originalEvent: Event;   // The native MouseEvent (for coords, etc.)
}
```

Listen like this in any framework:

```js
button.addEventListener('m-button-click', (e) => {
  // e.detail.source   → MButton
  // e.detail.originalEvent → MouseEvent
});
```

---

## What comes next

The framework subpaths now ship, per
[`INTEGRATION.md`](./INTEGRATION.md):

1. `@first-apps/mimi-ui/react` — React 18+ / 19, via `@lit/react`'s `createComponent`
2. `@first-apps/mimi-ui/vue` — Vue 3.4+, a real Vue component with camelCase props
3. `@first-apps/mimi-ui/angular` — Angular 18+, type declarations only (no runtime import)

The snippets on this page remain the supported way to use the raw custom
elements. They are not a fallback — they're the same Web Components the
wrappers sit on top of. Prefer the wrapper subpath when you want typed props
and framework-idiomatic event handlers.