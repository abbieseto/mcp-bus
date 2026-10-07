# User Prompts History

This file documents all user prompts submitted for the **Sky & Candy SG Transit** application.

---

### Prompt 1: Initial Application Build & Design System

```text
Build me an app with screens that look like this. You can hotlink images from the html

---
name: Sky & Candy
colors:
  surface: '#f6fafe'
  surface-dim: '#d6dade'
  surface-bright: '#f6fafe'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f4f8'
  surface-container: '#eaeef2'
  surface-container-high: '#e4e9ed'
  surface-container-highest: '#dfe3e7'
  on-surface: '#171c1f'
  on-surface-variant: '#3d4850'
  inverse-surface: '#2c3134'
  inverse-on-surface: '#edf1f5'
  outline: '#6d7881'
  outline-variant: '#bdc8d2'
  surface-tint: '#00658d'
  primary: '#00658d'
  on-primary: '#ffffff'
  primary-container: '#00baff'
  on-primary-container: '#004764'
  inverse-primary: '#81cfff'
  secondary: '#884a6c'
  on-secondary: '#ffffff'
  secondary-container: '#fdb0d7'
  on-secondary-container: '#7a3f60'
  tertiary: '#603de0'
  on-tertiary: '#ffffff'
  tertiary-container: '#b1a2ff'
  on-tertiary-container: '#420bc4'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c6e7ff'
  primary-fixed-dim: '#81cfff'
  on-primary-fixed: '#001e2d'
  on-primary-fixed-variant: '#004c6b'
  secondary-fixed: '#ffd8e9'
  secondary-fixed-dim: '#fdb0d7'
  on-secondary-fixed: '#380627'
  on-secondary-fixed-variant: '#6c3354'
  tertiary-fixed: '#e6deff'
  tertiary-fixed-dim: '#cabeff'
  on-tertiary-fixed: '#1c0062'
  on-tertiary-fixed-variant: '#4719c9'
  background: '#f6fafe'
  on-background: '#171c1f'
  surface-variant: '#dfe3e7'
typography:
  headline-xl:
    fontFamily: Quicksand
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Quicksand
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Quicksand
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-md:
    fontFamily: Quicksand
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Nunito Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Nunito Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-bold:
    fontFamily: Quicksand
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 20px
  label-sm:
    fontFamily: Quicksand
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 40px
  gutter: 16px
  margin-mobile: 20px
  margin-desktop: 64px
---

## Brand & Style

This design system is built on an "Anime Chibi" aesthetic, blending the hyper-expressive energy of Kawaii culture with the clarity required for a transit application. The brand personality is cheerful, helpful, and infinitely approachable, aiming to reduce the stress of daily commuting through visual delight.

The style is a fusion of **Minimalism** and **Soft-Tactile**. It utilizes heavy whitespace to maintain legibility, paired with "bubbly" UI elements that feel soft to the touch. The interface should feel like a series of friendly stickers or candy-coated modules layered over a clean, airy canvas. High-energy pops of color are used strategically to guide the eye toward action, while subtle pastel gradients add depth and a sense of "magical girl" transformation to the user experience.

## Colors

The palette is anchored by "Sky Blue" (Primary) and "Candy Pink" (Secondary). The Sky Blue is used for primary actions, transit routes, and navigation, evoking reliability and open horizons. Candy Pink is used for highlights, favorites, and delight moments.

- **Primary:** Bright Sky Blue (#00BAFF) for high-priority CTA buttons and active states.
- **Secondary:** Soft Candy Pink (#FFB2D9) for accents, notifications, and secondary interaction points.
- **Tertiary:** Magical Violet (#7D5FFF) used sparingly for specialized transit types (e.g., Express trains).
- **Surface/Background:** The app uses a pure white base with "Cloud Gray" (#F0F4F8) for container backgrounds to keep the interface feeling light and breathable.
- **Gradients:** Use linear gradients (Top-Left to Bottom-Right) transitioning from Primary to a lighter version of itself for large headers or cards to add a shimmering, "Anime-opening" feel.

## Typography

Typography is designed to be exceptionally soft and legible. **Quicksand** is utilized for headlines and labels to leverage its rounded terminals, which mimic the "bubbly" anime style. **Nunito Sans** provides a more stable, yet still friendly, structure for body copy and data-heavy transit information.

Headlines should use tight letter-spacing and bold weights to feel impactful and youthful. For mobile views, headline sizes are scaled down to ensure route names and destination headers remain visible without excessive wrapping.

## Layout & Spacing

This design system uses a **Fluid Grid** model with generous internal padding to emphasize the "soft" feel of the components. 

- **Grid:** A standard 12-column grid for desktop, 4-column for mobile.
- **Rhythm:** Spacing follows an 8px base unit. Components should never feel "cramped."
- **Safe Zones:** Use larger-than-standard margins (20px on mobile) to create a "floating" look for the content cards.
- **Adaptation:** On mobile, components reflow into a single-column vertical stack. On tablet and desktop, transit schedules and maps side-by-side using a 60/40 split.

## Elevation & Depth

Depth is achieved through **Tonal Layers** and **Soft Shadows**. 

- **Surface Tiers:** The primary background is white. Secondary containers use "Cloud Gray" (#F0F4F8). Active elements (like the current bus route) use a very faint version of the Primary Blue (#E6F8FF).
- **Shadows:** Use "Marshmallow Shadows"—high blur radius (20px+), very low opacity (10%), and tinted with the Primary Blue. This makes elements feel like they are floating softly rather than casting a heavy, realistic shadow.
- **Inner Glows:** Buttons may use a subtle top-inner-white border (1px) to simulate a "glossy" candy-like surface.

## Shapes

The shape language is defined by **exaggerated roundness**. 

- **Fully Rounded:** All buttons and small chips must be pill-shaped (100vh border-radius). 
- **Containers:** Larger cards and modals use a minimum of 2rem (32px) corner radius to maintain the "chibi" feel. 
- **Icons:** Icons should have rounded caps and corners. Avoid sharp angles; if an icon naturally has a point (like a map pin), soften the vertex.

## Components

- **Buttons:** Large, pill-shaped, and high-contrast. The primary button should have a subtle 2px bottom "offset" shadow in a darker shade of blue to make it feel clickable/squishy.
- **Chips (Transit Modes):** Use colored circles with white icons for Bus, Train, or Tram icons. Labels appear next to the circle in Quicksand Bold.
- **Input Fields:** Search bars for destinations should be oversized, pill-shaped, with a subtle blue outline when focused.
- **Cards (Route Selection):** Use 32px rounded corners. Include a "Sparkle" or "Star" icon for "Fastest Route" or "Cheapest" to lean into the anime theme.
- **Route Timeline:** The vertical line connecting stops should be thick (4px-6px) with rounded ends, resembling a soft noodle or tube rather than a thin geometric line.
- **Modals:** Use "Bottom Sheets" on mobile that slide up with large, 40px rounded top corners, mimicking a soft character pop-up.
```

---

### Prompt 2: Singapore Transit Context Localization

```text
change the website to singapore context
```

---

### Prompt 3: Git Remote Push

```text
git push https://<GITHUB_PERSONAL_ACCESS_TOKEN>@github.com/abbieseto/mcp-bus.git
```

---

### Prompt 4: Backend API Directory & LTA DataMall v3 Bus Arrival Integration

```text
1) Create a /api folder under the project main to store all the apis
2) Create a /api/health.js to monitor if the apis are working
3) integrate the LTA bus information api endpoint 
GET https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=04121
Header:  AccountKey: 

# BusStopCode is the only required parameter.
# Add &ServiceNo=7 to ask about one service only.
# Refreshes every 20 seconds. JSON comes back by default.

I will add the LTA_ACCOUNT_KEY in Vercel environment variables later
```

---

### Prompt 5: Vercel Deployment & Live API Frontend Update

```text
the api is added to Vercel, update the website
```

---

### Prompt 6: Prompts Documentation Generation

```text
create a prompt.md containing all my prompt located at project main
```
