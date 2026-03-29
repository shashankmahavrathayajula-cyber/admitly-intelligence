

# Admitly — Premium AI Admissions Platform Frontend

## Design System
- **Style**: Catalis-inspired — light sky-blue gradient backgrounds, clean white cards, serif/sans-serif typography mix (serif for hero headings, sans-serif for body), soft shadows, premium spacing
- **Color palette**: Sky-blue gradients for hero/CTA sections, white card backgrounds, dark navy text, blue accent for scores/CTAs, subtle gray borders
- **Typography**: Large elegant serif headings (mix of regular and italic for emphasis), clean sans-serif body text
- **Components**: Reusable badge chips (★ SECTION LABEL), premium cards, score visualizations, multi-step form elements

## Pages & Structure

### 1. Landing Page (`/`)
- Sticky navbar: Logo + Home, Features, Pricing, Contact + "Get Started" CTA
- Hero section with sky-blue gradient background, large serif heading ("AI-Powered Admissions Intelligence"), subtitle, dual CTAs
- "How It Works" — 3-step visual flow (Input → Analyze → Results)
- Features section — 4 cards (Profile Evaluation, University Fit, Strategic Insights, Multi-School Comparison)
- Stats bar (e.g., "10,000+ evaluations", "500+ universities")
- Testimonials carousel
- Final CTA section with gradient background
- Clean footer with links

### 2. Auth Pages (UI shells, local state)
- `/login` — email + password, "Forgot password?" link, sign-up link
- `/signup` — name, email, password, confirm password
- `/forgot-password` — email input for reset
- Auth context with local state management, ready for real backend wiring
- Protected route wrapper for authenticated pages

### 3. Application Input (`/application`)
- Multi-step wizard flow with progress indicator
- **Step 1 — Academics**: GPA input, course rigor selector, intended major
- **Step 2 — Activities & Leadership**: Dynamic list for extracurriculars with add/remove, leadership indicators
- **Step 3 — Honors & Awards**: Dynamic list with add/remove
- **Step 4 — Essays**: Personal statement textarea with character guidance
- **Step 5 — University Selection**: Searchable multi-select with popular suggestions
- **Step 6 — Review & Submit**: Summary of all inputs before submission
- Form state stored in context, auto-saved to localStorage as drafts
- Modular field config so sections can be added/rearranged easily

### 4. Evaluation Results (`/results`)
- Loading state: "Analyzing your application…" with animated progress
- **Single university view**: Large alignment score ring, category score cards (Academic Strength, Activity Impact, etc.), strengths/weaknesses/suggestions panels
- **Multi-university view**: Side-by-side comparison cards, radar chart overlay, comparative score table
- Graceful error handling with retry button
- Clean transformation layer mapping backend response to UI components

### 5. Dashboard Shell (`/dashboard`)
- Recent evaluations list (from localStorage)
- Saved drafts with resume capability
- "New Evaluation" CTA

## Architecture

### API Layer (`src/services/api.ts`)
- Centralized service with `VITE_API_BASE_URL`
- `evaluateApplication()` function that transforms form state → backend request shape
- Response transformation layer for result rendering
- Console logging in dev mode
- Error handling with typed error responses

### State & Data
- `ApplicationContext` — holds form data across steps
- `AuthContext` — user session state (shell)
- localStorage utility for draft persistence
- Clean TypeScript interfaces for request/response contracts

### File Structure
```
src/
  components/
    landing/        — Hero, Features, Stats, Testimonials, CTA, Footer
    auth/           — LoginForm, SignupForm, ForgotPasswordForm
    application/    — StepAcademics, StepActivities, StepHonors, StepEssays, StepUniversities, StepReview
    results/        — ScoreRing, CategoryCard, RadarChart, StrengthsList, ComparisonTable
    layout/         — Navbar, ProtectedRoute, AppShell
  contexts/         — AuthContext, ApplicationContext
  services/         — api.ts (centralized API)
  types/            — application.ts, evaluation.ts
  pages/            — Index, Login, Signup, Application, Results, Dashboard
```

This gives a complete, production-quality frontend in one pass — modular enough to add SAT/ACT, essays variants, recommendation letters, or new result fields without restructuring.

