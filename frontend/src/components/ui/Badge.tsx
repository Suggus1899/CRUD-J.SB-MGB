import { cn } from '@/lib/utils'

interface BadgeProps {
  label: string
  variant?: string
  className?: string
}

const variants: Record<string, string> = {
  default: 'bg-slate-100 text-slate-700',
  PENDING: 'bg-yellow-100 text-yellow-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  LOW: 'bg-slate-100 text-slate-600',
  MEDIUM: 'bg-orange-100 text-orange-700',
  HIGH: 'bg-red-100 text-red-700',
  overdue: 'bg-red-100 text-red-700',
}

export function Badge({ label, variant = 'default', className }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', variants[variant] ?? variants.default, className)}>
      {label}
    </span>
  )
}
