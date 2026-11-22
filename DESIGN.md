# DESIGN.md – Superr Design System Analysis & Specification

> **Aesthetic Philosophy:** *Warm schoolyard notebook in soft afternoon light.*  
> A clean cream page, an orange marker uncapped, and a stack of sticker-laminated labels waiting to be peeled. Playful, tactile, warm, and deeply personal.

---

## 1. Visual Theme & Atmosphere

- **Core Concept:** An analog-inspired digital keepsake. It feels like flipping through a cherished, sticker-covered notebook crafted by a best friend during golden hour.
- **Emotional Resonance:** Sincere, warm, unpretentious, playful, tactile, and celebratory.
- **Texture & Light:** 
  - Soft cream paper backdrop with subtle warm lighting.
  - Uncapped marker highlights and ink bleed accents.
  - Sticker-laminated badges with crisp borders and tactile offset drop shadows.
  - Polaroid photo cards with washi tape strips and handwritten scribbles.

---

## 2. Color Palette & Tokens

| Token Name | Hex Code | Role & Usage |
| :--- | :--- | :--- |
| `--color-canvas` | `#FDFBF9` | **Cream Paper** – Primary page & card background |
| `--color-dew` | `#F7EFE9` | **Dew Drop** – Elevated card surface & input fields |
| `--color-cocoa` | `#2B1A07` | **Cocoa Ink** – Primary typography, high-contrast borders & shadows |
| `--color-charcoal`| `#171717` | **Deep Charcoal** – Structural darks & contrast anchors |
| `--color-marker` | `#FF6F1E` | **Marker Orange** – Primary vibrant chromatic call-to-action & sparks |
| `--color-sienna` | `#CE500A` | **Burnt Sienna** – Active states, hover depths, button borders |
| `--color-bubblegum`| `#FF66CF`| **Bubblegum Pink** – Love badges, hearts, strawberry frosting accents |
| `--color-sky` | `#3B82F6` | **Sky Blue** – Friendly pills, balloon accents, playful highlights |
| `--color-sprout` | `#22C55E` | **Sprout Green** – Success markers, fortune cards, verified badges |
| `--color-sunshine`| `#FBBF24` | **Sunshine Gold** – Birthday stars, candlelight aura, crown badges |
| `--color-shadow` | `#BEBCBB` | **Shadow Mist** – Soft secondary boundaries & paper edges |

### Midnight Plum / Warm Night Mode (Cinematic Celebration)
For darkened rooms, fireworks, and candle-blowing climaxes, the system shifts into a warm dark palette:
- Background: `#170F1E` (Midnight Cocoa)
- Card Surfaces: `#24182E` (Plum Dew) with `#FF6F1E` (Marker Orange) & `#FF66CF` (Bubblegum) neon stickers.

---

## 3. Typography Scale & Hierarchy

### Font Families
- **Display Typography:** `Nunito`, sans-serif (Weights: 800 ExtraBold, 900 Black). Friendly, rounded, chunky, and joyful.
- **UI & Body Typography:** `Plus Jakarta Sans` / `Inter` (Weights: 500 Medium, 600 SemiBold, 700 Bold). Crisp, clear readability with geometric balance.
- **Handwritten Notes:** `Caveat` / `Dancing Script`, cursive (Weights: 600, 700). Used for letter writing, polaroid captions, and personal doodles.

### Type Scale
- **Hero Title (Display 1):** `clamp(2.25rem, 6vw, 3.75rem)` | `font-black tracking-tight leading-tight`
- **Section Heading (Display 2):** `clamp(1.5rem, 4vw, 2.25rem)` | `font-extrabold text-cocoa`
- **Card Heading (Display 3):** `1.25rem - 1.5rem` | `font-bold`
- **Body Regular:** `0.875rem - 1rem` | `leading-relaxed font-sans`
- **Caption & Sticker Label:** `0.75rem - 0.8125rem` | `font-bold uppercase tracking-wider`

---

## 4. Spacing, Geometry & Tactile Shadows

- **Corner Radii:**
  - Extra Large (`rounded-3xl`: `1.5rem`) for primary scrapbook panels & modals.
  - Large (`rounded-2xl`: `1rem`) for polaroid frames, challenge cards, and gift boxes.
  - Full (`rounded-full`: `9999px`) for interactive pill buttons and sticker badges.
- **Tactile Offset Shadows (The Signature Superr Sticker Look):**
  - Small Sticker: `box-shadow: 2px 2px 0px #2B1A07`
  - Medium Button: `box-shadow: 3px 3px 0px #2B1A07`
  - Large Card: `box-shadow: 5px 5px 0px #2B1A07`
  - Soft Ambient: `0 12px 32px -4px rgba(43, 26, 7, 0.12)`
- **Interactive Press State:**
  - On `:active` or `:hover`, buttons translate down-right by `2px` while shadow collapses:  
    `transform: translate(2px, 2px); box-shadow: 1px 1px 0px #2B1A07;`

---

## 5. Component Patterns

### 1. The Laminated Sticker Badge
- Pill shape with a solid 2px border in `#2B1A07`.
- Background in Bubblegum, Sky, Sprout, or Sunshine.
- Offset shadow (`2px 2px 0px #2B1A07`).
- Micro-rotation (`-2deg` to `+3deg`) to look naturally hand-placed.

### 2. Chunky Tactile Button
- Thick, high-contrast rounded-full pill.
- Primary CTA: Marker Orange (`#FF6F1E`) with Cocoa Ink border (`#2B1A07`) and crisp white/cocoa typography.
- Tangible spring bounce and physical click feeling.

### 3. Washi Tape & Polaroid Deck
- Polaroid photo with thick white bottom margin for handwritten captions.
- Translucent pastel tape strip (`bg-amber-100/80 -rotate-2 border-y border-amber-300/40`) pinned at top center.

### 4. Interactive Candle & Wish Chamber
- Soft candlelight glow shifting the warm cream into golden sunset ambiance.
- Extinguish state with realistic smoke wisps and bursts of colorful sticker confetti.

---

## 6. Do's & Don'ts

### ✅ DO:
- Use warm cream, dew surfaces, and rich cocoa ink.
- Use rounded, friendly Nunito headers and tactile offset drop shadows.
- Embrace stickers, washi tape, and hand-drawn annotations.
- Give every button a satisfying mechanical press effect.

### ❌ DON'T:
- Don't use cold blue gradients, generic dark-mode gray, or corporate SaaS dashboards.
- Don't use razor-sharp rectangular corners without rounding.
- Don't use fuzzy, washed-out shadows when a crisp tactile offset shadow is called for.
- Don't overwhelm the user with robotic jargon. Keep the tone warm, friendly, and celebratory.
