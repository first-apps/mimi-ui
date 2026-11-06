import 'happy-dom';

// =============================================================================
// happy-dom environment shims
// =============================================================================
// happy-dom does not implement `ElementInternals`, which every form-associated
// component in this library relies on (`static formAssociated = true` +
// `attachInternals()` in the constructor).
//
// The stub resolves `.form` to the nearest <form> ancestor, mirroring the
// browser's behaviour: the browser auto-associates a form-associated custom
// element with the form it is inserted into.
//
// This lives in the shared setup file so every test file — the component
// tests AND the framework-wrapper tests — gets the same shim. A wrapper test
// that constructed an <m-button> without it would fail with
// "this.attachInternals is not a function".
//
// See docs/COMPONENT_STANDARDS.md §9 (Testing) — "Stub environment holes".
// =============================================================================

if (
  typeof (HTMLElement.prototype as { attachInternals?: () => ElementInternals }).attachInternals !==
  'function'
) {
  (HTMLElement.prototype as { attachInternals: () => ElementInternals }).attachInternals =
    function (this: HTMLElement): ElementInternals {
      const host = this;
      const internals: Record<string | symbol, unknown> = {};
      Object.defineProperty(internals, 'form', {
        configurable: true,
        get(): HTMLFormElement | null {
          let node: HTMLElement | null = host;
          while (node) {
            if (node.tagName === 'FORM') {
              return node as HTMLFormElement;
            }
            node = node.parentElement ?? (node.parentNode as HTMLElement | null);
          }
          return null;
        },
      });
      return internals as unknown as ElementInternals;
    };
}
