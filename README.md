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

Source design and QA evidence are described in design-qa.md. Brand emblem sourced from the original Noble Escrow site. Architectural imagery generated for this concept. Content remains draft and should be reviewed before public launch.

## Public demo
https://shankarappan.github.io/noble-escrow-demo/

Changes pushed to main deploy through the GitHub Pages workflow. That workflow sets GITHUB_PAGES=true to build with the project URL prefix. Local development retains the root path.
