# YMUai — AI Capacity & Systems Proposal (Refugee Assistance Alliance)

Professional, client-ready proposal PDF generated from the original Word document.

## Files

- **`YMUai_Proposal_Refugee_Assistance_Alliance.pdf`** — the final deliverable (8 pages, US Letter, print-ready).
- **`YMUai_Proposal_Refugee_Assistance_Alliance.source.html`** — the editable HTML source used to render the PDF (fonts are injected at build time and omitted here to keep the file small).

## Design

- **Format:** US Letter (8.5" × 11"), 8 pages.
- **Type system:** Source Serif 4 (display headings, prices) paired with Inter (body and UI).
- **Palette:** deep navy with a warm gold accent and warm-ivory panels.
- **Structure:** full-bleed branded cover; numbered sections (01–08) for situation, method, team, plain-language glossary, tiered pricing cards (Foundation / Builder-recommended / Catalyst), add-ons table, funding notes, and terms; closing call-to-action with signature block. Content pages carry a confidential footer with page numbers.

## Rebuilding the PDF

The PDF was produced by injecting base64-embedded fonts into the source HTML and printing it with headless Chromium (via Playwright) at the CSS `@page` size, then merging a footer-free cover pass with a footered content pass.
