import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{a as t,c as n,d as r,l as i,n as a,r as o,s}from"./iframe-XK6I-6T4.js";var c;function l(){return(l=e((()=>{c=e=>(t,n)=>{n===void 0?customElements.define(e,t):n.addInitializer(()=>{customElements.define(e,t)})}})))()}function u(e){return(t,n)=>typeof n==`object`?f(e,t,n):((e,t,n)=>{let r=t.hasOwnProperty(n);return t.constructor.createProperty(n,e),r?Object.getOwnPropertyDescriptor(t,n):void 0})(e,t,n)}var d,f;function p(){return(p=e((()=>{n(),d={attribute:!0,type:String,converter:i,reflect:!1,hasChanged:s},f=(e=d,t,n)=>{let{kind:r,metadata:i}=n,a=globalThis.litPropertyMetadata.get(i);if(a===void 0&&globalThis.litPropertyMetadata.set(i,a=new Map),r===`setter`&&((e=Object.create(e)).wrapped=!0),a.set(n.name,e),r===`accessor`){let{name:r}=n;return{set(n){let i=t.get.call(this);t.set.call(this,n),this.requestUpdate(r,i,e,!0,n)},init(t){return t!==void 0&&this.C(r,void 0,e,t),t}}}if(r===`setter`){let{name:r}=n;return function(n){let i=this[r];t.call(this,n),this.requestUpdate(r,i,e,!0,n)}}throw Error(`Unsupported decorator location: `+r)}})))()}function m(){return(m=e((()=>{p()})))()}function h(){return(h=e((()=>{l(),p(),m()})))()}function g(e,t,n){return e?t(e):n?.(e)}var _;function v(){return(v=e((()=>{_=`:host{--_bg:var(--m-color-primary,#2563eb);--_bg-hover:var(--m-color-primary-hover,#1d4ed8);--_fg:var(--m-color-primary-fg,#fff);--_padding:var(--m-space-md,8px 16px);--_radius:var(--m-radius-md,6px);--_font-size:var(--m-font-size-md,14px);--_duration:.12s;--_ease:cubic-bezier(.2, 0, 0, 1);vertical-align:middle;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica Neue,sans-serif;display:inline-flex}:host([variant=secondary]){--_bg:var(--m-color-secondary-bg,#f3f4f6);--_bg-hover:var(--m-color-secondary-hover,#e5e7eb);--_fg:var(--m-color-secondary-fg,#111827)}:host([variant=danger]){--_bg:var(--m-color-danger,#dc2626);--_bg-hover:var(--m-color-danger-hover,#b91c1c);--_fg:var(--m-color-danger-fg,#fff)}:host([size=sm]){--_padding:var(--m-space-sm,6px 12px);--_font-size:var(--m-font-size-sm,13px);--_radius:var(--m-radius-sm,4px)}:host([size=lg]){--_padding:var(--m-space-lg,12px 24px);--_font-size:var(--m-font-size-lg,16px);--_radius:var(--m-radius-lg,8px)}:host([disabled]){cursor:not-allowed;opacity:.5;pointer-events:none}:host([loading]){cursor:progress}button{appearance:none;font:inherit;color:var(--_fg);letter-spacing:inherit;text-align:inherit;cursor:pointer;justify-content:center;align-items:center;gap:var(--m-space-icon-gap,8px);padding:0;padding:var(--_padding);background:0 0;background:var(--_bg);border-radius:var(--_radius);font-weight:500;font-size:var(--_font-size);border:0;margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica Neue,sans-serif;line-height:1.2;display:inline-flex;overflow:visible}@media (prefers-reduced-motion:no-preference){button{transition:background-color var(--_duration) var(--_ease), transform var(--_duration) var(--_ease)}}button:hover:not(:disabled){background:var(--_bg-hover)}button:active:not(:disabled){transform:translateY(1px)}button:focus-visible{outline:2px solid var(--m-color-focus,currentColor);outline-offset:2px}.spinner{border:2px solid;border-right-color:#0000;border-radius:50%;width:12px;height:12px;animation:.8s linear infinite m-button-spin}@media (prefers-reduced-motion:reduce){.spinner{animation-duration:3s}}@keyframes m-button-spin{to{transform:rotate(360deg)}}`})))()}function y(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a}var b;function x(){return(x=e((()=>{a(),h(),v(),b=class extends o{static{this.formAssociated=!0}static{this.styles=r(_)}constructor(){super(),this.variant=`primary`,this.size=`md`,this.disabled=!1,this.loading=!1,this.type=`button`,this.name=``,this.value=``,this._handleClick=e=>{if(this.dispatchEvent(new CustomEvent(`m-button-click`,{detail:{source:this,originalEvent:e},composed:!0,bubbles:!0})),this.type!==`submit`&&this.type!==`reset`)return;let t=e.composedPath(),n=this.renderRoot.querySelector(`button`);if(n&&t.includes(n))return;let r=this._internals.form;r&&(this.type===`submit`?r.requestSubmit():r.reset())},this._internals=this.attachInternals()}formDisabledCallback(e){this.disabled=e}formResetCallback(){}connectedCallback(){super.connectedCallback(),this.addEventListener(`click`,this._handleClick)}disconnectedCallback(){this.removeEventListener(`click`,this._handleClick),super.disconnectedCallback()}render(){let e=this.disabled||this.loading;return t`
            <button
                part="button"
                type=${this.type}
                name=${this.name}
                value=${this.value}
                ?disabled=${e}
                aria-busy=${this.loading?`true`:`false`}
            >
                ${g(this.loading,()=>t`<span class="spinner" part="spinner" aria-hidden="true"></span>`)}
                <slot name="icon"></slot>
                <slot></slot>
            </button>
        `}},y([u({type:String,reflect:!0})],b.prototype,`variant`,void 0),y([u({type:String,reflect:!0})],b.prototype,`size`,void 0),y([u({type:Boolean,reflect:!0})],b.prototype,`disabled`,void 0),y([u({type:Boolean,reflect:!0})],b.prototype,`loading`,void 0),y([u({type:String})],b.prototype,`type`,void 0),y([u({type:String})],b.prototype,`name`,void 0),y([u({type:String})],b.prototype,`value`,void 0),b=y([c(`m-button`)],b)})))()}var S,C,w,T,E,D,O,k,A,j,M,N,P,F,I;function L(){return(L=e((()=>{a(),x(),S={title:`Components/Button`,component:`m-button`,tags:[`autodocs`],parameters:{docs:{description:{component:"Production button primitive. Variants on the host attribute, form-association via ElementInternals, `m-button-click` event (composed + bubbles). Theming via `--m-*` custom properties — see the source SCSS for the full surface."}}},argTypes:{label:{control:`text`,description:`Default-slot content (the button label).`},variant:{control:{type:`select`},options:[`primary`,`secondary`,`danger`],description:"Visual variant — host attribute, drives `:host([variant=…])` styles."},size:{control:{type:`select`},options:[`sm`,`md`,`lg`],description:`Size scale — host attribute, drives padding / radius / font-size.`},disabled:{control:`boolean`,description:"Disables interaction; also adds the `disabled` attribute to the inner <button>."},loading:{control:`boolean`,description:"Shows a spinner, sets `aria-busy`, blocks clicks."},type:{control:{type:`select`},options:[`button`,`submit`,`reset`],description:'Forwarded to the inner <button type="…">. Defaults to `button` to prevent accidental form submission.'}},args:{label:`Save changes`,variant:`primary`,size:`md`,disabled:!1,loading:!1,type:`button`},render:e=>t`
        <m-button
            variant=${e.variant}
            size=${e.size}
            ?disabled=${e.disabled}
            ?loading=${e.loading}
            type=${e.type}
        >
            ${e.label}
        </m-button>
    `},C={name:`Variant · primary`,args:{variant:`primary`,label:`Save changes`}},w={name:`Variant · secondary`,args:{variant:`secondary`,label:`Cancel`}},T={name:`Variant · danger`,args:{variant:`danger`,label:`Delete account`}},E={name:`Size · sm`,args:{size:`sm`,label:`Compact`}},D={name:`Size · md (default)`,args:{size:`md`,label:`Default`}},O={name:`Size · lg`,args:{size:`lg`,label:`Emphasized`}},k={name:`State · disabled`,args:{disabled:!0,label:`Unavailable`}},A={name:`State · loading`,args:{loading:!0,label:`Submitting…`}},j={name:`Slot · icon`,parameters:{docs:{description:{story:"Named slot `icon` renders before the default slot. Styled via the `--m-space-icon-gap` token."}}},render:()=>t`
        <m-button variant="primary">
            <span slot="icon" aria-hidden="true">★</span>
            Add to favorites
        </m-button>
    `},M={name:`Slot · icon (custom layout)`,parameters:{docs:{description:{story:"Only one named slot is reserved (`icon`). For trailing icons, swap the order of children in the default slot, or extend the API with a new slot."}}},render:()=>t`
        <m-button variant="secondary">
            Continue
            <span slot="icon" aria-hidden="true">→</span>
        </m-button>
    `},N={name:`Form · submit`,parameters:{docs:{description:{story:'Set `type="submit"` to trigger the enclosing <form>. The component is form-associated via `ElementInternals`, so disabled ancestors (e.g. `<fieldset disabled>`) propagate automatically.'}}},render:()=>t`
        <form
            @submit=${e=>{e.preventDefault()}}
        >
            <m-button type="submit" variant="primary" name="action" value="save">
                Submit
            </m-button>
        </form>
    `},P={name:`Theming · custom palette`,parameters:{docs:{description:{story:"Every internal style references a public `--m-*` custom property. Override any of them on a parent to retheme. Here the entire primary palette is replaced."}}},render:()=>t`
        <div
            style=${`
                --m-color-primary: #7c3aed;
                --m-color-primary-hover: #6d28d9;
                --m-color-primary-fg: #f5f3ff;
                --m-radius-md: 999px;
            `}
        >
            <m-button variant="primary">Purple, fully rounded</m-button>
        </div>
    `},F={name:`Event · m-button-click`,parameters:{docs:{description:{story:'Listen with `addEventListener("m-button-click", handler)`. The event is `composed: true, bubbles: true`, so it crosses the Shadow DOM boundary and works inside React/Angular/Vue without adapters.'}}},render:()=>t`
        <m-button
            @m-button-click=${e=>{console.info(`m-button-click fired`,e.detail)}}
        >
            Click me — check the Actions panel
        </m-button>
    `},I=[`Primary`,`Secondary`,`Danger`,`SizeSmall`,`SizeMedium`,`SizeLarge`,`Disabled`,`Loading`,`WithIcon`,`WithTrailingIcon`,`FormSubmit`,`ThemedCustom`,`EventDemo`],C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  name: 'Variant · primary',
  args: {
    variant: 'primary',
    label: 'Save changes'
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  name: 'Variant · secondary',
  args: {
    variant: 'secondary',
    label: 'Cancel'
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  name: 'Variant · danger',
  args: {
    variant: 'danger',
    label: 'Delete account'
  }
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  name: 'Size · sm',
  args: {
    size: 'sm',
    label: 'Compact'
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  name: 'Size · md (default)',
  args: {
    size: 'md',
    label: 'Default'
  }
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  name: 'Size · lg',
  args: {
    size: 'lg',
    label: 'Emphasized'
  }
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  name: 'State · disabled',
  args: {
    disabled: true,
    label: 'Unavailable'
  }
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  name: 'State · loading',
  args: {
    loading: true,
    label: 'Submitting…'
  }
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  name: 'Slot · icon',
  parameters: {
    docs: {
      description: {
        story: 'Named slot \`icon\` renders before the default slot. Styled via the \`--m-space-icon-gap\` token.'
      }
    }
  },
  render: (): TemplateResult => html\`
        <m-button variant="primary">
            <span slot="icon" aria-hidden="true">★</span>
            Add to favorites
        </m-button>
    \`
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  name: 'Slot · icon (custom layout)',
  parameters: {
    docs: {
      description: {
        story: 'Only one named slot is reserved (\`icon\`). For trailing icons, swap the order of children in the default slot, or extend the API with a new slot.'
      }
    }
  },
  render: (): TemplateResult => html\`
        <m-button variant="secondary">
            Continue
            <span slot="icon" aria-hidden="true">→</span>
        </m-button>
    \`
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  name: 'Form · submit',
  parameters: {
    docs: {
      description: {
        story: 'Set \`type="submit"\` to trigger the enclosing <form>. The component is form-associated via \`ElementInternals\`, so disabled ancestors (e.g. \`<fieldset disabled>\`) propagate automatically.'
      }
    }
  },
  render: (): TemplateResult => html\`
        <form
            @submit=\${(e: Event) => {
    e.preventDefault();
    // In a real app this would post to a server. The story just
    // demonstrates wiring; no-op here.
  }}
        >
            <m-button type="submit" variant="primary" name="action" value="save">
                Submit
            </m-button>
        </form>
    \`
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  name: 'Theming · custom palette',
  parameters: {
    docs: {
      description: {
        story: 'Every internal style references a public \`--m-*\` custom property. Override any of them on a parent to retheme. Here the entire primary palette is replaced.'
      }
    }
  },
  render: (): TemplateResult => html\`
        <div
            style=\${\`
                --m-color-primary: #7c3aed;
                --m-color-primary-hover: #6d28d9;
                --m-color-primary-fg: #f5f3ff;
                --m-radius-md: 999px;
            \`}
        >
            <m-button variant="primary">Purple, fully rounded</m-button>
        </div>
    \`
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  name: 'Event · m-button-click',
  parameters: {
    docs: {
      description: {
        story: 'Listen with \`addEventListener("m-button-click", handler)\`. The event is \`composed: true, bubbles: true\`, so it crosses the Shadow DOM boundary and works inside React/Angular/Vue without adapters.'
      }
    }
  },
  render: (): TemplateResult => html\`
        <m-button
            @m-button-click=\${(e: CustomEvent<{
    source: HTMLElement;
  }>) => {
    // Surfaced in the Storybook actions panel — proves the
    // event crosses the shadow boundary.
    console.info('m-button-click fired', e.detail);
  }}
        >
            Click me — check the Actions panel
        </m-button>
    \`
}`,...F.parameters?.docs?.source}}}})))()}L();export{T as Danger,k as Disabled,F as EventDemo,N as FormSubmit,A as Loading,C as Primary,w as Secondary,O as SizeLarge,D as SizeMedium,E as SizeSmall,P as ThemedCustom,j as WithIcon,M as WithTrailingIcon,I as __namedExportsOrder,S as default};