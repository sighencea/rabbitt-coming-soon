# Handoff: Rabbitt — Coming Soon Page

## Overview
A single-screen "coming soon" / pre-launch landing page for **Rabbitt**, a heavyweight hoodie clothing brand. The page announces an upcoming first product drop and captures email addresses for a launch-notification waitlist. On submit, the email form swaps in place to a confirmation state.

## About the Design Files
The files in this bundle are **design references created in HTML** — a prototype showing the intended look and behavior, not production code to copy directly. The task is to **recreate this design in the target codebase's existing environment** (React, Vue, Next.js, Astro, plain HTML, etc.) using its established patterns, component library, and conventions. If no codebase/environment exists yet, choose the most appropriate framework for a marketing landing page (e.g. Next.js or Astro) and implement the design there. Wire the email field to a real mailing-list provider (Mailchimp, Klaviyo, ConvertKit, Resend, etc.) — the prototype's submit is front-end only.

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, and interactions are specified below. Recreate the UI pixel-perfectly using the codebase's existing libraries and patterns.

## Screens / Views

### Screen: Coming Soon (single page)
- **Name**: Coming Soon / Waitlist landing
- **Purpose**: Communicate that the brand is launching soon and collect the visitor's email for a launch notification.
- **Layout**: Full-viewport (`min-height: 100vh`) vertical flex column on a bone background, with `overflow: hidden`. Three stacked regions:
  1. **Header** (top bar) — horizontal flex, `space-between`, padding `28px 40px`.
  2. **Main** — `flex: 1`, centered both axes, `text-align: center`, padding `40px 24px 64px`.
  3. **Footer** — horizontal flex, `space-between`, padding `24px 40px`.
  - A decorative oversized **logomark watermark** is absolutely positioned behind everything (`z-index` below content). Content regions sit at `z-index: 2`.

#### Components

**Background watermark (logomark)**
- `assets/rabbitt-logomark.png`, absolutely positioned: `right: -7vw; bottom: -8vh; height: 115vh; width: auto`.
- `opacity: 0.05`, `pointer-events: none`, `user-select: none`.

**Header — left: logomark**
- `assets/rabbitt-logomark.png`, `height: 34px`, width auto.

**Header — right: tagline**
- Text: `EST. 2026 · Cut for character`
- Font: JetBrains Mono, `12px`, `letter-spacing: 0.18em`, `text-transform: uppercase`, color `#111` at `opacity: 0.7`.

**"Dropping Soon" pill (top of main)**
- Inline-flex, `gap: 9px`, padding `8px 16px`, `border: 1.5px solid #111`, `border-radius: 999px`, `margin-bottom: 44px`.
- Leading dot: `7px` circle, `background: #111`.
- Text: `Dropping Soon` — JetBrains Mono, `11.5px`, `letter-spacing: 0.22em`, uppercase.

**Logo + slogan lockup**
- `assets/rabbitt-logo-slogan.png` (the "Rabbitt / Cut for character" lockup), `width: min(560px, 82vw)`, height auto, `margin-bottom: 40px`.

**Body copy**
- `max-width: 480px`, `margin-bottom: 40px`, font Archivo `18px`, `line-height: 1.5`, `font-weight: 500`, color `#2b2b2b`.
- Text: "Heavyweight hoodies, built to last and cut for character. The first drop is almost here — be first through the door."

**Email form (default state)**
- Column flex, `gap: 12px`, `width: min(440px, 90vw)`.
- Input row: flex, `background: #fff`, `border: 1.5px solid #111`, `border-radius: 14px`, padding `6px`, `gap: 6px`.
  - **Input**: `type="email"`, `required`, placeholder `you@email.com`. Borderless, transparent, Archivo `16px` weight 500, padding `12px 14px`, color `#111`. Fills available width (`flex: 1`).
  - **Submit button**: text `Notify me`. `background: #111`, color `#f1ede5`, Archivo weight 700, `15px`, `letter-spacing: 0.02em`, padding `0 26px`, `border-radius: 9px`, `cursor: pointer`, `white-space: nowrap`. Hover: `opacity: 0.85`.
