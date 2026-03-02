# Semantic Job Match — Frontend

AI-powered resume-to-job matching dashboard built with React 19, TypeScript, and Vite. Users upload a resume (PDF or DOCX), the backend analyses it with semantic matching + Kimi AI, and the frontend renders a rich multi-panel dashboard showing ranked job matches, skill gaps, a career path timeline, and comparative matrices — all updating reactively through a single Zustand store.

---

## Features

### Resume Upload (`ResumeUpload.tsx`)
- Drag-and-drop or click-to-browse file picker. Accepts `.pdf` and `.docx` only (MIME type + extension validation, max ~10 MB guideline displayed).
- On file selection the component immediately resets the store, records the file name, advances the stage to `parsing`, and calls `matchResumeFile()`.
- While waiting it shows an animated progress bar with human-readable stage labels:
  - *"Parsing PDF / DOCX…"* (parsing)
  - *"Running 5-dimension semantic matching…"* (scoring)
  - *"Kimi is generating career insights…"* (insights)
- On error a dismissable alert appears inside the card with the server error message.
- After `done`, the card collapses to a compact "already uploaded" chip with a reset (×) button so the user can upload again.

### Candidate Summary Bar (`CandidateSummaryBar` in `TopMatches.tsx`)
- Appears in the top-right slot after a successful match.
- Displays name, current title, seniority level, years of experience, and up to 5 extracted skills as badges.
- Shows the 5-year target role from the global `career_prediction` as a badge on the right.

### Top-K Job Tabs (`TopMatches.tsx`)
- Renders matched jobs as a horizontal tab strip (Radix `Tabs`), each tab showing job title, company, rank badge, and a colour-coded score ring (green ≥ 80, indigo ≥ 60, amber otherwise).
- Selecting a tab updates `selectedJobId` in the store, which propagates reactively to every other panel without any prop drilling.

### Five-Dimension Radar Chart (`FiveDimRadar.tsx`)
- Recharts `RadarChart` plotting the five scoring dimensions on a 0–100 scale, one polygon per job.
- Dimensions: **Semantic**, **Skill Graph**, **Seniority**, **Culture**, **Salary**.
- Default view shows only the selected job; a toggle switch overlays all matched jobs simultaneously with distinct colors (`#4f46e5`, `#059669`, `#d97706`, `#dc2626`, `#7c3aed`).
- Custom tooltip shows raw score, dimension weight (%), and weighted score for each job on hover.

### Job Comparison Matrix (`JobComparisonMatrix.tsx`)
- Scrollable table comparing all matched jobs across qualitative dimensions returned by the API (e.g. technical depth, career ceiling, risk level, salary band).
- Alternating row backgrounds for readability.
- Cell values are rendered as colour-coded badges: `success` / `warning` / `danger` for risk dimensions, `default` / `secondary` / `outline` for technical and career dimensions — determined heuristically from the dimension name and value text.
- An AI recommendation banner (Lightbulb icon) appears below the table with the API's overall recommendation text.

### Skill Gaps Panel (`SkillGapsPanel.tsx`)
- Reactively displays the `skill_gaps` array for whichever job is currently selected.
- Each gap is an amber `warning` badge, stagger-animated in with Framer Motion so they cascade in one by one.
- Hides itself entirely when there are no gaps.

### Job Detail Card (`JobDetailCard.tsx`)
- Score ring (colour-coded composite score out of 100) alongside job title and company name.
- Five mini progress bars (one per dimension) for a compact at-a-glance breakdown.
- Bullet list of `why_match` reasons with green checkmarks.
- Animated slide-in on job switch (`opacity` + `x` transition, keyed by `job_id`).

