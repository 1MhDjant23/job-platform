import type { ReactNode } from 'react'

type BadgeVariant = 'pending' | 'reviewed' | 'accepted' | 'rejected' | 'neutral'

interface BadgeProps {
  variant?: BadgeVariant
  children: ReactNode
}

const variantStyles: Record<BadgeVariant, string> = {
  pending: 'bg-status-pending-bg text-status-pending-text',
  reviewed: 'bg-status-reviewed-bg text-status-reviewed-text',
  accepted: 'bg-status-accepted-bg text-status-accepted-text',
  rejected: 'bg-status-rejected-bg text-status-rejected-text',
  neutral: 'bg-surface-muted text-ink-muted',
}

const labels: Record<BadgeVariant, string> = {
  pending: 'En attente',
  reviewed: 'Examinée',
  accepted: 'Acceptée',
  rejected: 'Refusée',
  neutral: '—',
}

export function Badge({ variant = 'neutral', children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantStyles[variant]}`}
    >
      {children ?? labels[variant]}
    </span>
  )
}