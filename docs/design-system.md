# Design System — Joyful Precision

This system follows a Nintendo-inspired doctrine:

Interaction first.
Response second.
Aesthetic third.

Every interactive element must feel alive.

The interface must feel:
- Energetic
- Responsive
- Physical
- Warm
- Precise

Not corporate.
Not sterile.
Not chaotic.
Not childish.

Fun is engineered, not implied.
1. Core Emotional Pillars
The UI must communicate:

Climb

Momentum

Reaction

Energy buildup

Gentle recovery

If any screen feels static, it is incomplete.

2. Visual Tone
Primary Mode: Dark (but warm).

Background Primary: #0F141B
Background Secondary: #151C25
Surface Panel: #1C2430

No flat matte voids.
Background must have subtle depth:

Radial center light (very subtle)

Soft animated noise (barely perceptible)

Extremely slow gradient drift

The background must breathe.

3. Color Philosophy
Nintendo uses color emotionally.

We use controlled vibrancy.

Accent Colors
Mathematics → Luminous Blue (#4F8CFF)
Physics → Charged Violet (#9C6BFF)
Comedy → Warm Amber (#FFB547)

Accent is never decorative.
Accent is used for:

Interaction

Progress

Motion feedback

Streak heat

4. Typography
Typeface must feel modern and human.

Primary: Inter / Geist
Math: KaTeX default

Headings are slightly heavier than normal SaaS.

Hierarchy must be obvious without reading.

Font weight is preferred over color to indicate structure.

5. Interaction Rules (Mandatory)
Every interactive element must:

Scale 1.02–1.04 on hover

Slightly increase shadow depth

Show accent edge line

Transition within 120–160ms

No element changes state instantly without motion.

6. Physicality Rules
Buttons must compress on press.

Scale: 0.96–0.98
Duration: 80–120ms

Release must slightly overshoot before settling.

All primary interactions must simulate physical response.

Flat color change alone is forbidden.

7. Answer Card Behavior
Before selection:

Slight lift on hover (translateY -2px)

Accent line appears on left edge

Subtle glow (low intensity)

On click (before reveal):

Brief compress animation (80ms)

Subtle anticipation pulse (120ms)

On correct:

Card flashes accent glow (200ms)

Small overshoot scale 1.03 → 1.00

Rating number animates upward

Subtle particle spark (2–3 minimal particles max)

Correct sound plays

On wrong:

Quick horizontal shake (subtle)

Low red-tint pulse

Explanation revealed immediately

Wrong sound plays

Failure must feel safe.
Never punishing.

8. Rating Animation Rules
Rating change must:

Animate numerically (count up/down)

Overshoot slightly (+2 then settle)

Trigger small glow pulse on rating badge

Duration: 200–300ms

Silent number updates are forbidden.

9. Streak Energy System (Visual)
Streak is not a number.
It is energy.

At streak 2–3:

Subtle accent glow on panel edges.

At streak 4–5:

Accent glow intensifies.

Background radial light slightly brighter.

At streak 6+:

Gentle animated pulse (very subtle).

Slight shimmer on accent borders.

Streak must feel like rising heat.

Never overwhelming.
Never flashing.

10. Motion Doctrine
Motion exists for:

State change

Anticipation

Release

Momentum

Timing Rules:

Micro interactions: 120–160ms
Correct feedback: 200–300ms
Level up: 400–600ms

No motion longer than 700ms.

Idle motion:

Background drift ≤ 1px over 5–10 seconds

Panel breathing scale 1.00 → 1.01 → 1.00 every 6–8 seconds

The interface must feel alive even when idle.

11. Spatial Ascent Visualization
Progress must feel vertical.

Rating display must include:

Vertical mini-ladder

Moving marker

Visible upward motion when rating increases

Flat number-only display is insufficient.

Climb must be visible.

12. Anti-Patterns (Forbidden)
Static interactions

No-motion feedback

Silent rating changes

Flat white surfaces

Instant state changes

Overuse of blur

Excess gradients

Cartoon effects

Refined playfulness only.

13. Emotional Target
The user should feel:

“I am moving.”
“I am getting sharper.”
“One more.”

Not:

“This is efficient.”
“This is clean.”
“This is a dashboard.”

Fun must be engineered.