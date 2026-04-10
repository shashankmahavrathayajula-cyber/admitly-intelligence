# Project Memory

## Core
Admitly — AI admissions platform. Catalis-inspired: sky-blue gradients, Playfair Display serif headings, Inter body.
Auth is UI shell only (localStorage). Backend at VITE_API_BASE_URL, POST /api/evaluateApplication.
Drafts/results stored in localStorage. No real auth backend yet.
Dashboard is central hub with tabbed layout: Overview, Evaluate, Essay Analyzer, Action Plan, School List.
Old routes (/application, /essay-analyzer, /gap-analysis, /school-list) redirect to /dashboard?tab=...

## Memories
- [Design tokens](mem://design/tokens) — Color palette, typography, gradients, custom CSS utilities
- [Backend contract](mem://features/backend-contract) — Request/response shape for evaluation API
- [Architecture](mem://features/architecture) — File structure, contexts, services, extensibility notes
