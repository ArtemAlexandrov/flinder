# Flinder Product Requirements

## 1. Product Vision

Flinder is a playful web experience that helps a girl explain her flower preferences in a way that is easy for her partner to understand and actually use.

The output is not a dry form result. It is a visual "flower passport" with:

- safe bouquet examples for almost any situation
- bouquets for specific occasions
- flowers and bouquet styles to avoid
- a short cheat sheet the partner can use in real life

## 2. Core Product Format

Recommended format: a hybrid of a visual quiz and a "bouquet Tinder" step.

Why this works better than a pure Tinder mechanic:

- a pure swipe flow is fun, but too shallow for capturing nuance
- a classic form captures nuance, but feels boring and text-heavy
- a hybrid flow keeps it playful while still producing a useful report

Recommended experience structure:

1. Base visual flow with 6 to 8 quick questions for everyone
2. Conditional follow-up questions based on previous answers
3. Swipe/like-dislike step for bouquet examples
4. Occasion-specific recommendations
5. Hard no-go flowers, formats, and anti-examples
6. Final report with concrete examples and practical buying rules

## 3. Users

Primary user:

- a girl who wants to explain her taste quickly, playfully, and without writing long explanations

Secondary user:

- her partner, who wants a simple and memorable guide for choosing flowers

## 4. User Jobs To Be Done

When I am asked what flowers I like, I want to answer through simple visuals and choices, so that I do not need to explain flower language in detail.

When I need to buy flowers for my girlfriend, I want a clear report with examples and anti-examples, so I can choose something good even if I know almost nothing about flowers.

## 5. Product Goals

- make the preference collection feel fun and light
- minimize typing
- rely on visual examples more than terminology
- produce an output that is useful in everyday buying situations
- keep MVP simple enough for static hosting and fast launch

## 6. Non-Goals For MVP

- no florist marketplace integration
- no real-time collaboration
- no personalized AI bouquet generation
- no account system
- no admin panel

## 7. Information We Need To Capture

### Overall taste

- soft / bright / dramatic / elegant / cute / minimal / lush
- modern vs classic bouquet feel
- mono bouquet vs mixed bouquet
- neat and clean vs airy and wild
- cut bouquet vs potted plant openness
- low-key gesture vs wow gesture
- minimal greenery vs abundant greenery
- minimal wrap vs decorative presentation

### Color preferences

- favorite palette
- disliked palette
- preferred accent colors
- tolerance for very bright or very dark bouquets

### Flower family preferences

- liked flowers
- neutral flowers
- disliked flowers
- absolute no-go flowers
- flower-specific nuance when relevant:
  - preferred rose style
  - preferred tulip style
  - preferred potted plant type

### Occasion logic

- bouquets for everyday dates
- bouquets for apology / reconciliation
- bouquets for birthday
- bouquets for celebration or achievement
- bouquets that feel "too much" for casual gifting

### Red flags

- flowers that feel old-fashioned
- flowers that feel funeral-like
- bouquets that feel cheap
- bouquet styles that look generic or impersonal
- bouquets with too much packaging
- bouquets with too much greenery
- bouquets with a scent profile that feels too strong
- gift formats that feel wrong for the user

## 8. Functional Requirements

### Quiz Flow

- user can start the experience without registration
- questions are short and visually driven
- each step has large answer cards and minimal text
- every question has a visual anchor through real photos or image-based examples
- progress is visible
- after each answer the interface gives a playful positive reaction
- some next questions adapt based on previous answers
- follow-up questions should appear only when they improve recommendation quality

### Bouquet Tinder Step

- user can quickly react to bouquet examples with like / maybe / no
- examples represent different bouquet styles, not only flower species
- this step influences the final report

### Final Report

- report is easy to scan on mobile
- report contains "safe choices", "occasion picks", and "never buy this"
- report uses visuals, not just text
- report includes short explanations in plain language
- report can be shared via link
- report can be copied or printed

## 9. UX Requirements

- mobile-first
- cheerful, flirtatious, encouraging tone
- minimal paragraphs
- strong visual hierarchy
- interactions should feel rewarding after every step
- no flower expertise required from the user
- terminology should stay human and non-florist
- the flow should feel smart, not long: fewer mandatory questions, more useful follow-ups

## 10. Content Principles

- use bouquet examples instead of botanical jargon where possible
- use simple labels like "light and airy" instead of expert terminology
- explain dislikes gently and clearly
- final advice should be practical, not abstract
- when detailed nuance is needed, ask through pictures, not technical terms
- if a specific flower family is selected, follow-up questions should describe visual differences in plain language

## 11. Success Criteria For MVP

- a user can finish the flow in 3 to 5 minutes
- the final report gives at least:
  - 3 universal safe bouquet ideas
  - 2 to 4 occasion-based recommendations
  - 3 clear no-go examples
- the report can be shared by link without a backend
- the app feels enjoyable enough to complete in one sitting
