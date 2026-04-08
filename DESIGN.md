# Design System Strategy: The Gilded Curator

## 1. Overview & Creative North Star
The "Creative North Star" for this design system is **The Digital Gallery of Dreams**. We are moving away from the "app" aesthetic and toward a "curated exhibition" experience. This system rejects the industrial rigidity of standard web grids in favor of an editorial, painterly layout that feels like a living museum. 

To achieve this, we utilize **Intentional Asymmetry**—overlapping gilded frames across section boundaries, and treating the viewport as a canvas rather than a container. We break the "template" feel by layering high-contrast typography (Dramatic Serifs) against deep, swirling cosmic backgrounds, creating a sense of infinite depth and fantasy.

---

## 2. Color & Tonal Depth
The palette is built on the tension between the infinite `midnight navy` and the tactile brilliance of `warm gold`. 

### Surface Hierarchy & Nesting
We do not use flat backgrounds. Surfaces must feel like physical layers of an exhibit.
- **Base Layer:** `surface` (#000e3f) represents the deep museum hall.
- **Sectioning:** Use `surface-container-low` (#081747) to define large content areas.
- **Nesting:** Place `surface-container-high` (#1a2656) cards within those sections to create a natural, soft lift.

### The "No-Line" Rule
**Explicit Instruction:** Prohibit the use of 1px solid borders to define sections. All boundaries must be defined by shifts in background tokens (e.g., a `surface-container-lowest` card sitting on a `surface-container-low` section) or through the use of organic, swirling teal gradients that act as soft transitions between content blocks.

### The "Glass & Gradient" Rule
To evoke the "Fantasy" element, use **Glassmorphism** for all floating UI (navigation bars, tooltips). Use `surface` colors at 60% opacity with a `20px` backdrop-blur. 
- **Signature Gradient:** For primary actions, use a linear gradient from `secondary` (#ffdf9e) to `secondary-container` (#fabd00) at a 45-degree angle to mimic the sheen of real gold leaf.

---

## 3. Typography: Editorial Authority
The typography is a dialogue between the classical (Serif) and the functional (Sans-Serif).

- **Display & Headlines (`notoSerif` / Playfair):** Use `secondary` (#ffdf9e) for all headlines. For `display-lg`, apply a subtle text-shadow: `0 0 12px rgba(255, 193, 7, 0.4)` to simulate a museum spotlight hitting gold leaf.
- **Body & Titles (`inter` / DM Sans):** Use `on-background` (#dde1ff) for high readability. The contrast between the dramatic gold serif and the clean ivory sans-serif creates a "Museum Placard" effect.
- **Labels:** Always in `tertiary` (#76d6d5) to provide a "Curator’s Note" feel, distinguishing functional metadata from narrative content.

---

## 4. Elevation & Depth
In this system, depth is a narrative tool. 

- **The Layering Principle:** Stack `surface-container` tiers. A `surface-container-highest` element should feel like a pedestal rising out of the `surface-dim` floor.
- **Ambient Shadows:** When an element must "float" (like a gilded card), use a large, diffused shadow: `0 20px 40px rgba(0, 0, 0, 0.4)`. The shadow must be tinted with the `background` color (#000e3f) to ensure it looks like a natural occlusion of light in the "room."
- **The Ghost Border:** If a boundary is required for accessibility, use `outline-variant` (#454652) at **15% opacity**. This creates a "whisper" of an edge that suggests a frame without breaking the painterly flow.

---

## 5. Components

### Gilded Cards
- **Background:** `surface-container-low`.
- **Border:** A custom 2px gradient border using `secondary` and `secondary-fixed-dim` to simulate an ornate frame.
- **Corner Radius:** Use `md` (0.375rem) for a sharp, formal museum-piece feel.
- **Content:** Forbid divider lines. Separate sections using `1.5rem` of vertical space.

### Ornate Buttons
- **Primary:** Background `secondary-container` (#fabd00), text `on-secondary` (#3f2e00). High-gloss finish using a subtle top-to-bottom light-to-dark gradient.
- **Tertiary (Ghost):** No background. Text in `secondary`. On hover, add a `surface-variant` backplate with a `sm` (0.125rem) corner radius.

### Timeline Museum Maps
- Use `tertiary` (#76d6d5) for the pathing lines.
- Nodes should use `secondary` with a "glow" effect (box-shadow) to represent "Points of Interest" in the festival.

### Input Fields
- **Background:** `surface-container-lowest`.
- **Indicator:** Instead of a full box, use a bottom-border only in `outline` (#908f9d). On focus, transition the border to `secondary` (#ffdf9e) with a subtle outer glow.

---

## 6. Do's and Don'ts

### Do:
- **Do** overlap images and text. Let a sunflower motif (using `secondary`) bleed behind a `headline-lg` to create depth.
- **Do** use `tertiary` (#76d6d5) as a "magical" highlight color for interactive elements like links or active toggle states.
- **Do** lean into the "Van Gogh" inspiration by using subtle, animated SVG filters that create a "swirling" texture on `surface-container` backgrounds.

### Don't:
- **Don't** use pure white (#ffffff). Always use `on-surface` (#dde1ff) or `primary-fixed` (#dce1ff) to maintain the "midnight" atmosphere.
- **Don't** use standard 1px gray dividers. They shatter the illusion of a fantasy world. Use white space or a change in `surface` tier instead.
- **Don't** use aggressive "full" (9999px) rounding for buttons. Keep them `md` (0.375rem) or `none` to maintain the prestige of a high-end cultural institution.

### Accessibility Note:
While we lean into "Fantasy," ensure that all `body-md` text on `surface` backgrounds maintains a contrast ratio of at least 4.5:1. Use `on-surface` for all critical informational text.