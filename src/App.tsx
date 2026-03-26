import { BrainCircuit, FlaskConical } from 'lucide-react';
import { useJobStore } from '@/store/useJobStore';
import { ResumeUpload } from '@/components/ResumeUpload';
import { CandidateSummaryBar, TopMatches } from '@/components/TopMatches';
import { FiveDimRadar } from '@/components/FiveDimRadar';
import { JobComparisonMatrix } from '@/components/JobComparisonMatrix';
import { SkillGapsPanel } from '@/components/SkillGapsPanel';
import { JobDetailCard, AiInsightsCard } from '@/components/JobDetailCard';
import { CareerPathTimeline } from '@/components/CareerPathTimeline';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Analytics } from '@vercel/analytics/react';

export default function App() {
  const loadingStage = useJobStore((s) => s.loadingStage);
  const topMatches = useJobStore((s) => s.topMatches);

  const isLoading = loadingStage !== 'idle' && loadingStage !== 'done' && loadingStage !== 'error';
  const hasDone = loadingStage === 'done' && topMatches.length > 0;

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-slate-50 font-sans">
        {/* ── Global Header ──────────────────────────────────── */}
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-screen-2xl items-center gap-3 px-6 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
                <BrainCircuit className="h-4.5 w-4.5 text-white" />
              </div>
              <span className="text-base font-bold text-slate-900">Semantic Job Match</span>
            </div>
            <span className="ml-1 rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600">
              AI Powered · v2
            </span>
            {import.meta.env.DEV && (
              <button
                className="ml-auto flex items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 hover:bg-amber-100 transition-colors"
                onClick={() => import('@/utils/devMock').then((m) => m.loadMockData())}
              >
                <FlaskConical className="h-3.5 w-3.5" />
                加载示例数据
              </button>
            )}
          </div>
        </header>

        <main className="mx-auto max-w-screen-2xl px-6 py-6 space-y-5">
          {/* ── Upload + Candidate Summary ─────────────────────── */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_2fr]">
            <ResumeUpload />
            <div className="flex flex-col justify-center">
              {hasDone && <CandidateSummaryBar />}
              {!hasDone && !isLoading && (
                <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-5 text-center">
                  <p className="text-sm text-slate-400">上传简历后，候选人画像将显示于此</p>
                </div>
              )}
            </div>
          </div>

          {/* ── Top K Job Tabs ────────────────────────────────── */}
          {hasDone && (
            <section>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-slate-400">
                Top Matches · 推荐职位
              </h2>
              <TopMatches />
            </section>
          )}

          {/* ── Loading Skeleton ──────────────────────────────── */}
          {isLoading && <LoadingSkeleton />}

          {/* ── Main Split Layout ─────────────────────────────── */}
          {hasDone && (
            <div className="flex flex-col gap-5 xl:flex-row">
              {/* Left panel 60% */}
              <div className="flex flex-col gap-5 xl:w-[60%]">
                <FiveDimRadar />
                <JobComparisonMatrix />
                <SkillGapsPanel />
              </div>

              {/* Right panel 40% */}
              <div className="flex flex-col gap-5 xl:w-[40%]">
                <JobDetailCard />
                <AiInsightsCard />
                <CareerPathTimeline />
              </div>
            </div>
          )}

          {/* ── Empty state ───────────────────────────────────── */}
          {loadingStage === 'idle' && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50">
                <BrainCircuit className="h-8 w-8 text-indigo-400" />
              </div>
              <h2 className="text-xl font-semibold text-slate-700">上传简历，开启 AI 匹配</h2>
              <p className="mt-2 max-w-md text-sm text-slate-400">
                系统将通过语义理解、技能图谱、资历、文化适配和薪资五个维度，
                为你精准匹配最适合的职位，并预测 5 年职业发展路径。
              </p>
            </div>
          )}

          {/* ── Error state ───────────────────────────────────── */}
          {loadingStage === 'error' && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-base font-medium text-red-600">接口请求失败，请检查网络或后端服务状态</p>
            </div>
          )}
        </main>
      </div>
      <Analytics />
    </TooltipProvider>
  );
}
