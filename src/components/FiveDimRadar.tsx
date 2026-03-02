import { useState } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useJobStore } from '@/store/useJobStore';
import type { FiveDimScore, MatchedJob } from '@/types/models';

const DIM_LABELS: { key: keyof FiveDimScore; label: string; fullMark: number }[] = [
  { key: 'semantic', label: 'Semantic 语义', fullMark: 100 },
  { key: 'skill_graph', label: 'Skill Graph 技能', fullMark: 100 },
  { key: 'seniority', label: 'Seniority 资历', fullMark: 100 },
  { key: 'culture', label: 'Culture 文化', fullMark: 100 },
  { key: 'salary', label: 'Salary 薪资', fullMark: 100 },
];

const JOB_COLORS = ['#4f46e5', '#059669', '#d97706', '#dc2626', '#7c3aed'];

function buildRadarData(jobs: MatchedJob[]) {
  return DIM_LABELS.map(({ key, label, fullMark }) => {
    const entry: Record<string, string | number> = { dim: label, fullMark };
    jobs.forEach((job) => {
      // Use raw dimension score (0–1) × 100 so values are on a 0–100 scale
      entry[job.job_title] = Math.round(job.five_dim_score[key].score * 100);
    });
    return entry;
  });
}

interface DimTooltipPayload {
  name: string;
  value: number;
  color: string;
}

function CustomTooltip({
  active,
  payload,
  label,
  jobs,
}: {
  active?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: readonly any[];
  label?: string | number;
  jobs: MatchedJob[];
}) {
  const typedPayload = payload as DimTooltipPayload[] | undefined;
  const labelStr = String(label ?? '');
  if (!active || !typedPayload?.length) return null;

  const dimKey = DIM_LABELS.find((d) => d.label === labelStr)?.key;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-lg max-w-xs">
      <p className="mb-2 text-sm font-semibold text-slate-800">{labelStr}</p>
      {typedPayload.map((p) => {
        const job = jobs.find((j) => j.job_title === p.name);
        const dimDetail = dimKey ? job?.five_dim_score[dimKey] : undefined;
        return (
          <div key={p.name} className="mb-2 last:mb-0">
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: p.color }}>
                <span className="inline-block h-2 w-2 rounded-full" style={{ background: p.color }} />
                {p.name}
              </span>
              <span className="text-xs font-bold text-slate-800">{p.value}</span>
            </div>
            {dimDetail && (
              <div className="mt-1 pl-3.5 text-xs text-slate-500 space-y-0.5">
                <div>权重: {(dimDetail.weight * 100).toFixed(0)}% · 加权得分: {(dimDetail.weighted_score * 100).toFixed(1)}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function FiveDimRadar() {
  const topMatches = useJobStore((s) => s.topMatches);
  const selectedJobId = useJobStore((s) => s.selectedJobId);
  const [overlayAll, setOverlayAll] = useState(false);

  const displayJobs = overlayAll
    ? topMatches
    : topMatches.filter((j) => j.job_id === selectedJobId);

  if (!topMatches.length) return null;

  const data = buildRadarData(displayJobs);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>五维匹配雷达图</CardTitle>
          <button
            onClick={() => setOverlayAll((v) => !v)}
            className={[
              'rounded-md px-3 py-1 text-xs font-medium transition-colors',
              overlayAll
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
            ].join(' ')}
          >
            {overlayAll ? '▼ 叠加对比中' : '⊕ 叠加所有职位对比'}
          </button>
        </div>
        <div className="flex gap-2 flex-wrap mt-1">
          {DIM_LABELS.map(({ key, label }) => {
            const weight = topMatches[0]?.five_dim_score[key]?.weight;
            return (
              <Badge key={key} variant="secondary" className="text-xs">
                {label.split(' ')[0]}: {weight != null ? `${(weight * 100).toFixed(0)}%` : '-'}
              </Badge>
            );
          })}
        </div>
      </CardHeader>
      <CardContent>
        <motion.div
          key={selectedJobId + String(overlayAll)}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
        >
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis
                dataKey="dim"
                tick={{ fontSize: 12, fill: '#64748b', fontFamily: 'Inter, sans-serif' }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fontSize: 10, fill: '#94a3b8' }}
              />
              <Tooltip
                content={({ active, payload, label }) => (
                  <CustomTooltip active={active} payload={payload} label={label} jobs={displayJobs} />
                )}
              />
              {displayJobs.map((job, i) => (
                <Radar
                  key={job.job_id}
                  name={job.job_title}
                  dataKey={job.job_title}
                  stroke={JOB_COLORS[i % JOB_COLORS.length]}
                  fill={JOB_COLORS[i % JOB_COLORS.length]}
                  fillOpacity={overlayAll ? 0.12 : 0.2}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              ))}
              {displayJobs.length > 1 && <Legend />}
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </CardContent>
    </Card>
  );
}
