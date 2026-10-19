# Description
<!-- Required: what this PR changes and why. -->

# Pipeline mandates
- [ ] `npm run lint`
- [ ] `npm run format`
- [ ] `npm run test`

# New component checklist
<!-- Fill out only if this PR builds or edits a component. -->
- [ ] Files exist: `m-<name>.ts`, `m-<name>.scss`, `m-<name>.test.ts`, `m-<name>.stories.ts`, re-exported from `src/index.ts`
- [ ] `npm run build` succeeds; `npm test` passes; `npm run build:storybook` succeeds
- [ ] All `@property` decorators declare correct types; booleans reflect only when needed
- [ ] Form-associated components: `static formAssociated = true`, `attachInternals()` in the constructor, no DOM pokes in `formDisabledCallback`/`formResetCallback`, submit/reset forwarded through `_internals.form`
- [ ] Real semantic element under the hood; `:focus-visible` ring; `aria-busy` on loading
- [ ] All colors and dimensions use `--m-*` public custom properties; each has a SASS-token fallback; internal aliases use `--_*` prefix
- [ ] Custom events dispatch with `composed: true, bubbles: true`; names follow `m-<component>-<event>`; typed detail on `HTMLElementEventMap`
- [ ] `?disabled=${bool}` for booleans; reduced-motion transitions via the `motion()` mixin; `name`/`value` either forwarded to inner element OR registered via `setFormValue`, never both
- [ ] Vitest covers: registration, every reflected prop, event semantics, slot projection (default + named), disabled/loading blocks interaction, form-association lifecycle both directions
- [ ] Stories: `tags: ['autodocs']`, `argTypes` per prop, one per variant / size / state, slot-composition story, theming story, event story; title under `Components/<Name>`
- [ ] Backward compatibility: sibling components still typecheck and their tests still pass
