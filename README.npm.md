# mimi-ui

Framework-agnostic UI primitives built with [Lit](https://lit.dev) and
native Web Components. Consumes cleanly from React, Angular, Vue, and any
framework that supports custom elements. Zero runtime dependencies beyond
`lit`.

[![npm version](https://img.shields.io/npm/v/@first-apps/mimi-ui.svg)](https://www.npmjs.com/package/@first-apps/mimi-ui)
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/first-apps/mimi-ui/blob/master/LICENSE)
[![GitHub](https://img.shields.io/badge/github-first--apps%2Fmimi--ui-blue.svg)](https://github.com/first-apps/mimi-ui)

## Install

```bash
npm install @first-apps/mimi-ui
```

## Usage

mimi-ui exposes typed framework entrypoints. Pick the subpath that
matches your stack — every entrypoint is a regular import, no bundler
plugin needed.

> Currently shipping: vanilla web-components (`@first-apps/mimi-ui`). For
> today's React/Vue/Angular usage with native custom elements, see
> [Plain usage](https://github.com/first-apps/mimi-ui/blob/master/docs/PLAIN_USAGE.md).

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

### Svelte 5

```svelte
<script lang="ts">
  import { MButton } from '@first-apps/mimi-ui/svelte';

  function onSave() {
    // …
  }
</script>

<MButton variant="primary" onclick={onSave}>Save</MButton>
```

---

[MIT licensed](https://github.com/first-apps/mimi-ui/blob/master/LICENSE) © 2026 mimi-ui contributors · [GitHub repo →](https://github.com/first-apps/mimi-ui)