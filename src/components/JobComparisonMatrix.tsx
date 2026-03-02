import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useJobStore } from '@/store/useJobStore';
import type { MatrixRating } from '@/types/models';

const MATRIX_DIMS = [
  { key: 'career_ceiling' as const, label: 'Career Ceiling' },
  { key: 'technical_depth' as const, label: 'Technical Depth' },
  { key: 'risk' as const, label: 'Risk Level' },
  { key: 'salary_trajectory' as const, label: 'Salary Trajectory' },
  { key: 'culture_pace' as const, label: 'Culture Pace' },
  { key: 'management_vs_ic' as const, label: 'Mgmt vs IC' },
];

function rateToBadgeVariant(dim: string, value: MatrixRating) {
  const v = value?.toLowerCase() ?? '';
  if (dim === 'risk') {
    if (v === 'low') return 'success';
    if (v === 'medium') return 'warning';
    return 'danger';
  }
  if (v.includes('high') || v.includes('ic-heavy') || v.includes('strong')) return 'default';
  if (v.includes('medium') || v.includes('mixed')) return 'secondary';
  return 'outline';
}

export function JobComparisonMatrix() {
  const topMatches = useJobStore((s) => s.topMatches);
  const recommendation = useJobStore((s) => s.recommendation);

  if (!topMatches.length) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>职位对比矩阵</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto p-0">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide w-36">
                  维度
                </th>
                {topMatches.map((job) => (
                  <th
                    key={job.job_id}
                    className="px-4 py-3 text-center text-xs font-semibold text-slate-700"
                  >
                    <div className="line-clamp-2">{job.title}</div>
                    <div className="text-indigo-500 font-bold text-sm mt-0.5">
                      {Math.round(job.overall_score)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MATRIX_DIMS.map(({ key, label }, rowIdx) => (
                <tr
                  key={key}
                  className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}
                >
                  <td className="px-5 py-3 text-xs font-medium text-slate-600 whitespace-nowrap">
                    {label}
                  </td>
                  {topMatches.map((job) => {
                    const raw = job.comparison_matrix?.[key] as MatrixRating | undefined;
                    const val = raw ?? '—';
                    return (
                      <td key={job.job_id} className="px-4 py-2.5 text-center">
                        <Badge variant={rateToBadgeVariant(key, val) as Parameters<typeof Badge>[0]['variant']}>
                          {val}
                        </Badge>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          {recommendation && (
            <div className="px-5 py-4 border-t border-slate-100">
              <Alert variant="default">
                <Lightbulb className="h-4 w-4 text-blue-500" />
                <AlertTitle>AI 推荐结论</AlertTitle>
                <AlertDescription>{recommendation}</AlertDescription>
              </Alert>
            </div>
          )}
        </motion.div>
      </CardContent>
    </Card>
  );
}
