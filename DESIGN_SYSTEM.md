# LeanOps Design System

This design system formalizes the current LeanOps UI and is the source of truth for new work and refactors.

## 1. Spacing Scale

LeanOps uses a 4px base grid with an 8px rhythm for most layout composition.

Scale:
- `space-1` = 4px
- `space-2` = 8px
- `space-3` = 12px
- `space-4` = 16px
- `space-5` = 20px
- `space-6` = 24px
- `space-8` = 32px
- `space-10` = 40px
- `space-12` = 48px
- `space-14` = 56px
- `space-16` = 64px

Usage rules:
- Internal component padding should usually be `16px`, `20px`, `24px`, or `32px`.
- Vertical page rhythm should step in `24px`, `32px`, or `48px` increments.
- Tight inline gaps use `8px` or `12px`.
- Section-to-section spacing should default to `32px`.
- Large page sections use `48px` to `64px`.

Code references:
- Tokens are defined in [src/index.css](c:\Users\A D M I N\Desktop\Saad\Apps\leanops-hub-main\leanops-hub-main\src\index.css)
- Shared layout helpers are in [src/components/ui/page.tsx](c:\Users\A D M I N\Desktop\Saad\Apps\leanops-hub-main\leanops-hub-main\src\components\ui\page.tsx)

## 2. Typography System

### Sizes
- `2xs` = 11px: eyebrow labels, metadata, table headings
- `xs` = 12px: helper text, timestamps, supporting metadata
- `sm` = 14px: body copy inside cards, forms, lists
- `md` = 16px: default long-form body and page descriptions
- `lg` = 18px: prominent supporting copy
- `xl` = 22px: section headings
- `2xl` = 28px: strong section/page titles
- `3xl` = 36px: main page title on desktop
- `4xl` = 48px: hero/public marketing title

### Weights
- `500`: subdued labels only when visual emphasis is low
- `600`: standard headings, buttons, chips, cards
- `700`: reserved for high-emphasis numeric or hero moments

### Usage rules
- Page titles use `.page-title`
- Section titles use `.section-title`
- Eyebrows are uppercase with wide tracking and should be short
- Paragraph text should stay at `14px` to `16px`
- Do not mix many heading sizes in one section
- Avoid pure bold for everything; use weight contrast sparingly

## 3. Color System

### Core
- `primary`: deep enterprise blue for primary actions and focus
- `secondary`: pale neutral support surface
- `background`: soft cool-neutral app background
- `foreground`: dark slate for readable text

### Neutrals
- `slate-950`/`slate-900`: strong emphasis text
- `slate-700`/`slate-600`: secondary labels and UI text
- `slate-500`: metadata and supporting descriptions
- `slate-200`: borders and separators
- `slate-50`: muted inset surfaces

### States
- Success: green
- Warning: amber/orange
- Info: blue
- Destructive: red

### Usage rules
- Use color primarily for hierarchy and state, not decoration
- Keep most surfaces neutral and let primary blue act as the accent
- Avoid stacking multiple saturated colors in a single component
- Badges and status treatments should remain soft, not neon

## 4. Component Standards

### Buttons
- Primary buttons: gradient blue fill, elevated shadow, strong hover lift
- Outline buttons: white or near-white fill, subtle border, light elevation
- Ghost buttons: no heavy border unless used in chrome/toolbars
- Heights: `44px` default, `36px` small, `48px` large
- Buttons should use sentence case

Source:
- [src/components/ui/button.tsx](c:\Users\A D M I N\Desktop\Saad\Apps\leanops-hub-main\leanops-hub-main\src\components\ui\button.tsx)

### Inputs and Selects
- Height: `48px`
- Radius: `12px`
- Always use subtle gradient/white surfaces with hover border feedback
- Labels should sit above fields and use the shared label component
- Form fields should be arranged in `field-stack`, `form-grid-2`, or `form-grid-3`

Source:
- [src/components/ui/input.tsx](c:\Users\A D M I N\Desktop\Saad\Apps\leanops-hub-main\leanops-hub-main\src\components\ui\input.tsx)
- [src/components/ui/select.tsx](c:\Users\A D M I N\Desktop\Saad\Apps\leanops-hub-main\leanops-hub-main\src\components\ui\select.tsx)
- [src/components/ui/textarea.tsx](c:\Users\A D M I N\Desktop\Saad\Apps\leanops-hub-main\leanops-hub-main\src\components\ui\textarea.tsx)

### Cards
- Standard cards use `.surface-card` or the shared `Card`
- Internal padding should be `24px` to `32px`
- Use one informational emphasis per card: icon tile, stat, badge, or CTA
- Hover lift is reserved for interactive cards only

Source:
- [src/components/ui/card.tsx](c:\Users\A D M I N\Desktop\Saad\Apps\leanops-hub-main\leanops-hub-main\src\components\ui\card.tsx)

### Tables
- Header labels should be uppercase `2xs` metadata style
- Use soft row hover and a contained white table shell
- Prefer roomy row spacing over compressed density

Source:
- [src/components/ui/table.tsx](c:\Users\A D M I N\Desktop\Saad\Apps\leanops-hub-main\leanops-hub-main\src\components\ui\table.tsx)

### Modals
- White elevated dialog with generous `28px` padding
- Title and description must be present for context
- Primary action should be visually obvious and aligned at the bottom

Source:
- [src/components/ui/dialog.tsx](c:\Users\A D M I N\Desktop\Saad\Apps\leanops-hub-main\leanops-hub-main\src\components\ui\dialog.tsx)

### Status and Metadata
- Use `StatusBadge` for status, priority, and type labeling
- Avoid raw badge strings with random variant choices

Source:
- [src/components/ui/status-badge.tsx](c:\Users\A D M I N\Desktop\Saad\Apps\leanops-hub-main\leanops-hub-main\src\components\ui\status-badge.tsx)

## 5. Layout Rules

### Containers
- App shell max width: `1480px`
- Standard page shell: `1280px`
- Reading/legal pages: `768px`

### Grid rules
- Stats use `stats-grid`
- Dense content lists use a vertical `section-stack`
- Catalogs and browsing surfaces use `cards-grid-2` or `cards-grid-3`
- Filters should live inside `FilterBar`
- Top-level pages should use `PageShell`

### Page composition
- Preferred order:
  1. `PageHeader`
  2. `FilterBar` or secondary controls
  3. Content sections built from `SectionHeader`, `SectionCard`, `Card`, and `EmptyState`

## 6. Shared Patterns To Reuse

- `PageShell`
- `PageHeader`
- `SectionCard`
- `SectionHeader`
- `StatsGrid`
- `StatCard`
- `FilterBar`
- `ChipToggle`
- `EmptyState`
- `LoadingState`

Source:
- [src/components/ui/page.tsx](c:\Users\A D M I N\Desktop\Saad\Apps\leanops-hub-main\leanops-hub-main\src\components\ui\page.tsx)

## 7. Enforcement Rules

- New pages should not hand-roll hero headers when `PageHeader` fits
- Search and filter bars should use `FilterBar`
- Repeated chips should use `ChipToggle`
- Status labels should use `StatusBadge`
- Pages should default to `PageShell`
- Legal and text-heavy pages should use `legal-shell` and `legal-prose`

If a screen needs to diverge, it should extend the system rather than bypass it.
