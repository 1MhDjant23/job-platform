import type { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean
}

export function Card({ hoverable = false, className = '', children, ...props }: CardProps) {
  return (
    <div
      className={`bg-surface border border-surface-border rounded-lg shadow-sm p-5
        ${hoverable ? 'hover:shadow-md transition-shadow duration-150' : ''}
        ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}