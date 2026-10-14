# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Approved visual direction
Use the approved noble-escrow-homepage-mercury-inspired-v3.png in ../noble-escrow-audit/mockups as visual truth. Warm white, charcoal, champagne gold; no navy or blue. Cinematic coastal hero, refined Manrope typography, original escrow journey illustration, dark landscape solutions and light coastal trust CTA. Prior travertine direction superseded. This is a responsive website, not a native mobile app. Enquiries are presentation-only: no transmission, persistence or real escrow transaction.

FAQ assistant preference: free, client-side curated FAQ matching. No paid AI API. Keep responses grounded in the editable FAQ source; unsupported questions must offer team contact rather than fabricate answers. Do not persist or transmit conversations.

Motion preference: premium 3D depth and flowing scroll experience, preserving the approved visual identity. Use native scroll, a sticky four-stage escrow journey, subtle parallax and perspective reveals. Respect reduced motion and provide pause control; preserve all navigation and demo interactions.
