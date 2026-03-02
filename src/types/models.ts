// ─────────────────────────────────────────────
// Core Domain Models  (mirrors backend Pydantic)
// Format reference: src/examples/format.json
// ─────────────────────────────────────────────

/** Five-dimension weighted score for a single job match */
export interface FiveDimScore {
  semantic: DimDetail;
  skill_graph: DimDetail;
  seniority: DimDetail;
  culture: DimDetail;
  salary: DimDetail;
}

export interface DimDetail {
  /** Raw dimension score, 0–1 */
  score: number;
  weight: number;
  /** weight × score, 0–1 */
  weighted_score: number;
}

/** Decision gate at a career fork */
export interface DecisionGate {
  year: number;
  question: string;
  option_A: string;
  option_B: string;
  impact: string;
}

/** A single career milestone year */
export interface Milestone {
  year: number;
  title: string;
  skills_needed: string[];
  decision_gate?: DecisionGate | null;
}

/** Top-level career prediction (shared across all matched jobs) */
export interface CareerPrediction {
  current_level: string;
  target_role_in_5yr: string;
  milestones: Milestone[];
  skill_gaps_to_bridge: string[];
  confidence_note: string;
}

/**
 * Per-job counterfactual career path.
 * Key: counterfactual_path inside each top_matches entry.
 */
export interface CounterfactualPath {
  job_id: string;
  job_title: string;
  company: string;
  trajectory_summary: string;
  milestones: Milestone[];
  key_risks: string[];
}

// ── Job Comparison Matrix (top-level) ────────────────────────

export interface MatrixRow {
  dimension: string;
  /** keys are job_id strings */
  values: Record<string, string>;
}

export interface JobComparisonMatrixData {
  rows: MatrixRow[];
  recommendation: string;
}

// ── Candidate Summary ─────────────────────────────────────────

export interface CandidateSummary {
  name?: string;
  /** e.g. "Instructor", "Senior Engineer" */
  current_title: string;
  /** e.g. "mid", "senior" */
  seniority?: string;
  years_of_experience?: number | null;
  skills: string[];
  career_objective?: string;
}

// ── Matched Job ───────────────────────────────────────────────

export interface MatchedJob {
  job_id: string;
  /** Field name from API is job_title */
  job_title: string;
  company: string;
  /** 0–1 float; multiply ×100 before display */
  score: number;
  five_dim_score: FiveDimScore;
  /** Array of reasons why this job matches */
  why_match: string[];
  /** Skill gaps specific to this job */
  skill_gaps: string[];
  career_fit_commentary: string;
  implicit_requirements?: string[];
  counterfactual_path?: CounterfactualPath | null;
}

// ── Full API Response ─────────────────────────────────────────

export interface MatchApiResponse {
  request_id?: string;
  candidate_summary: CandidateSummary;
  /** Top-level career prediction (not per-job) */
  career_prediction: CareerPrediction;
  top_matches: MatchedJob[];
  overall_summary?: string;
  development_plan?: string;
  job_comparison_matrix: JobComparisonMatrixData;
  errors?: Record<string, unknown>;
  timings?: Record<string, number>;
}

// ─────────────────────────────────────────────
// UI State helpers
// ─────────────────────────────────────────────

export type LoadingStage =
  | 'idle'
  | 'parsing'       // "正在解析 PDF…"
  | 'scoring'       // "正在进行5维匹配…"
  | 'insights'      // "Kimi 正在生成职业洞察…"
  | 'done'
  | 'error';
