import type { LucideIcon } from 'lucide-react'

export interface CategoryCard {
  description: string
  href: string
  icon?: LucideIcon
  imageUrl?: string
  title: string
  tone: 'blue' | 'cyan' | 'amber'
}
