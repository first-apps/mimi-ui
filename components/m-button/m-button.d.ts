import { LitElement, TemplateResult } from 'lit';
export type MButtonVariant = 'primary' | 'secondary' | 'danger';
export type MButtonSize = 'sm' | 'md' | 'lg';
export type MButtonType = 'button' | 'submit' | 'reset';
/** Detail payload of the `m-button-click` event. */
export interface MButtonClickDetail {
    /** The originating `<m-button>` instance. */
    readonly source: MButton;
    /** The original native `MouseEvent` for callers that need coordinates, etc. */
    readonly originalEvent: Event;
}
/**
 * Detail object available on `m-button-click` events.
 * Documented here so consumers get type-aware access when listening
 * (`event.detail` is typed as `MButtonClickDetail`).
 */
export type { MButtonClickDetail as MButtonClickEventDetail };
export declare class MButton extends LitElement {
    /** Form-associated custom element. Opts into `attachInternals()` and the
     *  `formAssociatedCallback` family. */
    static formAssociated: boolean;
    static styles: import('lit').CSSResult;
    /** Visual variant. Reflected so SCSS can target `:host([variant='…'])`. */
    variant: MButtonVariant;
    /** Size scale. Reflected for SCSS targeting. */
    size: MButtonSize;
    /** Disabled state. Reflected so SCSS + native HTML semantics align. */
    disabled: boolean;
    /** Loading state. Disables interaction and exposes `aria-busy`. */
    loading: boolean;
    /** Native `<button type>` — controls form-submission semantics. */
    type: MButtonType;
    /** Form-associated name. */
    name: string;
    /** Form-associated value. */
    value: string;
    /** ElementInternals — available after the constructor returns. */
    private _internals;
    constructor();
    /**
     * Called by the browser when this element is inside a `<fieldset disabled>`
     * (or any other ancestor whose disabled state changes). The previous
     * implementation poked `btn.disabled` directly on the DOM, which Lit had
     * no knowledge of — the very next re-render would clobber it because
     * `?disabled=${this.disabled || this.loading}` evaluates from the
     * (still-`false`) reactive property.
     *
     * Updating the reactive property here keeps everything in sync: the host
     * attribute reflects (so SCSS `:host([disabled])` applies), Lit re-renders
     * the inner `<button>` with the correct disabled semantics, and any
     * listeners watching `this.disabled` see the change.
     */
    formDisabledCallback(disabled: boolean): void;
    /**
     * Called by the browser when the associated `<form>` is reset. Buttons
     * don't carry internal state that needs clearing, but the callback is
     * declared here so the form-association lifecycle is complete and any
     * future internal state (e.g. a pending-flag) has a hook to reset.
     */
    formResetCallback(): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    render(): TemplateResult;
    /**
     * Re-dispatch the native click as `m-button-click`, then drive form
     * submission / reset through `ElementInternals` when activation didn't
     * already go through the inner `<button>`.
     *
     * Why the second half exists: the native inner `<button type="submit">`
     * (or `type="reset"`) only triggers form submission/reset on a direct
     * click. Programmatic activation (`el.click()` from a parent calling code,
     * a synthetic event, or even clicks landing on host padding that doesn't
     * overlap the inner button) re-targets to `<m-button>` and bypasses the
     * inner button's native behavior. The internals API lets us mirror that
     * behavior from the host level so all activation paths are equivalent.
     *
     * We gate the forwarding on `event.composedPath()`: if the click already
     * went through the inner `<button>`, the native submit/reset fired and
     * calling `requestSubmit()` / `reset()` again would double-dispatch the
     * form's submit event.
     */
    private _handleClick;
}
declare global {
    interface HTMLElementTagNameMap {
        'm-button': MButton;
    }
    interface HTMLElementEventMap {
        'm-button-click': CustomEvent<MButtonClickDetail>;
    }
}
