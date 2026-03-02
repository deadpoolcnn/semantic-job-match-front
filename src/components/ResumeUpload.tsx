import { useCallback, useRef, useState } from 'react';
import { UploadCloud, FileText, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useJobStore } from '@/store/useJobStore';
import { matchResumeFile } from '@/services/api';

const STAGE_LABELS: Record<string, string> = {
  parsing: '正在解析 PDF / DOCX…',
  scoring: '正在进行 5 维语义匹配…',
  insights: 'Kimi 正在生成职业洞察…',
};

export function ResumeUpload() {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { loadingStage, loadingProgress, errorMessage, uploadedFileName, reset } = useJobStore();
  const setUploadedFileName = useJobStore((s) => s.setUploadedFileName);
  const setLoadingStage = useJobStore((s) => s.setLoadingStage);
  const setApiResult = useJobStore((s) => s.setApiResult);
  const setError = useJobStore((s) => s.setError);

  const isLoading = loadingStage !== 'idle' && loadingStage !== 'done' && loadingStage !== 'error';

  const handleFile = useCallback(
    async (file: File) => {
      if (!file) return;

      const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowed.includes(file.type) && !file.name.match(/\.(pdf|docx)$/i)) {
        setError('仅支持 PDF 或 DOCX 格式');
        return;
      }

      reset();
      setUploadedFileName(file.name);
      setLoadingStage('parsing', 5);

      try {
        const result = await matchResumeFile(file, 5);
        setApiResult(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : '上传失败，请重试');
      }
    },
    [reset, setUploadedFileName, setLoadingStage, setApiResult, setError],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        {/* Drop Zone */}
        {loadingStage === 'idle' && (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            className={[
              'flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 transition-all',
              dragging
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-slate-300 bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50/40',
            ].join(' ')}
          >
            <UploadCloud className="h-10 w-10 text-indigo-400" />
            <div className="text-center">
              <p className="text-sm font-medium text-slate-700">
                拖拽简历文件至此，或点击上传
              </p>
              <p className="mt-1 text-xs text-slate-400">支持 PDF、DOCX 格式，最大 10 MB</p>
            </div>
            <Button size="sm" variant="outline" type="button">
              选择文件
            </Button>
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.docx"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            />
          </div>
        )}

        {/* Loading State */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50">
                  <FileText className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-800">{uploadedFileName}</p>
                  <p className="text-xs text-slate-500">{STAGE_LABELS[loadingStage] ?? '处理中…'}</p>
                </div>
                <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
              </div>
              <Progress value={loadingProgress} className="h-2" />
              <p className="text-right text-xs text-slate-400">{loadingProgress}%</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Done State */}
        {loadingStage === 'done' && uploadedFileName && (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
              <FileText className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-800">{uploadedFileName}</p>
              <p className="text-xs text-emerald-600">✓ 分析完成</p>
            </div>
            <button
              onClick={reset}
              className="rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Error */}
        {loadingStage === 'error' && (
          <div className="space-y-3">
            <p className="text-sm text-red-600">{errorMessage}</p>
            <Button size="sm" variant="outline" onClick={reset}>重新上传</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
