import type { LucideIcon } from 'lucide-react'

export interface ProductDeal {
  category: string
  href: string
  imageUrl: string
  name: string
  price: string
  saving: string
  storeCount: number
}

export interface TrendItem {
  change: string
  icon: LucideIcon
  label: string
  note: string
  trend: 'up' | 'down'
}
