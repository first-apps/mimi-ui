// =============================================================================
// <m-button> Vue wrapper — unit tests
// =============================================================================
// Vitest + happy-dom. Covers the wrapper contract that the vanilla component
// tests cannot reach:
//
//   - The wrapper renders <m-button> and sets props as DOM PROPERTIES.
//   - `disabled: false` leaves the element's property false. This is the
//     BOOLEAN TRAP regression test: if <m-button> were not registered before
//     Vue created the element, Vue would take the attribute path, write
//     `disabled="false"`, and Lit's Boolean converter (`value !== null`)
//     would read it as TRUE — a silently broken button.
//   - `@click` emits.
//   - The `m-button-click` event emits with the typed detail.
//   - The named `icon` slot is rendered as a light-DOM child carrying
//     `slot="icon"`, so the component's <slot name="icon"> receives it.
// =============================================================================

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createApp, h, type App } from 'vue';

import { MButton } from './m-button';
import type { MButton as MButtonElement, MButtonClickDetail } from '../index';

let container: HTMLDivElement;
let app: App<Element> | undefined;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  app?.unmount();
  app = undefined;
  document.body.innerHTML = '';
});

/** Mount a Vue component and wait for both Vue and Lit to settle. */
async function render(props: Record<string, unknown> = {}) {
  app = createApp({
    render: () => h(MButton as never, props),
  });
  app.mount(container);

  const el = container.querySelector('m-button') as MButtonElement | null;
  await el?.updateComplete;
  // Let Vue's next tick flush any reactive updates.
  await Promise.resolve();
  return el;
}

/** The inner <button> of a rendered <m-button>. */
function innerButton(el: MButtonElement | null): HTMLButtonElement {
  const button = el?.renderRoot.querySelector('button');
  if (!button) {
    throw new Error('<m-button> did not render an inner <button>');
  }
  return button;
}

describe('m-button Vue wrapper', () => {
  it('renders an <m-button> element', async () => {
    const el = await render();
    expect(el).toBeTruthy();
    expect(el?.tagName.toLowerCase()).toBe('m-button');
  });

  it('sets props on the element as DOM PROPERTIES', async () => {
    const el = await render({ variant: 'danger', size: 'lg' });

    expect(el?.variant).toBe('danger');
    expect(el?.size).toBe('lg');
  });

  it('keeps `disabled` false as a PROPERTY (the boolean-trap regression)', async () => {
    const el = await render({ disabled: false });

    // If the element were un-upgraded when Vue created it, Vue would write
    // the ATTRIBUTE `disabled="false"` and Lit's Boolean converter would
    // parse that as TRUE. Assert the property AND the absent attribute.
    expect(el?.disabled).toBe(false);
    expect(el?.hasAttribute('disabled')).toBe(false);
  });

  it('sets `disabled` true as a PROPERTY', async () => {
    const el = await render({ disabled: true });
    expect(el?.disabled).toBe(true);
  });

  it('emits `click` when the element is clicked', async () => {
    const onClick = vi.fn();
    const el = await render({ onClick });

    (el as unknown as HTMLElement).click();

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('emits `m-button-click` with the typed detail', async () => {
    const onDetail = vi.fn();
    const el = await render({ 'onM-button-click': onDetail });

    innerButton(el).click();

    expect(onDetail).toHaveBeenCalledTimes(1);
    const event = onDetail.mock.calls[0]?.[0] as CustomEvent<MButtonClickDetail>;
    expect(event.type).toBe('m-button-click');
    expect(event.detail.source).toBe(el);
  });

  it('renders the named `icon` slot as a light-DOM child with slot="icon"', async () => {
    app = createApp({
      render: () =>
        h(
          MButton as never,
          {},
          {
            icon: () => h('span', { 'aria-hidden': 'true' }, '★'),
            default: () => 'Add to favorites',
          }
        ),
    });
    app.mount(container);

    const el = container.querySelector('m-button') as MButtonElement | null;
    await el?.updateComplete;

    // The icon content must be a light-DOM child carrying slot="icon" so the
    // component's <slot name="icon"> can project it.
    const iconSlot = el?.querySelector('[slot="icon"]');
    expect(iconSlot).toBeTruthy();
    expect(iconSlot?.textContent).toBe('★');

    // The default slot content is also projected.
    expect(el?.textContent).toContain('Add to favorites');
  });

  it('does not emit `click` when the button is disabled', async () => {
    const onClick = vi.fn();
    const el = await render({ disabled: true, onClick });

    const inner = innerButton(el);
    expect(inner.disabled).toBe(true);
    inner.click();

    expect(onClick).not.toHaveBeenCalled();
  });
});