### AI Insights Card (`AiInsightsCard.tsx`, exported from `JobDetailCard.tsx`)
- Displays the full `career_fit_commentary` from Kimi (multi-line, whitespace preserved).
- Shows a career trajectory arrow: **current level → 5-year milestone title** (sourced from the job's `counterfactual_path` when available, falling back to the global `career_prediction`).
- Shows the `trajectory_summary` from the counterfactual path as an italicised footnote.
- "Kimi" badge labels the AI source.

### Career Path Timeline (`CareerPathTimeline.tsx`)
- Vertical custom timeline (no library — built with CSS flex + a border line) showing year-labelled milestone nodes at Y1, Y3, Y5+ with colour coding (indigo / violet / emerald).
- Each node is a collapsible accordion: click to expand/collapse skills needed at that milestone.
- **Decision Gates** — milestones optionally contain a `DecisionGate` with a question and two branching options (Route A / Route B). Clicking a route reveals the impact text with an animated expand/collapse. Choices are independently tracked per gate.
- A mode toggle lets the user switch between the **global career prediction** (shared across all jobs) and the **per-job counterfactual path** (what the career looks like if you take this specific job).
- A `key_risks` section lists the risks specific to the per-job path.

### Loading Skeleton (`LoadingSkeleton.tsx`)
- Full-page shimmer placeholder rendered whenever `loadingStage` is not `idle`, `done`, or `error`.
- Mirrors the approximate layout of the results grid so the page does not jump on load.

---

## Tech Stack

| Layer | Library | Version |
|---|---|---|
| Framework | React | ^19.2.0 |
| Language | TypeScript | ~5.9.3 |
| Build | Vite | ^7.3.1 |
| Styling | Tailwind CSS v4 | ^4.2.1 |
| UI Primitives | Radix UI (Alert Dialog, Dialog, Progress, Slot, Tabs, Tooltip) | ^1.x |
| Charts | Recharts | ^3.7.0 |
| Animations | Framer Motion | ^12.34.3 |
| Icons | Lucide React | ^0.575.0 |
| Global State | Zustand | ^5.0.11 |
| HTTP Client | Axios | ^1.13.6 |
| Utilities | clsx, tailwind-merge, class-variance-authority | latest |

---

## Project Structure

```
src/
├── App.tsx                      # Root layout: header, upload row, top matches, results grid
├── components/
│   ├── ResumeUpload.tsx         # File upload card with drag-and-drop + progress
│   ├── TopMatches.tsx           # CandidateSummaryBar + TopMatches tab strip
│   ├── FiveDimRadar.tsx         # Recharts radar chart with overlay toggle
│   ├── JobComparisonMatrix.tsx  # Comparison table with heuristic badge colouring
│   ├── SkillGapsPanel.tsx       # Stagger-animated skill gap badges
│   ├── JobDetailCard.tsx        # JobDetailCard + AiInsightsCard
│   ├── CareerPathTimeline.tsx   # Vertical milestone timeline + decision gates
│   ├── LoadingSkeleton.tsx      # Full-page shimmer skeleton
│   └── ui/                      # Shared Radix-based primitives
│       ├── alert.tsx
│       ├── badge.tsx            # Variants: default, secondary, success, warning, danger, outline
│       ├── button.tsx
│       ├── card.tsx
│       ├── progress.tsx
│       ├── skeleton.tsx
│       ├── tabs.tsx
│       └── tooltip.tsx
├── services/
│   └── api.ts                   # matchResumeFile() with simulated stage timeline
├── store/
│   └── useJobStore.ts           # Zustand store — single source of truth
├── types/
│   └── models.ts                # TypeScript interfaces mirroring backend Pydantic models
├── utils/
│   └── devMock.ts               # Dev-only mock loader (simulates stage delays)
└── examples/
    └── format.json              # Reference API response
```

---

## State Management

All application state lives in a single Zustand store (`useJobStore`). Components subscribe only to the slices they need, so job selection updates radar, detail card, skill gaps, and timeline simultaneously without prop drilling.

```
JobStore {
  // API results
  topMatches: MatchedJob[]
  candidateSummary: CandidateSummary | null
  careerPrediction: CareerPrediction | null
  jobComparisonMatrix: JobComparisonMatrixData | null
  overallSummary: string
  developmentPlan: string

  // Selection
  selectedJobId: string | null

  // Loading / error
  loadingStage: 'idle' | 'parsing' | 'scoring' | 'insights' | 'done' | 'error'
  loadingProgress: number        // 0–100
  errorMessage: string | null

  // Upload
  uploadedFileName: string | null
}
```

Key actions: `setApiResult`, `selectJob`, `setLoadingStage`, `setError`, `setUploadedFileName`, `reset`.

---

## API Contract

The frontend calls a single backend endpoint:

```
POST /api/v2/match_resume_file
Content-Type: multipart/form-data

file   — resume file (.pdf or .docx)
top_k  — number of job matches to return (default: 5)
```

**Hard timeout:** 60 seconds. Axios error messages are unwrapped from `err.response.data.detail`, `.message`, or the raw Axios message and forwarded to the store's `errorMessage`.

**Response shape** (`MatchApiResponse` in [src/types/models.ts](src/types/models.ts)):

```typescript
{
  request_id?: string
  candidate_summary: CandidateSummary
  career_prediction: CareerPrediction          // global, shared across all jobs
  top_matches: MatchedJob[]                    // each has five_dim_score, why_match,
                                               // skill_gaps, career_fit_commentary,
                                               // counterfactual_path
  overall_summary?: string
  development_plan?: string
  job_comparison_matrix: JobComparisonMatrixData
}
```

See [src/examples/format.json](src/examples/format.json) for a complete reference response.

### Five-Dimension Score

Each matched job carries a `five_dim_score` object with five dimensions. Every dimension has:

| Field | Description |
|---|---|
| `score` | Raw score, 0–1 |
| `weight` | Dimension weight, 0–1 |
| `weighted_score` | `score × weight`, 0–1 |

The UI multiplies `score × 100` for display.

---

## Loading Stages

`matchResumeFile()` fires background timers to advance the progress bar at realistic intervals while the real HTTP request is in flight:

| Stage | Target Progress | Simulated Delay |
|---|---|---|
| `parsing` | 25 % | immediate (0 ms) |
| `scoring` | 65 % | 4 000 ms |
| `insights` | 90 % | 10 000 ms |
| `done` | 100 % | on API response |

All timers are cancelled as soon as the response (or error) arrives.

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- A running backend API (default base URL: `http://localhost:8000`)

### Install & Run

```bash
npm install
npm run dev
```

### Environment Variables

Create a `.env.local` in the project root:

```env
VITE_API_BASE_URL=http://localhost:8000
```

If not set, the API client defaults to `http://localhost:8000`.

### Build for Production

```bash
npm run build       # type-check + Vite build → dist/
npm run preview     # serve the built dist/ locally
```

### Lint

```bash
npm run lint
```

---

## Development: Mock Data

In `development` mode a **"Load Sample Data"** button appears in the header. Clicking it calls `loadMockData()` from [src/utils/devMock.ts](src/utils/devMock.ts), which:

1. Sets the filename to `example_resume.pdf`.
2. Simulates the three loading stages with 600 ms delays each.
3. Imports [src/examples/format.json](src/examples/format.json) at runtime and normalises it into a `MatchApiResponse`.
4. Calls `setApiResult()` — the entire dashboard populates exactly as if the real API had responded.

This lets you iterate on UI without a running backend.
