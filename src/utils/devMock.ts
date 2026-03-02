/**
 * Dev-only utility: load the example format.json response into the store
 * so you can test the UI without a running backend.
 *
 * Usage (in browser console or a dev button):
 *   import { loadMockData } from '@/utils/devMock';
 *   loadMockData();
 */
import type { MatchApiResponse } from '@/types/models';
import { useJobStore } from '@/store/useJobStore';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeMockResponse(raw: any): MatchApiResponse {
  return {
    request_id: raw.request_id,
    candidate_summary: raw.candidate_summary,
    career_prediction: raw.career_prediction,
    top_matches: (raw.top_matches ?? []).map((job: any) => ({
      job_id: job.job_id,
      job_title: job.job_title,
      company: job.company,
      score: job.score,
      five_dim_score: job.five_dim_score,
      why_match: job.why_match ?? [],
      skill_gaps: job.skill_gaps ?? [],
      career_fit_commentary: job.career_fit_commentary ?? '',
      implicit_requirements: job.implicit_requirements,
      counterfactual_path: job.counterfactual_path ?? null,
    })),
    overall_summary: raw.overall_summary,
    development_plan: raw.development_plan,
    job_comparison_matrix: raw.job_comparison_matrix,
    errors: raw.errors,
    timings: raw.timings,
  };
}

export async function loadMockData() {
  const { setApiResult, setUploadedFileName, setLoadingStage } = useJobStore.getState();
  setUploadedFileName('example_resume.pdf');
  setLoadingStage('parsing', 25);

  // Simulate loading delay
  await new Promise((r) => setTimeout(r, 600));
  setLoadingStage('scoring', 65);
  await new Promise((r) => setTimeout(r, 600));
  setLoadingStage('insights', 90);
  await new Promise((r) => setTimeout(r, 600));

  const raw = await import('@/examples/format.json');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setApiResult(normalizeMockResponse(raw as any));
}
