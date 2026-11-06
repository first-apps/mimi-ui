// =============================================================================
// mimi-ui — Angular subpath
// =============================================================================
// TYPE-ONLY. This module has no runtime import of `@angular/core`, which is
// deliberate:
//
//   A value re-export such as
//     export { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
//   would put a real `import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'`
//   into the built chunk, making `@angular/core` a peer dependency of the
//   package and making the `/angular` entry unusable outside an Angular app.
//
// WHY THERE IS NO SCHEMA CONSTANT HERE. Angular's AOT compiler validates the
// `schemas` array STRUCTURALLY, by symbol identity: `extractSchemas` requires
// each entry to be a reference whose `ownedByModuleGuess === '@angular/core'`
// and whose identifier is named `CUSTOM_ELEMENTS_SCHEMA` /
// `NO_ERRORS_SCHEMA`. A wrapper constant (e.g.
// `export const MIMI_UI_SCHEMA = [CUSTOM_ELEMENTS_SCHEMA]`) fails with
// "Component.schemas must be an array", and a nested array
// (`schemas: [[CUSTOM_ELEMENTS_SCHEMA]]`) is a compile error — `schemas` is
// not flattened the way `imports` is.
//
// So Angular consumers write:
//
//   import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
//
//   @Component({ schemas: [CUSTOM_ELEMENTS_SCHEMA], /* ... *\/ })
//   export class FeatureComponent {}
//
// NOTE ON TYPE CHECKING. Under `CUSTOM_ELEMENTS_SCHEMA`, Angular's schema
// registry accepts ANY dash-containing tag. Angular never reads the
// component's `.d.ts`, so a typo like `<m-buton>` compiles silently and
// `[notAProp]` compiles silently. The types exported below help your IDE,
// not the Angular compiler.
//
// NOTE ON FORMS. `attachInternals()` makes the element participate in NATIVE
// `<form>` submission and `new FormData(form)`. It does NOT make Angular's
// `ngModel` / `formControl` work — those require a `ControlValueAccessor`
// adapter and throw `NG_MISSING_VALUE_ACCESSOR` without one. Angular's forms
// API never reads `ElementInternals`.
// =============================================================================

export type {
  MButton,
  MButtonVariant,
  MButtonSize,
  MButtonType,
  MButtonClickDetail,
} from '../components/m-button/m-button';

export type { SchemaMetadata } from '@angular/core';
