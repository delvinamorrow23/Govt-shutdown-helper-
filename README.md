
# Shutdown Helper (PA & NY) — Next.js + Tailwind

A lightweight, static Next.js site that gives people personalized, official shutdown guidance plus nearby community resources for Pennsylvania and New York.

## Quick start

```bash
# install deps
npm i

# run locally
npm run dev
```

Open http://localhost:3000

## Deploy to Vercel

1. Create a new repo and push this folder.
2. Import the repo at https://vercel.com/new
3. Vercel detects Next.js automatically. Click Deploy.
4. Add a custom domain if you wish (e.g., shutdown.yourdomain.org).

## Update content (no code changes)

- All links and copy live in `data/resources.json`.
- Edit JSON in GitHub → Vercel auto-rebuilds → site updates.

## Notes

- This site aggregates links to official sources (OMB, SSA, HHS) and reputable nonprofits (211, Feeding America affiliates).
- It is not an official government website.
