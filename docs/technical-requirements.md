# Flinder Technical Requirements

## 1. MVP Architecture

Recommended stack:

- React
- TypeScript
- Vite
- plain CSS with design tokens and custom components

Why this stack:

- fast to build
- easy to host on Vercel, Netlify, or GitHub Pages
- no server required for the first version
- simple local development and cheap deployment

## 2. Application Model

The app should be a static single-page application with two major modes:

- quiz mode
- report mode

The report mode should be reconstructable from URL state so the result can be shared without a database.

## 3. State Management

MVP state can live in React state plus localStorage.

Required state areas:

- current step
- answers by question id
- selected bouquet reactions
- derived profile
- generated report

## 4. Shareable Report Strategy

To avoid backend costs in MVP:

- encode compact answer state into the URL hash or query string
- when the page loads with shared state, rebuild the report from that data
- provide copy-link action
- support print-friendly styling

This allows:

- zero backend hosting
- easy Vercel / GitHub Pages deployment
- instant sharing

## 5. Data Model

The app needs a local content layer with:

- question definitions
- bouquet example catalog
- flower family catalog
- occasion definitions
- scoring / mapping rules

Suggested entities:

- `Question`
- `Option`
- `BouquetCard`
- `FlowerFamily`
- `OccasionRule`
- `ReportSection`

## 6. Dynamic Flow Requirements

The questionnaire should be config-driven.

Each question should define:

- id
- type
- title
- helper copy
- answer options
- celebration message after selection
- visibility conditions

Supported answer types in MVP:

- single-select cards
- multi-select chips
- like / maybe / dislike bouquet cards

## 7. Report Generation Requirements

The report generator should derive:

- profile summary
- universal bouquet recommendations
- recommendations by occasion
- flowers to avoid
- bouquet styles to avoid
- quick cheat sheet for the partner

Generation does not need AI.
It can be based on deterministic scoring rules from user answers.

## 8. UI Requirements

- mobile-first layout
- responsive up to desktop
- highly visual card-based interactions
- playful motion for transitions and confirmations
- accessible contrast and clear touch targets

## 9. Design System Requirements

- custom CSS variables for colors, spacing, shadows, radii
- one intentional visual theme rather than default generic SaaS styling
- reusable button, card, progress, tag, and section patterns

## 10. Performance Requirements

- fast first load on static hosting
- no blocking heavy dependencies
- optimized bundle size
- graceful rendering on mobile network

## 11. Deployment Requirements

Primary deployment target:

- Vercel

Fallback deployment targets:

- Netlify
- GitHub Pages

Deployment requirements:

- static build output
- environment variables not required for MVP
- one-command build

## 12. Testing Requirements

Minimum checks for MVP:

- production build passes
- shared report URL opens correctly
- major flow works on mobile width
- no broken states when refreshing the page

## 13. Future-Friendly Extensions

The structure should allow later additions:

- custom bouquet image upload
- real bouquet examples from florist catalogs
- multiple saved reports
- AI recommendations
- backend persistence
