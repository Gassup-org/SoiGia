import { BarChart3, ShieldCheck, Sparkles } from 'lucide-react'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { SearchInput } from '../components/ui/SearchInput'
import { CategoryBento } from '../features/category/components/CategoryBento'
import { HotProductList } from '../features/product/components/HotProductList'
import { PriceTrendPanel } from '../features/product/components/PriceTrendPanel'

const valueProps = [
  { icon: ShieldCheck, label: 'Nguồn giá minh bạch' },
  { icon: BarChart3, label: 'Theo dõi biến động' },
  { icon: Sparkles, label: 'Gợi ý mua thông minh' },
]

export function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute right-[-10rem] top-[-12rem] h-[34rem] w-[34rem] rounded-full bg-brand-soft/80 blur-3xl" />
        <div className="absolute bottom-[-18rem] left-[-8rem] h-[32rem] w-[32rem] rounded-full bg-accent/10 blur-3xl" />
        <div className="relative mx-auto grid min-h-[calc(100dvh-5rem)] max-w-7xl grid-cols-1 items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.02fr_0.98fr] lg:px-8">
          <div className="flex flex-col items-start gap-6 text-left">
            <Badge>
              <Sparkles className="h-4 w-4" strokeWidth={1.8} />
              Tìm giá tốt nhất hôm nay
            </Badge>
            <div className="space-y-5">
              <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl lg:text-6xl">
                So sánh giá thông minh với <span className="text-brand">SoiGia</span>
              </h1>
              <p className="max-w-xl text-base leading-7 text-ink-muted sm:text-lg">
                Tìm và so sánh giá từ nhiều cửa hàng để mua đúng lúc, đúng nơi,
                với mức giá đáng tin cậy.
              </p>
            </div>
            <SearchInput popularTerms={['Điện thoại', 'Laptop', 'Tivi']} />
            <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
              {valueProps.map(({ icon: Icon, label }) => (
                <div
                  className="flex items-center gap-3 rounded-2xl bg-surface/90 p-3 text-sm font-semibold text-ink shadow-card ring-1 ring-ink/10 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:shadow-premium"
                  key={label}
                >
                  <Icon className="h-5 w-5 text-brand" strokeWidth={1.8} />
                  {label}
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-brand-soft/90 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] bg-surface p-4 shadow-premium ring-1 ring-ink/10">
              <img
                alt="Các thẻ sản phẩm và cửa hàng trực tuyến trong giao diện so sánh giá"
                className="h-[360px] w-full rounded-3xl object-cover md:h-[500px]"
                src="https://picsum.photos/seed/soigia-shopping-comparison/900/1100"
              />
              <div className="absolute bottom-8 left-8 right-8 rounded-3xl bg-surface/92 p-4 shadow-lg shadow-ink/10 backdrop-blur">
                <p className="text-sm font-semibold text-ink-muted">Giá tốt nhất</p>
                <div className="mt-2 flex items-center justify-between gap-4">
                  <p className="text-2xl font-bold tracking-tight text-ink">
                    12.490.000đ
                  </p>
                  <Button className="px-4 py-2">Theo dõi</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <CategoryBento />
      <HotProductList />
      <PriceTrendPanel />
    </>
  )
}