- Helper line below: "No spam. One email when we go live." — JetBrains Mono `11px`, `letter-spacing: 0.06em`, color `#111` at `opacity: 0.55`.

**Confirmation (success state — replaces the form)**
- Inline-flex row, `gap: 12px`, padding `18px 26px`, `background: #111`, color `#f1ede5`, `border-radius: 14px`, font `16px` weight 600.
- Leading `✓` glyph in JetBrains Mono.
- Text: "You're on the list. Watch your inbox."

**Footer**
- Left: `© 2026 Rabbitt`.
- Right: flex row, `gap: 22px` — `Instagram`, `TikTok` (link these to the brand's real social URLs).
- Both: JetBrains Mono `11px`, `letter-spacing: 0.12em`, uppercase, color `#111` at `opacity: 0.6`.

## Interactions & Behavior
- **Form submit**: `preventDefault()`, then swap the form for the confirmation block. In production, POST the email to the mailing-list provider, show a loading state on the button while in flight, and only show the confirmation on success.
- **Email validation**: native `required` + `type="email"`. Add explicit invalid-email error styling/messaging in production.
- **Entrance animations**: elements rise + fade in via the `rb-rise` keyframe — `from { opacity: 0; transform: translateY(14px) }` → `to { opacity: 1; transform: translateY(0) }`. Durations/delays, top to bottom: pill `.6s`, logo `.7s/.05s`, body `.7s/.1s`, form `.7s/.15s`; all `ease`, `both`. Confirmation animates in at `.5s`.
- **Button hover**: `opacity: 0.85`.
- **Responsive**: layout already fluid via `min()` widths and `vw` units; verify the header tagline and footer wrap/hide gracefully on narrow mobile (consider hiding the header tagline below ~480px).

## State Management
- `email: string` — controlled input value.
- `submitted: boolean` — toggles form vs. confirmation. Set `true` on successful submit.
- Production additions: `loading: boolean`, `error: string | null` for the network request.

## Design Tokens
- **Colors**
  - Background (bone): `#f1ede5`
  - Ink / primary: `#111`
  - Body text: `#2b2b2b`
  - Inverse text (on black): `#f1ede5`
  - Card/input surface: `#fff`
  - Selection: background `#111`, text `#f1ede5`
- **Typography**
  - Display/UI: **Archivo** (weights 500, 600, 700, 800)
  - Mono/labels: **JetBrains Mono** (weights 400, 500)
  - Both loaded from Google Fonts.
  - Scale: body `18px`, input/button/confirmation `15–16px`, mono labels `11–12px`.
- **Spacing**: section paddings `24–40px`; rhythm gaps `12px`, `40–44px`.
- **Border radius**: pill `999px`; input row / confirmation `14px`; button `9px`.
- **Borders**: `1.5px solid #111` (pill, input row).
- **Opacity accents**: watermark `0.05`; muted labels `0.55–0.7`.

## Assets
All in `assets/`, supplied by the brand (black-on-transparent PNGs):
- `rabbitt-logo-slogan.png` — full "Rabbitt + Cut for character" lockup (used as the hero).
- `rabbitt-logomark.png` — the bunny/R logomark (header + background watermark).
- `rabbitt-logo.png` — wordmark only (alternate, not used in current layout).

For production, request **SVG** versions of these marks for crisp scaling. Brand tagline: **"Cut for character."**

## Files
- `Rabbitt Coming Soon.dc.html` — the design prototype (included in this bundle). It is a streaming "Design Component" HTML file; treat the markup/styles inside the `<div>` body as the reference. Ignore the `<helmet>`/`<x-dc>` plumbing — that's prototyping-tool scaffolding, not part of the design.
- `assets/` — brand logo PNGs.
