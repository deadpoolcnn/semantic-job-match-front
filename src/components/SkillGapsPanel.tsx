import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useSelectedJob } from '@/store/useJobStore';

export function SkillGapsPanel() {
  const job = useSelectedJob();
  if (!job?.skill_gaps_to_bridge?.length) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <CardTitle>技能缺口分析 (Skill Gaps)</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-3 text-sm text-slate-500">
          以下技能为匹配本职位时检测到的能力差距，建议优先补齐：
        </p>
        <motion.div
          className="flex flex-wrap gap-2"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.05 } },
          }}
        >
          {job.skill_gaps_to_bridge.map((skill) => (
            <motion.span
              key={skill}
              variants={{ hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0 } }}
            >
              <Badge variant="warning">{skill}</Badge>
            </motion.span>
          ))}
        </motion.div>
      </CardContent>
    </Card>
  );
}
