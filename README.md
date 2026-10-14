# Noble Escrow presentation demo

Responsive React/Vite website implementing the approved charcoal, warm white and gold design.

## Demo
Local preview: http://127.0.0.1:4173/

Working features: desktop/mobile navigation, solution and trust dialogs, FAQs, labelled enquiry form with required-field validation and a local-only success state. Enquiries are not transmitted or stored. No live transactions or tracking.

## Development
`npm install`
`npm run dev -- --host 127.0.0.1 --port 4173 --strictPort`

## Production build
`npm run build` creates static client files at dist/client and the bundled Sites adapter.
`npm run test:sites` checks the adapter.

Source design and QA evidence are described in design-qa.md. Brand emblem sourced from the original Noble Escrow site. Coastal and landscape imagery and the escrow illustration generated for the approved Mercury-inspired v3 concept. Manrope is bundled locally via Fontsource. Content remains draft and should be reviewed before public launch.

## Public demo
https://shankarappan.github.io/noble-escrow-demo/

Changes pushed to main deploy through the GitHub Pages workflow. That workflow sets GITHUB_PAGES=true to build with the project URL prefix. Local development retains the root path.

## Free FAQ assistant
The floating chat runs entirely in the browser, with no AI API, backend, message transmission or conversation storage. Its 17 curated topics live in src/faq-data.mjs and share the first four answers with the FAQ dialog. It matches common phrases and falls back to team contact for unsupported questions. This is a bounded FAQ assistant, not a generative AI adviser. Content is draft and needs business review before production use.

Run matcher checks: node --test tests/faq.test.mjs

## Scroll experience
Native-scroll coastal parallax, a sticky four-stage escrow journey with perspective rotation, and service/CTA entrance motion. Visitors can select a stage or pause motion. Reduced-motion preferences and short viewports show all stages in a static reading layout. No paid animation services or additional libraries.
