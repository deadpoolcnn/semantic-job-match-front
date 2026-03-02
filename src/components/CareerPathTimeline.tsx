import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitFork, Target, ChevronDown, ChevronRight, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useSelectedJob, useJobStore } from '@/store/useJobStore';
import type { DecisionGate, Milestone } from '@/types/models';

const YEAR_COLORS: Record<number, string> = {
  1: 'bg-indigo-100 text-indigo-700 border-indigo-300',
  3: 'bg-violet-100 text-violet-700 border-violet-300',
  5: 'bg-emerald-100 text-emerald-700 border-emerald-300',
};

function DecisionGateCard({ gate }: { gate: DecisionGate }) {
  const [choice, setChoice] = useState<'A' | 'B' | null>(null);

  return (
    <div className="mt-4">
      <div className="mb-3 flex items-center gap-2">
        <GitFork className="h-4 w-4 text-amber-500" />
        <span className="text-sm font-semibold text-amber-700">决策门 · 第 {gate.year} 年</span>
      </div>
      <p className="mb-3 text-sm text-slate-600 italic">"{gate.question}"</p>
      <div className="grid grid-cols-2 gap-3">
        {(['A', 'B'] as const).map((opt) => {
          const label = opt === 'A' ? gate.option_A : gate.option_B;
          const isSelected = choice === opt;
          return (
            <button
              key={opt}
              onClick={() => setChoice((prev) => (prev === opt ? null : opt))}
              className={[
                'rounded-xl border-2 p-3 text-left text-sm transition-all',
                isSelected
                  ? 'border-indigo-500 bg-indigo-50 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50',
              ].join(' ')}
            >
              <span className={`inline-block mb-1.5 rounded-md px-1.5 py-0.5 text-xs font-bold ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                路线 {opt}
              </span>
              <p className="text-slate-700 leading-snug">{label}</p>
            </button>
          );
        })}
      </div>
      <AnimatePresence>
        {choice && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 rounded-xl bg-slate-50 border border-slate-200 p-3">
              <p className="text-xs font-semibold text-slate-500 mb-1">选择路线 {choice} 的影响</p>
              <p className="text-sm text-slate-700">{gate.impact}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MilestoneNode({ milestone, idx }: { milestone: Milestone; idx: number }) {
  const [expanded, setExpanded] = useState(idx === 0);
  const colorClass = YEAR_COLORS[milestone.year] ?? 'bg-slate-100 text-slate-700 border-slate-300';

  return (
    <div className="relative flex gap-4">
      {/* Timeline line + dot */}
      <div className="flex flex-col items-center">
        <div className={`z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold ${colorClass}`}>
          Y{milestone.year}
        </div>
        <div className="w-0.5 flex-1 bg-slate-200 mt-1" />
      </div>

      {/* Content */}
      <div className="flex-1 pb-8">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex w-full items-center justify-between gap-2 text-left"
        >
          <div>
            <p className="text-sm font-semibold text-slate-800">{milestone.title}</p>
            <p className="text-xs text-slate-400 mt-0.5">第 {milestone.year} 年里程碑</p>
          </div>
          {expanded ? (
            <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
          ) : (
            <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
          )}
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              {milestone.skills_needed.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {milestone.skills_needed.map((skill) => (
                    <Badge key={skill} variant="warning">{skill}</Badge>
                  ))}
                </div>
              )}
              {milestone.decision_gate && (
                <DecisionGateCard gate={milestone.decision_gate} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function CareerPathTimeline() {
  const job = useSelectedJob();
  const globalCp = useJobStore((s) => s.careerPrediction);

  // Per-job counterfactual_path has job-specific milestones
  const cp = job?.counterfactual_path;

  if (!cp && !globalCp) return null;

  const milestones = cp?.milestones ?? globalCp?.milestones ?? [];
  const fromLevel = globalCp?.current_level ?? '';
  const toTitle = cp?.milestones?.at(-1)?.title ?? globalCp?.target_role_in_5yr ?? '';
  const skillGaps = globalCp?.skill_gaps_to_bridge ?? [];
  const confidenceNote = globalCp?.confidence_note;
  const keyRisks = cp?.key_risks ?? [];

  return (
    <Card>
      <CardContent className="p-5 pt-5">
        {/* Header */}
        <div className="mb-5 flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
            <Target className="h-4 w-4 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">5 年职业路径预测</h3>
            {fromLevel && toTitle && (
              <p className="text-xs text-slate-500 mt-0.5">
                {fromLevel} → {toTitle}
              </p>
            )}
          </div>
        </div>

        {/* Milestones */}
        {milestones.length > 0 && (
          <div className="space-y-0">
            {milestones.map((ms, i) => (
              <MilestoneNode key={`${ms.year}-${i}`} milestone={ms} idx={i} />
            ))}
          </div>
        )}

        {/* Confidence note */}
        {confidenceNote && (
          <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-xs italic text-slate-500">
            📊 {confidenceNote}
          </p>
        )}

        {/* Global skill gaps */}
        {skillGaps.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
              全路径待补充技能
            </p>
            <div className="flex flex-wrap gap-1.5">
              {skillGaps.map((s) => (
                <Badge key={s} variant="warning">{s}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Key risks (from counterfactual_path) */}
        {keyRisks.length > 0 && (
          <div className="mt-4">
            <div className="mb-2 flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">主要风险</p>
            </div>
            <ul className="space-y-1.5">
              {keyRisks.map((risk, i) => (
                <li key={i} className="flex gap-2 text-xs text-slate-600">
                  <span className="mt-0.5 shrink-0 text-amber-400">⚠</span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
