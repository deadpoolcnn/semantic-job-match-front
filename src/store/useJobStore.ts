import { create } from 'zustand';
import type { MatchedJob, MatchApiResponse, LoadingStage, CandidateSummary } from '@/types/models';

interface JobStore {
  // ── API Result ───────────────────────────────
  topMatches: MatchedJob[];
  candidateSummary: CandidateSummary | null;
  recommendation: string;

  // ── Selection ────────────────────────────────
  selectedJobId: string | null;

  // ── Loading/Error ────────────────────────────
  loadingStage: LoadingStage;
  loadingProgress: number;     // 0–100
  errorMessage: string | null;

  // ── File ─────────────────────────────────────
  uploadedFileName: string | null;

  // ── Actions ──────────────────────────────────
  setApiResult: (data: MatchApiResponse) => void;
  selectJob: (id: string) => void;
  setLoadingStage: (stage: LoadingStage, progress: number) => void;
  setError: (msg: string) => void;
  setUploadedFileName: (name: string) => void;
  reset: () => void;
}

const initialState = {
  topMatches: [],
  candidateSummary: null,
  recommendation: '',
  selectedJobId: null,
  loadingStage: 'idle' as LoadingStage,
  loadingProgress: 0,
  errorMessage: null,
  uploadedFileName: null,
};

export const useJobStore = create<JobStore>((set) => ({
  ...initialState,

  setApiResult: (data) =>
    set({
      topMatches: data.top_matches,
      candidateSummary: data.candidate_summary,
      recommendation: data.recommendation,
      selectedJobId: data.top_matches[0]?.job_id ?? null,
      loadingStage: 'done',
      loadingProgress: 100,
    }),

  selectJob: (id) => set({ selectedJobId: id }),

  setLoadingStage: (stage, progress) =>
    set({ loadingStage: stage, loadingProgress: progress }),

  setError: (msg) =>
    set({ loadingStage: 'error', errorMessage: msg }),

  setUploadedFileName: (name) => set({ uploadedFileName: name }),

  reset: () => set(initialState),
}));

/** Derived selector: get the currently selected job */
export const useSelectedJob = () =>
  useJobStore((s) => s.topMatches.find((j) => j.job_id === s.selectedJobId) ?? null);
