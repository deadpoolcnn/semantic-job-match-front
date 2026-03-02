import axios from 'axios';
import type { MatchApiResponse } from '@/types/models';
import { useJobStore } from '@/store/useJobStore';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  // ⚠️  DO NOT set withCredentials: true — backend uses allow_credentials=False
  withCredentials: false,
});

/** Simulated stage delays so the progress bar feels natural */
const STAGE_TIMELINE: [string, number, number][] = [
  // [stage key, target progress, delay ms]
  ['parsing', 25, 0],
  ['scoring', 65, 4000],
  ['insights', 90, 10000],
];

/**
 * Upload a resume file and match against jobs.
 * @param file  - The resume PDF or DOCX file
 * @param topK  - Number of top job matches to return (default 5)
 */
export async function matchResumeFile(
  file: File,
  topK = 5,
): Promise<MatchApiResponse> {
  const store = useJobStore.getState();

  // Kick off simulated stage progress in background
  const timers: ReturnType<typeof setTimeout>[] = [];
  STAGE_TIMELINE.forEach(([stage, progress, delay]) => {
    const t = setTimeout(() => {
      store.setLoadingStage(stage as Parameters<typeof store.setLoadingStage>[0], progress);
    }, delay);
    timers.push(t);
  });

  const formData = new FormData();
  formData.append('file', file);
  formData.append('top_k', String(topK));

  try {
    const response = await api.post<MatchApiResponse>(
      '/api/v2/match_resume_file',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60_000, // 60 s hard limit
      },
    );
    timers.forEach(clearTimeout);
    return response.data;
  } catch (err) {
    timers.forEach(clearTimeout);
    if (axios.isAxiosError(err)) {
      const msg =
        err.response?.data?.detail ??
        err.response?.data?.message ??
        err.message ??
        'Unknown API error';
      throw new Error(String(msg));
    }
    throw err;
  }
}
