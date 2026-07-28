import { Fuel, TrendingDown, TrendingUp } from 'lucide-react'
import { SectionHeader } from '../../../components/ui/SectionHeader'
import type { TrendItem } from '../types'

const trends: TrendItem[] = [
  {
    change: '-3.2%',
    icon: TrendingDown,
    label: 'Điện thoại',
    note: 'Nhiều mẫu flagship giảm sau đợt ra mắt mới',
    trend: 'down',
  },
  {
    change: '+1.6%',
    icon: TrendingUp,
    label: 'Laptop văn phòng',
    note: 'Giá nhích nhẹ do nhu cầu đầu mùa cao',
    trend: 'up',
  },
  {
    change: '-1.1%',
    icon: Fuel,
    label: 'Xăng dầu',
    note: 'Theo dõi biến động theo khu vực và thời điểm',
    trend: 'down',
  },
]

export function PriceTrendPanel() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-ink p-6 text-white shadow-premium md:p-8 lg:p-10">
        <SectionHeader
          description="Tóm tắt biến động để bạn biết nên mua ngay hay tiếp tục theo dõi."
          tone="dark"
          title="Xu hướng giá hôm nay"
        />
        <div className="grid gap-4 md:grid-cols-3">
          {trends.map((item) => {
            const Icon = item.icon
            const isDown = item.trend === 'down'

            return (
              <article
                className="rounded-3xl bg-white/8 p-5 ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-1 hover:bg-white/12"
                key={item.label}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                    <Icon className="h-6 w-6" strokeWidth={1.8} />
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-bold ${
                      isDown ? 'bg-brand/25 text-white' : 'bg-accent/20 text-white'
                    }`}
                  >
                    {item.change}
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-bold tracking-tight">{item.label}</h3>
                <p className="mt-2 text-sm leading-6 text-white/70">{item.note}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
