# Design System — Yatzy Game (Lab 05)

## Colors
- Primary (Warm Blue): `#1E7BEA` — used for primary buttons, highlights.
- Secondary (Soft Yellow): `#FFD166` — accents, held-dice background.
- Surface / Card: `#FFFFFF` (white) with subtle shadow.
- Background: `#F3F6FB` — neutral page background.
- Text primary: `#0F1724` — dark slate for readability.
- Text muted: `#6B7280` — for hints, small labels.
- Danger / Error: `#EF4444` — for invalid input or zeroed scores.

**Rationale:**  
A bright but calm palette keeps the UI playful (game feel) while maintaining high contrast and accessibility for readability.

## Typography
- Headings: `Inter`, `Segoe UI`, `system-ui`, `sans-serif` — bold, modern.
- Body: `Roboto`, `system-ui`, `sans-serif` — readable at small sizes.
- Buttons / labels: same family as body but uppercase small caps for emphasis.

**Rationale:** Modern sans-serif fonts are friendly and readable on different devices.

## Dice Design
- Dice are square with rounded corners (border-radius: `10%`).
- Size:
  - Desktop: 80×80 px (adjustable via CSS variables).
  - Mobile: 56×56 px.
- Pips (dots) are rendered using CSS pseudo-elements (no image assets required).
- Held state: when clicked, a die gets a highlighted background (`#FFD166`) and a subtle transform (scale 0.98).
- Rolling animation: quick frame-cycle using `setInterval` with CSS transitions for the face-change.

**Rationale:** Pure-CSS dice avoid external image dependency and allow crisp vector display at any size.

## Icons & imagery
- Minimal icons (SVG) or font icons only if necessary. Prefer text and clear affordances (ex. "Hold" via visual style).

## Accessibility
- High contrast between text and background.
- Buttons sized for tap (>= 44px).
- `aria-live` region for announcing roll results for screen readers.
