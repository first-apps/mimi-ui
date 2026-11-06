// =============================================================================
// <m-button> — React wrapper
// =============================================================================
// Wraps the Lit `<m-button>` element as a React component using
// `@lit/react`'s `createComponent`.
//
// Two event props, two INDEPENDENT sources:
//
//   onClick        — NOT in the `events` map. It stays a normal React
//                    synthetic-event handler, because the component's inner
//                    <button> click is `composed`, escapes the shadow root,
//                    and reaches React's delegated listener at the root.
//                    Payload: React SyntheticEvent.
//
//   onMButtonClick — mapped to the component's own `m-button-click` event.
//                    Payload: CustomEvent<MButtonClickDetail>.
//
// WHY `onClick` IS NOT MAPPED. `@lit/react` keys its listener registry by
// EVENT NAME (`WeakMap<Element, Map<eventName, handler>>`). Mapping two
// props to the same event name executes `handler.handleEvent = listener`,
// silently OVERWRITING the first handler — only one of them would ever
// fire. So exactly one prop is mapped.
//
// The `react` option is required by `@lit/react@1.x` — the package imports
// nothing itself and expects the consumer's React module.
// =============================================================================

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
