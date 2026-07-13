---
name: Civic AI
description: The Future of Digital Public Services
colors:
  primary: "#1a146b"
  primary-container: "#312e81"
  secondary: "#0051d5"
  secondary-container: "#316bf3"
  tertiary: "#3e1a00"
  error: "#ba1a1a"
  background: "#ffffff"
  foreground: "#252525"
  surface-variant: "#f3f4f6"
typography:
  display:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "64px"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "40px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "24px"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "normal"
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Inter, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.01em"
rounded:
  sm: "calc(0.625rem - 4px)"
  md: "calc(0.625rem - 2px)"
  lg: "0.5rem"
  xl: "0.75rem"
  full: "9999px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "40px"
  xl: "64px"
  gutter: "24px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.lg}"
    padding: "12px 24px"
---

# Design System: Civic AI

## 1. Overview

**Creative North Star: "The Modern Public Pillar"**

Civic AI presents government services with the fidelity of a top-tier consumer tech product. The aesthetic is premium, futuristic, and highly polished, moving away from cluttered legacy portals and generic SaaS dashboards. The design language emphasizes clarity, elevated functionality through micro-interactions, and a sense of trust and authority. 

**Key Characteristics:**
- Elevated functionality with premium depth.
- High clarity and typographic rigor.
- Purposeful motion, avoiding gratuitous decoration.
- AI features integrated natively, not bolted on.

## 2. Colors

A restrained, highly legible palette built on deep blues and confident accents, signaling trust and modern governance.

### Primary
- **Deep Civic Blue** (#1a146b): The anchor of the brand. Used for primary typography, major interactive elements, and solid backgrounds.

### Secondary
- **Action Blue** (#0051d5): The primary interaction color. Used for links, highlights, and secondary actions.

### Neutral
- **Paper White** (#ffffff): Clean background for the primary surface.
- **Ink Black** (#252525): Primary text color for high legibility.
- **Muted Surface** (#f3f4f6): Used for secondary panels and subtle container backgrounds.

### Named Rules
**The Authority Rule.** Backgrounds remain clean (Paper White or very subtle tints). High saturation is reserved for action and identity.

## 3. Typography

**Display Font:** Plus Jakarta Sans
**Body Font:** Inter

**Character:** A pairing that balances the geometric, authoritative presence of Plus Jakarta Sans for headings with the highly legible, utilitarian clarity of Inter for dense information.

### Hierarchy
- **Display** (700, 64px, 1.1): Hero headlines on major entry points.
- **Headline** (700, 40px, 1.2): Section headers and major page divisions.
- **Title** (600, 24px, 1.3): Card titles, modal headers, and component-level groupings.
- **Body** (400, 16px, 1.5): Standard reading text. Max line length kept to 65–75ch.
- **Label** (500, 14px, 0.01em): Button labels, small metadata, and utility text.

### Named Rules
**The Legibility First Rule.** All body text must maintain a strict 4.5:1 contrast ratio. Do not use light gray text on light gray backgrounds.

## 4. Elevation

The system relies on subtle, premium shadows to lift interactive elements and create depth without feeling heavy. 

### Shadow Vocabulary
- **Ambient** (`box-shadow: 0 12px 34px -10px rgba(15, 23, 42, 0.08)`): Used for primary floating panels and major structural separations.
- **Premium** (`box-shadow: 0 4px 20px -2px rgba(14, 16, 61, 0.05)`): Used for interactive cards and components that elevate on hover.
- **Glow** (`box-shadow: 0 0 20px rgba(37, 99, 235, 0.2)`): Used sparingly to indicate AI-active states or primary focus.

### Named Rules
**The Functional Depth Rule.** Shadows define structural layers (modals, dropdowns) and interaction states (hover). They are not used for pure decoration.

## 5. Components

### Buttons
- **Shape:** Softened rectangles (0.5rem / 8px).
- **Primary:** Deep Civic Blue background, white text, 12px 24px padding.
- **Hover / Focus:** Slight scale (`scale-102`) and elevated shadow.

### Cards / Containers
- **Corner Style:** Rounded (0.75rem / 12px) to 2rem for major panels.
- **Background:** Glass-panel effect (`rgba(255, 255, 255, 0.8)` with blur) or solid surface-variant.
- **Shadow Strategy:** Ambient shadow at rest, elevating to Premium on hover.
- **Internal Padding:** Generous (24px to 40px) to maintain breathing room.

## 6. Do's and Don'ts

### Do:
- **Do** use solid colors for typography to ensure legibility and a premium feel.
- **Do** maintain a clean, high-contrast visual hierarchy.
- **Do** use motion purposefully for state changes and subtle reveals.

### Don't:
- **Don't** use gradient text on headings (a common AI tell).
- **Don't** overuse glassmorphism as a default background for everything; reserve it for elevated panels.
- **Don't** rely on oversized, disconnected floating orbs as primary visuals without grounding them in the UI context.
- **Don't** use generic SaaS clichés like the tiny uppercase tracked eyebrow above every section.
