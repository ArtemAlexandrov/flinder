# Flinder

Flinder is a playful static web app that helps turn flower preferences into a practical report for a partner who does not understand flowers well.

## What is included

- visual quiz with short card-based questions
- bouquet reaction stage in a mini "Flinder" format
- deterministic report generator
- shareable report URL without backend
- print-friendly output for PDF sharing

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

## Deployment

### Vercel

1. Import the `web` folder into Vercel.
2. Framework preset: `Vite`.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. No environment variables are required for MVP.

### GitHub Pages or Netlify

The app is a static Vite build and can be deployed to any host that serves the `dist` folder.

## Project docs

- `../docs/product-requirements.md`
- `../docs/technical-requirements.md`
- `../docs/implementation-plan.md`
