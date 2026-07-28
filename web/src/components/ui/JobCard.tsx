import { Card } from './Card'
import { Badge } from './Badge'

interface JobCardProps {
  title: string
  companyName: string
  companyLogoUrl?: string
  location: string
  contractType: string
  tags: string[]
  postedAt: string
  onClick?: () => void
}

export function JobCard({
  title,
  companyName,
  companyLogoUrl,
  location,
  contractType,
  tags,
  postedAt,
  onClick,
}: JobCardProps) {
  return (
    <Card
      hoverable
      onClick={onClick}
      className="cursor-pointer flex flex-col gap-3"
    >
      <div className="flex items-center gap-3">
        {companyLogoUrl ? (
          <img
            src={companyLogoUrl}
            alt={companyName}
            className="h-10 w-10 rounded-md object-cover border border-surface-border"
          />
        ) : (
          <div className="h-10 w-10 rounded-md bg-primary-50 text-primary-600 flex items-center justify-center font-semibold">
            {companyName.charAt(0)}
          </div>
        )}
        <div>
          <h3 className="font-semibold text-ink leading-tight">{title}</h3>
          <p className="text-sm text-ink-muted">{companyName}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <Badge key={tag} variant="neutral">
            {tag}
          </Badge>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-ink-faint pt-2 border-t border-surface-border">
        <span>{location}</span>
        <span className="font-medium text-primary-600">{contractType}</span>
        <span>{postedAt}</span>
      </div>
    </Card>
  )
}