import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,r as n}from"./iframe-BmQdewqU.js";var r,i,a,o,s,c,l,u,d,f,p,m,h,g,_;function v(){return(v=e((()=>{t(),r={title:`Components/Button`,component:`m-button`,tags:[`autodocs`],parameters:{docs:{description:{component:"Production button primitive. Variants on the host attribute, form-association via ElementInternals, `m-button-click` event (composed + bubbles). Theming via `--m-*` custom properties — see the source SCSS for the full surface."}}},argTypes:{label:{control:`text`,description:`Default-slot content (the button label).`},variant:{control:{type:`select`},options:[`primary`,`secondary`,`danger`],description:"Visual variant — host attribute, drives `:host([variant=…])` styles."},size:{control:{type:`select`},options:[`sm`,`md`,`lg`],description:`Size scale — host attribute, drives padding / radius / font-size.`},disabled:{control:`boolean`,description:"Disables interaction; also adds the `disabled` attribute to the inner <button>."},loading:{control:`boolean`,description:"Shows a spinner, sets `aria-busy`, blocks clicks."},type:{control:{type:`select`},options:[`button`,`submit`,`reset`],description:'Forwarded to the inner <button type="…">. Defaults to `button` to prevent accidental form submission.'}},args:{label:`Save changes`,variant:`primary`,size:`md`,disabled:!1,loading:!1,type:`button`},render:e=>n`
        <m-button
            variant=${e.variant}
            size=${e.size}
            ?disabled=${e.disabled}
            ?loading=${e.loading}
            type=${e.type}
        >
            ${e.label}
        </m-button>
    `},i={name:`Variant · primary`,args:{variant:`primary`,label:`Save changes`}},a={name:`Variant · secondary`,args:{variant:`secondary`,label:`Cancel`}},o={name:`Variant · danger`,args:{variant:`danger`,label:`Delete account`}},s={name:`Size · sm`,args:{size:`sm`,label:`Compact`}},c={name:`Size · md (default)`,args:{size:`md`,label:`Default`}},l={name:`Size · lg`,args:{size:`lg`,label:`Emphasized`}},u={name:`State · disabled`,args:{disabled:!0,label:`Unavailable`}},d={name:`State · loading`,args:{loading:!0,label:`Submitting…`}},f={name:`Slot · icon`,parameters:{docs:{description:{story:"Named slot `icon` renders before the default slot. Styled via the `--m-space-icon-gap` token."}}},render:()=>n`
        <m-button variant="primary">
            <span slot="icon" aria-hidden="true">★</span>
            Add to favorites
        </m-button>
    `},p={name:`Slot · icon (custom layout)`,parameters:{docs:{description:{story:"Only one named slot is reserved (`icon`). For trailing icons, swap the order of children in the default slot, or extend the API with a new slot."}}},render:()=>n`
        <m-button variant="secondary">
            Continue
            <span slot="icon" aria-hidden="true">→</span>
        </m-button>
    `},m={name:`Form · submit`,parameters:{docs:{description:{story:'Set `type="submit"` to trigger the enclosing <form>. The component is form-associated via `ElementInternals`, so disabled ancestors (e.g. `<fieldset disabled>`) propagate automatically.'}}},render:()=>n`
        <form
            @submit=${e=>{e.preventDefault()}}
        >
            <m-button type="submit" variant="primary" name="action" value="save">
                Submit
            </m-button>
        </form>
    `},h={name:`Theming · custom palette`,parameters:{docs:{description:{story:"Every internal style references a public `--m-*` custom property. Override any of them on a parent to retheme. Here the entire primary palette is replaced."}}},render:()=>n`
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
    `},g={name:`Event · m-button-click`,parameters:{docs:{description:{story:'Listen with `addEventListener("m-button-click", handler)`. The event is `composed: true, bubbles: true`, so it crosses the Shadow DOM boundary and works inside React/Angular/Vue without adapters.'}}},render:()=>n`
        <m-button
            @m-button-click=${e=>{console.info(`m-button-click fired`,e.detail)}}
        >
            Click me — check the Actions panel
        </m-button>
    `},_=[`Primary`,`Secondary`,`Danger`,`SizeSmall`,`SizeMedium`,`SizeLarge`,`Disabled`,`Loading`,`WithIcon`,`WithTrailingIcon`,`FormSubmit`,`ThemedCustom`,`EventDemo`],i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  name: 'Variant · primary',
  args: {
    variant: 'primary',
    label: 'Save changes'
  }
}`,...i.parameters?.docs?.source}}},a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  name: 'Variant · secondary',
  args: {
    variant: 'secondary',
    label: 'Cancel'
  }
}`,...a.parameters?.docs?.source}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  name: 'Variant · danger',
  args: {
    variant: 'danger',
    label: 'Delete account'
  }
}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  name: 'Size · sm',
  args: {
    size: 'sm',
    label: 'Compact'
  }
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  name: 'Size · md (default)',
  args: {
    size: 'md',
    label: 'Default'
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  name: 'Size · lg',
  args: {
    size: 'lg',
    label: 'Emphasized'
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  name: 'State · disabled',
  args: {
    disabled: true,
    label: 'Unavailable'
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  name: 'State · loading',
  args: {
    loading: true,
    label: 'Submitting…'
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
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
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
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
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
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
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
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
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
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
}`,...g.parameters?.docs?.source}}}})))()}v();export{o as Danger,u as Disabled,g as EventDemo,m as FormSubmit,d as Loading,i as Primary,a as Secondary,l as SizeLarge,c as SizeMedium,s as SizeSmall,h as ThemedCustom,f as WithIcon,p as WithTrailingIcon,_ as __namedExportsOrder,r as default};