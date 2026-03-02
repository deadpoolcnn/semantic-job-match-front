import { motion } from 'framer-motion';
import { Briefcase, MapPin, DollarSign } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useJobStore } from '@/store/useJobStore';

function ScoreRing({ score }: { score: number }) {
  const color =
    score >= 80 ? 'text-emerald-600' :
    score >= 60 ? 'text-indigo-600' :
    'text-amber-600';

  return (
    <div className={`flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-full border-2 ${score >= 80 ? 'border-emerald-200 bg-emerald-50' : score >= 60 ? 'border-indigo-200 bg-indigo-50' : 'border-amber-200 bg-amber-50'}`}>
      <span className={`text-sm font-bold leading-none ${color}`}>{score}</span>
    </div>
  );
}

export function TopMatches() {
  const topMatches = useJobStore((s) => s.topMatches);
  const selectedJobId = useJobStore((s) => s.selectedJobId);
  const selectJob = useJobStore((s) => s.selectJob);

  if (!topMatches.length) return null;

  return (
    <Tabs value={selectedJobId ?? undefined} onValueChange={selectJob}>
      <TabsList className="h-auto w-full flex-wrap justify-start gap-2 bg-transparent p-0">
        {topMatches.map((job, i) => (
          <TabsTrigger
            key={job.job_id}
            value={job.job_id}
            className="h-auto flex-col items-start gap-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left shadow-sm data-[state=active]:border-indigo-400 data-[state=active]:shadow-md"
          >
            <div className="flex w-full items-center justify-between gap-3">
              <span className="text-sm font-semibold text-slate-800 line-clamp-1">{job.title}</span>
              <ScoreRing score={Math.round(job.overall_score)} />
            </div>
            <span className="text-xs text-slate-500">{job.company}</span>
            <div className="flex flex-wrap gap-1 mt-0.5">
              {job.location && (
                <Badge variant="outline">
                  <MapPin className="mr-0.5 h-2.5 w-2.5" />{job.location}
                </Badge>
              )}
              {job.salary_range && (
                <Badge variant="secondary">
                  <DollarSign className="mr-0.5 h-2.5 w-2.5" />{job.salary_range}
                </Badge>
              )}
              <Badge variant="default">#{i + 1}</Badge>
            </div>
          </TabsTrigger>
        ))}
      </TabsList>

      {topMatches.map((job) => (
        <TabsContent key={job.job_id} value={job.job_id} />
      ))}
    </Tabs>
  );
}

export function CandidateSummaryBar() {
  const candidateSummary = useJobStore((s) => s.candidateSummary);
  if (!candidateSummary) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white px-5 py-3 shadow-sm"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100">
        <Briefcase className="h-4 w-4 text-indigo-600" />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-800">
          {candidateSummary.name ?? '候选人画像'}
        </p>
        <p className="text-xs text-slate-500">
          {candidateSummary.current_level}
          {candidateSummary.total_experience_years != null &&
            ` · ${candidateSummary.total_experience_years} 年经验`}
        </p>
      </div>
      {candidateSummary.target_role_in_5yr && (
        <div className="ml-auto">
          <span className="text-xs text-slate-500">5年目标</span>
          <Badge variant="default" className="ml-2">{candidateSummary.target_role_in_5yr}</Badge>
        </div>
      )}
      {candidateSummary.key_skills?.slice(0, 5).map((s) => (
        <Badge key={s} variant="secondary">{s}</Badge>
      ))}
    </motion.div>
  );
}
