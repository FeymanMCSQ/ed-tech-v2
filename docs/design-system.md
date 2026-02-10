# Design System — Scholarly Game Interface

This document defines the visual, interaction, and motion language of the platform.

The system must feel:

- Serious
- Immersive
- Precise
- Progress-driven
- Calm but intense

Not playful.
Not cartoonish.
Not corporate SaaS.

---

## 1. Core Design Philosophy

The product is a mastery engine.

The UI must feel like:

- Climbing a structured ladder
- Entering cognitive flow
- Advancing through tiers
- Earning precision

The interface is not decorative.
It is an instrument panel for intellectual progression.

---

## 2. Visual Identity

### 2.1 Primary Mode

Primary theme: Dark.

Light mode may exist later, but dark is canonical.

Reason:
- Reduces visual fatigue
- Increases contrast
- Feels game-like without childishness
- Allows accent colors to carry meaning

---

## 3. Color System

### 3.1 Base Colors

Background Primary: #0B0F14  
Background Secondary: #141A22  
Panel Surface: #1A212B  
Divider/Subtle Border: rgba(255,255,255,0.06)

Never use pure black.
Never use pure white panels.

---

### 3.2 Text Colors

Primary Text: #E6EDF3  
Secondary Text: #9AA4B2  
Muted Text: #6B7280  
Error: #FF5D5D  
Success: #3DDC97  

High contrast is mandatory.

---

### 3.3 Domain Accent Colors

Each world has a restrained accent color.

Mathematics → Cobalt Blue (#3B82F6)  
Physics → Electric Violet (#8B5CF6)  
Comedy → Amber Gold (#F59E0B)

Rules:
- Only one accent per screen.
- Accent must not dominate layout.
- Accent highlights progress and interaction only.

---

### 3.4 Rating Band Glow System

Rating tiers may subtly influence glow color intensity.

Example:
- 400–800 → low glow
- 800–1400 → medium glow
- 1400–1700 → strong edge highlight
- 1700+ → thin luminous border

This must remain subtle. No neon spam.

---

## 4. Typography

### 4.1 Font Rules

Maximum 2 font families.

Primary: Modern geometric sans (e.g., Inter, Geist, IBM Plex Sans)
Math: KaTeX default or STIX (no decorative math fonts)

No playful fonts.
No script fonts.
No serif body copy.

---

### 4.2 Type Scale

Display: 36–48px  
Heading: 24–32px  
Section Title: 18–22px  
Body: 14–16px  
Caption: 12–13px  

Rules:
- Strong hierarchy.
- No ambiguous sizing.
- Weight conveys structure.

Use weight variation more than color for hierarchy.

---

## 5. Layout Philosophy

### 5.1 Spatial Progression

Progress must feel vertical.

Climbing is a core metaphor.

Preferred patterns:
- Vertical ladders
- Tier columns
- Upward progress bars
- Gate thresholds visually stacked

Avoid:
- Flat dashboard grids
- Random floating cards
- Unstructured whitespace

---

### 5.2 Panels

Panels must:

- Have subtle elevation
- Avoid heavy drop shadows
- Use 8–12px radius maximum
- Maintain consistent padding scale

Spacing scale:
4px base grid (4, 8, 12, 16, 24, 32, 48)

Consistency is more important than flourish.

---

## 6. Motion System

Motion exists to signal progress and feedback.

Never decorative.

---

### 6.1 Timing

Fast interactions: 120–180ms  
Success animations: 200–300ms  
Page transitions: ≤ 250ms  

No slow fades.
No dramatic cinematic transitions.

---

### 6.2 Success Feedback

Correct answer must:

- Trigger subtle pulse
- Increment rating with numeric animation
- Show tier badge reaction (micro glow or highlight)
- Brief positive accent flash

Wrong answer must:

- Brief shake (subtle)
- Highlight incorrect choice
- Transition immediately to explanation

Feedback loop must feel tight.

---

## 7. Gamification Principles

Gamification must be structural, not cosmetic.

Allowed:
- Rating increments
- Tier badges
- Streak counters
- Mastery gates
- Ladder visualization

Not allowed:
- Random XP currencies
- Cosmetic unlock clutter
- Cartoon characters
- Excess emoji

The rating ladder is the game.

---

## 8. Component Rules

### 8.1 Buttons

Primary button:
- Accent color
- Solid fill
- Clear hover state
- No gradients

Secondary button:
- Outline
- Subtle background

No oversized playful buttons.

---

### 8.2 Cards

Cards must:

- Contain structured content
- Have clear visual hierarchy
- Not float randomly
- Align to grid

No glassmorphism blur.
No excessive gradients.

---

### 8.3 Progress Indicators

Rating change must animate numerically.

Progress bars must:

- Be minimal
- Reflect real movement
- Avoid candy-like styles

Vertical progress preferred over horizontal.

---

## 9. World Selection Screen

Worlds must feel like realms, not SaaS tiles.

Each world card must include:

- Name
- Tagline
- Current rating
- Tier
- Vertical mini-ladder preview
- Enter action

Avoid white cards on white background.

Use tonal depth.

---

## 10. Attempt Screen Design Rules

The attempt screen is sacred.

Rules:

- Centered content
- No distracting background imagery
- Generous whitespace around problem
- Math rendered crisply
- Choices clearly spaced
- Submit/Next clearly separated

Rating badge visible but not dominant.

Focus is cognition, not decoration.

---

## 11. Background Rules

No photographic backgrounds.

Allowed:
- Subtle noise texture
- Soft radial gradient
- Abstract grid pattern
- Slight animated gradient drift (very subtle)

Background must never compete with problem text.

---

## 12. Micro-Interaction Philosophy

Every interaction should:

- Reinforce progression
- Signal clarity
- Reduce friction

Nothing should feel “tacked on.”

If animation does not convey state change, remove it.

---

## 13. Visual Anti-Patterns (Forbidden)

- Glass blur everywhere
- Random fantasy wallpaper
- Overuse of glow
- Multiple accent colors on one screen
- Excess rounded bubbly UI
- Loud gradients
- Emoji-heavy design

The system is refined, not whimsical.

---

## 14. The Emotional Goal

The user should feel:

“I am sharpening.”

Not:

“This is cute.”

Not:

“This is a startup dashboard.”

Not:

“This is a mobile game.”

Refined gamification.

Controlled intensity.

Clear ascent.
