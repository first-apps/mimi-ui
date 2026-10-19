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
    <a href="https://www.npmjs.com/package/@first-apps/mimi-ui/" target="_blank">
      <img
        src="https://img.shields.io/npm/v/@first-apps/mimi-ui.svg"
        alt="NPM version"
      />
    </a>&nbsp;
    <a href="https://lit.dev/" target="_blank">
      <img src="https://img.shields.io/badge/Lit-Web%20Components-324FFF" alt="Lit" />
    </a>&nbsp;
    <a href="https://github.com/first-apps/mimi-ui/blob/master/LICENSE" target="_blank">
      <img src="https://img.shields.io/badge/License-MIT-green" alt="MIT License" />
    </a>&nbsp;
    <a href="https://first-apps.github.io/mimi-ui/" target="_blank">
      <img
        src="https://img.shields.io/badge/Explore-Storybook-FF4785"
        alt="Explore Mimi UI Storybook"
      />
    </a>&nbsp;
    <a href="https://github.com/first-apps/mimi-ui/" target="_blank">
      <img
        src="https://img.shields.io/badge/github-first--apps%2Fmimi--ui-blue.svg"
        alt="Github repo"
      />
    </a>
  </p>

</div>

---

## Install

```bash
npm install @first-apps/mimi-ui
```

## Usage

`@first-apps/mimi-ui` exposes typed framework entrypoints. Pick the subpath that
matches your stack — every entrypoint is a regular import, no bundler
plugin needed.

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

---

[MIT licensed](https://github.com/first-apps/mimi-ui/blob/master/LICENSE) © 2026 mimi-ui contributors · [GitHub repo →](https://github.com/first-apps/mimi-ui)
