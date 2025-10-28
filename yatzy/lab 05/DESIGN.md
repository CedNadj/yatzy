# Design - System - Yatzy Game

## Color Palette

| Color Role  | Hex Value  | Example Usage  |
|-------------|------------|----------------|
| **Primary** | `#1E7BEA` | Buttons, highlights |
| **Secondary** | `#FFD166` | Accents, held-dice background |
| **Surface/ Card** | `#FFFFFF` |  |
| **Background** | `#F3F6FB` | Neutral page background |
| **Text (Primary)** | `#0F1724` | Dark slate for readability |
| **Text (Muted)** | `#6B7280` | For hints, small labels |
| **Success** | `#10B981` | Notifications or status |
| **Error** | `#EF4444` | Error messages or invalid states |

---

**Rationale:**  
A bright but calm palette keeps the UI playful (game feel) while maintaning high contrast and accessibility for readability.

---

## Typography

- **Heading font:** `Inter`, `Segoe UI`, `system-ui`, `sans-serif` - bold modern. 
- **Body font:** `Roboto`, `system-ui`, `sans-serif` - readable at small sizes.  
- Buttons/ Labels: same family as body but uppercase small caps for emphasis.

---

## Dice Design
- Dice are square with rounded corners (border-radius: `10%`).
- Size:
    - Desktop: 80x80 px
    - Mobile: 56x56 px
- Pips (dots) are rendered unsing CSS pseudo-elements.
- Held state: when clicked, a dice gets a highlighted background (`#FFD166`) and a subtle transform (scale 0.98).
- Rolling animation: quick frame-cycle using `setInterval` with CSS transitions for the face-change.

---

**Rationale**
Pure-CSS dice avoid external image dpendency and allow crips vector display at any size.
 
---

## Icons & imagery
- Minimal icons or font icons only if necessary.

---

## Accessibility
- High contrast between text and background.
- Buttons sized for tap (>= 44px).
- `aria-live` region for annoncing roll results for screen readers.