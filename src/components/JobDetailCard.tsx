import { motion } from 'framer-motion';
import { Building2, TrendingUp, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSelectedJob, useJobStore } from '@/store/useJobStore';

export function JobDetailCard() {
  const job = useSelectedJob();
  if (!job) return null;

  const overallScore = Math.round(job.score * 100);
  const scoreColor =
    overallScore >= 80 ? 'text-emerald-600' :
    overallScore >= 60 ? 'text-indigo-600' :
    'text-amber-600';

  return (
    <motion.div
      key={job.job_id}
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Card>
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            {/* Score */}
            <div className={`flex flex-col items-center justify-center h-16 w-16 shrink-0 rounded-full border-2 ${overallScore >= 80 ? 'border-emerald-200 bg-emerald-50' : overallScore >= 60 ? 'border-indigo-200 bg-indigo-50' : 'border-amber-200 bg-amber-50'}`}>
              <span className={`text-xl font-bold leading-none ${scoreColor}`}>{overallScore}</span>
              <span className="text-[10px] text-slate-400 mt-0.5">综合分</span>
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-slate-900 leading-tight">{job.job_title}</h2>
              <div className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5" />{job.company}
                </span>
              </div>
            </div>
          </div>

          {/* Dim scores quick view */}
          <div className="mt-4 grid grid-cols-5 gap-2">
            {(
              [
                ['Semantic', job.five_dim_score.semantic],
                ['Skill', job.five_dim_score.skill_graph],
                ['Seniority', job.five_dim_score.seniority],
                ['Culture', job.five_dim_score.culture],
                ['Salary', job.five_dim_score.salary],
              ] as [string, { score: number; weight: number; weighted_score: number }][]
            ).map(([label, dim]) => {
              const s = Math.round(dim.score * 100);
              const barColor = s >= 80 ? 'bg-emerald-500' : s >= 60 ? 'bg-indigo-500' : 'bg-amber-400';
              return (
                <div key={label} className="flex flex-col items-center gap-1">
                  <span className="text-[10px] text-slate-500">{label}</span>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                      style={{ width: `${s}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-slate-700">{s}</span>
                </div>
              );
            })}
          </div>

          {/* Why match reasons */}
          {job.why_match?.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">匹配亮点</p>
              <ul className="space-y-1.5">
                {job.why_match.map((reason, i) => (
                  <li key={i} className="flex gap-2 text-xs text-slate-600">
                    <span className="mt-0.5 shrink-0 text-emerald-500">✓</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function AiInsightsCard() {
  const job = useSelectedJob();
  const careerPrediction = useJobStore((s) => s.careerPrediction);
  if (!job?.career_fit_commentary) return null;

  // Use job-specific counterfactual_path for trajectory, fallback to global
  const cp = job.counterfactual_path;
  const trajectoryFrom = careerPrediction?.current_level;
  const trajectoryTo = cp?.milestones?.at(-1)?.title ?? careerPrediction?.target_role_in_5yr;

  return (
    <motion.div
      key={job.job_id + '-ai'}
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, delay: 0.05 }}
    >
      <Card>
        <CardContent className="p-5">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50">
              <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800">AI 职业洞察</h3>
            <Badge variant="secondary" className="text-[10px]">Kimi</Badge>
          </div>
          <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-wrap">
            {job.career_fit_commentary}
          </p>

          {trajectoryFrom && trajectoryTo && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-slate-50 p-3">
              <TrendingUp className="h-4 w-4 text-indigo-400" />
              <div className="text-xs text-slate-600">
                <span className="font-medium">{trajectoryFrom}</span>
                <span className="text-slate-400 mx-1">→</span>
                <span className="font-medium text-indigo-600">{trajectoryTo}</span>
                <span className="text-slate-400 ml-1">（5年目标）</span>
              </div>
            </div>
          )}

          {cp?.trajectory_summary && (
            <p className="mt-3 text-xs italic text-slate-500 bg-slate-50 rounded-lg px-3 py-2">
              {cp.trajectory_summary}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
