import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset transition-colors',
  {
    variants: {
      variant: {
        default:
          'bg-indigo-50 text-indigo-700 ring-indigo-600/20',
        secondary:
          'bg-slate-100 text-slate-700 ring-slate-500/20',
        success:
          'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
        warning:
          'bg-amber-50 text-amber-700 ring-amber-600/20',
        danger:
          'bg-red-50 text-red-700 ring-red-600/20',
        outline:
          'bg-white text-slate-700 ring-slate-300',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
