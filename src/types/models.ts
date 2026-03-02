// ─────────────────────────────────────────────
// Core Domain Models  (mirrors backend Pydantic)
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
  score: number;
  weight: number;
  weighted_score: number;
  why_match?: string;
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

/** Full 5-year career prediction for a candidate */
export interface CareerPrediction {
  current_level: string;
  target_role_in_5yr: string;
  milestones: Milestone[];
  skill_gaps_to_bridge: string[];
  confidence_note: string;
}

/** Job comparison matrix row for a single dimension */
export type MatrixRating = 'Low' | 'Medium' | 'High' | 'Very High' | string;

export interface ComparisonMatrix {
  career_ceiling: MatrixRating;
  technical_depth: MatrixRating;
  risk: MatrixRating;
  salary_trajectory: MatrixRating;
  culture_pace: MatrixRating;
  management_vs_ic: string; // e.g. "IC-Heavy" | "Mixed" | "Management"
}

/** A single matched job returned by the API */
export interface MatchedJob {
  job_id: string;
  title: string;
  company: string;
  location?: string;
  salary_range?: string;
  overall_score: number;           // 0–100
  five_dim_score: FiveDimScore;
  skill_gaps_to_bridge: string[];
  career_fit_commentary: string;   // AI narrative
  career_prediction: CareerPrediction;
  comparison_matrix: ComparisonMatrix;
  recommendation?: string;
}

/** Full API response from POST /api/v2/match_resume_file */
export interface MatchApiResponse {
  candidate_summary: CandidateSummary;
  top_matches: MatchedJob[];
  recommendation: string;
}

export interface CandidateSummary {
  name?: string;
  current_level: string;
  target_role_in_5yr?: string;
  total_experience_years?: number;
  key_skills?: string[];
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
