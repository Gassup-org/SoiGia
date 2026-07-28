import type { ReactNode } from 'react'

interface SectionHeaderProps {
  title: string
  description?: string
  action?: ReactNode
  tone?: 'light' | 'dark'
}

export function SectionHeader({
  action,
  description,
  title,
  tone = 'light',
}: SectionHeaderProps) {
  const titleClass = tone === 'dark' ? 'text-white' : 'text-ink'
  const descriptionClass = tone === 'dark' ? 'text-white/70' : 'text-ink-muted'

  return (
    <div className="mb-8 flex flex-col gap-4 md:mb-10 md:max-w-2xl">
      <div className="flex items-end justify-between gap-4">
        <h2 className={`text-2xl font-bold tracking-tight md:text-4xl ${titleClass}`}>
          {title}
        </h2>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {description ? (
        <p className={`text-base leading-7 ${descriptionClass}`}>{description}</p>
      ) : null}
    </div>
  )
}
