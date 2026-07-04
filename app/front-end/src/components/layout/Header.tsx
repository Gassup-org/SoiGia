import { Home, Info, Layers3, Menu, UserRound, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../ui/Button'

const navItems = [
  { href: '#', label: 'Trang chủ' },
  { href: '#about', label: 'Về chúng tôi' },
  { href: '#categories', label: 'Danh mục' },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-surface/85 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a className="text-2xl font-bold tracking-tight text-brand-strong" href="#">
          SoiGia
        </a>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Chính">
          {navItems.map((item, index) => (
            <a
              className={`text-sm font-semibold transition-colors duration-300 hover:text-brand-strong ${
                index === 0 ? 'text-brand' : 'text-ink-muted'
              }`}
              href={item.href}
              key={item.label}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost">Đăng nhập</Button>
          <Button>Đăng ký</Button>
        </div>
        <button
          aria-label="Mở menu"
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-surface-soft text-ink transition-colors hover:bg-brand-soft md:hidden"
          onClick={() => setIsMenuOpen(true)}
          type="button"
        >
          <Menu className="h-5 w-5" strokeWidth={1.8} />
        </button>
      </div>

      <div
        className={`fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setIsMenuOpen(false)}
      />
      <aside
        aria-label="Menu di động"
        className={`fixed right-0 top-0 z-[60] flex h-dvh w-80 max-w-[86vw] flex-col bg-surface p-5 shadow-2xl shadow-ink/20 transition-transform duration-300 md:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-soft text-brand-strong">
              <UserRound className="h-5 w-5" strokeWidth={1.8} />
            </div>
            <div>
              <p className="font-bold text-brand-strong">SoiGia</p>
              <p className="text-sm text-ink-muted">So sánh giá nhanh</p>
            </div>
          </div>
          <button
            aria-label="Đóng menu"
            className="rounded-2xl p-3 text-ink-muted hover:bg-surface-soft"
            onClick={() => setIsMenuOpen(false)}
            type="button"
          >
            <X className="h-5 w-5" strokeWidth={1.8} />
          </button>
        </div>
        <nav className="flex flex-1 flex-col gap-2" aria-label="Menu di động">
          {[
            { icon: Home, label: 'Trang chủ' },
            { icon: Info, label: 'Về chúng tôi' },
            { icon: Layers3, label: 'Danh mục' },
          ].map(({ icon: Icon, label }) => (
            <a
              className="flex items-center gap-3 rounded-2xl px-4 py-3 font-semibold text-ink-muted transition-colors hover:bg-brand-soft hover:text-brand-strong"
              href="#"
              key={label}
              onClick={() => setIsMenuOpen(false)}
            >
              <Icon className="h-5 w-5" strokeWidth={1.8} />
              {label}
            </a>
          ))}
        </nav>
        <div className="grid gap-3 border-t border-ink/10 pt-5">
          <Button className="w-full">Đăng ký</Button>
          <Button className="w-full" variant="secondary">
            Đăng nhập
          </Button>
        </div>
      </aside>
    </header>
  )
}
