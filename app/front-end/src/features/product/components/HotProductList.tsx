import { ArrowRight, Store } from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import { SectionHeader } from '../../../components/ui/SectionHeader'
import type { ProductDeal } from '../types'

const products: ProductDeal[] = [
  {
    category: 'Điện thoại',
    href: '#',
    imageUrl: 'https://picsum.photos/seed/soigia-phone/640/520',
    name: 'Smartphone hiệu năng cao',
    price: '12.490.000đ',
    saving: 'Tiết kiệm 1.8 triệu',
    storeCount: 18,
  },
  {
    category: 'Laptop',
    href: '#',
    imageUrl: 'https://picsum.photos/seed/soigia-laptop/640/520',
    name: 'Laptop mỏng nhẹ cho công việc',
    price: '21.990.000đ',
    saving: 'Giảm 12%',
    storeCount: 11,
  },
  {
    category: 'Gia dụng',
    href: '#',
    imageUrl: 'https://picsum.photos/seed/soigia-home-device/640/520',
    name: 'Máy lọc không khí thông minh',
    price: '3.290.000đ',
    saving: 'Giá tốt trong 7 ngày',
    storeCount: 9,
  },
]

export function HotProductList() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeader
        description="Các lựa chọn đang có mức giá hấp dẫn, được tổng hợp từ nhiều cửa hàng."
        title="Sản phẩm đáng chú ý"
      />
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {products.map((product) => (
          <a
            className="group overflow-hidden rounded-3xl bg-surface shadow-card ring-1 ring-ink/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-premium"
            href={product.href}
            key={product.name}
          >
            <div className="aspect-[4/3] overflow-hidden bg-surface-soft">
              <img
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                src={product.imageUrl}
              />
            </div>
            <div className="p-5">
              <p className="text-sm font-semibold text-brand">{product.category}</p>
              <h3 className="mt-2 text-xl font-bold tracking-tight text-ink">
                {product.name}
              </h3>
              <div className="mt-5 flex items-end justify-between gap-4">
                <div>
                  <p className="text-2xl font-bold tracking-tight text-ink">
                    {product.price}
                  </p>
                  <p className="mt-1 text-sm font-medium text-brand">
                    {product.saving}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-surface-soft px-3 py-1.5 text-sm font-semibold text-ink-muted">
                  <Store className="h-4 w-4" strokeWidth={1.8} />
                  {product.storeCount}
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <Button variant="secondary">
          Xem thêm sản phẩm
          <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
        </Button>
      </div>
    </section>
  )
}
