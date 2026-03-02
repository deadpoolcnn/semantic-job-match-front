import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useJobStore } from '@/store/useJobStore';

/** Heuristically pick a badge variant based on dimension name + value text */
function rateToBadgeVariant(dimension: string, value: string): 'default' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline' {
  const v = value.toLowerCase();
  const dim = dimension.toLowerCase();

  if (dim.includes('risk')) {
    if (v.includes('low')) return 'success';
    if (v.includes('medium') || v.includes('mid')) return 'warning';
    return 'danger';
  }
  if (dim.includes('technical') || dim.includes('career ceiling') || dim.includes('salary')) {
    if (v.includes('deep') || v.includes('high') || v.includes('staff') || v.includes('principal') || v.includes('head')) return 'default';
    if (v.includes('medium') || v.includes('mid')) return 'secondary';
    return 'outline';
  }
  if (dim.includes('management') || dim.includes('mgmt')) {
    if (v.includes('ic')) return 'default';
    if (v.includes('management') || v.includes('em')) return 'warning';
    return 'secondary';
  }
  return 'secondary';
}

export function JobComparisonMatrix() {
  const topMatches = useJobStore((s) => s.topMatches);
  const jobComparisonMatrix = useJobStore((s) => s.jobComparisonMatrix);

  if (!topMatches.length || !jobComparisonMatrix) return null;

  const { rows, recommendation } = jobComparisonMatrix;

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
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide w-40">
                  维度
                </th>
                {topMatches.map((job) => (
                  <th
                    key={job.job_id}
                    className="px-4 py-3 text-center text-xs font-semibold text-slate-700"
                  >
                    <div className="line-clamp-2">{job.job_title}</div>
                    <div className="text-indigo-500 font-bold text-sm mt-0.5">
                      {Math.round(job.score * 100)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIdx) => (
                <tr
                  key={row.dimension}
                  className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}
                >
                  <td className="px-5 py-3 text-xs font-medium text-slate-600 whitespace-nowrap">
                    {row.dimension}
                  </td>
                  {topMatches.map((job) => {
                    const val = row.values[job.job_id] ?? '—';
                    return (
                      <td key={job.job_id} className="px-4 py-2.5 text-center">
                        <Badge variant={rateToBadgeVariant(row.dimension, val)}>
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
