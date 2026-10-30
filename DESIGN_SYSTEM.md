# TeamFlow Design System

A single source of truth for visual decisions. All UI must follow these tokens.

## 1. Design analogy
**"Calm workspace"** — like a well-organized desk. Soft neutrals, one confident accent (indigo), generous whitespace, clear hierarchy. Nothing shouts; everything guides.

## 2. Color tokens
| Token | Value | Use |
|---|---|---|
| --bg | #f8fafc | Page background |
| --surface | #ffffff | Cards, panels |
| --surface-subtle | #f8fafc | Hover/striped rows |
| --border | #e2e8f0 | Card borders |
| --border-soft | #edf1f5 | Dividers inside cards |
| --text | #0f172a | Primary text |
| --muted | #64748b | Secondary text |
| --muted-light | #94a3b8 | Tertiary/hints |
| --primary | #4f46e5 | Accent, CTAs, links |
| --primary-dark | #4338ca | Accent hover |
| --primary-soft | #eef2ff | Accent backgrounds |
| --blue / -soft | #3b82f6 / #eff6ff | Info |
| --green / -soft | #16a34a / #f0fdf4 | Success |
| --amber / -soft | #d97706 / #fffbeb | Warning |
| --red / -soft | #dc2626 / #fef2f2 | Danger |

## 3. Typography scale
Base font size: **14px** (body). Scale (px):
- xs: 11
- sm: 12
- base: 14
- md: 16
- lg: 18
- xl: 22
- 2xl: 28
- 3xl: 36

Weights: 400 (body), 500 (labels), 600 (headings), 700 (display).

## 4. Spacing scale (px)
4, 8, 12, 16, 20, 24, 32, 48.

## 5. Radius
- sm: 8px (inputs, small cards)
- md: 12px (cards, panels)
- lg: 16px (dialogs)
- pill: 999px (badges)

## 6. Cards
- Border: 1px solid --border
- Background: --surface
- Radius: --radius-md
- Padding: 20px (desktop), 16px (mobile)
- Shadow: --shadow-card
- Hover: translateY(-2px) + stronger shadow

## 7. Buttons
- Primary: --primary bg, white text, 8px radius, 10px 16px padding.
- Secondary: white bg, --border border.
- Icon: 36x36, transparent bg.
- Disabled: opacity .5, no pointer.

## 8. Inputs
- Height 40px, radius 8px, 1px border --border, 10px 12px padding.
- Focus: border --primary, 3px --primary-soft ring.

## 9. Rules
- All text ≥ 11px.
- Body text ≥ 13px.
- Use tokens, never raw hex (except status colors).
- Consistent 16px+ gaps between sections.
- Cards always have border + radius + shadow.