# Flinder Implementation Plan

## Phase 1. Foundation

- write product requirements
- write technical requirements
- confirm MVP flow and report structure
- choose static architecture

## Phase 2. Frontend Scaffold

- initialize Vite + React + TypeScript project
- set up base styles and theme tokens
- create app shell and responsive layout

## Phase 3. Quiz Engine

- define local question config
- build reusable card-based question components
- add progress and celebration feedback
- add conditional step navigation
- support photo-based answer cards for every question
- add question visibility rules and branch ordering

## Phase 4. Bouquet Tinder Layer

- create bouquet example dataset
- build like / maybe / dislike interaction
- connect bouquet reactions to preference profile
- extend dataset attributes so follow-up answers influence scoring

## Phase 5. Report Generator

- implement deterministic profile derivation
- build report sections:
  - safe choices
  - occasion picks
  - no-go picks
  - quick cheat sheet
- add share-by-link support
- add print-friendly view

## Phase 6. Polish

- improve motion and microcopy
- refine mobile spacing and hierarchy
- improve empty and edge states
- remove unclear florist terms in favor of plain-language labels
- ensure every key preference question has real visual examples

## Phase 7. Validation And Deployment

- run production build
- verify shared report behavior
- prepare deploy instructions
- deploy to Vercel or another free host
