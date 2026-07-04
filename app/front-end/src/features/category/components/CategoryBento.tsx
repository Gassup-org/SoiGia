import { ArrowRight, Armchair, Laptop, ShoppingBag } from 'lucide-react'
import { SectionHeader } from '../../../components/ui/SectionHeader'
import type { CategoryCard } from '../types'

const categories: CategoryCard[] = [
  {
    description: 'Hơn 50,000 sản phẩm được cập nhật giá liên tục',
    href: '#',
    imageUrl: 'https://picsum.photos/seed/soigia-premium-electronics/900/620',
    title: 'Điện tử & Công nghệ',
    tone: 'blue',
  },
  {
    description: 'Ưu đãi tốt cho nhà cửa, nội thất và thiết bị gia dụng',
    href: '#',
    icon: Armchair,
    title: 'Nhà cửa & Đời sống',
    tone: 'cyan',
  },
  {
    description: 'Theo dõi giá sản phẩm cần mua trong mùa sale',
    href: '#',
    icon: ShoppingBag,
    title: 'Mua sắm thông minh',
    tone: 'amber',
  },
  {
    description: 'Laptop, phụ kiện và thiết bị làm việc đáng cân nhắc',
    href: '#',
    icon: Laptop,
    title: 'Laptop & Phụ kiện',
    tone: 'blue',
  },
]

const toneClasses: Record<CategoryCard['tone'], string> = {
  amber: 'bg-danger-soft text-ink ring-accent/20',
  blue: 'bg-brand-soft text-brand-strong ring-brand/10',
  cyan: 'bg-surface text-ink ring-ink/10',
}

export function CategoryBento() {
  const [featuredCategory, ...secondaryCategories] = categories

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8" id="categories">
      <SectionHeader
        action={
          <a
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand transition-colors hover:text-brand-strong"
            href="#"
          >
            Xem tất cả
            <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
          </a>
        }
        description="Các nhóm sản phẩm phổ biến được gom theo nhu cầu mua sắm thực tế."
        title="Khám phá danh mục"
      />
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <a
          className="group relative min-h-[330px] overflow-hidden rounded-3xl bg-ink shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-premium md:col-span-2"
          href={featuredCategory.href}
        >
          <img
            alt={featuredCategory.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            src={featuredCategory.imageUrl}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" />
          <div className="absolute bottom-0 left-0 max-w-lg p-6 text-white md:p-8">
            <h3 className="text-2xl font-bold tracking-tight">{featuredCategory.title}</h3>
            <p className="mt-3 text-sm leading-6 text-white/85">
              {featuredCategory.description}
            </p>
          </div>
        </a>
        <div className="grid gap-5">
          {secondaryCategories.map((category) => {
            const Icon = category.icon

            return (
              <a
                className={`group rounded-3xl p-6 shadow-card ring-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-premium ${toneClasses[category.tone]}`}
                href={category.href}
                key={category.title}
              >
                {Icon ? <Icon className="h-8 w-8" strokeWidth={1.7} /> : null}
                <h3 className="mt-5 text-xl font-bold tracking-tight text-ink">
                  {category.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-ink-muted">
                  {category.description}
                </p>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
