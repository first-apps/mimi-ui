// =============================================================================
// <m-button> — Vue wrapper
// =============================================================================
// A real Vue component that renders the `<m-button>` custom element.
//
// WHY THIS IS NOT `defineCustomElement`. Vue's `defineCustomElement` wraps a
// VUE COMPONENT into a custom element — the inverse of what's needed here.
// We want a Vue component that renders an existing custom element.
//
// HOW PROPS REACH THE ELEMENT. Vue's `shouldSetAsProp()` (runtime-dom)
// decides between property and attribute with `return key in el`. Lit's
// `@property` defines accessors on the PROTOTYPE, so for an upgraded
// element `'variant' in el` is true and Vue assigns the DOM PROPERTY —
// exactly what Lit needs. So the prop keys below are camelCase, matching
// the Lit property names. Kebab-case keys would fail the `in` check and
// fall back to setAttribute().
//
// THE BOOLEAN TRAP. If the element is NOT upgraded when Vue creates it,
// `'disabled' in el` is false, Vue takes the attribute path, and
// `disabled: false` becomes the attribute `disabled="false"`. Lit's
// Boolean converter is `value !== null`, so it reads that as TRUE — a
// silently broken button. The side-effect import below guarantees
// `<m-button>` is registered before Vue ever creates one.
//
// SLOTS. `m-button` exposes a default slot and a named `icon` slot. The
// icon content must be a CHILD vnode carrying `slot: 'icon'` — Vue's
// `normalizeChildren()` flattens a slots object to its `default` key for
// ELEMENT vnodes, so passing `{ default, icon }` would drop the icon.
// `slot` is a reflected IDL attribute, so Vue's `patchDOMProp` sets
// `el.slot = 'icon'`, which reflects to the `slot` attribute.
// =============================================================================

import { defineComponent, h, onBeforeUnmount, onMounted, ref, type PropType } from 'vue';

import type {
  MButton as MButtonElement,
  MButtonClickDetail,
  MButtonSize,
  MButtonType,
  MButtonVariant,
} from '../components/m-button/m-button';

// LOAD-BEARING: registers <m-button> before Vue ever creates an element.
// See "THE BOOLEAN TRAP" above — without this, `disabled: false` becomes
// the attribute "false", which Lit parses as TRUE.
import '../components/m-button/m-button';

export const MButton = defineComponent({
  name: 'MButton',
  props: {
    variant: { type: String as PropType<MButtonVariant>, default: 'primary' },
    size: { type: String as PropType<MButtonSize>, default: 'md' },
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    type: { type: String as PropType<MButtonType>, default: 'button' },
    name: { type: String, default: '' },
    value: { type: String, default: '' },
  },
  emits: {
    click: (_e: MouseEvent) => true,
    'm-button-click': (_e: CustomEvent<MButtonClickDetail>) => true,
  },
  setup(props, { emit, slots }) {
    const el = ref<MButtonElement | null>(null);
    let onDetail: ((e: CustomEvent<MButtonClickDetail>) => void) | null = null;

    onMounted(() => {
      onDetail = (e) => emit('m-button-click', e);
      el.value?.addEventListener('m-button-click', onDetail);
    });

    onBeforeUnmount(() => {
      if (onDetail) {
        el.value?.removeEventListener('m-button-click', onDetail);
      }
    });

    return () => {
      // The named `icon` slot must be a CHILD vnode carrying `slot: 'icon'`.
      // A slots object would be flattened to `default` only for ELEMENT
      // vnodes, silently dropping the icon.
      const children: ReturnType<typeof h>[] = [];

      if (slots.icon) {
        children.push(h('span', { slot: 'icon' }, slots.icon()));
      }
      if (slots.default) {
        children.push(...slots.default());
      }

      return h(
        'm-button',
        {
          ref: el,
          // camelCase keys: Vue's shouldSetAsProp() checks `'variant' in el`.
          // Lit defines the accessor on the prototype, so this is true for an
          // upgraded element and Vue assigns the DOM PROPERTY. Never use
          // kebab-case here — `in` would fail and Vue would fall back to
          // setAttribute().
          variant: props.variant,
          size: props.size,
          disabled: props.disabled,
          loading: props.loading,
          type: props.type,
          name: props.name,
          value: props.value,
          onClick: (e: MouseEvent) => emit('click', e),
        },
        children
      );
    };
  },
});
