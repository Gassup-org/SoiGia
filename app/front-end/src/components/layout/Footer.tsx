import { Camera, Languages, MessageCircle } from 'lucide-react'

const footerLinks = [
  { href: '#about', label: 'Về chúng tôi' },
  { href: '#categories', label: 'Danh mục' },
  { href: '#support', label: 'Hỗ trợ' },
  { href: '#contact', label: 'Liên hệ' },
]

export function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 text-center sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] md:text-left lg:px-8">
        <div>
          <p className="text-2xl font-bold tracking-tight text-brand-strong">SoiGia</p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-ink-muted md:max-w-xs">
            Nền tảng so sánh giá thông minh, giúp bạn đưa ra quyết định mua sắm
            chính xác và tiết kiệm hơn mỗi ngày.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-ink">Liên kết</h3>
          <div className="mt-4 grid gap-3">
            {footerLinks.map((link) => (
              <a
                className="text-sm font-medium text-ink-muted transition-colors hover:text-brand"
                href={link.href}
                key={link.label}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-ink">Kết nối</h3>
          <div className="mt-4 grid gap-3">
            {[
              { icon: MessageCircle, label: 'Facebook' },
              { icon: Camera, label: 'Instagram' },
            ].map(({ icon: Icon, label }) => (
              <a
                className="inline-flex items-center justify-center gap-2 text-sm font-medium text-ink-muted transition-colors hover:text-brand md:justify-start"
                href="#"
                key={label}
              >
                <Icon className="h-4 w-4" strokeWidth={1.8} />
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-ink/10 px-4 py-5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-sm text-ink-muted md:flex-row">
          <p>© 2026 SoiGia. All rights reserved.</p>
          <a className="inline-flex items-center gap-2 hover:text-brand" href="#">
            <Languages className="h-4 w-4" strokeWidth={1.8} />
            Tiếng Việt
          </a>
        </div>
      </div>
    </footer>
  )
}
