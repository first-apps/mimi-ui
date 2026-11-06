// =============================================================================
// <m-button> React wrapper — unit tests
// =============================================================================
// Vitest + happy-dom. Covers the wrapper contract that the vanilla
// component tests cannot reach:
//
//   - The wrapper renders a real <m-button> element.
//   - Props land on the element as DOM PROPERTIES, not just attributes.
//   - `onMButtonClick` (MAPPED) fires with the typed CustomEvent detail.
//   - `onClick` (UNMAPPED) fires as a React synthetic event.
//   - Both fire independently — @lit/react keys its listener registry by
//     EVENT NAME, so a second prop mapped to the same event would silently
//     overwrite the first. This test guards that regression.
//   - A ref resolves to the MButton element instance.
//
// `@lit/react` assigns props inside `useLayoutEffect`, so the test must
// flush React's commit before asserting. `act()` does that — and React 19
// requires `IS_REACT_ACT_ENVIRONMENT` to be set for `act` to be supported.
//
// A NOTE ON `onClick` AND THE TEST ENVIRONMENT.
//
// `onClick` is NOT in the wrapper's `events` map, so React handles it as an
// ordinary synthetic event. React's synthetic system reads `nativeEvent.target`
// and walks up the React tree from there. For a click on the inner <button>,
// the browser RETARGETS `event.target` to the shadow host (<m-button>) for
// every listener outside the shadow tree — that is what makes the handler
// fire in a real browser.
//
// happy-dom does NOT implement shadow-DOM event retargeting: the target
// stays the inner <button>, React walks up from there, never reaches the
// <m-button> host, and the handler does not fire. That is a limitation of
// the test environment, not of the wrapper.
//
// The `onClick` test below therefore dispatches a click whose target is
// explicitly the host, reproducing the browser's retargeting. The
// `onMButtonClick` test needs no such treatment — `@lit/react` attaches its
// listener directly to the host element, so it fires in any environment.
// =============================================================================

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, createElement, type ReactElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';

import { MButton } from './m-button';
import type { MButton as MButtonElement, MButtonClickDetail } from '../index';

declare global {
  // eslint-disable-next-line no-var
  var IS_REACT_ACT_ENVIRONMENT: boolean;
}

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  document.body.innerHTML = '';
});

/**
 * Mount a React element, flush React's commit, then wait for Lit's own
 * update cycle so the shadow DOM reflects the props.
 */
async function render(ui: ReactElement): Promise<MButtonElement | null> {
  await act(async () => {
    root.render(ui);
  });
  const el = container.querySelector('m-button') as MButtonElement | null;
  await el?.updateComplete;
  return el;
}

/**
 * Dispatch a click whose `target` is the host element — what a browser does
 * when a click inside a shadow root crosses the boundary (shadow-DOM event
 * retargeting). happy-dom does not retarget on its own.
 */
function dispatchRetargetedClick(el: MButtonElement): void {
  const event = new MouseEvent('click', { bubbles: true, composed: true });
  Object.defineProperty(event, 'target', { value: el, configurable: true });
  el.dispatchEvent(event);
}

/** The inner <button> of a rendered <m-button>. */
function innerButton(el: MButtonElement | null): HTMLButtonElement {
  const button = el?.renderRoot.querySelector('button');
  if (!button) {
    throw new Error('<m-button> did not render an inner <button>');
  }
  return button;
}

describe('m-button React wrapper', () => {
  it('renders an <m-button> element', async () => {
    const el = await render(createElement(MButton, { variant: 'primary' }));
    expect(el).toBeTruthy();
    expect(el?.tagName.toLowerCase()).toBe('m-button');
  });

  it('sets props on the element as DOM PROPERTIES', async () => {
    const el = await render(createElement(MButton, { variant: 'danger', size: 'lg' }));

    // Property, not merely attribute — Lit reads the property.
    expect(el?.variant).toBe('danger');
    expect(el?.size).toBe('lg');
  });

  it('forwards `disabled` as a property (true)', async () => {
    const el = await render(createElement(MButton, { disabled: true }));
    expect(el?.disabled).toBe(true);
  });

  it('forwards `disabled` as a property (false)', async () => {
    const el = await render(createElement(MButton, { disabled: false }));
    expect(el?.disabled).toBe(false);
  });

  it('fires the mapped `onMButtonClick` with the typed detail', async () => {
    const onMButtonClick = vi.fn();
    const el = await render(createElement(MButton, { onMButtonClick }));

    innerButton(el).click();

    expect(onMButtonClick).toHaveBeenCalledTimes(1);
    const event = onMButtonClick.mock.calls[0]?.[0] as CustomEvent<MButtonClickDetail>;
    expect(event.type).toBe('m-button-click');
    expect(event.detail.source).toBe(el);
  });

  it('fires the unmapped `onClick` (React synthetic event)', async () => {
    const onClick = vi.fn();
    const el = await render(createElement(MButton, { onClick }));
    expect(el).toBeTruthy();

    // Simulates the browser's shadow-DOM event retargeting — see the note
    // at the top of this file.
    dispatchRetargetedClick(el!);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('fires BOTH onClick and onMButtonClick independently', async () => {
    // Regression guard: `@lit/react` keys its listener registry by EVENT
    // NAME. If both props were mapped to 'm-button-click', the second
    // mapping would overwrite the first and only one handler would fire.
    const onClick = vi.fn();
    const onMButtonClick = vi.fn();
    const el = await render(createElement(MButton, { onClick, onMButtonClick }));

    innerButton(el).click();
    expect(onMButtonClick).toHaveBeenCalledTimes(1);

    dispatchRetargetedClick(el!);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('resolves a ref to the MButton element instance', async () => {
    let captured: MButtonElement | null = null;
    const el = await render(
      createElement(MButton, {
        ref: (node: MButtonElement | null) => {
          captured = node;
        },
      })
    );

    expect(captured).toBeTruthy();
    expect(captured).toBe(el);
    expect((captured as MButtonElement | null)?.tagName.toLowerCase()).toBe('m-button');
  });

  it('does not fire onMButtonClick when the button is disabled', async () => {
    const onMButtonClick = vi.fn();
    const el = await render(createElement(MButton, { disabled: true, onMButtonClick }));

    const inner = innerButton(el);
    expect(inner.disabled).toBe(true);
    inner.click();

    expect(onMButtonClick).not.toHaveBeenCalled();
  });
});
