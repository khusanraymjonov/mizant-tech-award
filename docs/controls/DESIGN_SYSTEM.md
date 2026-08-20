# Mizant design system foundation

Requirements: E02, WCAG 2.2 AA foundation, P0.

## Principles

- Governance status is visible in text; colour is never the only signal.
- Synthetic/demo context remains persistent and cannot be mistaken for a live investment service.
- Keyboard focus is strongly visible and a skip link bypasses repeated navigation.
- Layouts reflow at tablet and mobile widths without hiding controlled content.
- Light and dark palettes follow the user's operating-system preference.
- Components use semantic HTML and preserve a minimum 44px interactive target where practical.

## Initial components

`Button`, `StatusBadge`, `Panel`, and `EmptyState` live in `packages/ui`. They are deliberately
small, presentation-focused primitives: business authority and workflow state remain server/domain
responsibilities.

## Visual tokens

The initial palette uses deep green for trust/governance, warm neutral surfaces, and gold for focus
and restrained emphasis. Spacing, typography, radius, colour, and focus tokens are exported from
`@mizant/ui/tokens`. Future component changes must preserve contrast, keyboard operation, reduced
motion, responsive reflow, and explicit status language.
